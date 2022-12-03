import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Drawer } from '@mui/material';
// mock
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import logo from '../../../images/mirainameBg.png';
import Scrollbar from '../../../components/scrollbar';
import useWeb3React from '../../../hooks/useWeb3React';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import { getMarketsData } from '../../../utils/getMarketsData';
import { globalCreators } from '../../../state/markets/index';
// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
  getMarketsLoad: PropTypes.func,
  getMarketsSuccess: PropTypes.func,
  getMarketsError: PropTypes.func,
  setMarketsStats: PropTypes.func,
};

function Nav({ openNav, onCloseNav, getMarketsLoad, getMarketsSuccess, getMarketsError, setMarketsStats }) {
  const { pathname } = useLocation();
  const {
    account,
  } = useWeb3React();
  const isDesktop = useResponsive('up', 'lg');
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  useEffect(() => {
    const getMarkets = async () => {
      getMarketsLoad();
      const markets = await getMarketsData(account);
      if (markets.success && markets.data.markets) {
        getMarketsSuccess(markets.data.markets);
        setMarketsStats({
          totalValueLocked: markets.data.totalSupply.toString(),
          totalValueBorrowed: markets.data.totalBorrowed.toString(),
          totalUserBorrowed: markets.data.totalUserBorrowed.toString(),
          totalUserSupplied: markets.data.totalUserSupplied.toString(),
          totalUserCollateral: markets.data.totalUserCollateral.toString(),
          totalUserLiadbility: markets.data.totalUserLiadbility.toString()
        })

      }
      if (markets.error) {
        getMarketsError();
      }
    };
    getMarkets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'flex', justifyContent: 'center' }}>
        <img src={logo} alt="Mirai" width="170px" />
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

const mapStateToProps = (state) => ({
  markets: state.markets,
});

export function mapDispatchToProps(dispatch) {
  const { getMarketsLoad, getMarketsSuccess, getMarketsError, setMarketsStats } = globalCreators;
  return {
    getMarketsLoad: () => dispatch(getMarketsLoad()),
    getMarketsError: () => dispatch(getMarketsError()),
    getMarketsSuccess: (data) => dispatch(getMarketsSuccess(data)),
    setMarketsStats: (data) => dispatch(setMarketsStats(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Nav);
