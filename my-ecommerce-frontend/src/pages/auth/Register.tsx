import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register({ ...formData });
      navigate("/profile");
      const user = await getCurrentUser();
      toast.success(`Welcome, ${user.name}!`);
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center bg-gray-100">
      <Card className="w-full gap-4 max-w-sm p-6 bg-white shadow-md rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="name">Name</Label>
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Button className="w-full cursor-pointer" type="submit">
                  Register
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
