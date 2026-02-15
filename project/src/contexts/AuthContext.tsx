import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAdmin: boolean;
  adminToken: string | null;
  login: (adminKey: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('*')
        .eq('session_token', token)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (data && !error) {
        setIsAdmin(true);
        setAdminToken(token);
      } else {
        localStorage.removeItem('admin_token');
        setIsAdmin(false);
        setAdminToken(null);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setIsAdmin(false);
      setAdminToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (adminKey: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: keyData, error: keyError } = await supabase
        .from('admin_keys')
        .select('*')
        .eq('key_value', adminKey)
        .eq('is_active', true)
        .maybeSingle();

      if (keyError || !keyData) {
        return { success: false, error: 'Invalid admin key' };
      }

      if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
        return { success: false, error: 'Admin key has expired' };
      }

      if (keyData.usage_type === 'single' && keyData.current_uses >= 1) {
        return { success: false, error: 'Admin key has already been used' };
      }

      if (keyData.max_uses && keyData.current_uses >= keyData.max_uses) {
        return { success: false, error: 'Admin key usage limit reached' };
      }

      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_key_id: keyData.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
        });

      if (sessionError) {
        return { success: false, error: 'Failed to create session' };
      }

      await supabase
        .from('admin_keys')
        .update({ current_uses: keyData.current_uses + 1 })
        .eq('id', keyData.id);

      localStorage.setItem('admin_token', sessionToken);
      setAdminToken(sessionToken);
      setIsAdmin(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, adminToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
