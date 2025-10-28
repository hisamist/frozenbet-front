"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import * as AuthService from "@/services/APIService";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Optionnel : récupérer l’utilisateur si déjà connecté (cookie HttpOnly)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await AuthService.getUser(); // backend endpoint /auth/me
        setUser(res.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await AuthService.loginUser({ email, password });
    setUser(data.user); // backend doit renvoyer user data
  };

  const logout = async () => {
    await AuthService.logoutUser();
    setUser(null);
  };

  const register = async (payload: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const data = await AuthService.registerUser(payload);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
