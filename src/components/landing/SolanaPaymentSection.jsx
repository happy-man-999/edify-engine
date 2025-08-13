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
                  <svg className="w-12 h-12" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                    <path fill="white" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                    <path fill="white" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                    <path fill="white" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4 c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
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
            
            {/* Floating animated elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-30" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', animation: 'slideUp 15s ease-in-out infinite'}}></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 opacity-30" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', animation: 'slideDown 18s ease-in-out infinite'}}></div>
            <div className="absolute top-1/2 -right-8 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 opacity-40" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', animation: 'rotate3D 25s linear infinite'}}></div>
            <div className="absolute top-1/4 -left-6 w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 opacity-25" style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', animation: 'wave 20s ease-in-out infinite'}}></div>
            <div className="absolute bottom-1/4 -right-12 w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-400 opacity-35" style={{clipPath: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)', animation: 'zigzag 16s ease-in-out infinite'}}></div>
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
          <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
            <div className="text-3xl font-bold text-[#9945FF] mb-2 animate-pulse">400ms</div>
            <div className="text-gray-600">Average Transaction Time</div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
            <div className="text-3xl font-bold text-[#14F195] mb-2 animate-bounce delay-500">$0.00025</div>
            <div className="text-gray-600">Average Transaction Fee</div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
            <div className="text-3xl font-bold text-[#9945FF] mb-2 animate-pulse delay-1000">65,000+</div>
            <div className="text-gray-600">TPS Capacity</div>
          </div>
        </div>
        
        {/* Additional floating animated elements */}
        <div className="absolute top-1/4 right-10 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-40" style={{clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', animation: 'scaleIn 18s ease-in-out infinite'}}></div>
        <div className="absolute bottom-1/4 left-10 w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 opacity-30" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', animation: 'slideLeft 22s ease-in-out infinite'}}></div>
        <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 opacity-50" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', animation: 'bounceRotate 24s ease-in-out infinite'}}></div>
      </div>
    </section>
  );
};

export default SolanaPaymentSection; 