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
    <div className="min-h-screen py-12 pt-24" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'oklch(0.65 0.05 280)' }}>
            Ready to bring your virtual world vision to life? Schedule a consultation with our team to discuss your project and get started.
          </p>
        </div>

        <div className="rounded-lg shadow-lg p-8" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-6" style={{ color: 'oklch(0.98 0.01 280)' }}>Get in Touch</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Schedule a Meeting</h3>
                  <p className="mb-4" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Book a time that works for you to discuss your project requirements, pricing, and timeline.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>What to Expect</h3>
                  <ul className="space-y-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    <li>• 15 minute consultation</li>
                    <li>• Project requirements discussion</li>
                    <li>• Custom pricing and timeline</li>
                    <li>• Technical feasibility review</li>
                    <li>• Next steps planning</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.1)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'oklch(0.45 0.15 290)' }}>Need Immediate Help?</h4>
                  <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    For urgent inquiries or technical support, please email us at{' '}
                    <a 
                      href="mailto:info@edifyengine.com" 
                      className="underline transition-colors"
                      style={{ color: 'oklch(0.45 0.15 290)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290 / 0.8)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290)'}
                    >
                      info@edifyengine.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Calendly Widget */}
            <div>
              <h2 className="text-2xl font-semibold mb-6" style={{ color: 'oklch(0.98 0.01 280)' }}>Book Your Consultation</h2>
              <div 
                className="calendly-inline-widget" 
                data-url={import.meta.env.VITE_CALENDLY_URL}
                style={{ minWidth: '320px', height: '420px' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
