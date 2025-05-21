import { UserResponse } from "@/models/user";
import { getAllUsers } from "@/services/userService";
import { useState } from "react";
import { toast } from "sonner";

export const useUsersData = () => {
  const [users, setUsers] = useState<UserResponse>({
    data: [],
    meta: {
      page: 0,
      limit: 0,
      total: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return { users, fetchUsers, setUsers, loading };
};
