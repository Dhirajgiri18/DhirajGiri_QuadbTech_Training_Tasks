import React from "react";

const BorrowFundsButton = ({ setBorrowAmount, handleBorrow }) => {
  const handleChange = (e) => {
    setBorrowAmount(Number(e.target.value));
  };

  return (
    <div>
      <input type="number" onChange={handleChange} placeholder="Enter amount to borrow" />
      <button onClick={handleBorrow}>Borrow Funds</button>
    </div>
  );
};

export default BorrowFundsButton;
