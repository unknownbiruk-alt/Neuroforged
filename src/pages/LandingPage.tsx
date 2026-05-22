import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Zap, Target, BarChart3, Shield, ChevronRight,
  Eye, Layers, Activity, ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Reaction Time Training',
    description: 'Sub-millisecond precision tracking. Train your neural response speed with scientifically validated protocols.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Aim Precision',
    description: 'Dynamic target tracking with adaptive difficulty. Build muscle memory through progressive overload.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'Working Memory',
    description: 'N-back tasks and sequence training to expand cognitive bandwidth and information retention.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: 'Pattern Recognition',
    description: 'Rapid visual processing and pattern matching to sharpen situational awareness.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: 'Cognitive Flexibility',
    description: 'Task-switching and dual-task paradigms to build mental agility under pressure.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Focus Endurance',
    description: 'Sustained attention training to maintain peak performance throughout long sessions.',
    color: 'from-indigo-500 to-violet-500',
  },
];

const stats = [
  { label: 'Training Tests Available', value: '6' },
  { label: 'Metrics Tracked Per Session', value: '12+' },
  { label: 'Adaptive Difficulty Levels', value: '10' },
  { label: 'XP Rank Tiers', value: '8' },
];

export function LandingPage() {
  return (
    <div className="bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-900/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-900/40 border border-violet-700/50 rounded-full text-violet-300 text-sm font-medium mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Cognitive Performance Platform
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-none">
              Train Your Brain{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Like a Pro Athlete
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              NeuroForge delivers science-backed cognitive training for competitive gamers, students,
              and high-performance individuals. Every session tracked, every gain measured.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="xl">
                  Start Training Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" size="xl">
                  View Pricing <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-gray-600">
              No credit card required · Free tier available · Cancel anytime
            </p>
          </motion.div>
        </div>

        {/* Floating stat pills */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl w-52">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-500">Your performance data</span>
            </div>
            <div className="text-lg font-bold text-white">Reaction Time</div>
            <div className="text-sm text-gray-400 mt-1">Tracked after each session</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl w-52">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs text-gray-500">Adaptive AI</span>
            </div>
            <div className="text-lg font-bold text-white">Dynamic Difficulty</div>
            <div className="text-sm text-gray-400 mt-1">Adjusts to your real results</div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-4">
              Six Training Disciplines
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Every module is built around validated cognitive science. Your results are your data — no fabricated benchmarks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gray-900/30 border-y border-gray-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-4">How NeuroForge Works</h2>
            <p className="text-gray-400">Real performance tracking. Real adaptive training. Real results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your account',
                desc: 'Sign up and complete a brief onboarding to set your training goals. No demo data pre-loaded.',
                icon: <Shield className="w-5 h-5" />,
              },
              {
                step: '02',
                title: 'Complete training sessions',
                desc: 'Run cognitive tests. Your actual performance metrics are recorded to your profile only.',
                icon: <Brain className="w-5 h-5" />,
              },
              {
                step: '03',
                title: 'Track real progress',
                desc: 'After 3 sessions, analytics unlock. The AI adapts difficulty based on your real data.',
                icon: <BarChart3 className="w-5 h-5" />,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative inline-flex w-14 h-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white mb-4 shadow-lg shadow-violet-900/40">
                  {item.icon}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 border border-gray-700 rounded-full text-xs text-gray-400 flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security commitment */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Your Data is Yours — Always</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Every metric you see in NeuroForge comes exclusively from your own training sessions.
                  We never display fabricated benchmarks, seeded demo data, or other users' results on your dashboard.
                  Your analytics are isolated to your account. Request deletion at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to train your mind?
            </h2>
            <p className="text-gray-400 mb-8">
              Join NeuroForge and start building real cognitive performance. Free to start.
            </p>
            <Link to="/register">
              <Button size="xl">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
              <Link to="/terms" className="hover:text-gray-400">Terms</Link>
              <span>·</span>
              <Link to="/privacy" className="hover:text-gray-400">Privacy</Link>
              <span>·</span>
              <Link to="/pricing" className="hover:text-gray-400">Pricing</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
