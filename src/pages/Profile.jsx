import React from "react";
import UserProfile from "../components/UserProfile";

export default function Profile() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-4">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
}
