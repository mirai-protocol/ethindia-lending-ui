/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
// @mui
import { styled as muiStyled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { faker } from '@faker-js/faker';
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';
import { Box, Stack, AppBar, Toolbar, Typography, Button } from '@mui/material';
// utils
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as PushAPI from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { bgBlur } from '../../../utils/cssStyles';
import useWeb3React from '../../../hooks/useWeb3React';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import NetworkToggle from './NetworkToggle';
import crossChain from '../../../images/alert.gif';
import { globalCreators } from '../../../state/markets/index';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = muiStyled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = muiStyled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------
const RainbowLight = keyframes`
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
`;
const StyledCardAccent = styled.div`
  visibility: visible;
  background: linear-gradient(45deg, rgba(255, 255, 255, 1) 0%, #5a69e6 35%, #4caf50 100%);
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 0.625rem !important;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
  /* */
`;
const CrossChainEnabled = styled.div`
  overflow: initial;
  position: relative;
  background: #ffffff;
  border-radius: 10px;
  font-weight: 700;
  padding: 10px;

  :hover {
    ${StyledCardAccent} {
      visibility: visible;
    }
  }
`;
Header.propTypes = {
  getAllNotificationsLoad: PropTypes.func,
  getAllNotificationsSuccess: PropTypes.func,
  getAllNotificationsError: PropTypes.func,
  addNewNotification: PropTypes.func,
  // updateNotification: PropTypes.func
};

function Header({ getAllNotificationsLoad, getAllNotificationsSuccess, getAllNotificationsError, addNewNotification }) {
  const channelAddress = '0x4274A49FBeB724D75b8ba7bfC55FC8495A15AD1E';
  const [notificationOn, setNotificationOn] = useState(false);
  const { chainId, account } = useWeb3React();

  const subscribeToNotifications = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = provider.getSigner();

    await PushAPI.channels.subscribe({
      signer: _signer,
      channelAddress: `eip155:${chainId}:${channelAddress}`, // channel address in CAIP
      userAddress: `eip155:${chainId}:${account}`, // user address in CAIP
      onSuccess: () => {
        setNotificationOn(true);
      },
      env: 'staging',
    });
  };
  const getPushSubscriptions = useCallback(async () => {
    const subscriptions = await PushAPI.user.getSubscriptions({
      user: `eip155:${chainId}:${account}`, // user address in CAIP
      env: 'staging',
    });
    const isNotificationOn = subscriptions.find((subscription) => subscription.channel === channelAddress);
    if (isNotificationOn) {
      setNotificationOn(() => true);
    }
  }, [account, chainId]);
  const getNotifications = useCallback(async () => {
    try {
      getAllNotificationsLoad()
      const notifications = await PushAPI.user.getFeeds({
        user: `eip155:${chainId}:${account}`, // user address in CAIP
        env: 'staging',
      });
      let filteredNotificaitons = notifications.filter(notification => notification.app === 'mirai-crosschain-notifications')
      filteredNotificaitons = filteredNotificaitons.map(notification => {
        if (notification.app === 'mirai-crosschain-notifications') {
          const updatednotification = {
            ...notification,
            description: notification.notification.body,
            isUnRead: false,
            type: 'order_placed',
            id: faker.datatype.uuid(),
          }
          return updatednotification;
        }
      })
      getAllNotificationsSuccess(filteredNotificaitons)
    } catch (error) {
      getAllNotificationsError()
      console.error(error)
    }
  }, [account, chainId, getAllNotificationsError, getAllNotificationsLoad, getAllNotificationsSuccess]);

  useEffect(() => {
    if (account) {
      getPushSubscriptions();
    }
  }, [account, getPushSubscriptions]);

  useEffect(() => {
    if (notificationOn) getNotifications();
  }, [getNotifications, notificationOn]);
  useEffect(() => {
    const createpushSocket = () => {
      try {
        if (account) {
          const pushSDKSocket = createSocketConnection({
            user: `eip155:${chainId}:${account}`, // CAIP, see below
            env: 'staging',
            socketOptions: { autoConnect: false }
          });
          if (pushSDKSocket) {
            pushSDKSocket.connect();
            pushSDKSocket.on(EVENTS.CONNECT, () => {
              console.log('connected')
            });

            pushSDKSocket.on(EVENTS.DISCONNECT, () => {
              console.log('DISCONNECT')
            });

            pushSDKSocket.on(EVENTS.USER_FEEDS, (feedItem) => {
              // feedItem is the notification data when that notification was received
              console.log('feedItem', feedItem)
              if (feedItem.payload && feedItem.payload.data.app === 'mirai-crosschain-notifications') {
                addNewNotification({
                  ...feedItem.payload.data,
                  description: feedItem.payload.notification.body,
                  title: feedItem.payload.data.asub,
                  isUnRead: true,
                  type: 'order_placed',
                  createdAt: new Date(Math.floor(parseFloat(feedItem.payload.data.epoch)*1000)),
                  id: faker.datatype.uuid(),
                })
              }
            });
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (account) {
      createpushSocket()
    }
  }, [account, addNewNotification, chainId])

  return (
    <StyledRoot>
      <StyledToolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          {chainId === 5 && (
            <CrossChainEnabled>
              <StyledCardAccent />
              <Stack direction="row" alignItems="center">
                <Typography sx={{ fontWeight: '700', color: '#212B36', fontSize: '15px' }}>
                  Cross Chain Mode
                </Typography>
                <img src={crossChain} alt="cross chain" width="25px" style={{ marginLeft: '15px' }} />
              </Stack>
            </CrossChainEnabled>
          )}

          {notificationOn ?
            <NotificationsPopover />
            : (
              <div>
                <div style={{ margin: '0px 5px 0px 5px' }}>
                  <Button variant='contained' onClick={subscribeToNotifications} endIcon={<NotificationsActiveIcon />}>
                    Enabled Notifications
                  </Button>
                </div>
              </div>
            )}
          <NetworkToggle />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
const mapStateToProps = (state) => ({
  markets: state.markets,
});

export function mapDispatchToProps(dispatch) {
  const { getAllNotificationsLoad, getAllNotificationsSuccess, getAllNotificationsError, addNewNotification, updateNotification } = globalCreators;
  return {
    getAllNotificationsLoad: () => dispatch(getAllNotificationsLoad()),
    getAllNotificationsError: () => dispatch(getAllNotificationsError()),
    getAllNotificationsSuccess: (data) => dispatch(getAllNotificationsSuccess(data)),
    addNewNotification: (data) => dispatch(addNewNotification(data)),
    updateNotification: (data) => dispatch(updateNotification(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Header);