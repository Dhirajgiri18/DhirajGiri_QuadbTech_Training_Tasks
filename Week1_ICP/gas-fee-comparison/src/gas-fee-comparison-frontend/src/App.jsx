import React, { useState } from "react";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [prevGasFee, setPrevGasFee] = useState(null);

  const addTransaction = () => {
    const gasFee = Math.floor(Math.random() * 100) + 1; // Random gas fee between 1-100
    let comparison = "";

    if (prevGasFee !== null) {
      if (gasFee > prevGasFee) comparison = " 🔺 Higher than previous";
      else if (gasFee < prevGasFee) comparison = " 🔻 Lower than previous";
      else comparison = " ➖ Equal to previous";
    }

    const newTransaction = `✅ Transaction ${transactions.length + 1}: Gas Fee - ${gasFee} ${comparison}`;
    
    setTransactions([...transactions, newTransaction]);
    setPrevGasFee(gasFee);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🚀 ICP - Gas Fee Comparison DApp</h2>
        <button className="btn" onClick={addTransaction}>➕ Add Transaction</button>
        <h3>📜 Transactions:</h3>
        <ul className="transaction-list">
          {transactions.map((txn, index) => (
            <li key={index}>{txn}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
