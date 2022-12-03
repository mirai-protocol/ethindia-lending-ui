import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { useWeb3Modal } from "@web3modal/react";
import WalletIcon from '@mui/icons-material/Wallet';
import { useDisconnect } from 'wagmi'
import Identicon from 'react-identicons';
// import { Web3Modal, Web3Button } from "@web3modal/react";
// import {
//   EthereumClient,
// } from "@web3modal/ethereum";
import { Box, Divider, Typography, MenuItem, Avatar, Button, IconButton, Popover } from '@mui/material';
import useWeb3React from '../../../hooks/useWeb3React';
// mocks_
import { NETWORKS } from '../../../config'
// import { wagmiClient, chains } from '../../../utils/wagmiClient';
// ----------------------------------------------------------------------

// const MENU_OPTIONS = [
//   {
//     label: 'Home',
//     icon: 'eva:home-fill',
//   },
//   {
//     label: 'Profile',
//     icon: 'eva:person-fill',
//   },
//   {
//     label: 'Settings',
//     icon: 'eva:settings-2-fill',
//   },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [openPopver, setOpen] = useState(null);
  const { open } = useWeb3Modal();
  const {
    account,
    isConnecting,
    chainId,
  } = useWeb3React();
  const { disconnect } = useDisconnect()
  // const ethereumClient = new EthereumClient(wagmiClient(), chains);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };
  return (
    <>
      {account ? (
        <IconButton
          onClick={handleOpen}
          sx={{
            p: 0,
            ...(openPopver && {
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
          <Avatar alt="photoURL">
            <Identicon
              palette={["rgba(212, 55, 49)", "#1976d2", "#9c27b0", "#ed6c02", "#0288d1","#2e7d32"]}
              string={account}
              size="40"
            />
          </Avatar>
        </IconButton>
      ) : (
        <Button
          onClick={() => open()}
          variant="contained"
          disabled={isConnecting}
          endIcon={<WalletIcon />}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
      <Popover
        open={Boolean(openPopver)}
        anchorEl={openPopver}
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
        {account && chainId && (
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {`${account.slice(0, 4)}....${account.slice(account.length - 4)}`}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {NETWORKS[chainId] && NETWORKS[chainId].name ? NETWORKS[chainId].name : 'Wrong Network'}
            </Typography>
          </Box>
        )}

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

        {/* <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => {
          disconnect()
          handleClose()
        }
        } sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
