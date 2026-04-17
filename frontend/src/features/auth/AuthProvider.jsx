import { createContext, useEffect, useMemo, useState } from "react";
import authService from "../../services/authService.js";
import { clearAuthState, loadAuthState, saveAuthState } from "../../utils/storage.js";

const initialState = loadAuthState();

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialState);
  const [loading, setLoading] = useState(Boolean(initialState.token));

  useEffect(() => {
    let isMounted = true;

    const syncProfile = async () => {
      if (!authState.token) {
        setLoading(false);
        return;
      }

      try {
        const user = await authService.getProfile();

        if (!isMounted) {
          return;
        }

        const nextState = {
          token: authState.token,
          user,
        };

        setAuthState(nextState);
        saveAuthState(nextState);
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        setAuthState({
          token: null,
          user: null,
        });
        clearAuthState();
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    syncProfile();

    return () => {
      isMounted = false;
    };
  }, [authState.token]);

  const updateSession = (payload) => {
    setAuthState(payload);
    saveAuthState(payload);
  };

  const login = async (credentials) => {
    const payload = await authService.login(credentials);
    updateSession(payload);
    return payload;
  };

  const register = async (credentials) => {
    const payload = await authService.register(credentials);
    updateSession(payload);
    return payload;
  };

  const logout = () => {
    const emptyState = {
      token: null,
      user: null,
    };

    setAuthState(emptyState);
    clearAuthState();
  };

  const value = useMemo(
    () => ({
      ...authState,
      loading,
      isAuthenticated: Boolean(authState.token && authState.user),
      login,
      register,
      logout,
    }),
    [authState, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
