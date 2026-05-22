import { Link } from 'react-router-dom';
import { Shield, Clock, Mail, CheckCircle2, XCircle } from 'lucide-react';

const EFFECTIVE_DATE = 'January 1, 2025';
const SUPPORT_EMAIL = 'support@neuroforge.io';
const REFUND_WINDOW_DAYS = 7;

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

export function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-violet-400" />
          <span className="text-violet-400 text-sm font-medium">Legal</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Refund Policy</h1>
        <p className="text-gray-400">Effective date: {EFFECTIVE_DATE}</p>
        <p className="text-gray-400 mt-2 leading-relaxed">
          We want you to be completely satisfied with NeuroForge. This policy outlines when and how you can request a refund for paid subscriptions.
        </p>
      </div>

      {/* Summary Box */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-violet-400" />
          <h2 className="font-semibold text-white">Refund Summary</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white">Eligible</div>
              <div className="text-xs text-gray-400 mt-0.5">
                Initial purchase within {REFUND_WINDOW_DAYS} calendar days · First-time refund request · Account in good standing
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white">Not Eligible</div>
              <div className="text-xs text-gray-400 mt-0.5">
                Subscription renewals · After {REFUND_WINDOW_DAYS} days · Second refund request · Terms violations
              </div>
            </div>
          </div>
        </div>
      </div>

      <Section id="window" title="1. Refund Window">
        <p>
          NeuroForge offers a <strong className="text-white">{REFUND_WINDOW_DAYS}-calendar-day refund window</strong> on the first payment of any paid subscription (Pro or Elite).
        </p>
        <p>
          The {REFUND_WINDOW_DAYS}-day window begins at the time your initial payment is processed by Paddle. If you request a refund after this window has closed, we are unable to process the request except under extraordinary circumstances at our sole discretion.
        </p>
        <p>
          The refund window applies to the <strong className="text-white">initial subscription charge only</strong>. Subsequent automatic monthly renewals are not eligible for refund. If you do not wish to continue, cancel before your renewal date in Account Settings.
        </p>
      </Section>

      <Section id="how-to-request" title="2. How to Request a Refund">
        <p>To initiate a refund request, follow these steps:</p>
        <ol className="list-decimal list-inside space-y-3 pl-2">
          <li>
            <strong className="text-white">Email us</strong> at <a href={`mailto:${SUPPORT_EMAIL}`} className="text-violet-400 hover:underline">{SUPPORT_EMAIL}</a> within {REFUND_WINDOW_DAYS} days of your purchase
          </li>
          <li>
            Use the subject line: <span className="font-mono bg-gray-800 px-1.5 py-0.5 rounded text-gray-200 text-xs">Refund Request - [Your Registered Email]</span>
          </li>
          <li>
            Include in the body:
            <ul className="list-disc list-inside mt-1.5 space-y-1 pl-4 text-gray-500">
              <li>Your registered email address</li>
              <li>The date of purchase (approximate is fine)</li>
              <li>Your Paddle order ID (found in your receipt email)</li>
              <li>Brief reason for the refund request (optional but helpful)</li>
            </ul>
          </li>
          <li>
            <strong className="text-white">We will respond</strong> within 2 business days to confirm eligibility and initiate the refund through Paddle
          </li>
        </ol>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-white">Refund Contact</span>
          </div>
          <p className="text-sm">Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-violet-400 hover:underline">{SUPPORT_EMAIL}</a></p>
          <p className="text-xs text-gray-500 mt-1">Response time: within 2 business days</p>
        </div>
      </Section>

      <Section id="processing" title="3. Refund Processing">
        <p>
          Once we confirm your refund is eligible, we submit it through Paddle (our payment processor). Paddle processes the refund back to your original payment method.
        </p>
        <p>
          Typical timeline after approval:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Credit/debit cards: 5–10 business days depending on your card issuer</li>
          <li>PayPal: 3–5 business days</li>
        </ul>
        <p>
          You will receive a confirmation email from Paddle when the refund has been processed. The refund will appear on your statement as a credit from Paddle.
        </p>
        <p>
          Upon processing a refund, your subscription will be cancelled immediately and your account will revert to the Free tier. Your training data remains intact; you simply lose access to paid features.
        </p>
      </Section>

      <Section id="non-abuse" title="4. Fair Use & Anti-Abuse Clause">
        <p>
          Our refund policy exists to protect customers who genuinely try the service and find it does not meet their needs. We reserve the right to decline refund requests in the following circumstances:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>The account has previously received a refund from NeuroForge</li>
          <li>Evidence of account sharing, multiple accounts, or policy circumvention</li>
          <li>Violation of our Terms of Service</li>
          <li>Requests submitted solely to use the service for free (e.g., subscribing, using all premium features extensively, then immediately requesting a refund)</li>
          <li>Chargeback filed before contacting us — we consider chargebacks without prior communication to be a breach of good faith</li>
        </ul>
        <p>
          If you believe your refund request was incorrectly denied, contact us at {SUPPORT_EMAIL} with additional context. We review all appeals individually.
        </p>
      </Section>

      <Section id="exceptions" title="5. Exceptions & Extraordinary Circumstances">
        <p>
          In cases of verified billing errors, double-charges, or service outages of more than 72 consecutive hours during your billing period, we will evaluate refund or credit requests on a case-by-case basis outside of the standard window.
        </p>
        <p>
          To report a billing error, contact us at {SUPPORT_EMAIL} with your Paddle receipt and a description of the error.
        </p>
      </Section>

      <Section id="cancellation" title="6. Cancellation vs. Refund">
        <p>
          <strong className="text-white">Cancellation</strong> stops future billing but does not refund the current billing period. You retain access to your paid plan until the period ends, then revert to Free.
        </p>
        <p>
          <strong className="text-white">Refund</strong> reverses the charge for the current period and immediately cancels your subscription, reverting your account to Free.
        </p>
        <p>
          To cancel your subscription without a refund: go to Account Settings → Subscription → Manage Billing (via Paddle) → Cancel Subscription.
        </p>
      </Section>

      <div className="pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm">
        <Link to="/terms" className="text-violet-400 hover:underline">Terms of Service</Link>
        <Link to="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link>
        <Link to="/pricing" className="text-violet-400 hover:underline">Pricing</Link>
      </div>
    </div>
  );
}
