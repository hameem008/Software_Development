import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '@/types';
import api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (userType: UserType, credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status by making a request to the backend
    const checkAuth = async () => {
      try {
        // Try to get user profile based on the cookie
        await api.get('/refresh');
        const response = await api.get('/me');
        // console.log('Auth check response:', response.data); // Debug log
        
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        // If the request fails, user is not authenticated
        console.error('Error in auth check:', error);
        console.error('Error response:', error.response); 
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userType: UserType, credentials: { email: string; password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      // The actual API call is handled in the login form
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      
      // Clear chat conversation data from localStorage
      if (user?.id) {
        const conversationKey = `chat_conversation_${user.id}`;
        localStorage.removeItem(conversationKey);
        console.log('Chat conversation cleared for user:', user.id);
      }
      
      // Also clear any default conversation if it exists
      const defaultConversationKey = 'chat_conversation_default';
      localStorage.removeItem(defaultConversationKey);
      
      setUser(null);
      console.log('User logged out successfully and chat data cleared');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if logout API fails, clear local data
      if (user?.id) {
        const conversationKey = `chat_conversation_${user.id}`;
        localStorage.removeItem(conversationKey);
      }
      localStorage.removeItem('chat_conversation_default');
      
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};