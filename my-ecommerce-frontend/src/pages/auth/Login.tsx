import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/authService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuthStore();

  // Get the return URL from location state or default to home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // Redirect to the page the user was trying to access
      navigate(from, { replace: true });
      const user = await getCurrentUser();
      toast.success(`Welcome back, ${user.name}!`);
    } catch (err) {
      console.error("Login error in component:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center bg-gray-100">
      <Card className="w-full gap-4 max-w-sm p-6 bg-white shadow-md rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-1" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      state={{ from: location }}
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Button
                  className="w-full cursor-pointer"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
