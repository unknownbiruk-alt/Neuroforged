import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Zap, GraduationCap, Gamepad2, Briefcase, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

type Goal = 'gaming' | 'studying' | 'professional';

const goals: { id: Goal; icon: React.ReactNode; label: string; desc: string }[] = [
  {
    id: 'gaming',
    icon: <Gamepad2 className="w-6 h-6" />,
    label: 'Competitive Gaming',
    desc: 'Reaction time, aim precision, and game awareness',
  },
  {
    id: 'studying',
    icon: <GraduationCap className="w-6 h-6" />,
    label: 'Academic Performance',
    desc: 'Memory, focus endurance, and cognitive flexibility',
  },
  {
    id: 'professional',
    icon: <Briefcase className="w-6 h-6" />,
    label: 'Professional Edge',
    desc: 'Decision speed, pattern recognition, and mental clarity',
  },
];

const steps = [
  { id: 'welcome', title: 'Welcome to NeuroForge' },
  { id: 'goal', title: 'What\'s your primary goal?' },
  { id: 'ready', title: 'You\'re all set' },
];

export function OnboardingPage() {
  const { user, completeOnboarding } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleComplete = () => {
    completeOnboarding();
    navigate('/dashboard', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === step ? 'w-6 bg-violet-500' : i < step ? 'bg-violet-700' : 'bg-gray-700'
              )} />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-900/40 mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white mb-3">
                Welcome, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-400 mb-8 leading-relaxed">
                NeuroForge tracks your actual cognitive performance. There's no pre-loaded data — every metric you see will be earned through your own sessions.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: <Zap className="w-4 h-4" />, label: '6 Training Modules' },
                  { icon: <Target className="w-4 h-4" />, label: 'Adaptive Difficulty' },
                  { icon: <Brain className="w-4 h-4" />, label: 'Real Analytics' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-2 text-violet-400">{item.icon}</div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>

              <Button size="lg" onClick={() => setStep(1)} className="w-full">
                Let's get started <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-2xl font-black text-white text-center mb-2">{steps[1].title}</h2>
              <p className="text-gray-400 text-center text-sm mb-8">This helps us highlight the most relevant training modules</p>

              <div className="space-y-3 mb-8">
                {goals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left',
                      selectedGoal === goal.id
                        ? 'border-violet-500 bg-violet-900/20'
                        : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                      selectedGoal === goal.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                    )}>
                      {goal.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{goal.label}</div>
                      <div className="text-sm text-gray-400">{goal.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => setStep(2)}
                disabled={!selectedGoal}
                className="w-full"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-900/40 border-2 border-emerald-500/50 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">You're ready to train</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your dashboard starts empty — that's correct. Complete your first training session to begin generating real performance data.
              </p>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8 text-left">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">What happens next</div>
                {[
                  'Your dashboard shows empty state until you train',
                  'Analytics unlock after 3 completed sessions',
                  'XP and rank earned only from completed sessions',
                  'Adaptive AI activates based on your real data',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm text-gray-300 mb-2 last:mb-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <Button size="lg" onClick={handleComplete} className="w-full">
                Go to My Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
