import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Calendar, Award } from "lucide-react";
import { User as UserInterface, UserPut } from "@/models/user";
import { EditUserInfo } from "./EditUserInfo";
import { toast } from "sonner";
import { updateProfile } from "@/services/authService";

interface UserInfoProps {
  user: UserInterface;
  setUser: (user: UserInterface) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, setUser }) => {
  const { name, email, role, createdAt, updatedAt } = user;

  const onEditUserInfo = async (userInfo: UserPut) => {
    try {
      const updatedUser = await updateProfile(userInfo);
      setUser(updatedUser);
      toast.success("User info updated successfully!");
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Failed to update user info. Please try again.");
    }
  };

  return (
    <Card className="mb-5 overflow-hidden pt-0 gap-3">
      <div className="h-24 bg-gradient-to-r from-slate-700 to-slate-900"></div>

      <div className="relative px-6">
        <div className="absolute -top-15 flex items-center justify-center w-24 h-24 bg-white rounded-full border-4 border-white shadow-md">
          <div className="flex items-center justify-center w-full h-full bg-slate-100 rounded-full">
            <User className="h-12 w-12 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="mt-10 px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
          <p className="text-slate-500 text-left italic">{role}</p>
        </div>

        <EditUserInfo user={user} onEditUserInfo={onEditUserInfo} />
      </div>
      <CardContent className="grid text-left grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500">
            Account Information
          </h3>

          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="text-slate-900">{email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Award className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-500">Role</p>
              <p className="text-slate-900 capitalize">{role}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500">Account Dates</h3>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-500">Member Since</p>
              <p className="text-slate-900">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-500">Last Updated</p>
              <p className="text-slate-900">
                {new Date(updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
