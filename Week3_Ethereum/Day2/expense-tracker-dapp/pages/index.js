"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const contractAddress = "0x748Ff23D0520A370d9E55D1CCed2CC9dE11c34c8";
const contractABI = [
  {
    inputs: [
      { internalType: "string", name: "_category", type: "string" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "uint256", name: "_date", type: "uint256" },
    ],
    name: "addExpense",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getExpenses",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint256", name: "date", type: "uint256" },
        ],
        internalType: "struct ExpenseTracker.Expense[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    setSigner(signer);
    setWalletAddress(await signer.getAddress());
  };

  const fetchExpenses = async () => {
    if (!signer) {
      alert("Connect Wallet First!");
      return;
    }
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const data = await contract.getExpenses();
    setExpenses(
      data.map((expense) => ({
        id: Number(expense.id),
        category: expense.category,
        amount: ethers.formatUnits(expense.amount, "wei"),
        description: expense.description,
        date: new Date(Number(expense.date) * 1000).toLocaleString(),
      }))
    );
  };

  const addExpense = async () => {
    if (!signer) {
      alert("Wallet not connected!");
      return;
    }
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.addExpense(
      newExpense.category,
      ethers.parseUnits(newExpense.amount, "wei"),
      newExpense.description,
      Math.floor(Date.now() / 1000)
    );
    await tx.wait();
    fetchExpenses();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <button
        onClick={connectWallet}
        className="p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
      >
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>

      {walletAddress && (
        <p className="mt-3 text-lg font-medium text-gray-700">
          Connected Wallet:{" "}
          <span className="font-semibold">{walletAddress}</span>
        </p>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add Expense
        </h2>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-black placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Category"
          onChange={(e) =>
            setNewExpense({ ...newExpense, category: e.target.value })
          }
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-black placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Amount (ETH)"
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-black placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Description"
          onChange={(e) =>
            setNewExpense({ ...newExpense, description: e.target.value })
          }
        />
        <button
          onClick={addExpense}
          className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
        >
          Add Expense
        </button>
      </div>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">Expense List</h2>
      <button
        onClick={fetchExpenses}
        className="p-3 bg-gray-600 text-white font-semibold rounded-lg mt-3 hover:bg-gray-700 transition duration-200"
      >
        Fetch Expenses
      </button>
      <div className="mt-5 w-full max-w-lg">
        {expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow-md rounded-lg mt-3 border-l-4 border-blue-600"
            >
              <p className="text-gray-800">
                <b>Category:</b> {expense.category}
              </p>
              <p className="text-gray-800">
                <b>Amount:</b> {expense.amount} ETH
              </p>
              <p className="text-gray-800">
                <b>Description:</b> {expense.description}
              </p>
              <p className="text-gray-600 text-sm">
                <b>Date:</b> {expense.date}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No expenses found.</p>
        )}
      </div>
    </div>
  );
}
