import { ResponsiveDialog } from "@/components/ResponsiveDialog/ResponsiveDialog";
import { UserPut } from "@/models/user";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/SubmitButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface EditUserInfoProps {
  onEditUserInfo: (userInfo: UserPut) => Promise<void>;
  user: UserPut;
}

export const EditUserInfo = ({ onEditUserInfo, user }: EditUserInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<UserPut>({
    name: user.name,
    email: user.email,
  });
  const [isLoading, setIsLoading] = useState(false);
  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onEditUserInfo(formData);
    } catch (error) {
      console.error("Error updating user info:", error);
    } finally {
      setIsLoading(false);
      toggleDialog();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const isUnchanged =
    formData.name === user.name && formData.email === user.email;

  const trigger = isMobile ? (
    <button className="flex justify-center items-center text-sm h-10 w-10 outline-1 rounded-full duration-200 font-medium text-slate-700 hover:text-red-600 hover:outline-red-600 transition-colors group">
      <Edit className="h-5 w-5 group-hover:text-red-600 transition-colors" />
    </button>
  ) : (
    <button className="flex items-center text-sm duration-200 font-medium text-slate-700 hover:text-red-600 transition-colors group">
      <Edit className="h-5 w-5 mr-2 group-hover:text-red-600 transition-colors" />
      <span className="hidden sm:block">Edit Profile</span>
    </button>
  );
  return (
    <ResponsiveDialog
      handleOpenDialog={toggleDialog}
      isOpen={isOpen}
      title="Edit Profile"
      description="Update your profile information"
      customTrigger={trigger}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <SubmitButton
          label="Save Changes"
          isLoading={isLoading}
          disabled={isUnchanged}
          customClassName="w-full md:w-fit inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      </form>
    </ResponsiveDialog>
  );
};
