/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react';
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { compose } from 'redux';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
// sections
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
} from '../sections/@dashboard/app';
import marketsIcon from '../images/market.png'
import borrowIcon from '../images/borrow.png'
import lenderIcon from '../images/lender.png'
import reserveIcon from '../images/reserve.png'
import { globalCreators } from '../state/markets/index';
import { useApollo } from '../apollo/index';
import { totalSupplyTopMarkets, getDailyMarketTrends } from '../apollo/queries'

// ----------------------------------------------------------------------
DashboardAppPage.propTypes = {
  markets: PropTypes.object,
  getTopMarketsLoad: PropTypes.func,
  getTopMarketsSuccess: PropTypes.func,
  getTopMarketsError: PropTypes.func,
  getDailyProtocolDataLoad: PropTypes.func,
  getDailyProtocolDataSuccess: PropTypes.func,
  getDailyProtocolDataError: PropTypes.func,
};
function DashboardAppPage({ markets, getTopMarketsLoad, getTopMarketsSuccess, getTopMarketsError, getDailyProtocolDataLoad, getDailyProtocolDataSuccess, getDailyProtocolDataError }) {
  const theme = useTheme();
  const client = useApollo();
  useEffect(() => {
    const getTopMarkets = async () => {
      try {
        getTopMarketsLoad()
        const { data, error } = await client.query({
          query: totalSupplyTopMarkets,
          context: {
            clientName: "mirai",
          },
        });
        if (data && data.markets) {
          const topMarkets = [];
          let totalDeposited = new BigNumber('0')
          data.markets.forEach(market => {
            totalDeposited = totalDeposited.plus(market.totalDepositBalanceUSD)
            topMarkets.push({
              label: market.inputToken.symbol,
              value: market.totalDepositBalanceUSD
            })
          })
          topMarkets.push({
            label: 'Others',
            value: parseFloat(markets.totalValueLocked) - parseFloat(totalDeposited.toString())
          })
          getTopMarketsSuccess(topMarkets)
        }
        if (error) {
          getTopMarketsError()
        }
      } catch (error) {
        console.error(error)
        getTopMarketsError()
      }
    }
    const getDailyMarketData = async () => {
      try {
        getDailyProtocolDataLoad()
        const { data, error } = await client.query({
          query: getDailyMarketTrends,
          context: {
            clientName: "mirai",
          },
        });
        if (data && data.financialsDailySnapshots) {
          let dailyMarketData = {
            date: [],
            totalValueLocked: [],
            totalValueBorrowed: []
          }
          data.financialsDailySnapshots.forEach(marketData => {
            dailyMarketData = {
              date: [...dailyMarketData.date, new Date(parseFloat(marketData.timestamp) * 1000).toLocaleDateString()],
              totalValueLocked: [...dailyMarketData.totalValueLocked, marketData.totalDepositBalanceUSD],
              totalValueBorrowed: [...dailyMarketData.totalValueBorrowed, marketData.totalBorrowBalanceUSD]
            }
          })
          getDailyProtocolDataSuccess(dailyMarketData)
        }
        if (error) {
          getDailyProtocolDataError()
        }
      } catch (error) {
        console.error({ error })
        getDailyProtocolDataError()
      }
    }
    getDailyMarketData()
    getTopMarkets()
  }, [client, markets.totalValueLocked])
  return (
    <>
      <Helmet>
        <title> Dashboard | Mirai ProtocolMinimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome To Lending Protocol
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Supply" total={parseFloat(markets.totalValueLocked)} icon={<img src={marketsIcon} width="40px" alt="Markets" />} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Value Locked (TVL)" total={parseFloat(markets.totalValueLocked) - parseFloat(markets.totalValueBorrowed)} color="success" icon={<img src={reserveIcon} width="40px" alt="Markets" />} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Borrowed" total={parseFloat(markets.totalValueBorrowed)} color="error" icon={<img src={borrowIcon} width="40px" alt="Markets" />} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {getDailyProtocolDataSuccess &&
              <AppWebsiteVisits
                title="Protocol at Glance"
                subheader="(+43%) than last Month"
                chartLabels={markets.dailyProtocolData.date}
                chartData={[
                  {
                    name: 'Total Supply',
                    type: 'area',
                    fill: 'gradient',
                    data: markets.dailyProtocolData.totalValueLocked
                  },
                  {
                    name: 'Total Borrowed',
                    type: 'line',
                    fill: 'solid',
                    data: markets.dailyProtocolData.totalValueBorrowed
                  },
                ]}
              />
            }
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Total Supply Top Markets"
              chartData={markets.topMarkets}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          {false &&
            <Grid item xs={12} md={6} lg={12}>
              <AppTrafficBySite
                title="Lending Stats"
                list={[
                  {
                    name: 'Markets',
                    value: 323234,
                    icon: <img src={marketsIcon} width="50px" alt="Markets" />,
                  },
                  {
                    name: 'Reserves',
                    value: 341212,
                    icon: <img src={reserveIcon} width="50px" alt="Markets" />,
                  },
                  {
                    name: 'Lenders',
                    value: 411213,
                    icon: <img src={lenderIcon} width="50px" alt="Markets" />,
                  },
                  {
                    name: 'Borrowers',
                    value: 443232,
                    icon: <img src={borrowIcon} width="50px" alt="Markets" />,
                  },
                ]}
              />
            </Grid>
          }
        </Grid>
      </Container>
    </>
  );
}

const mapStateToProps = state => ({
  markets: state.markets,
});

export function mapDispatchToProps(dispatch) {
  const { getMarketsLoad, getMarketsSuccess, getMarketsError, getTopMarketsLoad, getTopMarketsSuccess, getTopMarketsError, getDailyProtocolDataLoad, getDailyProtocolDataSuccess, getDailyProtocolDataError } = globalCreators;
  return {
    getMarketsLoad: () => dispatch(getMarketsLoad()),
    getMarketsError: () => dispatch(getMarketsError()),
    getMarketsSuccess: data => dispatch(getMarketsSuccess(data)),
    getTopMarketsLoad: () => dispatch(getTopMarketsLoad()),
    getTopMarketsError: () => dispatch(getTopMarketsError()),
    getTopMarketsSuccess: data => dispatch(getTopMarketsSuccess(data)),
    getDailyProtocolDataLoad: () => dispatch(getDailyProtocolDataLoad()),
    getDailyProtocolDataError: () => dispatch(getDailyProtocolDataError()),
    getDailyProtocolDataSuccess: data => dispatch(getDailyProtocolDataSuccess(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(DashboardAppPage);