import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { getCurrentUser } from "../services/authService";
import {
  Loader2,
  AlertCircle,
  PenSquare,
  UserCircle,
  Mail,
  Shield,
  Package,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const Profile = () => {
  const { updateUserProfile } = useAuthStore();
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUserState(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
        });
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PenSquare className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Profile Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your personal account details
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <UserCircle className="h-4 w-4" />
                    <span className="text-sm">Name</span>
                  </div>
                  <p className="font-medium text-left text-gray-900">
                    {user?.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="font-medium text-left text-gray-900">
                    {user?.email}
                  </p>
                </div>
                <div className="space-y-2 flex justify-start flex-col">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Role</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <p className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Order History
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View your recent orders and their status
              </p>
            </div>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <div className="h-[300px] overflow-y-auto pr-4">
                <div className="text-center text-gray-500 py-8">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No orders yet</p>
                  <p className="text-sm">Your order history will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
