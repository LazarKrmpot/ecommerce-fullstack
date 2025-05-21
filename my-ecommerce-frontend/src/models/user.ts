export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface UserResponse {
  data: User[];
  meta: {
    page: 0;
    limit: 0;
    total: 0;
  };
}

export interface UpdateUserPayload {
  _id: string;
  name?: string;
  email?: string;
}
