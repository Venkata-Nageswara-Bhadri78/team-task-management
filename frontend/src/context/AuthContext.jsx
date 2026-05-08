import { createContext, useEffect, useState } from 'react';
import { getMeApi, loginApi, signupApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const login = async (payload) => {
    const result = await loginApi(payload);
    const userData = result.data.user;
    const authToken = result.data.token;

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);

    return result;
  };

  const signup = async (payload) => {
    const result = await signupApi(payload);
    const userData = result.data.user;
    const authToken = result.data.token;

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);

    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (token) {
          const result = await getMeApi();
          setUser(result.data.user);
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token && user),
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
