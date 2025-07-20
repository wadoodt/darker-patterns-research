import type { AuthenticatedUser } from "types/auth";

export interface AuthContextType {
  user: AuthenticatedUser | null;
  token: string | null;
  tokenExpiresAt: number | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  hasPlan: (plans: string[]) => boolean;
  isAuthenticated: () => boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
