import React from 'react';

const DepositFundsButton = () => {
  // Define the handleDeposit function
  const handleDeposit = () => {
    // Handle the deposit logic here
    console.log('Deposit clicked');
  };

  return (
    <button onClick={handleDeposit}>Deposit Funds</button>
  );
};

export default DepositFundsButton;
