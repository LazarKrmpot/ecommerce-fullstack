import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  getCurrentUser,
  updateProfile,
} from "../services/authService";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { name: string; email: string }) => Promise<void>;
  checkAuth: () => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const data = await authLogin(email, password);
          set({ user: data.user, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            loading: false,
          });
          throw error;
        }
      },
      logout: async () => {
        set({ loading: true });
        try {
          authLogout();
          set({ user: null, loading: false });
          window.location.reload();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Logout failed",
            loading: false,
          });
          throw error;
        }
      },
      register: async ({ email, password, name }) => {
        set({ loading: true, error: null });
        try {
          const user = await authRegister(email, password, name);
          const { user: registeredUser } = user;
          set({ user: registeredUser, loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
            loading: false,
          });
          throw error;
        }
      },
      updateUserProfile: async (data) => {
        set({ loading: true });
        try {
          const updatedUser = await updateProfile(data);
          set({ user: updatedUser, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Update failed",
            loading: false,
          });
          throw error;
        }
      },
      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ user: null, loading: false });
          return;
        }

        set({ loading: true });
        try {
          const user = await getCurrentUser();
          set({ user, loading: false });
        } catch (error) {
          // Only remove token and user if it's an authentication error
          if (error instanceof Error && error.message.includes("401")) {
            localStorage.removeItem("token");
            set({ user: null, loading: false });
          } else {
            // For other errors, just set loading to false
            set({ loading: false });
          }
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
