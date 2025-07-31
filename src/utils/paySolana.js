import { Transaction, SystemProgram, PublicKey, Connection, TransactionInstruction } from '@solana/web3.js';

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

    const connection = new Connection('https://api.devnet.solana.com');
    const sender = window.solana.publicKey;
    const lamports = amountSol * 1e9;

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
        data: Buffer.from(reference),
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
    throw new Error(`Payment failed: ${error.message}`);
  }
};