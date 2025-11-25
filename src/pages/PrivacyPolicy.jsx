import React from 'react';
import { motion } from 'framer-motion';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const PrivacyPolicy = () => {
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
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-300 mb-2">
                <strong style={{ color: 'oklch(0.98 0.01 280)' }}>EDIFY ENGINE – PRIVACY POLICY</strong>
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
                  This Privacy Policy explains how Edify Engine LLC ("Edify Engine," "Edify," "we," "us," "our") collects, uses, stores, processes, and shares information when you ("User," "you") access or use our website, platform, AI tools, provisioning systems, domains, dashboards, marketplace, support systems, and any other associated services (the "Services").
                </p>
                <p className="text-gray-300 mb-12 leading-relaxed">
                  By using the Services, you consent to the practices described in this Privacy Policy. If you do not agree, discontinue use immediately.
                </p>

                <div className="space-y-8">
                  {/* Section 1 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>1. Information We Collect</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      We collect the following categories of information:
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>1.1 Information You Provide</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li><strong>Account Information:</strong> name, email address, username, password.</li>
                          <li><strong>Billing Information:</strong> payment details processed through Stripe, Solana Pay, or other third-party processors (we do not store full credit card numbers or private keys).</li>
                          <li><strong>World & Project Data:</strong> 3D worlds, objects, textures, scripts, environments, media files, and other assets you upload or create.</li>
                          <li><strong>AI Inputs:</strong> prompts, text, and data provided for AI processing.</li>
                          <li><strong>Support Data:</strong> messages, emails, tickets, screenshots, error reports.</li>
                          <li><strong>Agency/Studio Client Data:</strong> if you manage clients under your account, you may upload or enter client information.</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>1.2 Information Collected Automatically</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          When you use Edify, we may automatically collect:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li><strong>Usage Data:</strong> interactions, features accessed, session duration, creation logs, AI usage.</li>
                          <li><strong>Device & Browser Information:</strong> IP address, operating system, browser type, device identifiers.</li>
                          <li><strong>Cookies & Tracking Technologies:</strong> analytics, authentication, session cookies.</li>
                          <li><strong>Provisioning Logs:</strong> DigitalOcean droplet deployment logs, custom domain connection logs, DNS change attempts.</li>
                          <li><strong>Performance Data:</strong> crash logs, load errors, latency, deployment failures.</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>1.3 Information from Third Parties</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          We may receive information from:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li>Payment processors (Stripe, Solana Pay, etc.)</li>
                          <li>Domain providers (Cloudflare, Entri, Squarespace)</li>
                          <li>Analytics platforms (Google Analytics, Cloudflare Insights, Plausible, etc.)</li>
                          <li>AI service providers</li>
                          <li>Social login providers (if enabled)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>2. How We Use Your Information</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      We use collected information to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Provide, maintain, and improve the Services</li>
                      <li>Authenticate users and manage accounts</li>
                      <li>Process payments and subscriptions</li>
                      <li>Operate and provision worlds and hosting environments</li>
                      <li>Enable AI generation features</li>
                      <li>Provide customer support</li>
                      <li>Detect fraud, abuse, and security threats</li>
                      <li>Analyze platform performance</li>
                      <li>Enforce Terms of Service</li>
                      <li>Communicate updates, service changes, or marketing (as permitted)</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      AI prompts may be used to improve model performance but are not used to personally identify individuals.
                    </p>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>3. How We Share Information</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      We may share information with:
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>3.1 Service Providers</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          Including but not limited to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li>DigitalOcean (world hosting)</li>
                          <li>Cloudflare (security, DNS, CDN)</li>
                          <li>Stripe (billing)</li>
                          <li>Solana ecosystem providers (wallet-based payments)</li>
                          <li>Entri & Squarespace (domain integration)</li>
                          <li>Email & support platforms (e.g., Zendesk, Gmail, Intercom)</li>
                          <li>AI model providers</li>
                        </ul>
                        <p className="text-gray-300 mt-4 leading-relaxed">
                          These partners only receive information necessary to perform their functions.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>3.2 Legal, Security, and Compliance</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          We may disclose information:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li>To comply with law, regulation, or legal process</li>
                          <li>To protect the rights, property, or safety of Edify, users, or the public</li>
                          <li>To detect, prevent, or address fraud or security issues</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>3.3 Business Transfers</h3>
                        <p className="text-gray-300 leading-relaxed">
                          If Edify is involved in a merger, acquisition, asset sale, or investment transaction, user information may be transferred as part of the corporate assets.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>4. Cookies & Tracking Technologies</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      We use cookies and similar technologies for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Authentication</li>
                      <li>Session management</li>
                      <li>Analytics</li>
                      <li>Load balancing</li>
                      <li>Fraud prevention</li>
                      <li>Personalization</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      You can modify cookie settings in your browser, but the Services may not function properly if essential cookies are disabled.
                    </p>
                  </div>

                  {/* Section 5 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>5. AI Data Practices</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify provides AI generative features for world building, object creation, textures, chat, and automation.
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You acknowledge and agree:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>AI inputs may be stored temporarily for processing.</li>
                      <li>AI outputs are not guaranteed to be unique.</li>
                      <li>We do not sell or share AI prompt data for profiling.</li>
                      <li>Prompts may be used internally to improve model performance and safety.</li>
                      <li>You are responsible for reviewing AI outputs before using or publishing them.</li>
                    </ul>
                  </div>

                  {/* Section 6 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>6. Data Storage & Security</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      We implement reasonable technical and administrative security measures, including encryption, access controls, audit logs, and infrastructure segmentation.
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      However:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>No system is fully secure</li>
                      <li>We cannot guarantee absolute protection against unauthorized access</li>
                      <li>Third-party infrastructure (e.g., DigitalOcean) may be subject to outages or failures outside our control</li>
                      <li>Users are responsible for safeguarding login credentials and any connected wallets or API keys.</li>
                    </ul>
                  </div>

                  {/* Section 7 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>7. Data Retention</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      We retain information for as long as necessary to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Provide the Services</li>
                      <li>Comply with legal obligations</li>
                      <li>Resolve disputes</li>
                      <li>Enforce agreements</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      You may delete worlds, assets, or your account at any time, though backup copies may persist temporarily.
                    </p>
                  </div>

                  {/* Section 8 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>8. User Rights</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Depending on your location, you may have rights including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Access to your personal data</li>
                      <li>Correction of inaccurate data</li>
                      <li>Deletion of data ("right to be forgotten")</li>
                      <li>Restriction or objection to processing</li>
                      <li>Portability of data</li>
                      <li>Withdrawal of consent (when applicable)</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      To exercise rights, contact: <a href="mailto:privacy@edifyengine.com" className="underline" style={{ color: 'oklch(0.50 0.18 260)' }}>privacy@edifyengine.com</a>
                    </p>
                  </div>

                  {/* Section 9 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>9. Children's Privacy</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      The Services are not intended for individuals under 18.
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      We do not knowingly collect information from minors.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      If you believe a minor has used Edify, contact us immediately.
                    </p>
                  </div>

                  {/* Section 10 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>10. Custom Domains, Public Worlds & User-Generated Content</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      When you publish a world or connect a custom domain:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>The world becomes publicly accessible</li>
                      <li>Metadata such as world name, template, creator, and assets may be visible</li>
                      <li>You control what information is displayed in your world</li>
                      <li>You are responsible for ensuring your world does not contain sensitive or personal information unless you have obtained appropriate consent.</li>
                    </ul>
                  </div>

                  {/* Section 11 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>11. International Transfers</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      We may transfer and store data in:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>The United States</li>
                      <li>Countries where we or our providers operate</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      By using the Services, you consent to international data transfers.
                    </p>
                  </div>

                  {/* Section 12 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>12. Third-Party Links & Integrations</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      The Services may include links or integrations with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Solana wallets</li>
                      <li>External 3D assets</li>
                      <li>Payment gateways</li>
                      <li>Domain registrars</li>
                      <li>AI services</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      Edify is not responsible for the privacy practices of third parties. Review their policies before using integrated services.
                    </p>
                  </div>

                  {/* Section 13 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>13. Marketing Communications</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      We may send you:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Service announcements</li>
                      <li>Subscription updates</li>
                      <li>Product updates</li>
                      <li>Marketing or promotional content</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      You may opt out at any time by using the unsubscribe link or emailing: <a href="mailto:support@edifyengine.com" className="underline" style={{ color: 'oklch(0.50 0.18 260)' }}>support@edifyengine.com</a>
                    </p>
                    <p className="text-gray-300 mt-2 leading-relaxed">
                      Transactional emails cannot be opted out of.
                    </p>
                  </div>

                  {/* Section 14 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>14. Data Breach Notification</h2>
                    <p className="text-gray-300 leading-relaxed">
                      If a data breach occurs that exposes personal information, we will notify affected users as required by applicable law.
                    </p>
                  </div>

                  {/* Section 15 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>15. Your Responsibilities</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Only upload content you have rights to</li>
                      <li>Not collect personal information from world visitors without complying with privacy laws</li>
                      <li>Not misuse Edify to process sensitive personal data (e.g., medical, financial, or biometric data) unless permitted by law and properly disclosed</li>
                    </ul>
                  </div>

                  {/* Section 16 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>16. Changes to This Policy</h2>
                    <p className="text-gray-300 leading-relaxed">
                      We may update this Privacy Policy from time to time. Continued use after changes constitutes acceptance of the revised policy.
                    </p>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      We will update the "Last Updated" date when changes are made.
                    </p>
                  </div>

                  {/* Section 17 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>17. Contact Information</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      For questions or requests related to privacy:
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

export default PrivacyPolicy;

