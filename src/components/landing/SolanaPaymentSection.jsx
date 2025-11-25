import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Wallet, Shield, Workflow, ArrowRight } from 'lucide-react';
import Badge from './Badge';

const SolanaPaymentSection = () => {
  return (
    <section className="py-24 px-4 relative" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge 
            className="mb-4 px-4 py-2 border"
            style={{
              backgroundColor: 'oklch(0.85 0.18 130 / 0.2)',
              color: 'oklch(0.85 0.18 130)',
              borderColor: 'oklch(0.85 0.18 130 / 0.5)'
            }}
          >
            <Coins className="w-4 h-4 mr-2" />
            Monetization & Commerce
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ lineHeight: '1.1', paddingBottom: '0.1em' }}>
            Creator Commerce Powered by Solana
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Accept Solana payments for all store purchases, giving your users fast, secure, low-fee on-chain checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex gap-4">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                }}
              >
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Sell Your Creations</h3>
                <p className="text-gray-300">
                  List your apps, scripts, templates, worlds, and 3D objects in the Edify Store and earn directly in SOL on Solana.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Digital Asset Sales</h3>
                <p className="text-gray-300">
                  Sell in-world items, access passes, and digital collectibles. Built-in commerce tools for creators.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                }}
              >
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Instant Payouts</h3>
                <p className="text-gray-300">
                  Fast payment processing with automated payouts. Focus on creating while we handle transactions.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div 
              className="backdrop-blur border rounded-xl p-8"
              style={{
                backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                borderColor: 'oklch(0.25 0.05 285 / 0.5)'
              }}
            >
              <div className="space-y-6">
                <div 
                  className="aspect-video rounded-xl flex items-center justify-center border"
                  style={{
                    background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290 / 0.2), oklch(0.50 0.18 260 / 0.2))',
                    borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                  }}
                >
                  <Coins className="w-24 h-24" style={{ color: 'oklch(0.45 0.15 290 / 0.5)' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 gradient-text">Monetization Made Easy</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.85 0.18 130)' }} />
                      <span><strong className="text-white">One-Time Purchases:</strong> Offer premium downloads, tools, templates, or assets with simple one-time Solana payments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.85 0.18 130)' }} />
                      <span><strong className="text-white">Crypto Support:</strong> Store transactions run entirely on Solana — ultra-low fees, instant settlement, and secure on-chain processing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolanaPaymentSection;
