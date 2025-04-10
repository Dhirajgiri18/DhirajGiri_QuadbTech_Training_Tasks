import React, { useState } from 'react';
import { AptosClient } from 'aptos';

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

const App = () => {
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [txHash, setTxHash] = useState("");

  const fetchTransaction = async () => {
    try {
      const response = await client.getTransactionByHash(txHash);
      const data = response.data;

      // Extract gas used and refunded
      const gasUsed = data.gas_used;
      const gasRefunded = data.gas_refunded;
      const status = data.success;

      setTransactionDetails({ gasUsed, gasRefunded, status });
    } catch (error) {
      console.error("Error fetching transaction", error);
    }
  };

  return (
    <div>
      <h1>Aptos Gas Tracker</h1>
      <input
        type="text"
        placeholder="Enter Transaction Hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
      />
      <button onClick={fetchTransaction}>Track Gas</button>

      {transactionDetails && (
        <div>
          <p>Gas Used: {transactionDetails.gasUsed}</p>
          <p>Gas Refunded: {transactionDetails.gasRefunded}</p>
          <p>Status: {transactionDetails.status ? "Success" : "Failure"}</p>
        </div>
      )}
    </div>
  );
};

export default App;
