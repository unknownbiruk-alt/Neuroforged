import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 8) return { level: 'weak', label: 'Too short', color: 'bg-red-500' };
    if (password.length < 12 && !/[A-Z]/.test(password)) return { level: 'fair', label: 'Fair', color: 'bg-amber-500' };
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return { level: 'strong', label: 'Strong', color: 'bg-emerald-500' };
    return { level: 'good', label: 'Good', color: 'bg-cyan-500' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim()) { setError('Please enter a valid email address.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    const result = await register(name.trim(), email.trim(), password);
    if (result.success) {
      navigate('/onboarding', { replace: true });
    } else {
      setError(result.error ?? 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-900/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Neuro<span className="text-violet-400">Forge</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Start your cognitive training journey</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl shadow-black/30">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-6"
            >
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              autoComplete="name"
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
                required
              />
              {passwordStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} rounded-full transition-all`}
                      style={{
                        width: passwordStrength.level === 'weak' ? '25%' :
                          passwordStrength.level === 'fair' ? '50%' :
                          passwordStrength.level === 'good' ? '75%' : '100%'
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{passwordStrength.label}</span>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm password"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                icon={
                  confirmPassword && confirmPassword === password
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <Lock className="w-4 h-4" />
                }
                autoComplete="new-password"
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          By creating an account you agree to our{' '}
          <Link to="/terms" className="underline hover:text-gray-400">Terms of Service</Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-gray-400">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}
