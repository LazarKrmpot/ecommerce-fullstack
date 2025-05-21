import api from "./api";
import axios from "axios";

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface UpdateProfileData {
  name: string;
  email: string;
}

export const login = async (email: string, password: string) => {
  try {
    // First, get the token from login
    const { data: loginData } = await api.post("/auth/login", {
      email,
      password,
    });
    console.log("Login response:", loginData);

    if (!loginData.token.token) {
      throw new Error("No token received from server");
    }

    // Store the token
    localStorage.setItem("token", loginData.token.token);

    // Then, get the user data using the token
    const { data: userData } = await api.get("/auth/me");
    console.log("User data response:", userData);

    if (!userData.data) {
      throw new Error("No user data received from server");
    }

    const response: LoginResponse = {
      token: loginData.token.token,
      user: {
        _id: userData.data._id,
        name: userData.data.name,
        email: userData.data.email,
        role: userData.data.role,
      },
    };

    return response;
  } catch (error) {
    console.error("Login error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw error;
  }
};

export const register = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const { data: registerData } = await api.post("/auth/register", {
      email,
      password,
      name,
    });

    console.log("Register response:", registerData);
    if (!registerData.token) {
      throw new Error("No token received from server");
    }
    // Store the token
    localStorage.setItem("token", registerData.token);
    // Then, get the user data using the token
    const { data: userData } = await api.get("/auth/me");
    console.log("User data response:", userData);
    if (!userData.data) {
      throw new Error("No user data received from server");
    }
    const response: LoginResponse = {
      token: registerData.token,
      user: {
        _id: userData.data._id,
        name: userData.data.name,
        email: userData.data.email,
        role: userData.data.role,
      },
    };
    return response;
  } catch (error) {
    console.error("Register error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/auth/me");
    return data.data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

export const updateProfile = async (profileData: UpdateProfileData) => {
  try {
    // First update the profile
    await api.put("/auth/me", profileData);

    // Then fetch the updated user data
    const { data } = await api.get("/auth/me");
    return data.data;
  } catch (error) {
    console.error("Update profile error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  // Optionally, you can also clear user data from the state management library (like Redux or Context API)
};
