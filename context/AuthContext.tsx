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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🔄 Charger utilisateur depuis localStorage (persistance)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🔐 Login
  const login = async (email: string, password: string) => {
    const res = await AuthService.loginUser({ email, password });
    console.log("🔐 API Login Response:", res);

    if (res?.data?.user) {
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
    } else {
      throw new Error("Réponse du serveur invalide");
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await AuthService.logoutUser(); // maintenant avec token
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  // 🆕 Register
  const register = async (payload: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const res = await AuthService.registerUser(payload);
    console.log("🆕 Register response:", res);

    if (res?.data?.user) {
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
    } else {
      throw new Error("Réponse du serveur invalide");
    }
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
