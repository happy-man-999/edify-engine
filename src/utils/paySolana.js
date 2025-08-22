import { Transaction, SystemProgram, PublicKey, Connection, TransactionInstruction } from '@solana/web3.js';

// Get Solana network configuration from settings
const getSolanaNetwork = async () => {
  try {
    const response = await fetch('/api/admin/payment-settings');
    if (response.ok) {
      const settings = await response.json();
      const solanaMode = settings.solanaMode || 'devnet';
      const isTestMode = settings.isTestMode || false;
      
      // If test mode is enabled, force devnet
      if (isTestMode) {
        console.log('Test mode enabled, using Solana devnet');
        return 'devnet';
      }
      
      console.log(`Using Solana network: ${solanaMode.toUpperCase()}`);
      return solanaMode;
    }
  } catch (error) {
    console.warn('Failed to fetch Solana network settings, using devnet as fallback:', error);
  }
  return 'devnet'; // Default fallback
};

// Get Solana RPC endpoint based on network
const getSolanaEndpoint = (network) => {
  if (network === 'mainnet') {
    // Use Helius RPC for mainnet - API key should be in .env file
    const heliusApiKey = import.meta.env.VITE_HELIUS_API_KEY;
    if (!heliusApiKey) {
      console.warn('Helius API key not found in environment variables');
      // Fallback to a free endpoint if no API key
      return 'https://ssc-dao.genesysgo.net/';
    }
    return `https://rpc.helius.xyz/?api-key=${heliusApiKey}`;
  }
  return 'https://api.devnet.solana.com';
};

export const sendSOLWithReference = async (recipient, amountSol, reference) => {
  try {
    // Validate inputs
    if (!recipient || !amountSol || !reference) {
      throw new Error('Missing required parameters');
    }

    if (amountSol <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Check if wallet is available
    if (!window.solana || !window.solana.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Get network configuration
    const network = await getSolanaNetwork();
    const endpoint = getSolanaEndpoint(network);
    
    const connection = new Connection(endpoint);
    const sender = window.solana.publicKey;
    const lamports = Math.round(amountSol * 1e9);

    // Validate recipient address
    let recipientPubkey;
    try {
      recipientPubkey = new PublicKey(recipient);
    } catch (error) {
      throw new Error('Invalid recipient address');
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipientPubkey,
        lamports,
      }),
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: new TextEncoder().encode(reference),
      })
    );

    transaction.feePayer = sender;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    // Sign the transaction
    const signed = await window.solana.signTransaction(transaction);
    
    // Send the transaction
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error('Transaction failed to confirm');
    }

    return signature;
  } catch (error) {
    console.error('SOL payment error:', error);
    throw new Error(`Payment failed.`);
  }
};