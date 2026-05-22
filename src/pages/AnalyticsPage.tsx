import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, Target, Zap, Lock, ArrowRight, TrendingUp,
  Activity, Brain, Clock
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { useAuthStore } from '../store/authStore';
import { useSessionStore, computeUserAnalytics } from '../store/sessionStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';

const testTypeLabels: Record<string, string> = {
  reaction_time: 'Reaction',
  aim_precision: 'Aim',
  pattern_recognition: 'Pattern',
  working_memory: 'Memory',
  cognitive_flexibility: 'Flexibility',
  focus_endurance: 'Focus',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export function AnalyticsPage() {
  const { user } = useAuthStore();
  const { getSessionsByUser } = useSessionStore();

  if (!user) return null;

  const sessions = getSessionsByUser(user.id);
  const analytics = computeUserAnalytics(sessions);
  const isProOrElite = user.subscriptionTier === 'pro' || user.subscriptionTier === 'elite';

  // Empty state: no sessions
  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6">
          <BarChart3 className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No training data yet</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Start your first training session to begin generating real performance data. Analytics unlock after 3 sessions.
        </p>
        <Link to="/tests">
          <Button>Start Your First Training <ArrowRight className="w-4 h-4" /></Button>
        </Link>
      </div>
    );
  }

  // Partial state: fewer than 3 sessions
  if (sessions.length < 3) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-gray-400 text-sm mb-8">Derived from your actual training sessions — no fabricated data.</p>

        <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-6 mb-8 text-center">
          <BarChart3 className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Complete {3 - sessions.length} more session{3 - sessions.length !== 1 ? 's' : ''} to unlock analytics</h3>
          <p className="text-amber-500/80 text-sm mb-4">
            You have {sessions.length} session{sessions.length !== 1 ? 's' : ''} completed. Analytics require a minimum of 3 sessions to generate meaningful insights.
          </p>
          <Link to="/tests">
            <Button size="sm">Continue Training <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>

        {/* Show what they have so far */}
        <Card>
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Your Sessions So Far
          </h3>
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="text-sm font-medium text-white">{testTypeLabels[s.testType] ?? s.testType}</div>
                  <div className="text-xs text-gray-500">{format(new Date(s.completedAt), 'MMM d, h:mm a')}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{s.score}</div>
                  <div className="text-xs text-gray-500">{s.accuracy}% acc · +{s.xpEarned} XP</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Full analytics view
  const radarData = analytics!.typeAverages.map(t => ({
    subject: testTypeLabels[t.type] ?? t.type,
    score: Math.round(t.avgScore),
    fullMark: 1000,
  }));

  const scoresByDate = analytics!.trendData.reduce<Record<string, number[]>>((acc, d) => {
    acc[d.date] = [...(acc[d.date] ?? []), d.score];
    return acc;
  }, {});

  const trendChartData = Object.entries(scoresByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, scores]) => ({
      date: format(new Date(date), 'MMM d'),
      score: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length),
      accuracy: Math.round(
        analytics!.trendData
          .filter(d => d.date === date)
          .reduce((s, d) => s + d.accuracy, 0) /
        analytics!.trendData.filter(d => d.date === date).length
      ),
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 text-sm">
            Based on {sessions.length} real session{sessions.length !== 1 ? 's' : ''} — no fabricated data
          </p>
        </div>
        {!isProOrElite && (
          <Link to="/pricing">
            <Button variant="outline" size="sm">
              <Zap className="w-3.5 h-3.5" /> Upgrade for Advanced Analytics
            </Button>
          </Link>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Sessions', value: analytics!.totalSessions, icon: <Activity className="w-4 h-4" /> },
          { label: 'Avg Score', value: analytics!.avgScore, icon: <Target className="w-4 h-4" /> },
          { label: 'Avg Accuracy', value: `${analytics!.avgAccuracy}%`, icon: <TrendingUp className="w-4 h-4" /> },
          {
            label: 'Avg Reaction',
            value: analytics!.avgReactionMs > 0 ? `${analytics!.avgReactionMs}ms` : '—',
            icon: <Zap className="w-4 h-4" />
          },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{stat.label}</span>
                <span className="text-violet-400">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Trend */}
        <Card>
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            Score Trend
          </h3>
          {trendChartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Score"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-600 text-sm">
              Trend chart requires sessions on multiple days
            </div>
          )}
        </Card>

        {/* Accuracy Trend */}
        <Card>
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-500" />
            Accuracy Over Time
          </h3>
          {trendChartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', r: 3 }}
                  name="Accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-600 text-sm">
              Trend chart requires sessions on multiple days
            </div>
          )}
        </Card>
      </div>

      {/* Performance by Type + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart by Test Type */}
        <Card>
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            Score by Test Type
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics!.typeAverages.map(t => ({ name: testTypeLabels[t.type] ?? t.type, score: Math.round(t.avgScore), sessions: t.count }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar Chart — Pro+ */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-gray-500" />
              Cognitive Profile
            </h3>
            {!isProOrElite && <Badge variant="violet" size="sm">Pro Feature</Badge>}
          </div>
          {isProOrElite ? (
            radarData.length >= 3 ? (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1f2937" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-gray-600 text-sm text-center px-4">
                Complete sessions in at least 3 different test types to see your cognitive profile
              </div>
            )
          ) : (
            <div className="h-56 flex flex-col items-center justify-center gap-3">
              <Lock className="w-6 h-6 text-gray-600" />
              <p className="text-sm text-gray-500 text-center">
                Cognitive profile radar is available on Pro and Elite plans
              </p>
              <Link to="/pricing">
                <Button size="sm" variant="outline">Upgrade to Pro</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Weakness Detection */}
      {analytics!.weakAreas.length > 0 && (
        <Card className="mb-6">
          <h3 className="font-semibold text-white mb-4">
            ⚠ Performance Gaps Detected
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            These areas are performing below your overall average ({analytics!.avgScore}). Focus training here for the biggest gains.
          </p>
          <div className="flex flex-wrap gap-2">
            {analytics!.weakAreas.map(area => (
              <div key={area} className="flex items-center gap-2 bg-amber-900/20 border border-amber-700/40 rounded-lg px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm text-amber-300">{testTypeLabels[area] ?? area}</span>
                <Link to={`/tests?type=${area}`}>
                  <Button size="sm" variant="ghost" className="text-amber-400 hover:text-amber-300 px-1 py-0.5 text-xs">
                    Train →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Session History */}
      <Card>
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          Session History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 px-3 text-gray-500 font-medium text-xs">Date</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium text-xs">Test</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium text-xs">Score</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium text-xs">Accuracy</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium text-xs">Difficulty</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium text-xs">XP</th>
              </tr>
            </thead>
            <tbody>
              {[...sessions]
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .map(s => (
                  <tr key={s.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-gray-400 text-xs">{format(new Date(s.completedAt), 'MMM d, h:mm a')}</td>
                    <td className="py-2.5 px-3 text-white font-medium">{testTypeLabels[s.testType] ?? s.testType}</td>
                    <td className="py-2.5 px-3 text-right text-white font-bold">{s.score}</td>
                    <td className="py-2.5 px-3 text-right text-gray-300">{s.accuracy}%</td>
                    <td className="py-2.5 px-3 text-right text-gray-400">{s.difficulty}/10</td>
                    <td className="py-2.5 px-3 text-right text-violet-400 font-medium">+{s.xpEarned}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
