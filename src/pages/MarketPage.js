/* eslint-disable react/prop-types */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { styled, alpha } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
// import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Grid,
  CardHeader,
  Stack,
  Paper,
  Avatar,
  Collapse,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  // Rating,
  OutlinedInput,
  InputAdornment,
  Button
} from '@mui/material';
// components
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { AppWidgetSummary } from '../sections/@dashboard/app';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import { fShortenNumber } from '../utils/formatNumber';
import liabilityIcon from '../images/liability.png';
import walletyIcon from '../images/wallet.png';
import { globalCreators } from '../state/markets/index';

// ----------------------------------------------------------------------

const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  marginTop: '10px',
  marginBottom: '10px',
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: '100%',
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));
const TABLE_HEAD = [
  { id: 'inputToken', label: 'Market Name', alignRight: false },
  // { id: 'type', label: 'Type', alignRight: false },
  // { id: 'rating', label: 'Rating', alignRight: false },
  { id: 'inputTokenPriceUSD', label: 'Price', alignRight: false },
  { id: 'supplierApy', label: 'Supply APY', alignRight: false },
  { id: 'borrowerApy', label: 'Borrow APY', alignRight: false },
  { id: 'totalDepositBalanceUSD', label: 'Total Supply', alignRight: false },
  { id: 'totalBorrowBalanceUSD', label: 'Total Borrow', alignRight: false },
  { id: 'available', label: 'Available', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
function Row(props) {
  const { id, inputToken, supplierApy, borrowerApy, totalBorrowBalanceUSD, totalDepositBalanceUSD, inputTokenPriceUSD, available } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover key={id} tabIndex={-1} role="checkbox">
        <TableCell padding="checkbox">
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, token.symbol)} /> */}
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={inputToken.symbol} src={inputToken.logoImg} />
            <Stack>
              <Typography variant="subtitle2" noWrap>
                {inputToken.symbol}
              </Typography>
              <Typography variant="body" noWrap>
                {inputToken.name}
              </Typography>
            </Stack>
          </Stack>
        </TableCell>

        {/* <TableCell align="left">
          <span style={{ fontWeight: '700', fontSize: '16px' }}>{type}</span>
        </TableCell> */}

        {/* <TableCell align="left">
          <Rating name="customized-10" readOnly value={rating} max={3} />
        </TableCell> */}

        <TableCell align="right">
          <span style={{ fontWeight: '700', fontSize: '16px' }}>
            ${parseFloat(inputTokenPriceUSD).toFixed(2)}
          </span>
        </TableCell>

        <TableCell align="right">
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#43a047' }}>
            {parseFloat(supplierApy).toFixed(3)}%
          </span>
        </TableCell>
        <TableCell align="right">
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#ffa000' }}>
            {parseFloat(borrowerApy).toFixed(3)}%
          </span>
        </TableCell>
        <TableCell align="right">
          <span style={{ fontWeight: '700', fontSize: '16px' }}>
            {fShortenNumber(totalDepositBalanceUSD)}
          </span>
        </TableCell>
        <TableCell align="right">
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#ffa000' }}>
            {fShortenNumber(totalBorrowBalanceUSD)}
          </span>
        </TableCell>
        <TableCell align="right">
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#43a047' }}>
            {available > 0 ? fShortenNumber(available) : 0}
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit sx={{ padding: '20px 10px' }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={6}>
                <Card sx={{ padding: '20px' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginBottom: '20px' }}>
                    <CardHeader title="Deposit into Market" sx={{ padding: '0px' }} subheader={`Balance: 0.05 ${inputToken.symbol}`} />
                    <Stack alignItems="center" justifyContent="centercenter">
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 700
                      }}>
                        {inputToken.symbol} Deposited
                      </span>
                      <span style={{
                        fontSize: '18px',
                        color: '#2e7d32',
                        fontWeight: 700
                      }}>
                        {fShortenNumber(1000)} {inputToken.symbol}
                      </span>
                    </Stack>
                  </Stack>
                  <StyledInput
                    // value={filterName}
                    // onChange={onFilterName}
                    placeholder="Enter Amount......"
                    label="Amount"
                    endAdornment={
                      <InputAdornment position="end">
                        <Button variant="outlined" color='secondary'>
                          Max
                        </Button>
                      </InputAdornment>
                    }
                  />
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={3} sx={{ marginTop: '20px' }}>
                    <Button variant="outlined" fullWidth>Approve</Button>
                    <Button variant="contained" fullWidth endIcon={<AddCircleIcon />}>Deposit {inputToken.symbol}</Button>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Card sx={{ padding: '20px' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginBottom: '20px' }}>
                    <CardHeader title="Borrow from Market" sx={{ padding: '0px' }} subheader={`Available Amount: 0.05 ${inputToken.symbol}`} />
                    <Stack alignItems="center" justifyContent="centercenter">
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 700
                      }}>
                        {inputToken.symbol} Borrowed
                      </span>
                      <span style={{
                        fontSize: '18px',
                        color: '#d32f2f',
                        fontWeight: 700
                      }}>
                        {fShortenNumber(1000)} {inputToken.symbol}
                      </span>
                    </Stack>
                  </Stack>
                  <StyledInput
                    // value={filterName}
                    // onChange={onFilterName}
                    placeholder="Enter Amount......"
                    label="Amount"
                    endAdornment={
                      <InputAdornment position="end">
                        <Button variant="outlined">Max</Button>
                      </InputAdornment>
                    }
                  />
                  <Button variant="contained" fullWidth sx={{ marginTop: '20px' }} endIcon={<RemoveCircleIcon />}>Borrow From Market</Button>
                </Card>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
function MarketPage({ markets }) {
  const [open, setOpen] = useState(null);
  const [marketsData, setMarkestData] = useState([]);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = marketsData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - marketsData.length) : 0;

  const filteredUsers = applySortFilter(marketsData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  useEffect(() => {
    setMarkestData(markets.markets)
  }, [markets.getMarketsSuccess, markets.markets])

  return (
    <>
      <Helmet>
        <title> Markets | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Markets
          </Typography>
        </Stack>
        <div style={{ marginBottom: '30px' }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Total Supplied Amount" prefix="$ " total={1710} color="success" icon={<img src={walletyIcon} width="40px" alt="Markets" />} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Total Borrowed Amount" prefix="$ " total={1510} color="error" icon={<img src={liabilityIcon} width="40px" alt="Markets" />} />
            </Grid>
          </Grid>
        </div>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={marketsData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <Row {...row} key={row.id} />
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={marketsData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
const mapStateToProps = state => ({
  markets: state.markets,
});

export function mapDispatchToProps(dispatch) {
  const { getMarketsLoad, getMarketsSuccess, getMarketsError } = globalCreators;
  return {
    getMarketsLoad: () => dispatch(getMarketsLoad()),
    getMarketsError: () => dispatch(getMarketsError()),
    getMarketsSuccess: data => dispatch(getMarketsSuccess(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(MarketPage);