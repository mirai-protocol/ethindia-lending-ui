// @mui
import { styled as muiStyled } from '@mui/material/styles';
import styled, { keyframes } from "styled-components";
import { Box, Stack, AppBar, Toolbar, Typography } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
import useWeb3React from '../../../hooks/useWeb3React';
// components
// import Iconify from '../../../components/iconify';
//
// import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import NetworkToggle from './NetworkToggle';
import crossChain from '../../../images/alert.gif';

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
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;
const StyledCardAccent = styled.div`
  visibility: visible;
  background: linear-gradient(45deg, rgba(255,255,255,1) 0%, #5A69E6 35%, #4caf50 100%);
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
const CorssChainEnabled = styled.div`
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
  // onOpenNav: PropTypes.func,
};

export default function Header() {
  const {
    chainId,
  } = useWeb3React();
  return (
    <StyledRoot>
      <StyledToolbar>
        {/* <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton> */}

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          {false && <LanguagePopover />}
          {chainId === 5
            && <CorssChainEnabled>
              <StyledCardAccent />
              <Stack direction="row" alignItems="center">
                <Typography sx={{ fontWeight: '700', color: '#212B36', fontSize: '15px' }}>
                  Cross Chain Enabled
                </Typography>
                <img src={crossChain} alt="cross chain" width="25px" style={{ marginLeft: '15px' }} />
              </Stack>
            </CorssChainEnabled>}
          <NotificationsPopover />
          <NetworkToggle />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
