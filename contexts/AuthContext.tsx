import {
  deleteTokens,
  getUserFromStorage,
  updateTokens,
  UserDataFromStorage,
} from "@/utils/user-handler";
import { jwtDecode, JwtPayload } from "jwt-decode";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextValue {
  userId: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  loginWithTokens: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserFromStorage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Load user id on mount from secure storage (if token exists)
  useEffect(() => {
    (async () => {
      try {
        const stored = await getUserFromStorage();
        console.log("Stored user on initialization:", stored);
        if (stored?.id) setUserId(stored.id);
      } catch (e) {
        console.log("AuthProvider initialization error", e);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const refreshUserFromStorage = useCallback(async () => {
    const stored: UserDataFromStorage | null = await getUserFromStorage();
    setUserId(stored?.id ?? null);
  }, []);

  const loginWithTokens = useCallback(
    async (token: string) => {
      // Persist tokens
      await updateTokens(token);
      // Decode user id (sub) directly for immediate state update
      try {
        const decoded: JwtPayload = jwtDecode(token);
        setUserId(decoded.sub || decoded.id || null);
      } catch (e) {
        console.log("Failed to decode token, falling back to storage", e);
        await refreshUserFromStorage();
      }
    },
    [refreshUserFromStorage]
  );

  const logout = useCallback(async () => {
    await deleteTokens();
    setUserId(null);
  }, []);

  const value: AuthContextValue = {
    userId,
    isAuthenticated: !!userId,
    initializing,
    loginWithTokens,
    logout,
    refreshUserFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
