"use client";

import React from "react";
import NormalUserLayout from "@/components/users/layout";
import UserSearchResultList from "@/components/users/User-Search-Result-List";

const UserSearchResultPage = () => {
  return (
    <NormalUserLayout title="Search Results">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Property Search Results</h1>
        <UserSearchResultList />
      </div>
    </NormalUserLayout>
  );
};

export default UserSearchResultPage;
