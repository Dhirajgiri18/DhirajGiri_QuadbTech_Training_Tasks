import WalletIcon from '@mui/icons-material/Wallet';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";

const App = () => {
  const theme = useTheme();
  const [account, setAccount] = useState(null);
  const [lendingAmount, setLendingAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [totalLendingAmount, setTotalLendingAmount] = useState(0);
  const [totalBorrowedAmount, setTotalBorrowedAmount] = useState(0);
  const [loading, setLoading] = useState({
    deposit: false,
    borrow: false,
    withdraw: false,
    repay: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    if (account) {
      fetchTotalLendingAmount();
      fetchTotalBorrowedAmount();
    }
  }, [account]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleConnect = async () => {
    const aptos = window.aptos;
    if (!aptos) {
      showSnackbar("Please install Petra wallet!", "error");
      return;
    }
    try {
      await aptos.connect();
      const accountInfo = await aptos.account();
      setAccount(accountInfo.address);
      showSnackbar("Wallet connected successfully!");
    } catch (error) {
      showSnackbar("Connection failed!", "error");
    }
  };

  const handleDeposit = async () => {
    if (!lendingAmount || isNaN(lendingAmount)) {
      showSnackbar("Please enter a valid amount", "error");
      return;
    }
  
    try {
      setLoading(prev => ({ ...prev, deposit: true }));
      const aptos = window.aptos;
  
      // 1. Verify connection
      if (!await aptos.isConnected()) {
        await aptos.connect();
      }
  
      // 2. Create properly formatted transaction
      const transaction = {
        payload: {
          type: "entry_function_payload",
          function: "lending_borrowing::lending::deposit_funds",
          arguments: [Number(lendingAmount)],
        },
        options: {
          chainId: 1 // Mainnet - use 2 for testnet
        }
      };
  
      // 3. Submit transaction
      const response = await aptos.signAndSubmitTransaction(transaction);
      console.log("Tx hash:", response.hash);
      
      // 4. Wait for confirmation
      const result = await aptos.waitForTransaction(response.hash);
      if (result.success) {
        showSnackbar(`Success! ${lendingAmount} APT deposited`);
        await fetchTotalLendingAmount();
        setLendingAmount("");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      showSnackbar(`Failed: ${error.message}`, "error");
    } finally {
      setLoading(prev => ({ ...prev, deposit: false }));
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount)) {
      showSnackbar("Please enter a valid amount", "error");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, withdraw: true }));
      const aptos = window.aptos;
      const payload = {
        type: "entry_function_payload",
        function: "lending_borrowing::lending::withdraw_funds",
        arguments: [Number(withdrawAmount)],
      };
      const response = await aptos.signAndSubmitTransaction(payload);
      await aptos.waitForTransaction(response.hash);
      await fetchTotalLendingAmount();
      showSnackbar("Withdrawal successful!");
      setWithdrawAmount("");
    } catch (error) {
      showSnackbar(`Withdrawal failed: ${error.message}`, "error");
    } finally {
      setLoading(prev => ({ ...prev, withdraw: false }));
    }
  };

  const handleBorrow = async () => {
    if (!borrowAmount || isNaN(borrowAmount)) {
      showSnackbar("Please enter a valid amount", "error");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, borrow: true }));
      const aptos = window.aptos;
      const payload = {
        type: "entry_function_payload",
        function: "lending_borrowing::borrowing::borrow_funds",
        arguments: [Number(borrowAmount)],
      };
      const response = await aptos.signAndSubmitTransaction(payload);
      await aptos.waitForTransaction(response.hash);
      await fetchTotalBorrowedAmount();
      showSnackbar("Borrow successful!");
      setBorrowAmount("");
    } catch (error) {
      showSnackbar(`Borrow failed: ${error.message}`, "error");
    } finally {
      setLoading(prev => ({ ...prev, borrow: false }));
    }
  };

  const handleRepay = async () => {
    if (!repayAmount || isNaN(repayAmount)) {
      showSnackbar("Please enter a valid amount", "error");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, repay: true }));
      const aptos = window.aptos;
      const payload = {
        type: "entry_function_payload",
        function: "lending_borrowing::borrowing::repay_funds",
        arguments: [Number(repayAmount)],
      };
      const response = await aptos.signAndSubmitTransaction(payload);
      await aptos.waitForTransaction(response.hash);
      await fetchTotalBorrowedAmount();
      showSnackbar("Repayment successful!");
      setRepayAmount("");
    } catch (error) {
      showSnackbar(`Repayment failed: ${error.message}`, "error");
    } finally {
      setLoading(prev => ({ ...prev, repay: false }));
    }
  };

  const fetchTotalLendingAmount = async () => {
    try {
      const aptos = window.aptos;
      const contractPayload = {
        function: "lending_borrowing::lending::get_lending_amount",
        type_arguments: [],
        arguments: [account],
      };
      const result = await aptos.callContract(contractPayload);
      setTotalLendingAmount(result.amount || 0);
    } catch (error) {
      showSnackbar(`Failed to fetch lending amount: ${error.message}`, "error");
    }
  };

  const fetchTotalBorrowedAmount = async () => {
    try {
      const aptos = window.aptos;
      const contractPayload = {
        function: "lending_borrowing::borrowing::get_borrowed_amount",
        type_arguments: [],
        arguments: [account],
      };
      const result = await aptos.callContract(contractPayload);
      setTotalBorrowedAmount(result.borrowed || 0);
    } catch (error) {
      showSnackbar(`Failed to fetch borrowed amount: ${error.message}`, "error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ 
        textAlign: "center", 
        mb: 4,
        padding: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3]
      }}>
        <Typography variant="h3" sx={{ 
          mb: 3, 
          fontWeight: 700,
          color: theme.palette.primary.main
        }}>
          Lending & Borrowing Protocol
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnect}
          startIcon={<WalletIcon />}
          sx={{ 
            mb: 3,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: "1.1rem"
          }}
        >
          {account ? "Connected" : "Connect Wallet"}
        </Button>

        {account && (
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary,
            fontFamily: 'monospace',
            wordBreak: "break-all"
          }}>
            {account}
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Deposited
              </Typography>
              <Typography variant="h4" sx={{ color: theme.palette.success.main }}>
                {totalLendingAmount} APT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Borrowed
              </Typography>
              <Typography variant="h4" sx={{ color: theme.palette.warning.main }}>
                {totalBorrowedAmount} APT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Deposit Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Deposit Funds
              </Typography>
              <TextField
                fullWidth
                label="Amount in APT"
                variant="outlined"
                type="number"
                value={lendingAmount}
                onChange={(e) => setLendingAmount(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleDeposit}
                disabled={loading.deposit}
                sx={{ py: 1.5 }}
              >
                {loading.deposit ? (
                  <CircularProgress size={24} />
                ) : (
                  "Deposit"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Withdraw Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Withdraw Funds
              </Typography>
              <TextField
                fullWidth
                label="Amount in APT"
                variant="outlined"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleWithdraw}
                disabled={loading.withdraw}
                sx={{ py: 1.5 }}
              >
                {loading.withdraw ? (
                  <CircularProgress size={24} />
                ) : (
                  "Withdraw"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Borrow Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Borrow Funds
              </Typography>
              <TextField
                fullWidth
                label="Amount in APT"
                variant="outlined"
                type="number"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleBorrow}
                disabled={loading.borrow}
                sx={{ py: 1.5 }}
              >
                {loading.borrow ? (
                  <CircularProgress size={24} />
                ) : (
                  "Borrow"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Repay Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Repay Funds
              </Typography>
              <TextField
                fullWidth
                label="Amount in APT"
                variant="outlined"
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={handleRepay}
                disabled={loading.repay}
                sx={{ py: 1.5 }}
              >
                {loading.repay ? (
                  <CircularProgress size={24} />
                ) : (
                  "Repay"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;