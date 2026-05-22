import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionTier = 'free' | 'pro' | 'elite';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: string;
  xp: number;
  rank: string;
  onboardingComplete: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  completeOnboarding: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Stored users registry (simulates DB — keyed by email)
const USERS_REGISTRY_KEY = 'neuroforge_users_registry';

function getUsersRegistry(): Record<string, { passwordHash: string; user: User }> {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsersRegistry(registry: Record<string, { passwordHash: string; user: User }>) {
  localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
}

function hashPassword(password: string): string {
  // Simple deterministic hash for demo — in production use bcrypt server-side
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `ph_${Math.abs(hash).toString(36)}`;
}

function generateUserId(): string {
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function calculateRank(xp: number): string {
  if (xp >= 10000) return 'Grandmaster';
  if (xp >= 5000) return 'Master';
  if (xp >= 2000) return 'Diamond';
  if (xp >= 1000) return 'Platinum';
  if (xp >= 500) return 'Gold';
  if (xp >= 200) return 'Silver';
  if (xp >= 50) return 'Bronze';
  return 'Unranked';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 800));

        const registry = getUsersRegistry();
        const entry = registry[email.toLowerCase()];

        if (!entry) {
          set({ isLoading: false });
          return { success: false, error: 'No account found with this email address.' };
        }

        const passwordHash = hashPassword(password);
        if (entry.passwordHash !== passwordHash) {
          set({ isLoading: false });
          return { success: false, error: 'Incorrect password. Please try again.' };
        }

        // Refresh user from registry (in case updated)
        const updatedUser = { ...entry.user, rank: calculateRank(entry.user.xp) };
        registry[email.toLowerCase()].user = updatedUser;
        saveUsersRegistry(registry);

        set({ user: updatedUser, isAuthenticated: true, isLoading: false });
        return { success: true };
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 900));

        const registry = getUsersRegistry();

        if (registry[email.toLowerCase()]) {
          set({ isLoading: false });
          return { success: false, error: 'An account with this email already exists.' };
        }

        if (password.length < 8) {
          set({ isLoading: false });
          return { success: false, error: 'Password must be at least 8 characters.' };
        }

        const newUser: User = {
          id: generateUserId(),
          email: email.toLowerCase(),
          name: name.trim(),
          createdAt: new Date().toISOString(),
          subscriptionTier: 'free',
          xp: 0,
          rank: 'Unranked',
          onboardingComplete: false,
        };

        registry[email.toLowerCase()] = {
          passwordHash: hashPassword(password),
          user: newUser,
        };
        saveUsersRegistry(registry);

        set({ user: newUser, isAuthenticated: true, isLoading: false });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      completeOnboarding: () => {
        const { user } = get();
        if (!user) return;

        const registry = getUsersRegistry();
        const updatedUser = { ...user, onboardingComplete: true };
        registry[user.email].user = updatedUser;
        saveUsersRegistry(registry);

        set({ user: updatedUser });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        const registry = getUsersRegistry();
        const updatedUser = { ...user, ...updates, rank: calculateRank((updates.xp ?? user.xp)) };
        registry[user.email].user = updatedUser;
        saveUsersRegistry(registry);

        set({ user: updatedUser });
      },
    }),
    {
      name: 'neuroforge_auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
