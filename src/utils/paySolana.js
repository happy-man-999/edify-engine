import { Transaction, SystemProgram, PublicKey, Connection, TransactionInstruction } from '@solana/web3.js';
import { createMemoInstruction } from '@solana/spl-memo';

export const sendSOLWithReference = async (recipient, amountSol, reference) => {
  const connection = new Connection('https://api.devnet.solana.com');
  const sender = window.solana.publicKey;
  const lamports = amountSol * 1e9;

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: new PublicKey(recipient),
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

  const signed = await window.solana.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(signature, 'confirmed');

  return signature;
};