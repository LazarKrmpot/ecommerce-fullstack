import { UpdateUserPayload, UserResponse } from "../models/user";
import api from "./api";

export const getAllUsers = async (
  page = 1,
  limit = 20
): Promise<UserResponse> => {
  try {
    const { data } = await api.get("/users", {
      params: { page, limit },
    });
    return { data: data.data, meta: data.meta };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUser = async (id: string, user: UpdateUserPayload) => {
  try {
    const { data } = await api.put(`/users/${id}`, user);
    return data.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
