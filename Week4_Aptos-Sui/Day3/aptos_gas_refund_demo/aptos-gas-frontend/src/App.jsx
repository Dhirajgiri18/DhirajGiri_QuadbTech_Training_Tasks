import React, { useState } from "react";
import { AptosClient } from "aptos";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

const MODULE_ADDRESS = "0xadd45e28494b481e39973ebad4b8c70d1a5aaa59f17016e70c1f5dfe9fef6872";
const MODULE_NAME = "gas_refund_demo";

function App() {
  const [account, setAccount] = useState(null);
  const [txnHistory, setTxnHistory] = useState([]);
  const [refundData, setRefundData] = useState([]);

  const connectWallet = async () => {
    try {
      const response = await window.aptos.connect();
      setAccount(response.address);
    } catch (err) {
      console.error("Wallet connect error:", err);
    }
  };

  const runFunction = async (funcName) => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::${funcName}`,
        arguments: [],
        type_arguments: [],
      };

      const tx = await window.aptos.signAndSubmitTransaction(payload);
      await client.waitForTransaction(tx.hash);

      const details = await client.getTransactionByHash(tx.hash);

      const newTxn = {
        hash: tx.hash,
        gasUsed: details.gas_used,
        success: details.success,
        type: funcName,
      };

      setTxnHistory((prev) => [newTxn, ...prev.slice(0, 4)]);

      if (funcName === "delete_state") {
        const refundValue = 441 - parseInt(details.gas_used); // assuming create used 441 gas
        setRefundData((prev) => [...prev.slice(-4), refundValue]);
      }
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  return (
    <div className="p-8 text-center font-sans bg-gradient-to-tr from-slate-100 to-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">⚡ Aptos Gas Refund Demo</h1>

      <button onClick={connectWallet} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow">
        {account ? "Wallet Connected" : "Connect Wallet"}
      </button>

      <div className="mt-8 flex justify-center gap-6 flex-wrap">
        <button onClick={() => runFunction("create_state")} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium shadow">
          Create State
        </button>
        <button onClick={() => runFunction("delete_state")} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium shadow">
          Delete State
        </button>
      </div>

      {txnHistory.length > 0 && (
        <div className="mt-12 text-left bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">📜 Transaction History</h2>
          <ul className="space-y-5">
            {txnHistory.map((txn, index) => (
              <li key={index} className="bg-slate-50 p-5 rounded-lg shadow-sm border border-slate-200">
                <p><span className="font-semibold text-gray-700">Type:</span> {txn.type}</p>
                <p><span className="font-semibold text-gray-700">Gas Used:</span> {txn.gasUsed}</p>
                <p><span className="font-semibold text-gray-700">Status:</span> {txn.success ? "✅ Success" : "❌ Failed"}</p>
                <p>
                  <span className="font-semibold text-gray-700">Txn Hash:</span>{" "}
                  <a
                    href={`https://explorer.aptoslabs.com/txn/${txn.hash}?network=devnet`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {txn.hash.slice(0, 10)}...{txn.hash.slice(-6)}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {refundData.length > 0 && (
        <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-200">
          <h2 className="text-2xl font-bold mb-6 text-green-700">💸 Gas Refund Observed</h2>
          <ul className="list-disc list-inside text-left text-gray-800 space-y-2">
            {refundData.map((refund, index) => (
              <li key={index} className="pl-1">Refund for Txn {index + 1}: <strong>{refund} gas units</strong></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;