
import React, { createContext, useContext, useCallback } from 'react';
import { User, LoginCredentials, SignUpCredentials } from '../types';
import { useUserQuery, useLoginMutation, useSignUpMutation, useLogoutMutation } from '../hooks/useAuthQueries';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: isUserLoading } = useUserQuery();
  const loginMutation = useLoginMutation();
  const signUpMutation = useSignUpMutation();
  const logoutMutation = useLogoutMutation();

  const isLoading = 
    isUserLoading || 
    loginMutation.isPending || 
    signUpMutation.isPending || 
    logoutMutation.isPending;

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const signUp = async (credentials: SignUpCredentials) => {
    await signUpMutation.mutateAsync(credentials);
  };

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  // Listen for unauthorized events (401) from api client
  React.useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ 
      user: user ?? null, 
      isLoading, 
      login, 
      signUp, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
