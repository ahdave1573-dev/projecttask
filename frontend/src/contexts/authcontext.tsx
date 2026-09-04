"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/auth';
import { USE_BACKEND_API } from '@/src/config/apiconfig';
import { useLoader } from './loadercontext';

interface AuthContextType {
  user: any;
  userInitials: string;
  userFullName: string;
  login: (data: any) => Promise<{ success: boolean; message?: string }>;
  registerUser: (data: any) => Promise<{ success: boolean; message?: string }>;
  changePassword: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { showLoader } = useLoader();
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined' && !USE_BACKEND_API) {
      try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          return users.find((u: any) => u.isLoggedIn === true) || null;
        }
      } catch (e) {
        console.error("Error parsing users", e);
      }
    }
    return null;
  });
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (USE_BACKEND_API) {
        // --- API LOGIC ---
        try {
          const response = await authService.getCurrentUser();
          if (response && response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Error checking user:", error);
        } finally {
          setIsMounted(true);
        }
      } else {
        setIsMounted(true);
      }
    };
    checkUser();
  }, []);

  const registerUser = async (data: any) => {
    try {
      if (!USE_BACKEND_API) {
        // --- LOCAL STORAGE LOGIC ---
        const { email, password, firstName, lastName } = data;
        const storedUsers = localStorage.getItem('users');
        let users = [];

        if (storedUsers) {
          users = JSON.parse(storedUsers);
          const userExists = users.find((u: any) => u.email === email);
          if (userExists) {
            return { success: false, message: 'Email is already registered' };
          }
        }

        const newUser = { id: Date.now(), email, password, firstName, lastName, isLoggedIn: false };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        router.push('/login');
        return { success: true };
      } else {
        // --- API LOGIC ---
        const response = await authService.register(data);
        if (response && response.data) {
          router.push('/login');
          return { success: true };
        } else {
          return { success: false, message: response?.message || "Registration failed" };
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return { success: false, message: "Something went wrong." };
    }
  };

  const login = async (data: any) => {
    showLoader(1500);
    try {
      if (!USE_BACKEND_API) {
        // --- LOCAL STORAGE LOGIC ---
        const { email, password } = data;
        const storedUsers = localStorage.getItem('users');

        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const userIndex = users.findIndex((u: any) => u.email === email && u.password === password);

          if (userIndex !== -1) {
            const updatedUsers = users.map((u: any) => ({ ...u, isLoggedIn: false }));
            updatedUsers[userIndex].isLoggedIn = true;

            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setUser(updatedUsers[userIndex]);
            router.push('/');
            return { success: true };
          }
        }

        return { success: false, message: "Invalid credentials or user not found" };
      } else {
        // --- API LOGIC ---
        const response = await authService.login(data);
        if (response && response.data) {
          setUser(response.data);
          router.push('/');
          return { success: true };
        } else {
          return { success: false, message: response?.message || "Invalid credentials" };
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "Login failed" };
    }
  };

  const changePassword = async (data: any) => {
    try {
      if (!USE_BACKEND_API) {
        // --- LOCAL STORAGE LOGIC ---
        const { email, oldPassword, newPassword } = data;
        const storedUsers = localStorage.getItem('users');

        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const userIndex = users.findIndex((u: any) => u.email === email && u.password === oldPassword);

          if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            return { success: true, message: "Password updated successfully" };
          }
        }
        return { success: false, message: "Invalid email or old password" };
      } else {
        // --- API LOGIC ---
        const response = await authService.changePassword(data);
        if (response && response.data !== null) {
          return { success: true, message: response.message || "Password updated successfully" };
        } else {
          return { success: false, message: response?.message || "Failed to update password" };
        }
      }
    } catch (error) {
      console.error("Error during change password:", error);
      return { success: false, message: "Something went wrong" };
    }
  };

  const logout = async () => {
    try {
      if (!USE_BACKEND_API) {
        // --- LOCAL STORAGE LOGIC ---
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((u: any) => ({ ...u, isLoggedIn: false }));
          localStorage.setItem('users', JSON.stringify(updatedUsers));
        }
      } else {
        // --- API LOGIC ---
        await authService.logout();
      }

      setUser(null);
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  if (!isMounted) {
    return null; // Prevents SSR hydration mismatch and flicker
  }

  const userInitials = (() => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    if (user.firstName) return user.firstName.substring(0, 2).toUpperCase();
    if (user.email) return user.email.substring(0, 2).toUpperCase();
    return 'U';
  })();

  const userFullName = (() => {
    if (!user) return 'User Name';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return 'User Name';
  })();

  return (
    <AuthContext.Provider value={{ user, userInitials, userFullName, login, registerUser, changePassword, logout }}>
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
