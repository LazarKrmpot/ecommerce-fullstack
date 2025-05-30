import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Calendar, Award, Edit } from "lucide-react";
import { User as UserInterface } from "@/models/user";

interface UserInfoProps {
  user: UserInterface;
  onEdit: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, onEdit }) => {
  const { name, email, role, createdAt, updatedAt } = user;

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

        <button
          onClick={onEdit}
          className="flex items-center text-sm font-medium text-slate-700 hover:text-red-600 transition-colors group"
        >
          <Edit className="h-5 w-5 mr-2 group-hover:text-red-600 transition-colors" />
          <span className="hidden sm:block">Edit Profile</span>
        </button>
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
