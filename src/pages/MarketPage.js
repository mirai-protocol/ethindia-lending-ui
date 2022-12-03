/* eslint-disable react/prop-types */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { ethers } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
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
  Button,
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
import eularTestnetConfig from '../config/addresses-polygontestnet.json';
import getEulerInstance from '../utils/getEulerInstance';
import erc20Abi from '../config/abis/erc20.json';
import useWeb3React from '../hooks/useWeb3React';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

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
  { id: 'available', label: 'Current TVL', alignRight: false },
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
  const {
    id,
    inputToken,
    supplierApy,
    borrowerApy,
    totalBorrowBalanceUSD,
    totalDepositBalanceUSD,
    inputTokenPriceUSD,
    available,
    userData,
  } = props.market;
  const { account, updateMarket, chainId } = props;
  const [open, setOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [repayLoading, setRepayLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [amounts, setamounts] = useState({
    depositAmount: '0',
    withdrawAmount: '0',
  });
  const [openMarketProcessing, setOpenMarketProcessing] = useState(false);
  const [isEntered, setIsEntered] = useState(userData ? userData.isEntered : false);
  const handleOpenMarket = async () => {
    try {
      setOpenMarketProcessing(true);
      const eularInstance = getEulerInstance();
      const tx = await eularInstance.contracts.markets.enterMarket('0', inputToken.id);
      await tx.wait();
      setIsEntered(true);
      setOpenMarketProcessing(false);
    } catch (error) {
      setOpenMarketProcessing(false);
      console.error(error);
    }
  };
  const handleTextChange = (title, event) => {
    setamounts((amount) => ({
      ...amount,
      [title]: event.target.value,
    }));
  };
  const handleApprove = async () => {
    try {
      setApproveLoading(true);
      const eularInstance = getEulerInstance();
      await eularInstance.addContract(inputToken.symbol.toLowerCase(), erc20Abi, inputToken.id);
      const approvalAmount = ethers.BigNumber.from(MaxUint256.toString());
      const approvalTxn = await eularInstance.contracts[inputToken.symbol.toLowerCase()].approve(
        eularInstance.addresses.euler,
        approvalAmount
      );
      await approvalTxn.wait();
      const allowence = await eularInstance.contracts[inputToken.symbol.toLowerCase()].allowance(
        account,
        eularInstance.addresses.euler
      );
      const eulerAllowance = new BigNumber(allowence.toString()).dividedBy(10 ** parseFloat(inputToken.decimals));
      const newMarket = {
        id,
        market: {
          ...props.market,
          userData: {
            ...userData,
            eulerAllowance: eulerAllowance.toString(),
          },
        },
      };
      updateMarket(newMarket);
      setApproveLoading(false);
    } catch (error) {
      setApproveLoading(false);
      console.log('error', error);
    }
  };
  const updateUserStats = async () => {
    const eularInstance = getEulerInstance();
    const query = {
      eulerContract: eularTestnetConfig.euler,
      account,
      markets: [inputToken.id],
    };
    const marketsUserData = await eularInstance.contracts.eulerGeneralView.doQuery(query);
    const isEntered = marketsUserData.enteredMarkets.find(
      (market) => market.toLowerCase() === inputToken.id.toLowerCase()
    );
    if (isEntered) {
      let liabilityValue = new BigNumber('0');
      let collateralValue = new BigNumber('0');
      let tokenBal = new BigNumber('0');
      let eulerAllowance = new BigNumber('0');
      let eTokenBalanceUnderlying = new BigNumber('0');
      let dTokenBalance = new BigNumber('0');
      marketsUserData.markets.forEach((market) => {
        if (market[0] === isEntered) {
          dTokenBalance = new BigNumber(market.dTokenBalance.toString()).dividedBy(10 ** parseFloat(market.decimals));
          eTokenBalanceUnderlying = new BigNumber(market.eTokenBalanceUnderlying.toString()).dividedBy(
            10 ** parseFloat(market.decimals)
          );
          eulerAllowance = new BigNumber(market.eulerAllowance.toString()).dividedBy(10 ** parseFloat(market.decimals));
          tokenBal = new BigNumber(market.underlyingBalance.toString()).dividedBy(10 ** parseFloat(market.decimals));
          liabilityValue = liabilityValue
            .plus(market.liquidityStatus.liabilityValue.toString())
            .dividedBy(10 ** parseFloat(market.decimals));
          collateralValue = collateralValue
            .plus(market.liquidityStatus.collateralValue.toString())
            .dividedBy(10 ** parseFloat(market.decimals));
        }
      });
      const updatedUserData = {
        ...userData,
        isEntered: true,
        dTokenBalance: dTokenBalance.toString(),
        eTokenBalanceUnderlying: eTokenBalanceUnderlying.toString(),
        eulerAllowance: eulerAllowance.toString(),
        tokenBal: tokenBal.toString(),
        totalCollatral: collateralValue.toString(),
        totalLiability: liabilityValue.toString(),
      };
      const newMarket = {
        id,
        market: {
          ...props.market,
          userData: updatedUserData,
        },
      };
      updateMarket(newMarket);
    }
  };
  const handleDeposit = async () => {
    try {
      const eularInstance = getEulerInstance();
      setDepositLoading(true);
      const eToken = await eularInstance.eTokenOf(inputToken.id);
      const approvalAmount = new BigNumber(amounts.depositAmount)
        .multipliedBy(new BigNumber(10).pow(inputToken.decimals))
        .toJSON();
      const tx = await eToken.deposit('0', approvalAmount);
      await tx.wait();
      setDepositLoading(false);
      updateUserStats();
    } catch (error) {
      setDepositLoading(false);
      console.log('error', error);
    }
  };
  const handleBorrow = async () => {
    try {
      setBorrowLoading(true);
      const eularInstance = getEulerInstance();
      const dToken = await eularInstance.dTokenOf(inputToken.id);
      const approvalAmount = new BigNumber(amounts.withdrawAmount)
        .multipliedBy(new BigNumber(10).pow(inputToken.decimals))
        .toJSON();
      const tx = await dToken.borrow('0', approvalAmount);
      await tx.wait();
      updateUserStats();
      setBorrowLoading(false);
    } catch (error) {
      setBorrowLoading(false);
      console.error(error);
    }
  };
  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      const eularInstance = getEulerInstance();
      const eToken = await eularInstance.eTokenOf(inputToken.id);
      const approvalAmount = new BigNumber(amounts.depositAmount)
        .multipliedBy(new BigNumber(10).pow(inputToken.decimals))
        .toJSON();
      const tx = await eToken.withdraw('0', approvalAmount);
      await tx.wait();
      setWithdrawLoading(false);
      updateUserStats();
    } catch (error) {
      setWithdrawLoading(false);
      console.error(error);
    }
  };
  const handleRepay = async () => {
    try {
      setRepayLoading(true);
      const eularInstance = getEulerInstance();
      const dToken = await eularInstance.dTokenOf(inputToken.id);
      const approvalAmount = new BigNumber(amounts.withdrawAmount)
        .multipliedBy(new BigNumber(10).pow(inputToken.decimals))
        .toJSON();
      const tx = await dToken.repay('0', approvalAmount);
      await tx.wait();
      updateUserStats();
      setRepayLoading(false);
    } catch (error) {
      setRepayLoading(false);
      console.error(error);
    }
  };
  useEffect(() => {
    if (userData) {
      setIsEntered(userData.isEntered);
    }
  }, [userData]);

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
          <span style={{ fontWeight: '700', fontSize: '16px' }}>${parseFloat(inputTokenPriceUSD).toFixed(2)}</span>
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
          <span style={{ fontWeight: '700', fontSize: '16px' }}>$ {fShortenNumber(totalDepositBalanceUSD)}</span>
        </TableCell>
        <TableCell align="right">
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#ffa000' }}>
            $ {fShortenNumber(totalBorrowBalanceUSD)}
          </span>
        </TableCell>
        <TableCell align="right">
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#43a047' }}>
            $ {available > 0 ? fShortenNumber(available) : 0}
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit sx={{ padding: '20px 10px' }}>
            {isEntered ? (
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6} md={6}>
                  <Card sx={{ padding: '20px' }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ marginBottom: '20px' }}
                    >
                      <CardHeader
                        title="Deposit into Market"
                        sx={{ padding: '0px' }}
                        subheader={`Balance: ${fShortenNumber(parseFloat(userData.tokenBal))} ${inputToken.symbol}`}
                      />
                      <Stack alignItems="center" justifyContent="centercenter">
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 700,
                          }}
                        >
                          {inputToken.symbol} Deposited
                        </span>
                        <span
                          style={{
                            fontSize: '18px',
                            color: '#2e7d32',
                            fontWeight: 700,
                          }}
                        >
                          {fShortenNumber(parseFloat(userData.eTokenBalanceUnderlying))} {inputToken.symbol}
                        </span>
                      </Stack>
                    </Stack>
                    <StyledInput
                      value={amounts.depositAmount}
                      onChange={(event) => handleTextChange('depositAmount', event)}
                      placeholder="Enter Amount......"
                      label="Amount"
                      type="number"
                      endAdornment={
                        <InputAdornment position="end">
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                              setamounts((amount) => ({
                                ...amount,
                                depositAmount: userData.tokenBal,
                              }))
                            }
                          >
                            Max
                          </Button>
                        </InputAdornment>
                      }
                    />
                    {parseFloat(userData.eulerAllowance) > 0 ? (
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={3}
                        sx={{ marginTop: '20px' }}
                      >
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={handleWithdraw}
                          disabled={
                            withdrawLoading ||
                            parseFloat(amounts.depositAmount) <= 0 ||
                            parseFloat(userData.eulerAllowance) <= parseFloat(amounts.depositAmount)
                          }
                          endIcon={<AddCircleIcon />}
                        >
                          {withdrawLoading ? 'Processing...' : `Withdraw ${inputToken.symbol}`}
                        </Button>
                        {parseFloat(userData.eulerAllowance) > parseFloat(amounts.depositAmount) ? (
                          <Button
                            variant="contained"
                            onClick={handleDeposit}
                            fullWidth
                            disabled={depositLoading || parseFloat(amounts.depositAmount) <= 0}
                          >
                            {depositLoading ? 'Processing...' : 'Deposit'}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={handleApprove}
                            fullWidth
                            disabled={approveLoading || parseFloat(amounts.depositAmount) <= 0}
                          >
                            {approveLoading ? 'Processing...' : 'Approve'}
                          </Button>
                        )}
                      </Stack>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={handleApprove}
                        fullWidth
                        disabled={
                          approveLoading || parseFloat(userData.eulerAllowance) > parseFloat(amounts.depositAmount)
                        }
                      >
                        {approveLoading ? 'Processing...' : 'Approve'}
                      </Button>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Card sx={{ padding: '20px' }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ marginBottom: '20px' }}
                    >
                      <CardHeader
                        title="Borrow from Market"
                        sx={{ padding: '0px' }}
                        subheader={`Balance: ${fShortenNumber(parseFloat(userData.tokenBal))} ${inputToken.symbol}`}
                      />
                      <Stack alignItems="center" justifyContent="centercenter">
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 700,
                          }}
                        >
                          {inputToken.symbol} Borrowed
                        </span>
                        <span
                          style={{
                            fontSize: '18px',
                            color: '#d32f2f',
                            fontWeight: 700,
                          }}
                        >
                          {fShortenNumber(parseFloat(userData.dTokenBalance))} {inputToken.symbol}
                        </span>
                      </Stack>
                    </Stack>
                    <StyledInput
                      value={amounts.withdrawAmount}
                      onChange={(event) => handleTextChange('withdrawAmount', event)}
                      type="number"
                      placeholder="Enter Amount......"
                      label="Amount"
                      endAdornment={
                        <InputAdornment position="end">
                          <Button variant="outlined">Max</Button>
                        </InputAdornment>
                      }
                    />
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={3}
                      sx={{ marginTop: '20px' }}
                    >
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleRepay}
                        disabled={repayLoading}
                        endIcon={<RemoveCircleIcon />}
                      >
                        {repayLoading ? 'Processing...' : 'Repay'}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleBorrow}
                        disabled={borrowLoading}
                        fullWidth
                        endIcon={<RemoveCircleIcon />}
                      >
                        {borrowLoading ? 'Processing...' : 'Borrow From Market'}
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <div>
                <Card sx={{ padding: '20px' }}>
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <CardHeader title="Enter the Market" sx={{ padding: '0px' }} />
                    <Button variant="contained" disabled={openMarketProcessing} onClick={handleOpenMarket}>
                      {openMarketProcessing ? 'Processing...' : 'Enter The Market'}
                    </Button>
                  </Stack>
                </Card>
              </div>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
