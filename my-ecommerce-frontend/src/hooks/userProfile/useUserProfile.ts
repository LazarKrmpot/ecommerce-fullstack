import { User } from "@/models/user";
import { getCurrentUser } from "@/services/authService";
import { useState } from "react";

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      setUser(response);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, fetchUserProfile, loading, setUser };
};
