import { createContext, useContext, useMemo, useState } from 'react';
import { getAuthUser } from '../api/client.js';
import { login, logout, register } from '../api/auth.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getAuthUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (action, credentials) => {
    try {
      setLoading(true);
      setError(null);
      const result = await action(credentials);
      setUser(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login: (credentials) => handleAuth(login, credentials),
      register: (credentials) => handleAuth(register, credentials),
      logout: () => {
        logout();
        setUser(null);
      }
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
