import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Target, Zap, Trophy, ArrowRight, Clock,
  BarChart3, Activity, Lock, Star
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSessionStore, computeUserAnalytics } from '../store/sessionStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';
import { format } from 'date-fns';

const testTypeLabels: Record<string, string> = {
  reaction_time: 'Reaction Time',
  aim_precision: 'Aim Precision',
  pattern_recognition: 'Pattern Recognition',
  working_memory: 'Working Memory',
  cognitive_flexibility: 'Cognitive Flexibility',
  focus_endurance: 'Focus Endurance',
};

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

const rankProgressMap: Record<string, { current: number; required: number }> = {
  Unranked: { current: 0, required: 50 },
  Bronze: { current: 50, required: 200 },
  Silver: { current: 200, required: 500 },
  Gold: { current: 500, required: 1000 },
  Platinum: { current: 1000, required: 2000 },
  Diamond: { current: 2000, required: 5000 },
  Master: { current: 5000, required: 10000 },
  Grandmaster: { current: 10000, required: 10000 },
};

export function DashboardPage() {
  const { user } = useAuthStore();
  const { getSessionsByUser } = useSessionStore();

  if (!user) return null;

  const sessions = getSessionsByUser(user.id);
  const analytics = computeUserAnalytics(sessions);
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  const rankProgress = rankProgressMap[user.rank] ?? rankProgressMap['Unranked'];
  const xpInCurrentRank = user.xp - rankProgress.current;
  const xpNeeded = rankProgress.required - rankProgress.current;
  const progressPercent = Math.min(100, Math.round((xpInCurrentRank / Math.max(xpNeeded, 1)) * 100));

  const isProOrElite = user.subscriptionTier === 'pro' || user.subscriptionTier === 'elite';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="text-violet-400">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {sessions.length === 0
              ? 'Your training dashboard is ready. Complete your first session to begin.'
              : `${sessions.length} session${sessions.length !== 1 ? 's' : ''} completed · ${user.xp} XP earned`}
          </p>
        </div>
        <Link to="/tests">
          <Button size="md">
            Start Training <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* XP & Rank Bar */}
      <Card className="mb-6 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-900/40">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{user.name}</span>
                <Badge variant={user.subscriptionTier === 'elite' ? 'gold' : user.subscriptionTier === 'pro' ? 'violet' : 'default'} size="sm">
                  {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className={cn('w-3.5 h-3.5', rankColors[user.rank] ?? 'text-gray-400')} />
                <span className={cn('text-sm font-semibold', rankColors[user.rank] ?? 'text-gray-400')}>
                  {user.rank}
                </span>
                <span className="text-gray-600 text-xs">· {user.xp} XP total</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-48 max-w-xs">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Progress to next rank</span>
              <span>{user.rank === 'Grandmaster' ? 'MAX' : `${progressPercent}%`}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {user.rank !== 'Grandmaster' && (
              <div className="text-xs text-gray-600 mt-1">
                {xpNeeded - xpInCurrentRank} XP to {Object.keys(rankProgressMap)[Object.keys(rankProgressMap).indexOf(user.rank) + 1]}
              </div>
            )}
          </div>
        </div>
      </Card>

      {sessions.length === 0 ? (
        /* ── EMPTY STATE ── */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6">
            <Brain className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No training data yet</h2>
          <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
            Start your first session to begin generating real performance metrics. Your dashboard will populate with your actual results.
          </p>
          <Link to="/tests">
            <Button size="lg">
              Start Your First Training <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-gray-600 mt-4">
            Analytics unlock after 3 completed sessions
          </p>
        </motion.div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Sessions',
                value: sessions.length,
                icon: <Activity className="w-4 h-4" />,
                suffix: '',
              },
              {
                label: 'Avg Score',
                value: analytics ? analytics.avgScore : '—',
                icon: <Target className="w-4 h-4" />,
                suffix: analytics ? '' : '',
              },
              {
                label: 'Avg Accuracy',
                value: analytics ? `${analytics.avgAccuracy}%` : '—',
                icon: <Zap className="w-4 h-4" />,
                suffix: '',
              },
              {
                label: 'Total XP',
                value: user.xp,
                icon: <Trophy className="w-4 h-4" />,
                suffix: '',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                    <div className="text-violet-400">{stat.icon}</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}{stat.suffix}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Analytics Unlock Notice */}
          {!analytics?.hasEnoughData && (
            <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4 mb-6 flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-amber-300 text-sm font-medium">
                  Analytics unlock after 3 sessions — you have {sessions.length}/3.
                </span>
                <span className="text-amber-500/70 text-sm ml-2">
                  Complete {3 - sessions.length} more session{3 - sessions.length !== 1 ? 's' : ''} to view your performance charts.
                </span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Recent Sessions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  Recent Sessions
                </h3>
                <Link to="/analytics" className="text-xs text-violet-400 hover:text-violet-300">
                  View all
                </Link>
              </div>
              <div className="space-y-2">
                {recentSessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {testTypeLabels[session.testType] ?? session.testType}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(session.completedAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{session.score}</div>
                      <div className="text-xs text-gray-500">{session.accuracy}% acc</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Adaptive Plan */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-gray-500" />
                  AI Training Plan
                </h3>
                {!isProOrElite && (
                  <Badge variant="violet" size="sm">Pro Feature</Badge>
                )}
              </div>

              {!isProOrElite ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mb-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Adaptive AI training plans are available on Pro and Elite plans
                  </p>
                  <Link to="/pricing">
                    <Button size="sm" variant="outline">
                      Upgrade to Pro <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              ) : !analytics?.hasEnoughData ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <p className="text-sm text-gray-500">
                    Complete {Math.max(0, 3 - sessions.length)} more session{3 - sessions.length !== 1 ? 's' : ''} to generate your personalized AI training plan.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-3">
                    Based on your last {Math.min(sessions.length, 5)} sessions
                  </p>
                  {analytics.weakAreas.length > 0 ? (
                    analytics.weakAreas.slice(0, 3).map(area => (
                      <div key={area} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                        <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-white">{testTypeLabels[area]}</div>
                          <div className="text-xs text-gray-500">Performance gap detected</div>
                        </div>
                        <Link to="/tests" className="ml-auto">
                          <Button size="sm" variant="ghost">Train</Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-emerald-400 text-center py-4">
                      Balanced performance — keep it up!
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Train Buttons */}
          <Card>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-500" />
              Quick Train
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(testTypeLabels).map(([type, label]) => (
                <Link key={type} to={`/tests?type=${type}`}>
                  <div className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-3 transition-colors cursor-pointer">
                    <div className="text-sm font-medium text-white">{label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
