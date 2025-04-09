// WithdrawFundsButton.jsx
import React from 'react';

const WithdrawFundsButton = ({ account }) => {
  const handleWithdraw = async () => {
    try {
      // Call the smart contract to withdraw funds (implement actual smart contract interaction)
      const result = await withdrawFundsFromContract(account);
      console.log("Withdrawal successful:", result);
    } catch (err) {
      console.error("Error withdrawing funds:", err);
    }
  };

  return (
    <button onClick={handleWithdraw} className="mt-4 bg-green-500 px-4 py-2 text-white">
      Withdraw Funds
    </button>
  );
};

export default WithdrawFundsButton;
