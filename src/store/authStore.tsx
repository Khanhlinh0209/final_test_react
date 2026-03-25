import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import type { User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<User | null>;
};

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): User | null {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function saveSession(accessToken: string, user: User) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredAccessToken());

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    saveSession(response.accessToken, response.user);
    setUser(response.user);
    setAccessToken(response.accessToken);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setAccessToken(null);
  };

  const getCurrentUser = async () => {
    const storedUser = getStoredUser();
    if (storedUser) {
      return storedUser;
    }

    try {
      return await authService.getMe();
    } catch {
      return null;
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      login,
      logout,
      getCurrentUser,
    }),
    [user, accessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
