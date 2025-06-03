import { useUserAddress, useUserProfile } from "@/hooks";
import UserInfo from "./components/UserInfo/UserInfo";
import AddressList from "./components/Address/AddressList";
import { useEffect } from "react";
import { UserInfoSkeleton } from "./components/SkeletonLoaders/UserInfoSkeleton";
import { AddressListSkeleton } from "./components/SkeletonLoaders/AddressListSkeleton";
import { OrderListSkeleton } from "./components/SkeletonLoaders/OrderListSkeleton";

const Profile = () => {
  const { user, fetchUserProfile, setUser, loading } = useUserProfile();
  const { createAddress, updateAddress, deleteAddress, setPrimaryAddress } =
    useUserAddress();

  useEffect(() => {
    fetchUserProfile();
  }, []);

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
          <UserInfo user={user} setUser={setUser} />
          <AddressList
            addresses={user.deliveryAddresses || []}
            createAddress={createAddress}
            updateAddress={updateAddress}
            deleteAddress={deleteAddress}
            setPrimaryAddress={setPrimaryAddress}
          />
          {/* <OrderList orders={user.orders || []} /> */}
        </>
      )}
    </div>
  );
};

export default Profile;
