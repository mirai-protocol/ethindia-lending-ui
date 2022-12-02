import { Helmet } from 'react-helmet-async';
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

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome To Lending Protocol
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Supply" total={714000} icon={<img src={marketsIcon} width="40px" alt="Markets" />} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Value Locked (TVL)" total={1352831} color="success" icon={<img src={reserveIcon} width="40px" alt="Markets" />} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Borrowed" total={1723315} color="error" icon={<img src={borrowIcon} width="40px" alt="Markets" />} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Protocol at Glance"
              subheader="(+43%) than last Month"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Total Supply',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Total Borrowed',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Total Supply Top Markets"
              chartData={[
                { label: 'USDC', value: 4344 },
                { label: 'WSTETH', value: 5435 },
                { label: 'WETH', value: 1443 },
                { label: 'Other', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

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
        </Grid>
      </Container>
    </>
  );
}
