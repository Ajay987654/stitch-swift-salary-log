
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        // Handle authentication events
        if (event === 'SIGNED_IN') {
          toast.success("Logged in successfully!");
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          toast.success("Logged out successfully!");
          navigate('/auth');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Redirect logic - handle protected and public routes
  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = location.pathname === "/auth";

    // If user is authenticated and on auth page, redirect to home
    if (user && isAuthPage) {
      navigate("/");
    }
    
    // If user is not authenticated and not on auth page, redirect to auth
    if (!user && !isAuthPage) {
      navigate("/auth");
    }
  }, [user, location.pathname, isLoading, navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Navigation and toast are now handled in onAuthStateChange
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
