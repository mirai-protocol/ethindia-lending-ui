/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
// import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
// import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
// @mui
import {
  Box,
  List,
  Badge,
  // Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { globalCreators } from '../../../state/markets/index';

// ----------------------------------------------------------------------

// const NOTIFICATIONS = [
//   {
//     id: faker.datatype.uuid(),
//     title: 'Your order is placed',
//     description: 'waiting for shipping',
//     avatar: null,
//     type: 'order_placed',
//     createdAt: set(new Date(), { hours: 10, minutes: 30 }),
//     isUnRead: true,
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: faker.name.fullName(),
//     description: 'answered to your comment on the Minimal',
//     avatar: '/assets/images/avatars/avatar_2.jpg',
//     type: 'friend_interactive',
//     createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
//     isUnRead: true,
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: 'You have new message',
//     description: '5 unread messages',
//     avatar: null,
//     type: 'chat_message',
//     createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
//     isUnRead: false,
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: 'You have new mail',
//     description: 'sent from Guido Padberg',
//     avatar: null,
//     type: 'mail',
//     createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
//     isUnRead: false,
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: 'Delivery processing',
//     description: 'Your order is being shipped',
//     avatar: null,
//     type: 'order_shipped',
//     createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
//     isUnRead: false,
//   },
// ];
NotificationsPopover.propTypes = {
  markets: PropTypes.object,
  updateNotification: PropTypes.func
};
function NotificationsPopover({ markets, updateNotification }) {
  const [notifications, setNotifications] = useState(markets.notificaitons);

  const totalUnReadNotifications = notifications.filter((item) => item.isUnRead === true)
  const totalReadNotifications = notifications.filter((item) => item.isUnRead === false)
  const totalUnRead = totalUnReadNotifications.length;
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };
  useEffect(() => {
    setNotifications(markets.notificaitons)
  }, [markets.notificaitons])  
  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" sx={{ color: '#4caf50'}}/>
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {totalUnReadNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} updateNotification={updateNotification}/>
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {totalReadNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box> */}
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  updateNotification: PropTypes.func,
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification, updateNotification }) {
  const { avatar, title } = renderContent(notification);
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (notification.isUnRead) {
        updateNotification({
          ...notification,
          isUnRead: false,
        })
      }
    }, 10000);
    return () => clearTimeout(timerId);
  }, [])
  
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          notification.createdAt &&
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {/* {fToNow(notification.createdAt)} */}
            {new Date(notification.createdAt).toLocaleDateString()}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}

const mapStateToProps = (state) => ({
  markets: state.markets,
});

export function mapDispatchToProps(dispatch) {
  const { getAllNotificationsLoad,getAllNotificationsSuccess, getAllNotificationsError, addNewNotification, updateNotification } = globalCreators;
  return {
    getAllNotificationsLoad: () => dispatch(getAllNotificationsLoad()),
    getAllNotificationsError: () => dispatch(getAllNotificationsError()),
    getAllNotificationsSuccess: (data) => dispatch(getAllNotificationsSuccess(data)),
    addNewNotification: (data) => dispatch(addNewNotification(data)),
    updateNotification: (data) => dispatch(updateNotification(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(NotificationsPopover);
