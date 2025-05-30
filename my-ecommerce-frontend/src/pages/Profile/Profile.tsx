import { useUserProfile } from "@/hooks";
import UserInfo from "./components/UserInfo";
import AddressList from "./components/AddressList";
import { useEffect } from "react";
import { UserInfoSkeleton } from "./components/SkeletonLoaders/UserInfoSkeleton";
import { AddressListSkeleton } from "./components/SkeletonLoaders/AddressListSkeleton";
import { OrderListSkeleton } from "./components/SkeletonLoaders/OrderListSkeleton";

const Profile = () => {
  const { user, fetchUserProfile, loading } = useUserProfile();
  // const { updateUserProfile } = useAuthStore();
  // const [user, setUserState] = useState<User | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  // const [isEditing, setIsEditing] = useState(false);
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  // });

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userData = await getCurrentUser();
  //       setUserState(userData);
  //       setFormData({
  //         name: userData.name,
  //         email: userData.email,
  //       });
  //     } catch (err) {
  //       setError("Failed to load profile data");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditUser = () => {};
  const handleEditAddress = () => {};
  const handleAddAddress = () => {};

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-4 space-y-8">
        <UserInfoSkeleton />
        <AddressListSkeleton />
        <OrderListSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-8">
      {user && (
        <>
          <UserInfo user={user} onEdit={handleEditUser} />
          <AddressList
            addresses={user.deliveryAddresses || []}
            onEditAddress={handleEditAddress}
            onAddAddress={handleAddAddress}
          />
          {/* <OrderList orders={user.orders || []} /> */}
        </>
      )}
    </div>
  );
};

export default Profile;
