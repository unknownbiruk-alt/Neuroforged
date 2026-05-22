import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireTier?: 'pro' | 'elite';
}

export function ProtectedRoute({ children, requireTier }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (requireTier) {
    const tierOrder = { free: 0, pro: 1, elite: 2 };
    const requiredLevel = tierOrder[requireTier];
    const userLevel = tierOrder[user.subscriptionTier];

    if (userLevel < requiredLevel) {
      return <Navigate to="/pricing" replace />;
    }
  }

  return <>{children}</>;
}
