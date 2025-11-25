import React from 'react';
import { motion } from 'framer-motion';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <LandingNavbar />
      <div className="relative pt-24 pb-16">
        <section className="px-4 py-24 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text" style={{ lineHeight: '1.1', paddingBottom: '0.1em' }}>
                Cookie Policy
              </h1>
              <p className="text-lg text-gray-300 mb-2">
                <strong style={{ color: 'oklch(0.98 0.01 280)' }}>EDIFY ENGINE – COOKIE POLICY</strong>
              </p>
              <p className="text-sm text-gray-400">
                Last Updated: November 25, 2025
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-invert max-w-none"
            >
              <div 
                className="rounded-xl backdrop-blur border p-8 md:p-12"
                style={{
                  backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                  borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                }}
              >
                <p className="text-gray-300 mb-8 leading-relaxed">
                  This Cookie Policy explains how Edify Engine LLC ("Edify," "we," "our," "us") uses cookies and similar tracking technologies when you visit or use our website, dashboard, store, and platform (the "Services").
                </p>
                <p className="text-gray-300 mb-12 leading-relaxed">
                  By continuing to use the Services, you agree to the use of cookies as described in this Policy.
                </p>

                <div className="space-y-8">
                  {/* Section 1 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>1. What Are Cookies?</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Cookies are small text files stored on your browser or device. They help websites operate, remember preferences, maintain sessions, analyze usage, and improve functionality.
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>2. Types of Cookies We Use</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>2.1 Essential / Strictly Necessary Cookies</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          Required for the platform to function—such as login sessions, user authentication, world management, checkout flow, and security.
                        </p>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          Examples include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li>Session identification</li>
                          <li>Account authentication</li>
                          <li>Security & bot protection (Cloudflare)</li>
                        </ul>
                        <p className="text-gray-300 mt-4 leading-relaxed">
                          You cannot disable these without breaking the platform.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>2.2 Performance & Analytics Cookies</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          Help us understand how users navigate and use Edify.
                        </p>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          Examples:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li>Google Analytics</li>
                          <li>Cloudflare Insights</li>
                          <li>Internal performance logs</li>
                        </ul>
                        <p className="text-gray-300 mt-4 leading-relaxed">
                          We use this data to improve performance, stability, and features.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>2.3 Functional Cookies</h3>
                        <p className="text-gray-300 leading-relaxed">
                          Used to remember preferences—such as UI settings, editor preferences, and dashboard filters.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>2.4 Marketing & Tracking Cookies (Only if enabled)</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          We may use cookies for retargeting or conversion tracking when running marketing campaigns.
                        </p>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          Examples:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li>Stripe checkout telemetry</li>
                          <li>Social media ad tracking pixels (if installed)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>3. Third-Party Cookies</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      The following services may set cookies through the platform:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Stripe (payment processing)</li>
                      <li>Cloudflare (security, DNS, analytics)</li>
                      <li>Google Analytics</li>
                      <li>AI vendors (temporary session data)</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      We do not control third-party cookie policies. Please review their individual policies for details.
                    </p>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>4. How You Can Control Cookies</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You may:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Adjust browser settings to block or delete cookies</li>
                      <li>Use browser-level privacy features</li>
                      <li>Opt-out of non-essential analytics (if applicable)</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      Blocking essential cookies will prevent the platform from functioning.
                    </p>
                  </div>

                  {/* Section 5 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>5. Changes to This Policy</h2>
                    <p className="text-gray-300 leading-relaxed">
                      We may update this Cookie Policy from time to time. We will update the "Last Updated" date whenever changes occur.
                    </p>
                  </div>

                  {/* Section 6 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>6. Contact Us</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      For any questions:
                    </p>
                    <div className="text-gray-300 leading-relaxed space-y-2">
                      <p><strong style={{ color: 'oklch(0.98 0.01 280)' }}>Edify Engine LLC</strong></p>
                      <p>Email: <a href="mailto:privacy@edifyengine.com" className="underline" style={{ color: 'oklch(0.50 0.18 260)' }}>privacy@edifyengine.com</a></p>
                      <p>Website: <a href="https://edifyengine.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'oklch(0.50 0.18 260)' }}>https://edifyengine.com</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
};

export default CookiePolicy;

