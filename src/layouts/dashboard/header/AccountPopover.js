import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import WalletIcon from '@mui/icons-material/Wallet';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, Button, IconButton, Popover } from '@mui/material';
// mocks_
import accountData from '../../../_mock/account';
import { SUPPORTED_WALLETS, NETWORKS } from '../../../config'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const {
    account,
    chainId,
    activate,
  } = useWeb3React();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const connectWallet = async (connector) => {
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (SUPPORTED_WALLETS[key].name);
      }
      return true;
    });
    activate(connector, undefined, true).catch((error) => {
      if (error instanceof UnsupportedChainIdError) {
        activate(connector); // a little janky...can't use setError because the connector isn't set
      } else {
        console.error('errir', error);
      }
    });
  };
  return (
    <>
      {account ?
        <IconButton
          onClick={handleOpen}
          sx={{
            p: 0,
            ...(open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
              },
            }),
          }}
        >
          <Avatar src={accountData.photoURL} alt="photoURL" />
        </IconButton>
        :
        <Button
          onClick={() => connectWallet(SUPPORTED_WALLETS.METAMASK.connector)}
          variant="contained"
          endIcon={<WalletIcon />}
        >
          Connect Wallet
        </Button>
      }

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {account && chainId &&
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {`${account.slice(0, 4)}....${account.slice(account.length - 4)}`}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {NETWORKS[chainId] && NETWORKS[chainId].name ? NETWORKS[chainId].name : 'Wrong Network'}
            </Typography>
          </Box>
        }

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleClose} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
