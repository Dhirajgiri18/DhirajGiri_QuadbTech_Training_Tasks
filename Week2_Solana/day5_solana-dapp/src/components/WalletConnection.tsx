import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletConnection = () => {
  const { publicKey, connected, wallet, signTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<string>('0.001');
  const [isSending, setIsSending] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if address is valid
  const isValidAddress = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  // Fetch balance when wallet connects/changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          const connection = new Connection(clusterApiUrl('devnet'));
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
          setError(null);
        } catch (err) {
          console.error("Error fetching balance:", err);
          setError("Failed to fetch balance");
        }
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
  }, [connected, publicKey]);

  const sendTransaction = async () => {
    if (!publicKey || !connected || !wallet || !signTransaction) return;
    if (!recipient || !amount) return;

    setIsSending(true);
    setError(null);
    setTxSignature(null);

    try {
      // Validate inputs
      if (!isValidAddress(recipient)) {
        throw new Error("Invalid recipient address");
      }

      const amountInLamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      if (isNaN(amountInLamports)) {
        throw new Error("Invalid amount");
      }

      const connection = new Connection(clusterApiUrl('devnet'));
      
      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amountInLamports,
        })
      );

      // Set recent blockhash and fee payer
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      setTxSignature(signature);

      // Confirm transaction
      await connection.confirmTransaction(signature);
      alert(`Transaction successful!\nSignature: ${signature}`);

      // Refresh balance after sending
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Transaction failed:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8f9fa' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '600' }}>Solana Wallet</h1>
        <WalletMultiButton style={{ backgroundColor: '#9945FF', color: 'white', padding: '10px 20px', borderRadius: '8px' }} />
      </div>

      {connected && publicKey && (
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Wallet Info</h2>
          <p><strong>Address:</strong> {publicKey.toBase58()}</p>
          {balance !== null && <p><strong>Balance:</strong> {balance.toFixed(4)} SOL</p>}
        </div>
      )}

      {connected && (
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Send SOL</h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Recipient Address:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana address"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
            {recipient && !isValidAddress(recipient) && (
              <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>Invalid Solana address</p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Amount (SOL):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.000001"
              step="0.001"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>

          <button
            onClick={sendTransaction}
            disabled={isSending || !isValidAddress(recipient) || !amount}
            style={{
              backgroundColor: '#9945FF',
              color: 'white',
              padding: '12px 18px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              opacity: isSending || !isValidAddress(recipient) || !amount ? 0.7 : 1
            }}
          >
            {isSending ? 'Sending...' : 'Send Transaction'}
          </button>

          {error && (
            <div style={{ color: 'red', marginTop: '15px' }}>
              Error: {error}
            </div>
          )}

          {txSignature && (
            <div style={{ marginTop: '15px', wordBreak: 'break-all' }}>
              <p>Transaction successful!</p>
              <p><strong>Signature:</strong> {txSignature}</p>
              <a
                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#9945FF' }}
              >
                View on Solana Explorer
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
