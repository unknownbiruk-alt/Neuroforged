import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Trophy, Star, Target, Zap, Activity, Calendar, Brain } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSessionStore, computeUserAnalytics } from '../store/sessionStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const rankColors: Record<string, string> = {
  Unranked: 'text-gray-400',
  Bronze: 'text-amber-700',
  Silver: 'text-gray-300',
  Gold: 'text-amber-400',
  Platinum: 'text-cyan-300',
  Diamond: 'text-blue-400',
  Master: 'text-violet-400',
  Grandmaster: 'text-red-400',
};

const testTypeLabels: Record<string, string> = {
  reaction_time: 'Reaction Time',
  aim_precision: 'Aim Precision',
  pattern_recognition: 'Pattern Recognition',
  working_memory: 'Working Memory',
  cognitive_flexibility: 'Cognitive Flexibility',
  focus_endurance: 'Focus Endurance',
};

export function ProfilePage() {
  const { user } = useAuthStore();
  const { getSessionsByUser } = useSessionStore();

  if (!user) return null;

  const sessions = getSessionsByUser(user.id);
  const analytics = computeUserAnalytics(sessions);

  const bestByType: Record<string, number> = {};
  sessions.forEach(s => {
    if (!bestByType[s.testType] || s.score > bestByType[s.testType]) {
      bestByType[s.testType] = s.score;
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-violet-900/30 to-indigo-900/30 border border-violet-800/40 rounded-2xl p-8 mb-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-violet-900/40 flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <Badge variant={user.subscriptionTier === 'elite' ? 'gold' : user.subscriptionTier === 'pro' ? 'violet' : 'default'}>
                {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
              </Badge>
            </div>
            <div className={cn('flex items-center gap-1.5 font-semibold text-sm', rankColors[user.rank] ?? 'text-gray-400')}>
              <Star className="w-4 h-4" />
              {user.rank}
            </div>
            <div className="text-gray-400 text-sm mt-1">{user.email}</div>
            <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white">{user.xp}</div>
            <div className="text-xs text-gray-400">Total XP</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Sessions', value: sessions.length, icon: <Activity className="w-4 h-4" /> },
          { label: 'Best Score', value: sessions.length ? Math.max(...sessions.map(s => s.score)) : '—', icon: <Trophy className="w-4 h-4" /> },
          { label: 'Avg Accuracy', value: analytics ? `${analytics.avgAccuracy}%` : '—', icon: <Target className="w-4 h-4" /> },
          { label: 'Best Reaction', value: sessions.filter(s => s.reactionTimeMs).length ? `${Math.min(...sessions.filter(s => s.reactionTimeMs).map(s => s.reactionTimeMs!))}ms` : '—', icon: <Zap className="w-4 h-4" /> },
        ].map(stat => (
          <Card key={stat.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{stat.label}</span>
              <span className="text-violet-400">{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* Personal Bests */}
      <Card className="mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Personal Bests
        </h3>
        {Object.keys(bestByType).length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Complete training sessions to set personal bests</p>
            <Link to="/tests" className="mt-3 inline-block">
              <Button size="sm">Start Training</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(bestByType).map(([type, score]) => (
              <div key={type} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-sm text-gray-300">{testTypeLabels[type] ?? type}</span>
                <span className="font-bold text-white">{score}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/tests">
          <Button size="sm">Start Training</Button>
        </Link>
        <Link to="/analytics">
          <Button size="sm" variant="secondary">View Analytics</Button>
        </Link>
        <Link to="/settings">
          <Button size="sm" variant="ghost">Account Settings</Button>
        </Link>
      </div>
    </div>
  );
}
