import { Brain, Trophy, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSessionStore, computeUserAnalytics } from '../store/sessionStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
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

export function LeaderboardPage() {
  const { user } = useAuthStore();
  const { getSessionsByUser } = useSessionStore();

  if (!user) return null;

  const sessions = getSessionsByUser(user.id);
  const analytics = computeUserAnalytics(sessions);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-1">Leaderboard</h1>
      <p className="text-gray-400 text-sm mb-8">Your personal rank and performance standing</p>

      {/* Privacy notice */}
      <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-300">
          <span className="font-semibold">Privacy-first leaderboard.</span> NeuroForge does not display other users' names or performance data. Your statistics are private to you. Global leaderboards with opt-in anonymized rankings are on our roadmap.
        </div>
      </div>

      {/* Your Card */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-violet-900/40">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-white text-lg">{user.name}</div>
            <div className={cn('flex items-center gap-1.5 text-sm font-semibold', rankColors[user.rank] ?? 'text-gray-400')}>
              <Trophy className="w-4 h-4" />
              {user.rank}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-black text-white">{user.xp}</div>
            <div className="text-xs text-gray-500">Total XP</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Sessions', value: sessions.length },
            { label: 'Avg Score', value: analytics ? analytics.avgScore : '—' },
            { label: 'Avg Accuracy', value: analytics ? `${analytics.avgAccuracy}%` : '—' },
          ].map(stat => (
            <div key={stat.label} className="text-center bg-gray-800 rounded-lg p-3">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rank Progression */}
      <Card className="mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-gray-500" />
          Rank Progression
        </h3>
        <div className="space-y-2">
          {[
            { rank: 'Unranked', min: 0, max: 49 },
            { rank: 'Bronze', min: 50, max: 199 },
            { rank: 'Silver', min: 200, max: 499 },
            { rank: 'Gold', min: 500, max: 999 },
            { rank: 'Platinum', min: 1000, max: 1999 },
            { rank: 'Diamond', min: 2000, max: 4999 },
            { rank: 'Master', min: 5000, max: 9999 },
            { rank: 'Grandmaster', min: 10000, max: Infinity },
          ].map(tier => {
            const isCurrent = user.rank === tier.rank;
            const isPassed = user.xp >= tier.min && !isCurrent && tier.max < user.xp;
            return (
              <div key={tier.rank} className={cn(
                'flex items-center gap-3 py-2 px-3 rounded-lg',
                isCurrent ? 'bg-violet-900/30 border border-violet-700/50' : isPassed ? 'bg-gray-800/50' : 'bg-transparent'
              )}>
                <div className={cn('w-3 h-3 rounded-full', isCurrent ? 'bg-violet-400 ring-2 ring-violet-400/30' : isPassed ? 'bg-gray-500' : 'bg-gray-700')} />
                <span className={cn('font-semibold text-sm flex-1', rankColors[tier.rank] ?? 'text-gray-400', !isCurrent && !isPassed && 'opacity-50')}>
                  {tier.rank}
                </span>
                <span className="text-xs text-gray-600">
                  {tier.max === Infinity ? `${tier.min}+ XP` : `${tier.min}–${tier.max} XP`}
                </span>
                {isCurrent && <Badge variant="violet" size="sm">Current</Badge>}
                {isPassed && <Badge variant="success" size="sm">✓</Badge>}
              </div>
            );
          })}
        </div>
      </Card>

      {sessions.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Complete training sessions to start earning XP and climbing the ranks.
        </div>
      )}
    </div>
  );
}
