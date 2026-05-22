import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const EFFECTIVE_DATE = 'January 1, 2025';
const EMAIL = 'privacy@neuroforge.io';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-800">{title}</h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-violet-400" />
          <span className="text-violet-400 text-sm font-medium">Legal</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Privacy Policy</h1>
        <p className="text-gray-400">Effective date: {EFFECTIVE_DATE}</p>
        <p className="text-gray-400 mt-2 leading-relaxed">
          This Privacy Policy describes how NeuroForge ("we", "us", "our") collects, uses, and protects your personal information when you use our platform. We are committed to handling your data transparently and in compliance with applicable privacy laws including the General Data Protection Regulation (GDPR).
        </p>
      </div>

      <Section id="data-collected" title="1. Data We Collect">
        <p><strong className="text-white">Account Data:</strong> When you register, we collect your name, email address, and a hashed password. We do not store plaintext passwords.</p>

        <p><strong className="text-white">Training Session Data:</strong> Every completed cognitive training session is stored and associated with your user account. This includes: test type, score, accuracy, reaction time, difficulty level, session duration, XP earned, and timestamp. This data is strictly isolated to your account and never shared with other users.</p>

        <p><strong className="text-white">Subscription Data:</strong> Subscription status (Free, Pro, Elite) and billing period are stored. We do not store payment card details — these are handled exclusively by Paddle.</p>

        <p><strong className="text-white">Technical Data:</strong> Standard web server logs including IP addresses, browser type, device type, and pages visited may be collected for security monitoring and service improvement. These logs are retained for up to 90 days.</p>

        <p><strong className="text-white">Cookies:</strong> We use strictly necessary cookies for session authentication. We do not use advertising or tracking cookies. See Section 6 (Cookies) for details.</p>
      </Section>

      <Section id="data-use" title="2. How We Use Your Data">
        <p>We use your data solely to provide and improve the Service:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>To authenticate your identity and maintain your session</li>
          <li>To store your training results and compute your analytics</li>
          <li>To calculate your XP, rank, and adaptive training recommendations</li>
          <li>To manage your subscription status and communicate billing events</li>
          <li>To enforce our Terms of Service and prevent abuse</li>
          <li>To send transactional emails (receipts, security alerts, product updates you have opted into)</li>
          <li>To monitor service health and debug technical issues</li>
        </ul>
        <p>
          We do not sell your personal data to third parties. We do not use your training performance data for advertising purposes.
        </p>
      </Section>

      <Section id="data-sharing" title="3. Data Sharing">
        <p>We share your data only in limited circumstances:</p>
        <p><strong className="text-white">Paddle:</strong> Your email address and subscription status are shared with Paddle (our payment processor) to manage billing. Paddle is GDPR-compliant and acts as a data processor under our direction.</p>
        <p><strong className="text-white">Infrastructure Providers:</strong> We use cloud infrastructure providers (e.g., database hosting, CDN) who process data on our behalf under data processing agreements.</p>
        <p><strong className="text-white">Legal Requirements:</strong> We may disclose your data if required by law, legal process, or governmental authority, or if we believe in good faith that disclosure is necessary to protect rights, property, or safety.</p>
        <p>We never sell your data. We never display your individual performance data to other users.</p>
      </Section>

      <Section id="data-retention" title="4. Data Retention">
        <p>We retain your personal data for as long as your account is active. If you delete your account:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Account data is deleted within 30 days of the deletion request</li>
          <li>Training session data is deleted within 30 days</li>
          <li>Billing records may be retained for up to 7 years for legal and tax compliance</li>
          <li>Server logs are retained for up to 90 days</li>
        </ul>
        <p>
          Anonymized, aggregated statistical data (with no personally identifiable information) may be retained indefinitely for product improvement purposes.
        </p>
      </Section>

      <Section id="your-rights" title="5. Your Rights (GDPR & Privacy Laws)">
        <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li><strong className="text-white">Right of Access (Art. 15 GDPR):</strong> Request a copy of all personal data we hold about you</li>
          <li><strong className="text-white">Right to Rectification (Art. 16):</strong> Request correction of inaccurate data</li>
          <li><strong className="text-white">Right to Erasure (Art. 17):</strong> Request deletion of your personal data ("right to be forgotten")</li>
          <li><strong className="text-white">Right to Restriction (Art. 18):</strong> Request that we limit processing of your data</li>
          <li><strong className="text-white">Right to Data Portability (Art. 20):</strong> Receive your data in a machine-readable format</li>
          <li><strong className="text-white">Right to Object (Art. 21):</strong> Object to processing based on legitimate interests</li>
          <li><strong className="text-white">Right to Withdraw Consent:</strong> Where processing is based on consent, withdraw it at any time</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at <a href={`mailto:${EMAIL}`} className="text-violet-400 hover:underline">{EMAIL}</a>. We will respond within 30 days (or 72 hours for security incidents).
        </p>
        <p>
          You also have the right to lodge a complaint with your local data protection authority (e.g., ICO in the UK, or your EU member state's DPA).
        </p>
      </Section>

      <Section id="cookies" title="6. Cookies">
        <p>We use the following cookies:</p>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-300">Cookie</th>
                <th className="text-left py-2 text-gray-300">Purpose</th>
                <th className="text-left py-2 text-gray-300">Duration</th>
                <th className="text-left py-2 text-gray-300">Type</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono">neuroforge_auth</td>
                <td className="py-2">Authentication session (localStorage)</td>
                <td className="py-2">Session</td>
                <td className="py-2">Strictly necessary</td>
              </tr>
              <tr>
                <td className="py-2 font-mono">neuroforge_sessions</td>
                <td className="py-2">Local session data cache</td>
                <td className="py-2">Persistent</td>
                <td className="py-2">Strictly necessary</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          We do not use advertising cookies, social media tracking pixels, or third-party analytics cookies (e.g., Google Analytics). All data is processed on our own infrastructure.
        </p>
      </Section>

      <Section id="analytics" title="7. Analytics">
        <p>
          NeuroForge does not use third-party web analytics services (e.g., Google Analytics, Mixpanel). We use server-side logs and internal dashboards based solely on data from our own infrastructure.
        </p>
        <p>
          All performance analytics shown on your dashboard are derived exclusively from your own training sessions. We never display fabricated data, benchmarks from other users, or seeded demonstration metrics.
        </p>
      </Section>

      <Section id="security" title="8. Data Security">
        <p>
          We implement appropriate technical and organizational security measures to protect your personal data, including:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Passwords are hashed using a cryptographic algorithm before storage</li>
          <li>Data transmission is encrypted in transit (HTTPS/TLS)</li>
          <li>Database access is restricted to authorized personnel only</li>
          <li>Training session data is stored with strict user-level access controls</li>
          <li>Payment information is handled exclusively by PCI-DSS compliant Paddle</li>
        </ul>
        <p>
          No method of transmission or storage is 100% secure. If you believe your account has been compromised, contact us immediately at {EMAIL}.
        </p>
      </Section>

      <Section id="children" title="9. Children's Privacy">
        <p>
          The Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information without parental consent, contact us at {EMAIL} and we will take steps to delete that information.
        </p>
      </Section>

      <Section id="international" title="10. International Transfers">
        <p>
          Your data may be transferred to and processed in countries outside your jurisdiction. Where we transfer data outside the EEA, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.
        </p>
      </Section>

      <Section id="deletion-request" title="11. Data Deletion Request Process">
        <p>To request deletion of your account and all associated personal data:</p>
        <ol className="list-decimal list-inside space-y-2 pl-2">
          <li>Email <a href={`mailto:${EMAIL}`} className="text-violet-400 hover:underline">{EMAIL}</a> with the subject line: "Data Deletion Request"</li>
          <li>Include your registered email address and account ID (available in Settings)</li>
          <li>We will verify your identity and confirm receipt within 72 hours</li>
          <li>All personal data will be deleted within 30 days of verification</li>
          <li>You will receive a confirmation email once deletion is complete</li>
        </ol>
        <p>
          Note: Billing records required by law may be retained for up to 7 years. You will be informed of any data retained after your deletion request.
        </p>
      </Section>

      <Section id="changes" title="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be communicated via email to your registered address at least 14 days before taking effect. The effective date at the top of this page will always reflect the most recent version.
        </p>
        <p>
          Continued use of the Service after the effective date of a revised policy constitutes acceptance of those changes.
        </p>
      </Section>

      <Section id="contact" title="13. Contact & Data Controller">
        <p>
          NeuroForge is the data controller for personal data processed through this Service. For privacy inquiries, data access requests, or to exercise your rights:
        </p>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-white font-medium">NeuroForge — Data Protection</p>
          <p>Email: <a href={`mailto:${EMAIL}`} className="text-violet-400 hover:underline">{EMAIL}</a></p>
          <p className="text-xs text-gray-500 mt-2">We aim to respond to all privacy inquiries within 30 calendar days.</p>
        </div>
      </Section>

      <div className="pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm">
        <Link to="/terms" className="text-violet-400 hover:underline">Terms of Service</Link>
        <Link to="/refunds" className="text-violet-400 hover:underline">Refund Policy</Link>
        <Link to="/pricing" className="text-violet-400 hover:underline">Pricing</Link>
      </div>
    </div>
  );
}
