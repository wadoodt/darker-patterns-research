import type { User } from 'types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  tokenExpiresAt: number | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  isAuthenticated: () => boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
