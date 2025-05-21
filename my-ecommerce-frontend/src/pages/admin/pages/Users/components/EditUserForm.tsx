import { UpdateUserPayload, User } from "@/models/user";
import { useState } from "react";
import { ResponsiveForm } from "@/components/ResponsiveForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Save } from "lucide-react";

interface EditUserFormProps {
  user: User;
  onSave: (updatedUser: UpdateUserPayload) => Promise<void>;
}

interface UpdateUserForm {
  name: string;
  email: string;
  role: "user" | "admin";
}

export const EditUserForm = ({ user, onSave }: EditUserFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const initialValues: UpdateUserForm = {
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const [formData, setFormData] = useState<UpdateUserForm>(initialValues);

  const hasChanges = () => {
    return Object.keys(initialValues).some(
      (key) =>
        initialValues[key as keyof UpdateUserForm] !==
        formData[key as keyof UpdateUserForm]
    );
  };

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser: UpdateUserPayload = {
        _id: user._id,
        name: formData.name,
        email: formData.email,
      };
      await onSave(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
      toggleDialog();
    }
  };

  const cancelEdit = () => {
    setFormData(initialValues);
    toggleDialog();
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEmptyField = (field: string) => {
    return field.trim() === "";
  };

  const isValidForm = () => {
    return (
      !isEmptyField(formData.name) &&
      !isEmptyField(formData.email) &&
      isValidEmail(formData.email)
    );
  };

  return (
    <ResponsiveForm
      handleOpenDialog={toggleDialog}
      isOpen={isOpen}
      title="Edit User"
      description="Edit user details"
      classNames="w-80"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter user name"
              value={formData.name}
              onChange={handleTextChange}
              className="transition-all duration-200"
              required
            />
            {isEmptyField(formData.name) && (
              <div className="flex items-center ml-1 space-x-2">
                <span className="text-red-500 text-xs">Name is required</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter user email"
                type="email"
                value={formData.email}
                onChange={handleTextChange}
                className="transition-all duration-200"
                required
              />
            </div>
            {!isValidEmail(formData.email) && (
              <div className="flex items-center ml-1 space-x-2">
                <span className="text-red-500 text-xs">
                  Invalid email format
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={cancelEdit}
            className={cn(
              "transition-all duration-200",
              isLoading && "opacity-50"
            )}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !hasChanges() || !isValidForm()}
            className={cn(
              "transition-all duration-200",
              (isLoading || !hasChanges()) && "opacity-50"
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </form>
    </ResponsiveForm>
  );
};
