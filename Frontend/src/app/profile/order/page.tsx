// app/profile/order/page.tsx
import React from "react";
import ProfileOrdersClient from "./OrderClient";

const ProfileOrdersPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <ProfileOrdersClient />
    </div>
  );
};

export default ProfileOrdersPage;
