import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Trash2, Shield, Bell, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSessionStore } from '../store/sessionStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

export function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const { deleteUserSessions } = useSessionStore();

  const [name, setName] = useState(user?.name ?? '');
  const [nameSaved, setNameSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  if (!user) return null;

  const handleSaveName = () => {
    if (!name.trim() || name.trim() === user.name) return;
    updateUser({ name: name.trim() });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2500);
  };

  const handleDeleteData = () => {
    if (deleteConfirm !== 'DELETE') return;
    deleteUserSessions(user.id);
    updateUser({ xp: 0, rank: 'Unranked' });
    setDeleteConfirm('');
    setShowDeleteSection(false);
    alert('All your training data has been deleted.');
  };

  const tierBadgeVariant = user.subscriptionTier === 'elite' ? 'gold' : user.subscriptionTier === 'pro' ? 'violet' : 'default';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Account Settings</h1>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            Profile Information
          </h3>
          <div className="space-y-4">
            <Input
              label="Display name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
              <input
                value={user.email}
                disabled
                className="w-full bg-gray-800 border border-gray-700 text-gray-400 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-gray-600 mt-1">Email cannot be changed after registration</p>
            </div>
            <Button
              onClick={handleSaveName}
              disabled={!name.trim() || name.trim() === user.name}
              size="sm"
            >
              {nameSaved ? (
                <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved</>
              ) : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Subscription */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="mb-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-500" />
            Subscription
          </h3>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium capitalize">{user.subscriptionTier} Plan</span>
                <Badge variant={tierBadgeVariant}>
                  {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">
                {user.subscriptionTier === 'free'
                  ? 'Free plan — upgrade to unlock all training modules'
                  : 'Managed through Paddle. Cancel or update billing at any time.'}
              </p>
            </div>
            {user.subscriptionTier === 'free' ? (
              <a href="/pricing">
                <Button size="sm">Upgrade Plan</Button>
              </a>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => alert('In production: Opens Paddle Customer Portal to manage billing, cancel subscription, or update payment method.')}
              >
                Manage Billing
              </Button>
            )}
          </div>

          {user.subscriptionTier !== 'free' && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                Billing is managed by Paddle. To cancel your subscription, click "Manage Billing" and follow the cancellation steps. Your subscription will remain active until the end of the current billing period.
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Notifications placeholder */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="mb-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-500" />
            Notifications
          </h3>
          <p className="text-sm text-gray-400 mb-4">Email notification preferences are managed through your email client. We only send transactional emails: receipts, refund confirmations, and security alerts.</p>
          <div className="space-y-2">
            {[
              'Payment receipts',
              'Subscription changes',
              'Security alerts',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                {item} — always enabled
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="mb-6">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            Password
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Password changes require server-side authentication. In the full production deployment, this would send a secure password reset link to your registered email.
          </p>
          <Button variant="secondary" size="sm" onClick={() => alert('In production: Sends a password reset email to ' + user.email)}>
            Send Password Reset Email
          </Button>
        </Card>
      </motion.div>

      {/* Data & Privacy */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="mb-6 border-red-900/30">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            Data & Privacy
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Delete Training Data</h4>
              <p className="text-xs text-gray-400 mb-3">
                Permanently deletes all your training sessions and resets your XP to zero. This action cannot be undone.
              </p>
              {!showDeleteSection ? (
                <Button variant="danger" size="sm" onClick={() => setShowDeleteSection(true)}>
                  Delete All Training Data
                </Button>
              ) : (
                <div className="bg-red-950/30 border border-red-800/40 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-300">
                      This will permanently delete all {useSessionStore.getState().getSessionsByUser(user.id).length} of your training sessions. Type DELETE to confirm.
                    </p>
                  </div>
                  <Input
                    placeholder="Type DELETE to confirm"
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setShowDeleteSection(false); setDeleteConfirm(''); }}>
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={deleteConfirm !== 'DELETE'}
                      onClick={handleDeleteData}
                    >
                      Confirm Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-800">
              <h4 className="text-sm font-medium text-white mb-1">Request Account Deletion</h4>
              <p className="text-xs text-gray-400 mb-3">
                To permanently delete your account and all associated data (GDPR Article 17 right to erasure), contact us at privacy@neuroforge.io with your registered email.
              </p>
              <Button variant="secondary" size="sm" onClick={() => alert('In production: Initiates GDPR data deletion request. Account and all data deleted within 30 days.')}>
                Request Account Deletion
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Sign out */}
      <div className="flex justify-end">
        <Button variant="ghost" onClick={logout} className="text-red-400 hover:text-red-300">
          Sign Out of NeuroForge
        </Button>
      </div>
    </div>
  );
}
