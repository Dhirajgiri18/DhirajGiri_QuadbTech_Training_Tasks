import React from "react";

const RepayFundsButton = () => {
  const handleRepay = async () => {
    const aptos = window.aptos;
    if (!aptos) {
      console.error("Petra wallet is not installed.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        type: "entry_function_payload",
        function: "lending_borrowing::borrowing::repay_funds",
        arguments: [repaymentAmount], // assuming repaymentAmount is set
        type_arguments: [],
      };

      setLoading(true);
      const response = await aptos.submitTransaction(payload);
      console.log("Repayment successful:", response);
    } catch (error) {
      console.error("Repayment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleRepay}>Repay Funds</button>
    </div>
  );
};

export default RepayFundsButton;