function MarketPage({ markets, updateMarket }) {
  const { account, chainId } = useWeb3React();
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
    setMarkestData(markets.markets);
  }, [markets.getMarketsSuccess, markets.markets]);
  return (
    <>
      <Helmet>
        <title> Markets | Mirai ProtocolMinimal UI </title>
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
              <AppWidgetSummary
                title="Total Supplied Amount"
                prefix="$ "
                total={parseFloat(markets.totalUserSupplied)}
                color="info"
                icon={<img src={walletyIcon} width="40px" alt="Markets" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Total Collateral Avaialble"
                prefix="$ "
                total={parseFloat(markets.totalUserCollateral)}
                color="success"
                icon={<img src={walletyIcon} width="40px" alt="Markets" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Total Borrowed Amount"
                prefix="$ "
                total={parseFloat(markets.totalUserBorrowed)}
                color="error"
                icon={<img src={liabilityIcon} width="40px" alt="Markets" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Availabe Amount"
                prefix="$ "
                total={parseFloat(markets.totalUserCollateral) - parseFloat(markets.totalUserBorrowed)}
                color="success"
                icon={<img src={liabilityIcon} width="40px" alt="Markets" />}
              />
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
                    <Row market={row} key={row.id} account={account} chainID={chainId} updateMarket={updateMarket} />
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
const mapStateToProps = (state) => ({
  markets: state.markets,
});

export function mapDispatchToProps(dispatch) {
  const { getMarketsLoad, getMarketsSuccess, getMarketsError, updateMarket } = globalCreators;
  return {
    getMarketsLoad: () => dispatch(getMarketsLoad()),
    getMarketsError: () => dispatch(getMarketsError()),
    getMarketsSuccess: (data) => dispatch(getMarketsSuccess(data)),
    updateMarket: (data) => dispatch(updateMarket(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MarketPage);
