import type { AuthenticatedUser } from "types/auth";

export interface AuthContextType {
  user: AuthenticatedUser | null;
  token: string | null;
  tokenExpiresAt: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
  hasPlan: (plans: string[]) => boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
