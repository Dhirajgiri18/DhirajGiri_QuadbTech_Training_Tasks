import { BrowserProvider, Contract } from "ethers";
import React, { useEffect, useState } from "react";
import contractData from "../abi/GasFeeTracker.json"; // Import the ABI JSON file

const contractAddress = "0x87984142A11578A8Ca023422E67D1Dcd09844e24";

const GasFeeTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" }); // Request MetaMask connection
          const browserProvider = new BrowserProvider(window.ethereum);
          const signerInstance = await browserProvider.getSigner();
          setProvider(browserProvider);
          setSigner(signerInstance);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
          setError("Failed to connect MetaMask. Please try again.");
        }
      } else {
        setError("MetaMask not detected. Install it to proceed.");
      }
    };
    initializeProvider();
  }, []);

  const makeTransaction = async () => {
    if (!signer) {
      setError("No signer found. Connect MetaMask first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const contract = new Contract(contractAddress, contractData.abi, signer);
      const tx = await contract.recordTransaction();
      await tx.wait();

      const receipt = await signer.provider.getTransactionReceipt(tx.hash);
      const gasUsed = receipt.gasUsed.toString(); // Convert BigInt to string

      setTransactions((prev) => [...prev, { hash: tx.hash, gasUsed }]);
    } catch (error) {
      console.error("Transaction failed:", error);
      setError("Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Gas Fee Tracker</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        onClick={makeTransaction}
        disabled={loading}
        className={`px-6 py-2 text-white font-semibold rounded-lg transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Make Transaction"}
      </button>

      {loading && (
        <p className="text-gray-600 mt-2">Transaction in progress...</p>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Transaction History
        </h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="border border-gray-300 rounded-md p-3 bg-gray-50">
            {transactions.map((tx, index) => (
              <li key={index} className="text-sm text-gray-700 mb-1">
                <span className="font-medium">
                  Transaction {index + 1} ✅ | Gas Fee: {tx.gasUsed} wei
                </span>
                {index > 0 && (
                  <span
                    className={`ml-2 ${
                      tx.gasUsed > transactions[index - 1].gasUsed
                        ? "text-red-600"
                        : tx.gasUsed < transactions[index - 1].gasUsed
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {tx.gasUsed > transactions[index - 1].gasUsed
                      ? "🔺 Higher than previous"
                      : tx.gasUsed < transactions[index - 1].gasUsed
                      ? "🔻 Lower than previous"
                      : "⚖️ Same as previous"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GasFeeTracker;
