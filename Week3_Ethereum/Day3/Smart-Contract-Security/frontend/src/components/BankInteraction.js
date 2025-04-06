import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import ReentrancyAttacker from "../abis/ReentrancyAttacker.json";
import SafeBank from "../abis/SafeBank.json";
import VulnerableBank from "../abis/VulnerableBank.json";

// Replace with your deployed contract addresses
const SAFE_BANK_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const VULNERABLE_BANK_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const ATTACKER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const BankInteraction = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [safeBank, setSafeBank] = useState(null);
  const [vulnerableBank, setVulnerableBank] = useState(null);
  const [attackerContract, setAttackerContract] = useState(null);

  const [depositAmount, setDepositAmount] = useState("0.01");
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      await newProvider.send("eth_requestAccounts", []);
      const newSigner = await newProvider.getSigner();
      const userAddr = await newSigner.getAddress();

      setProvider(newProvider);
      setSigner(newSigner);
      setUserAddress(userAddr);

      setSafeBank(
        new ethers.Contract(SAFE_BANK_ADDRESS, SafeBank.abi, newSigner)
      );
      setVulnerableBank(
        new ethers.Contract(
          VULNERABLE_BANK_ADDRESS,
          VulnerableBank.abi,
          newSigner
        )
      );
      setAttackerContract(
        new ethers.Contract(ATTACKER_ADDRESS, ReentrancyAttacker.abi, newSigner)
      );
    };

    init();
  }, []);

  const depositTo = async (contract, label) => {
    try {
      const tx = await contract.deposit({
        value: ethers.parseEther(depositAmount),
      });
      await tx.wait();
      alert(`${label} deposit successful`);
    } catch (err) {
      console.error(err);
      alert(`${label} deposit failed`);
    }
  };

  const withdrawFrom = async (contract, label) => {
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      alert(`${label} withdraw successful`);
    } catch (err) {
      console.error(err);
      alert(`${label} withdraw failed`);
    }
  };

  const runAttack = async () => {
    try {
      const tx = await attackerContract.attack({
        value: ethers.parseEther(depositAmount),
      });
      await tx.wait();
      alert("🚨 Reentrancy attack attempted!");
    } catch (err) {
      console.error(err);
      alert("Attack failed or was prevented.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🔐 Smart Contract Security Playground</h1>
      <p style={styles.subheading}>
        <strong>Connected Wallet:</strong> {userAddress || "Not connected"}
      </p>

      <div style={styles.inputSection}>
        <label style={styles.label}>Deposit Amount (ETH):</label>
        <input
          type="text"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>✅ SafeBank</h2>
          <button
            style={styles.button}
            onClick={() => depositTo(safeBank, "SafeBank")}
          >
            Deposit
          </button>
          <button
            style={styles.button}
            onClick={() => withdrawFrom(safeBank, "SafeBank")}
          >
            Withdraw
          </button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>⚠️ VulnerableBank</h2>
          <button
            style={styles.button}
            onClick={() => depositTo(vulnerableBank, "VulnerableBank")}
          >
            Deposit
          </button>
          <button
            style={styles.button}
            onClick={() => withdrawFrom(vulnerableBank, "VulnerableBank")}
          >
            Withdraw
          </button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>💣 Reentrancy Attacker</h2>
          <button
            style={{ ...styles.button, backgroundColor: "#e74c3c" }}
            onClick={runAttack}
          >
            🚨 Launch Attack
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
    padding: "2rem",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  subheading: {
    marginBottom: "2rem",
    color: "#333",
  },
  inputSection: {
    marginBottom: "2rem",
  },
  label: {
    marginRight: "10px",
    fontWeight: "bold",
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "150px",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: "1.5rem",
    textAlign: "center",
  },
  cardTitle: {
    marginBottom: "1rem",
  },
  button: {
    padding: "10px 20px",
    margin: "0.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
};

export default BankInteraction;
