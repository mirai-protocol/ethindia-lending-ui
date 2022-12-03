import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core';
import { Box, Divider, Typography, Stack, MenuItem, Button, Popover } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SUPPORTED_NETWORKS, NATIVE_TOKENS } from '../../../config';

export default function NetworkToggle() {
  const [open, setOpen] = useState(null);
  const {
    chainId,
  } = useWeb3React();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const changeNetwork = async (networkData) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        // params: [{ chainId: '0x1' }],
        params: [
          { chainId: `0x${parseFloat(networkData.chainId).toString(16)}` },
        ],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${parseFloat(networkData.chainId).toString(16)}`,
                rpcUrls: [networkData.rpcUrl],
                chainName: networkData.title,
                nativeCurrency: {
                  name: NATIVE_TOKENS[networkData.chainId].name,
                  symbol: NATIVE_TOKENS[networkData.chainId].symbol,
                  decimals: parseInt(
                    NATIVE_TOKENS[networkData.chainId].decimals, 10
                  ),
                },
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          console.error({ addError });
        }
      }
      // handle other "switch" errors
    }
    handleClose()
  };
  let network = null;
  if (chainId) {
    network = SUPPORTED_NETWORKS.find(network => network.chainId === chainId.toString());
  }
  return (
    <div>
      {network ? <Button
        variant='outlined'
        onClick={handleOpen}
        sx={{ marginRight: '20px' }}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
      >
        {network.title}
      </Button> :
        <Button
          variant='outlined'
          color='error'
          onClick={() => changeNetwork(SUPPORTED_NETWORKS[0])}
          sx={{ marginRight: '20px' }}
          endIcon={<KeyboardArrowDownIcon />}
          startIcon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
        >
          Wrong Network
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
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="h6">
            Change Network
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack sx={{ p: 1 }}>
          {SUPPORTED_NETWORKS.map((option) => (
            <MenuItem key={option.name} onClick={() => changeNetwork(option)}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <img src={option.imgSrc} alt={option.title} width="20px" />
                  <Typography variant="subtitle2">
                    {option.title}
                  </Typography>
                </Stack>
                {chainId && chainId.toString() === option.chainId &&
                  <div style={{
                    width: '10px',
                    height: '10px',
                    background: '#4caf50',
                    borderRadius: '50%'
                  }} />
                }
              </Stack>
            </MenuItem>
          ))}
        </Stack>
      </Popover>
    </div>
  )
}
