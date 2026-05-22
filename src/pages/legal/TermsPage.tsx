import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const EFFECTIVE_DATE = 'January 1, 2025';
const COMPANY = 'NeuroForge';
const EMAIL = 'legal@neuroforge.io';

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

export function TermsPage() {
  const sections = [
    { id: 'accounts', title: '1. Accounts' },
    { id: 'subscriptions', title: '2. Subscriptions' },
    { id: 'billing', title: '3. Billing & Payments' },
    { id: 'refunds', title: '4. Refund Policy' },
    { id: 'acceptable-use', title: '5. Acceptable Use' },
    { id: 'intellectual-property', title: '6. Intellectual Property' },
    { id: 'data', title: '7. User Data' },
    { id: 'disclaimers', title: '8. Disclaimers' },
    { id: 'liability', title: '9. Limitation of Liability' },
    { id: 'termination', title: '10. Termination' },
    { id: 'governing-law', title: '11. Governing Law' },
    { id: 'changes', title: '12. Changes to These Terms' },
    { id: 'contact', title: '13. Contact' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-violet-400" />
          <span className="text-violet-400 text-sm font-medium">Legal</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Terms of Service</h1>
        <p className="text-gray-400">Effective date: {EFFECTIVE_DATE}</p>
        <p className="text-gray-400 mt-2 leading-relaxed">
          These Terms of Service ("Terms") govern your use of the {COMPANY} platform ("Service") operated by {COMPANY} ("we", "us", or "our"). By creating an account or using the Service, you agree to be bound by these Terms.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10">
        <h2 className="text-sm font-semibold text-white mb-3">Contents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>
      </div>

      <Section id="accounts" title="1. Accounts">
        <p>
          To access the full functionality of {COMPANY}, you must create an account using a valid email address. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.
        </p>
        <p>
          You must be at least 13 years of age to use the Service. If you are under 18, you represent that you have your parent's or guardian's permission to use the Service.
        </p>
        <p>
          You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. We reserve the right to suspend or terminate accounts that use false or misleading information.
        </p>
        <p>
          You are responsible for safeguarding your password. You agree to notify us immediately at {EMAIL} if you suspect any unauthorized access to your account. We cannot and will not be liable for any loss or damage arising from unauthorized use of your credentials.
        </p>
        <p>
          One account per person. Creating multiple accounts to circumvent subscription limits or abuse the refund policy is prohibited and may result in permanent account termination.
        </p>
      </Section>

      <Section id="subscriptions" title="2. Subscriptions">
        <p>
          {COMPANY} offers three subscription tiers: Free, Pro ($9.99/month), and Elite ($19.99/month). The features available at each tier are described on our <Link to="/pricing" className="text-violet-400 hover:underline">Pricing page</Link>, which forms part of these Terms.
        </p>
        <p>
          <strong className="text-white">Free Tier:</strong> Available to all registered users at no cost. Access is limited to core training modules as described on the pricing page. Free tier access may change at our discretion with 30 days' notice.
        </p>
        <p>
          <strong className="text-white">Paid Tiers:</strong> Subscriptions are billed on a monthly recurring basis. Your subscription automatically renews at the end of each billing period unless you cancel before the renewal date.
        </p>
        <p>
          <strong className="text-white">Cancellation:</strong> You may cancel your subscription at any time through your account settings or by contacting Paddle (our payment processor). Cancellation takes effect at the end of the current billing period. You will retain access to paid features until then.
        </p>
        <p>
          <strong className="text-white">Downgrades:</strong> If your subscription expires or is cancelled, your account reverts to the Free tier. Your data is preserved; access to paid features is suspended.
        </p>
      </Section>

      <Section id="billing" title="3. Billing & Payments">
        <p>
          All payments are processed by Paddle.com Market Limited ("Paddle"), who acts as the Merchant of Record. By purchasing a subscription, you agree to Paddle's terms of service and privacy policy. {COMPANY} does not directly store or process payment card information.
        </p>
        <p>
          Subscription fees are charged at the beginning of each billing period. All prices are in US Dollars (USD) unless otherwise stated. Paddle automatically handles applicable tax calculations and compliance.
        </p>
        <p>
          If a payment fails, Paddle will make multiple retry attempts. We reserve the right to suspend access to paid features if payment remains outstanding after these attempts. You will receive email notifications of failed payments.
        </p>
        <p>
          Prices may change at our discretion. We will provide at least 30 days' advance notice via email before any price increases affect your existing subscription.
        </p>
      </Section>

      <Section id="refunds" title="4. Refund Policy">
        <p>
          We offer a <strong className="text-white">7-day refund window</strong> on initial subscription purchases. If you are not satisfied with your paid subscription, you may request a full refund within 7 calendar days of the initial charge by contacting us at {EMAIL} with your order details and registered email address.
        </p>
        <p>
          Refunds are not available for: (a) subscription renewals after the 7-day initial window; (b) accounts where the refund policy has been previously exercised; (c) accounts found to have violated these Terms. See our <Link to="/refunds" className="text-violet-400 hover:underline">full Refund Policy</Link> for details.
        </p>
        <p>
          Approved refunds are processed through Paddle and typically appear on your statement within 5–10 business days depending on your bank.
        </p>
      </Section>

      <Section id="acceptable-use" title="5. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
          <li>Attempt to gain unauthorized access to the Service, other accounts, or systems</li>
          <li>Use automated tools (bots, scripts, crawlers) to interact with the Service without permission</li>
          <li>Reverse-engineer, decompile, or disassemble any portion of the Service</li>
          <li>Upload, transmit, or distribute any malware, viruses, or malicious code</li>
          <li>Interfere with or disrupt the integrity or performance of the Service</li>
          <li>Impersonate any person or entity or misrepresent your affiliation</li>
          <li>Sell, trade, or transfer your account to another person</li>
          <li>Use multiple accounts to abuse the free tier or refund policy</li>
        </ul>
        <p>
          Violation of these restrictions may result in immediate account termination without refund.
        </p>
      </Section>

      <Section id="intellectual-property" title="6. Intellectual Property">
        <p>
          The Service, including all software, algorithms, training methodologies, user interface designs, graphics, and content, is owned by {COMPANY} and is protected by copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          Your subscription grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal, non-commercial use. No rights are granted beyond this limited license.
        </p>
        <p>
          You retain ownership of any data you generate through your use of the Service (your session results, performance metrics). You grant us a limited license to store and process this data solely to provide the Service to you.
        </p>
      </Section>

      <Section id="data" title="7. User Data">
        <p>
          Your training session data is strictly associated with your authenticated account. We do not share individual performance data with other users or third parties, except as described in our <Link to="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link>.
        </p>
        <p>
          You may request deletion of your account and all associated data at any time in accordance with our Privacy Policy and applicable data protection law (including GDPR Article 17).
        </p>
      </Section>

      <Section id="disclaimers" title="8. Disclaimers">
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. {COMPANY.toUpperCase()} DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          {COMPANY} does not warrant that the Service will be uninterrupted, error-free, or free from harmful components. Cognitive training results vary by individual. We make no guarantees regarding specific cognitive performance improvements.
        </p>
        <p>
          {COMPANY} is not a medical service. Our training tools are not intended to diagnose, treat, cure, or prevent any medical condition. Consult a healthcare professional for any medical concerns.
        </p>
      </Section>

      <Section id="liability" title="9. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {COMPANY.toUpperCase()} AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Your use of or inability to use the Service</li>
          <li>Any unauthorized access to or use of our servers and/or personal information stored therein</li>
          <li>Any interruption or cessation of transmission to or from the Service</li>
          <li>Any bugs, viruses, or the like transmitted through the Service</li>
        </ul>
        <p>
          In no event shall our total liability to you for all claims exceed the greater of: (a) the amount you paid to us in the 12 months preceding the claim; or (b) USD $100.
        </p>
      </Section>

      <Section id="termination" title="10. Termination">
        <p>
          You may terminate your account at any time by contacting us at {EMAIL} or using the account deletion feature in Settings. Upon termination, your right to use the Service ceases immediately.
        </p>
        <p>
          We may suspend or terminate your account immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, you will lose access to all data associated with your account unless you have requested a data export prior to termination.
        </p>
      </Section>

      <Section id="governing-law" title="11. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration or in the courts of the governing jurisdiction.
        </p>
      </Section>

      <Section id="changes" title="12. Changes to These Terms">
        <p>
          We reserve the right to modify these Terms at any time. Material changes will be communicated via email to your registered address and/or a prominent notice in the Service at least 14 days before taking effect.
        </p>
        <p>
          Continued use of the Service after the effective date of revised Terms constitutes acceptance of those Terms. If you do not agree to the revised Terms, you must stop using the Service and may request account deletion.
        </p>
      </Section>

      <Section id="contact" title="13. Contact">
        <p>
          For questions, concerns, or notices regarding these Terms, contact us at:
        </p>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mt-2">
          <p className="text-white font-medium">{COMPANY}</p>
          <p>Legal Inquiries: <a href={`mailto:${EMAIL}`} className="text-violet-400 hover:underline">{EMAIL}</a></p>
          <p>Privacy: <a href="mailto:privacy@neuroforge.io" className="text-violet-400 hover:underline">privacy@neuroforge.io</a></p>
          <p>Support: <a href="mailto:support@neuroforge.io" className="text-violet-400 hover:underline">support@neuroforge.io</a></p>
        </div>
      </Section>

      <div className="pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm">
        <Link to="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link>
        <Link to="/refunds" className="text-violet-400 hover:underline">Refund Policy</Link>
        <Link to="/pricing" className="text-violet-400 hover:underline">Pricing</Link>
      </div>
    </div>
  );
}
