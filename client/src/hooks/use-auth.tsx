import { createContext, useContext, ReactNode, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api, type User } from "@shared/routes";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  login: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Login failed");
      return await res.json();
    },
    onSuccess: (data: User) => {
      setUser(data);
      setLocation("/dashboard");
    },
  });

  const logout = () => {
    setUser(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login: loginMutation.mutateAsync, logout, isLoading: loginMutation.isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
