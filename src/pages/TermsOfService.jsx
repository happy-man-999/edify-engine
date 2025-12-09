import React from 'react';
import { motion } from 'framer-motion';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const TermsOfService = () => {
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
                Terms of Service
              </h1>
              <p className="text-lg text-gray-300 mb-2">
                <strong style={{ color: 'oklch(0.98 0.01 280)' }}>EDIFY ENGINE – TERMS OF SERVICE</strong>
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
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you") and Edify Engine LLC ("Edify Engine," "Edify," "we," "our"), governing your access to and use of the Edify Engine platform, websites, dashboards, provisioning systems, 3D builder tools, AI features, APIs, and associated services (collectively, the "Services").
                </p>
                <p className="text-gray-300 mb-12 leading-relaxed">
                  By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, you must discontinue use immediately.
                </p>

                <div className="space-y-8">
                  {/* Section 1 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>1. Eligibility</h2>
                    <p className="text-gray-300 leading-relaxed">
                      You must be at least 18 years old and legally capable of entering into a binding agreement. If you are using the Services on behalf of an entity, you represent that you are authorized to bind that entity to these Terms.
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>2. The Services</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify Engine provides tools that allow Users to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Create, manage, and publish immersive 3D worlds</li>
                      <li>Provision hosting environments, including DigitalOcean droplets</li>
                      <li>Use AI features for world generation, asset generation, and automation</li>
                      <li>Upload 3D models, textures, audio, scripts, and other digital materials</li>
                      <li>Integrate custom domains and DNS settings</li>
                      <li>Manage multiple client accounts (Agency & Studio tier)</li>
                      <li>Process payments using Stripe or Solana-compatible wallets</li>
                      <li>Access templates, pre-built scenes, and marketplace content</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      Edify may update, modify, or remove features at any time at its sole discretion.
                    </p>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>3. Account Registration</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You must create an account to access most Services. You agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Provide accurate and complete information</li>
                      <li>Maintain the confidentiality of your login credentials</li>
                      <li>Accept full responsibility for all activity under your account</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      Edify is not liable for loss or damage caused by unauthorized access resulting from your failure to safeguard your credentials.
                    </p>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>4. Subscriptions, Fees & Billing</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>4.1 Subscription Tiers</h3>
                        <p className="text-gray-300 leading-relaxed">
                          Edify offers multiple plans (Starter, Growth, Agency & Studio, Enterprise). Features and limits vary by tier. Details are available on our Pricing page.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>4.2 Recurring Billing</h3>
                        <p className="text-gray-300 leading-relaxed">
                          Paid plans automatically renew unless canceled before the renewal date. You authorize Edify Engine or its payment processors (Stripe, Solana Pay, or others) to automatically bill you for recurring fees.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>4.3 Taxes</h3>
                        <p className="text-gray-300 leading-relaxed">
                          You are responsible for all applicable taxes, fees, duties, or government charges.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>4.4 Price Changes</h3>
                        <p className="text-gray-300 leading-relaxed">
                          Edify may change prices with prior notice. Continued use after a price change constitutes acceptance.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>5. Refunds & Cancellations</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Except where prohibited by law:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>All payments are non-refundable.</li>
                      <li>AI credits, world-hours, and provisioning fees are non-refundable.</li>
                      <li>Canceling a subscription prevents future charges but does not refund past payments.</li>
                      <li>Deleting a world or droplet does not entitle you to a refund.</li>
                      <li>Enterprise agreements may contain separate terms.</li>
                    </ul>
                  </div>

                  {/* Section 6 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>6. Hosting, Provisioning & Infrastructure</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify Engine automates provisioning of hosting environments using third-party providers, including but not limited to DigitalOcean, Cloudflare, Entri, and others.
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You acknowledge and agree:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Infrastructure is hosted on third-party systems outside Edify's direct control.</li>
                      <li>Edify is not responsible for outages, downtime, rate limits, data loss, or failures caused by third-party providers.</li>
                      <li>World performance, uptime, and stability may vary by provider and configuration.</li>
                      <li>You are responsible for any usage-based costs resulting from provisioning (when applicable).</li>
                    </ul>
                  </div>

                  {/* Section 7 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>7. User Content & Ownership</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>7.1 Ownership</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          You retain ownership of all 3D models, textures, audio, scripts, builds, and other content you upload or create within your worlds ("User Content"), excluding:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li>Edify templates</li>
                          <li>Edify AI-generated assets</li>
                          <li>Marketplace-provided assets</li>
                          <li>System-level components</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>7.2 License to Edify</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          By using the Services, you grant Edify a non-exclusive, worldwide, royalty-free license to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                          <li>Host, store, reproduce, modify (as needed for technical purposes)</li>
                          <li>Transmit, distribute, and display your worlds and content</li>
                          <li>Use your content to operate, maintain, and improve the Services</li>
                        </ul>
                        <p className="text-gray-300 mt-4 leading-relaxed">
                          This license ends when you delete your content or your account, except where retention is required for legal or operational purposes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 8 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>8. AI-Generated Content</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify's AI features generate 3D objects, environments, text, textures, and other outputs.
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You acknowledge that:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>AI outputs may not be unique, and similar results may be generated for other users.</li>
                      <li>You receive a license, not exclusive ownership, to use AI outputs.</li>
                      <li>AI systems may produce inaccurate, incomplete, or unintended results.</li>
                      <li>You are solely responsible for reviewing AI outputs before publishing or distributing them.</li>
                      <li>Edify disclaims all liability for AI-generated content.</li>
                    </ul>
                  </div>

                  {/* Section 9 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>9. Marketplace Content</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      If you upload assets to the Edify Marketplace:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>You certify that you own all necessary rights</li>
                      <li>You grant Edify the right to distribute your assets to other users</li>
                      <li>You agree to comply with all intellectual property laws</li>
                      <li>Edify may remove marketplace items at any time</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      If you download marketplace content, you agree to abide by the license terms set by the contributor.
                    </p>
                  </div>

                  {/* Section 10 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>10. Prohibited Conduct</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You agree not to use the Services to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Create worlds involving illegal activity</li>
                      <li>Upload or distribute infringing, harmful, or malicious content</li>
                      <li>Upload malware, exploits, or unauthorized scripts</li>
                      <li>Attempt to hack, bypass, or disrupt Edify infrastructure</li>
                      <li>Create fraudulent, deceptive, or phishing worlds</li>
                      <li>Engage in harassment, hate speech, or discrimination</li>
                      <li>Create explicit adult content unless expressly authorized</li>
                      <li>Abuse free trials, discounts, or provisioning systems</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      Edify may suspend or terminate accounts violating these rules.
                    </p>
                  </div>

                  {/* Section 11 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>11. Domain Integration & DNS</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify allows Users to connect custom domains purchased through third-party services (Squarespace, Entri, Cloudflare, etc.).
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You acknowledge:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>DNS propagation delays or errors are not Edify's responsibility</li>
                      <li>You must configure records exactly as instructed</li>
                      <li>Edify may disable domain connections that violate policies or cause security issues</li>
                    </ul>
                  </div>

                  {/* Section 12 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>12. Intellectual Property</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      All Edify trademarks, branding, templates, software, 3D systems, interface elements, dashboards, and proprietary technology are owned by Edify Engine LLC.
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You receive a limited, non-exclusive, revocable license to use the Services solely for their intended purpose.
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You may not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Copy or clone the platform</li>
                      <li>Reverse engineer the code</li>
                      <li>Frame, scrape, or reproduce Edify content</li>
                      <li>Remove copyright or ownership notices</li>
                    </ul>
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>12.1 Open Source Components (Hyperfy / AGPL-3.0)</h3>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        The Services incorporate certain open-source software components, including portions of the Hyperfy V2 project, which are licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
                      </p>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        Edify Engine acknowledges and complies with the terms of the AGPL-3.0, including but not limited to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mb-4">
                        <li>retaining all copyright and license notices associated with Hyperfy,</li>
                        <li>making available the source code for any modifications to AGPL-licensed components that are accessed over a network, as required by the license, and</li>
                        <li>providing Users with access to the relevant source code upon request.</li>
                      </ul>
                      <p className="text-gray-300 mb-2 leading-relaxed">
                        A copy of the AGPL-3.0 license is available at:
                      </p>
                      <p className="text-gray-300 mb-2 leading-relaxed">
                        <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'oklch(0.50 0.18 260)' }}>https://www.gnu.org/licenses/agpl-3.0.en.html</a>
                      </p>
                      <p className="text-gray-300 mb-2 leading-relaxed">
                        The original Hyperfy source code is available at:
                      </p>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        <a href="https://github.com/hyperfy-xyz/hyperfy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'oklch(0.50 0.18 260)' }}>https://github.com/hyperfy-xyz/hyperfy</a>
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        Nothing in these Terms restricts or modifies your rights under the AGPL-3.0 license for those specific components. All other proprietary code, systems, and assets within Edify Engine remain exclusively owned by Edify Engine LLC and are not subject to open-source licensing obligations.
                      </p>
                    </div>
                  </div>

                  {/* Section 13 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>13. Third-Party Services</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify integrates with external services including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>DigitalOcean</li>
                      <li>Cloudflare</li>
                      <li>Stripe</li>
                      <li>Solana/Web3 wallets</li>
                      <li>Entri Connect</li>
                      <li>Squarespace</li>
                      <li>HeyGen</li>
                      <li>AI model providers (various)</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      Edify is not responsible for the availability, security, or operation of third-party services.
                    </p>
                  </div>

                  {/* Section 14 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>14. Data Privacy</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify collects and processes data as described in our Privacy Policy.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      You agree to comply with all applicable privacy laws when using Edify to store or process data from your customers or visitors.
                    </p>
                  </div>

                  {/* Section 15 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>15. DMCA & Copyright Infringement</h2>
                    <p className="text-gray-300 leading-relaxed">
                      If you believe content on Edify infringes your copyright, you may submit a DMCA takedown notice. Edify may remove content or suspend accounts without prior notice in response to valid claims.
                    </p>
                  </div>

                  {/* Section 16 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>16. Availability & Uptime</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify does not guarantee uninterrupted uptime. Scheduled maintenance, updates, or outages may occur.
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify is not liable for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Downtime</li>
                      <li>Data loss</li>
                      <li>Deployment failures</li>
                      <li>Third-party outages (DigitalOcean, Cloudflare, Solana RPC, etc.)</li>
                    </ul>
                  </div>

                  {/* Section 17 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>17. Termination</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edify may suspend or terminate accounts at any time, including for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Violations of these Terms</li>
                      <li>Non-payment</li>
                      <li>Suspected fraud or abuse</li>
                      <li>Security concerns</li>
                    </ul>
                    <p className="text-gray-300 mt-4 mb-4 leading-relaxed">
                      Upon termination:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Access to worlds, assets, and dashboards may be revoked</li>
                      <li>Provisioned infrastructure may be deleted</li>
                      <li>Data may not be recoverable</li>
                    </ul>
                  </div>

                  {/* Section 18 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>18. Disclaimers</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed" style={{ fontWeight: 'bold' }}>
                      YOU USE THE SERVICES AT YOUR OWN RISK.
                    </p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, INCLUDING:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Fitness for a particular purpose</li>
                      <li>Non-infringement</li>
                      <li>Accuracy or reliability</li>
                      <li>Uninterrupted operation</li>
                    </ul>
                    <p className="text-gray-300 mt-4 leading-relaxed" style={{ fontWeight: 'bold' }}>
                      AI-GENERATED CONTENT IS PROVIDED WITHOUT WARRANTY OF ANY KIND.
                    </p>
                  </div>

                  {/* Section 19 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>19. Limitation of Liability</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Edify is not liable for indirect, incidental, special, punitive, or consequential damages.</li>
                      <li>Edify's total liability shall not exceed the amount paid by you in the past 12 months.</li>
                      <li>Edify is not responsible for losses related to downtime, world corruption, provisioning errors, or AI output.</li>
                      <li>Some jurisdictions do not allow certain exclusions, so these limits may not apply to you.</li>
                    </ul>
                  </div>

                  {/* Section 20 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>20. Indemnification</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      You agree to indemnify and hold harmless Edify Engine and its owners, officers, employees, partners, and contractors from any claims resulting from:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Your use of the Services</li>
                      <li>Your content</li>
                      <li>Your worlds</li>
                      <li>Violations of these Terms</li>
                      <li>Infringement claims</li>
                      <li>Misuse of integrations or third-party systems</li>
                    </ul>
                  </div>

                  {/* Section 21 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>21. Governing Law & Dispute Resolution</h2>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      These Terms are governed by the laws of the State of Delaware, without regard to conflict of law rules.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      ANY DISPUTE SHALL BE RESOLVED THROUGH BINDING ARBITRATION IN DELAWARE, except claims that may be brought in small-claims court.
                    </p>
                  </div>

                  {/* Section 22 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>22. Changes to Terms</h2>
                    <p className="text-gray-300 leading-relaxed">
                      We may modify these Terms at any time. Continued use after changes constitutes acceptance. If you do not agree to updated Terms, you must stop using the Services.
                    </p>
                  </div>

                  {/* Section 23 */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>23. Contact Information</h2>
                    <div className="text-gray-300 leading-relaxed space-y-2">
                      <p><strong style={{ color: 'oklch(0.98 0.01 280)' }}>Edify Engine LLC</strong></p>
                      <p>8 The Green Ste B</p>
                      <p>Dover, DE 19901</p>
                      <p>Email: <a href="mailto:support@edifyengine.com" className="underline" style={{ color: 'oklch(0.50 0.18 260)' }}>support@edifyengine.com</a></p>
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

export default TermsOfService;

