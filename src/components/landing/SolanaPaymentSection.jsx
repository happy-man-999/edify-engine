import React from 'react';

const SolanaPaymentSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Shop with
            <span className="block bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
              Solana Cryptocurrency
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience lightning-fast, low-cost transactions when purchasing items in our marketplace. 
            Pay with SOL and enjoy instant confirmations with minimal fees.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Visual representation */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              {/* Solana Logo */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 9.75L12 4.5l7.5 5.25v4.5L12 19.5l-7.5-5.25v-4.5z"/>
                    <path d="M12 15.75l7.5-5.25"/>
                    <path d="M12 19.5l7.5-5.25"/>
                  </svg>
                </div>
              </div>
              
              {/* Payment Flow Visualization */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-shopping-cart text-green-600 text-sm"></i>
                  </div>
                  <span className="text-gray-700">Select Item</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-wallet text-blue-600 text-sm"></i>
                  </div>
                  <span className="text-gray-700">Connect Solana Wallet</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-bolt text-purple-600 text-sm"></i>
                  </div>
                  <span className="text-gray-700">Instant Payment</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-600 text-sm"></i>
                  </div>
                  <span className="text-gray-700">Item Delivered</span>
                </div>
              </div>
              
              {/* Solana Network Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-xl text-white text-center">
                <p className="text-sm font-medium">Solana Network</p>
                <p className="text-xs opacity-90">~400ms confirmation • ~$0.00025 fee</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
          
          {/* Right side - Benefits and features */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-rocket text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">Complete transactions in under 400 milliseconds with Solana's high-performance blockchain.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-coins text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ultra Low Fees</h3>
                  <p className="text-gray-600">Pay less than $0.001 per transaction, making micro-payments practical and affordable.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-shield-alt text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                  <p className="text-gray-600">Built on Solana's battle-tested infrastructure with enterprise-grade security and reliability.</p>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="pt-6">
              <button className="w-full lg:w-auto bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Start Shopping with SOL
              </button>
              <p className="text-sm text-gray-500 mt-3 text-center lg:text-left">
                No account required • Instant setup
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#9945FF] mb-2">400ms</div>
            <div className="text-gray-600">Average Transaction Time</div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#14F195] mb-2">$0.00025</div>
            <div className="text-gray-600">Average Transaction Fee</div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#9945FF] mb-2">65,000+</div>
            <div className="text-gray-600">TPS Capacity</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolanaPaymentSection; 