import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TestType =
  | 'reaction_time'
  | 'aim_precision'
  | 'pattern_recognition'
  | 'working_memory'
  | 'cognitive_flexibility'
  | 'focus_endurance';

export interface TestSession {
  id: string;
  userId: string;
  testType: TestType;
  score: number;
  accuracy: number;        // 0-100
  reactionTimeMs?: number;
  difficulty: number;      // 1-10
  durationSeconds: number;
  xpEarned: number;
  completedAt: string;
  metrics: Record<string, number>;
}

export interface SessionState {
  sessions: TestSession[];
  // All queries MUST filter by userId — never expose all sessions
  getSessionsByUser: (userId: string) => TestSession[];
  getSessionsByUserAndType: (userId: string, testType: TestType) => TestSession[];
  getLastNSessionsByUser: (userId: string, n: number) => TestSession[];
  addSession: (session: TestSession) => void;
  deleteUserSessions: (userId: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],

      getSessionsByUser: (userId: string) => {
        return get().sessions.filter(s => s.userId === userId);
      },

      getSessionsByUserAndType: (userId: string, testType: TestType) => {
        return get().sessions.filter(s => s.userId === userId && s.testType === testType);
      },

      getLastNSessionsByUser: (userId: string, n: number) => {
        return get().sessions
          .filter(s => s.userId === userId)
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .slice(0, n);
      },

      addSession: (session: TestSession) => {
        // Enforce: userId must be present
        if (!session.userId) {
          console.error('[SessionStore] Attempted to add session without userId. Rejected.');
          return;
        }
        set(state => ({ sessions: [...state.sessions, session] }));
      },

      deleteUserSessions: (userId: string) => {
        set(state => ({
          sessions: state.sessions.filter(s => s.userId !== userId),
        }));
      },
    }),
    {
      name: 'neuroforge_sessions',
    }
  )
);

// ─── Analytics Queries (all userId-scoped) ─────────────────────────────────

export function computeUserAnalytics(sessions: TestSession[]) {
  if (sessions.length === 0) return null;

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  const avgScore = sessions.reduce((s, x) => s + x.score, 0) / sessions.length;
  const avgAccuracy = sessions.reduce((s, x) => s + x.accuracy, 0) / sessions.length;
  const avgReaction = sessions
    .filter(s => s.reactionTimeMs !== undefined)
    .reduce((s, x) => s + (x.reactionTimeMs ?? 0), 0) /
    Math.max(sessions.filter(s => s.reactionTimeMs !== undefined).length, 1);

  const totalXp = sessions.reduce((s, x) => s + x.xpEarned, 0);
  const totalSessions = sessions.length;

  // Performance by test type
  const byType: Record<string, TestSession[]> = {};
  for (const s of sessions) {
    byType[s.testType] = byType[s.testType] ?? [];
    byType[s.testType].push(s);
  }

  const typeAverages = Object.entries(byType).map(([type, typeSessions]) => ({
    type,
    avgScore: typeSessions.reduce((s, x) => s + x.score, 0) / typeSessions.length,
    count: typeSessions.length,
  }));

  // Trend: last 7 sessions scores
  const trendData = sorted.slice(-10).map(s => ({
    date: s.completedAt.split('T')[0],
    score: s.score,
    accuracy: s.accuracy,
    type: s.testType,
  }));

  // Weakness detection — types with below-average performance
  const globalAvg = avgScore;
  const weakAreas = typeAverages
    .filter(t => t.avgScore < globalAvg * 0.85)
    .map(t => t.type);

  // Adaptive difficulty: average difficulty of last 5 sessions
  const last5 = sorted.slice(-5);
  const avgDifficulty = last5.reduce((s, x) => s + x.difficulty, 0) / Math.max(last5.length, 1);
  const recommendedDifficulty = Math.min(10, Math.round(avgDifficulty + (avgAccuracy > 75 ? 1 : 0)));

  return {
    avgScore: Math.round(avgScore),
    avgAccuracy: Math.round(avgAccuracy * 10) / 10,
    avgReactionMs: Math.round(avgReaction),
    totalXp,
    totalSessions,
    typeAverages,
    trendData,
    weakAreas,
    recommendedDifficulty,
    hasEnoughData: sessions.length >= 3,
  };
}

// Generate adaptive training plan — only if real data exists
export function generateAdaptiveTrainingPlan(sessions: TestSession[], userId: string) {
  const userSessions = sessions.filter(s => s.userId === userId);
  if (userSessions.length < 3) return null;

  const analytics = computeUserAnalytics(userSessions);
  if (!analytics) return null;

  const plan = [];

  if (analytics.weakAreas.length > 0) {
    plan.push({
      focus: analytics.weakAreas[0],
      reason: 'Detected performance gap below your average',
      difficulty: analytics.recommendedDifficulty,
      sessions: 3,
    });
  }

  if (analytics.avgAccuracy < 70) {
    plan.push({
      focus: 'aim_precision',
      reason: 'Accuracy below 70% — precision drills recommended',
      difficulty: Math.max(1, analytics.recommendedDifficulty - 1),
      sessions: 2,
    });
  }

  if (analytics.avgReactionMs > 350 && analytics.avgReactionMs > 0) {
    plan.push({
      focus: 'reaction_time',
      reason: `Reaction time ${analytics.avgReactionMs}ms — targeting sub-300ms`,
      difficulty: analytics.recommendedDifficulty,
      sessions: 2,
    });
  }

  if (plan.length === 0) {
    plan.push({
      focus: 'cognitive_flexibility',
      reason: 'Balanced performance — maintaining cognitive flexibility',
      difficulty: analytics.recommendedDifficulty,
      sessions: 3,
    });
  }

  return plan;
}

export function calculateXpForSession(score: number, accuracy: number, difficulty: number): number {
  const base = Math.round(score * 0.5);
  const accuracyBonus = Math.round(accuracy * 0.3);
  const difficultyMultiplier = 1 + (difficulty - 1) * 0.15;
  return Math.round((base + accuracyBonus) * difficultyMultiplier);
}
