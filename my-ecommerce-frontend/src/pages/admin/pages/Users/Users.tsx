import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsersData } from "@/hooks";
import { useEffect } from "react";
import { EditUserForm } from "./components/EditUserForm";
import { UpdateUserPayload } from "@/models/user";
import DeleteUser from "./components/DeleteUser";
import { toast } from "sonner";
import { deleteUser, updateUser } from "@/services/userService";

export const Users = () => {
  const { users, fetchUsers, setUsers, loading } = useUsersData();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (
    updatedUser: UpdateUserPayload
  ): Promise<void> => {
    const userId = updatedUser._id;
    if (!userId) {
      toast.error("User ID is required");
      return;
    }
    try {
      const savedUser = await updateUser(userId, updatedUser);
      setUsers((prev) => ({
        ...prev,
        data: prev.data.map((user) =>
          user._id === userId ? { ...user, ...savedUser } : user
        ),
      }));
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Error updating user");
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const userId = id;
    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    try {
      await deleteUser(userId);
      setUsers((prev) => ({
        ...prev,
        data: prev.data.filter((user) => user._id !== userId),
      }));
      toast.warning("User deleted successfully");
    } catch (error) {
      toast.error("Error deleting user");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.data?.length > 0 ? (
                users.data.map((user) => (
                  <TableRow className="text-left" key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right gap-2 flex justify-end">
                      <EditUserForm user={user} onSave={handleUpdateUser} />
                      <DeleteUser id={user._id} onDelete={handleDeleteUser} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
