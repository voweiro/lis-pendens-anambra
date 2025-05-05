"use client";

import React from "react";
import NormalUserLayout from "@/components/users/layout";
import UserSearchDetailView from "@/components/users/User-Search-Detail-View";

const UserSearchDetailViewPage = () => {
  return (
    <NormalUserLayout title="Search Detail">
      <div className="max-w-4xl mx-auto">
        <UserSearchDetailView />
      </div>
    </NormalUserLayout>
  );
};

export default UserSearchDetailViewPage;