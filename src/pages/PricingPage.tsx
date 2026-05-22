import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Zap, Brain, Shield, Star, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

interface PricingTier {
  id: 'free' | 'pro' | 'elite';
  name: string;
  price: string;
  period: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  highlighted: boolean;
  badge?: string;
  paddleProductId?: string;
}

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Start training with core cognitive tests. No credit card required.',
    cta: 'Get Started Free',
    highlighted: false,
    features: [
      { text: 'Reaction Time training', included: true },
      { text: 'Aim Precision training', included: true },
      { text: 'Pattern Recognition training', included: true },
      { text: 'Basic XP & Rank system', included: true },
      { text: 'Session history (last 30 days)', included: true },
      { text: 'Working Memory training', included: false },
      { text: 'Cognitive Flexibility training', included: false },
      { text: 'Focus Endurance training', included: false },
      { text: 'AI Adaptive Training Plan', included: false },
      { text: 'Cognitive Profile radar chart', included: false },
      { text: 'Advanced analytics & trends', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'Unlock adaptive AI training and advanced analytics for serious performers.',
    cta: 'Upgrade to Pro',
    highlighted: true,
    badge: 'Most Popular',
    paddleProductId: process.env.VITE_PADDLE_PRO_PRODUCT_ID,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Working Memory training', included: true },
      { text: 'Cognitive Flexibility training', included: true },
      { text: 'AI Adaptive Training Plan', included: true },
      { text: 'Cognitive Profile radar chart', included: true },
      { text: 'Advanced analytics & trends', included: true },
      { text: 'Full session history', included: true },
      { text: 'Weakness detection & targeting', included: true },
      { text: 'Focus Endurance training', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$19.99',
    period: 'per month',
    description: 'The complete cognitive performance suite for competitive and professional use.',
    cta: 'Upgrade to Elite',
    highlighted: false,
    badge: 'Full Access',
    paddleProductId: process.env.VITE_PADDLE_ELITE_PRODUCT_ID,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Focus Endurance training', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Early access to new modules', included: true },
      { text: 'Export session data (CSV)', included: true },
      { text: 'All future training modules', included: true },
    ],
  },
];

function PaddleCheckoutButton({
  tier,
  currentTier,
}: {
  tier: PricingTier;
  currentTier: string;
}) {
  const isCurrentPlan = tier.id === currentTier;

  if (isCurrentPlan) {
    return (
      <button
        disabled
        className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-gray-800 text-gray-400 cursor-default border border-gray-700"
      >
        Current Plan
      </button>
    );
  }

  if (tier.id === 'free') {
    return (
      <Link to="/register" className="block">
        <Button variant="secondary" className="w-full" size="lg">
          {tier.cta}
        </Button>
      </Link>
    );
  }

  // Paddle integration: In production, this would open Paddle.js checkout
  // with the real paddleProductId and the authenticated user's email
  const handleCheckout = () => {
    alert(
      `Paddle Checkout Integration\n\n` +
      `In production, this button triggers:\n` +
      `Paddle.Checkout.open({\n` +
      `  product: "${tier.paddleProductId || 'PADDLE_PRODUCT_ID'}",\n` +
      `  email: "user@example.com",\n` +
      `  passthrough: JSON.stringify({ userId: "user_id" }),\n` +
      `  successCallback: () => updateSubscription("${tier.id}")\n` +
      `})\n\n` +
      `Webhook handler at /api/webhooks/paddle processes:\n` +
      `- subscription_created\n` +
      `- subscription_updated\n` +
      `- subscription_cancelled`
    );
  };

  return (
    <Button
      variant={tier.highlighted ? 'primary' : 'outline'}
      className="w-full"
      size="lg"
      onClick={handleCheckout}
    >
      {tier.cta} <ArrowRight className="w-4 h-4" />
    </Button>
  );
}

export function PricingPage() {
  const { user, isAuthenticated } = useAuthStore();
  const currentTier = user?.subscriptionTier ?? 'free';

  return (
    <div className="bg-gray-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl font-black text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Start free. Upgrade when you're ready for advanced training tools. All plans include real performance tracking — no fake metrics.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'relative flex flex-col rounded-2xl border p-8',
                tier.highlighted
                  ? 'border-violet-500 bg-violet-900/10 shadow-xl shadow-violet-900/20'
                  : 'border-gray-800 bg-gray-900'
              )}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant={tier.id === 'elite' ? 'gold' : 'violet'}>
                    {tier.id === 'elite' ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                    {tier.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-1">{tier.name}</h2>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-gray-500 text-sm">/{tier.period}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{tier.description}</p>
              </div>

              {isAuthenticated ? (
                <PaddleCheckoutButton tier={tier} currentTier={currentTier} />
              ) : (
                <Link to="/register">
                  <Button
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    className="w-full"
                    size="lg"
                  >
                    {tier.cta} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              <div className="mt-8 space-y-3">
                {tier.features.map(feature => (
                  <div key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={cn('text-sm', feature.included ? 'text-gray-200' : 'text-gray-600')}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Paddle & Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white">Secure Payments by Paddle</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              All billing is handled by Paddle, a PCI-DSS compliant payment processor. NeuroForge never stores your payment information. Paddle acts as Merchant of Record and handles all tax compliance.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-violet-400" />
              <h3 className="font-semibold text-white">7-Day Refund Policy</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Not satisfied? Request a full refund within 7 days of your initial purchase. Contact support with your order details. See our <Link to="/refunds" className="text-violet-400 hover:underline">Refund Policy</Link> for full terms.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. You can cancel your subscription at any time from your account settings. You\'ll retain access until the end of your billing period.',
              },
              {
                q: 'What happens to my data if I downgrade?',
                a: 'Your session history is preserved. You\'ll lose access to Pro/Elite features, but your data remains in your account.',
              },
              {
                q: 'Is there a free trial for Pro?',
                a: 'We offer a 7-day refund window instead of a free trial. Start a Pro subscription and request a refund within 7 days if you\'re not satisfied.',
              },
              {
                q: 'How does billing work?',
                a: 'Subscriptions are billed monthly. Paddle processes payments and sends receipts to your email. You can update payment methods via Paddle\'s secure portal.',
              },
              {
                q: 'Is my training data shared with others?',
                a: 'No. All your training data is strictly isolated to your account. We never share individual performance data or display it to other users.',
              },
            ].map(faq => (
              <details key={faq.q} className="bg-gray-900 border border-gray-800 rounded-xl">
                <summary className="px-6 py-4 text-sm font-medium text-white cursor-pointer select-none hover:text-violet-300 transition-colors">
                  {faq.q}
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
