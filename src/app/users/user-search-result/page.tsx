"use client";

import React from "react";
import NormalUserLayout from "@/components/users/layout";
import UserSearchResultList from "@/components/users/User-Search-Result-List";

const UserSearchResultPage = () => {
  return (
    <NormalUserLayout title="Search Results">
      <div className="w-[90%] mx-auto mt-8 mb-8">
        <h1 className="text-2xl font-bold mb-6">Your Property Search Results</h1>
        <h2 className="text-[18px] font-extrabold">Note you can only view and download only one search result of your choice which can be found in the search history.</h2>
        <br />
        <UserSearchResultList />
      </div>
    </NormalUserLayout>
  );
};

export default UserSearchResultPage;
