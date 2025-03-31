import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';
import WalletConnection from './components/WalletConnection';
import '@solana/wallet-adapter-react-ui/styles.css';

const App = () => {
  const network = clusterApiUrl('devnet');
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div
            style={{
              background: '#f8f9fa',
              minHeight: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: '40px 20px',
              fontFamily: "'Arial', sans-serif",
            }}
          >
            <div
              style={{
                maxWidth: '800px',
                width: '100%',
                padding: '30px',
                background: '#ffffff',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                marginBottom: '40px',
              }}
            >
              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  marginBottom: '20px',
                }}
              >
                Solana dApp with Phantom Wallet
              </h1>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#7f8c8d',
                  marginBottom: '30px',
                }}
              >
                Connect your Phantom wallet and send SOL to any Solana address.
              </p>
            </div>

            <div
              style={{
                width: '100%',
                maxWidth: '800px',
                background: '#ffffff',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <WalletConnection />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
