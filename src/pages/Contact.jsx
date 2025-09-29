import React, { useEffect } from 'react';

const Contact = () => {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to bring your virtual world vision to life? Schedule a consultation with our team to discuss your project and get started.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule a Meeting</h3>
                  <p className="text-gray-600 mb-4">
                    Book a time that works for you to discuss your project requirements, pricing, and timeline.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">What to Expect</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• 15-30 minute consultation</li>
                    <li>• Project requirements discussion</li>
                    <li>• Custom pricing and timeline</li>
                    <li>• Technical feasibility review</li>
                    <li>• Next steps planning</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Need Immediate Help?</h4>
                  <p className="text-blue-700 text-sm">
                    For urgent inquiries or technical support, please email us at{' '}
                    <a href="mailto:support@edifyengine.com" className="underline hover:text-blue-800">
                      support@edifyengine.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Calendly Widget */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Book Your Consultation</h2>
              <div 
                className="calendly-inline-widget" 
                data-url={import.meta.env.VITE_CALENDLY_URL}
                style={{ minWidth: '320px', height: '630px' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fab fa-instagram text-pink-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Follow on Instagram</h3>
            <p className="text-gray-600 text-sm mb-3">See our latest updates</p>
            <a 
              href="https://instagram.com/edifyengine" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 font-medium"
            >
              @edifyengine
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fab fa-tiktok text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Follow on TikTok</h3>
            <p className="text-gray-600 text-sm mb-3">Watch our content</p>
            <a 
              href="https://tiktok.com/@edifyengine" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-gray-900 font-medium"
            >
              @edifyengine
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fab fa-x-twitter text-gray-800 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Follow on X</h3>
            <p className="text-gray-600 text-sm mb-3">Stay updated on news</p>
            <a 
              href="https://x.com/edifyengine" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-gray-900 font-medium"
            >
              @edifyengine
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
