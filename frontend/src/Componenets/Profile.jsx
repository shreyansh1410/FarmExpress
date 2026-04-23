import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const companyInitial = user?.name?.charAt(0)?.toUpperCase() || "C";

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-base-100 px-4 py-10 sm:px-6">
        <div className="glass-panel apple-glass apple-glass-hover mx-auto w-full max-w-lg rounded-2xl p-8 text-center transition-all duration-300">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
            !
          </div>
          <h2 className="text-2xl font-bold">You are not logged in</h2>
          <p className="mt-2 text-sm opacity-80">
              Please login to view your company profile.
          </p>
          <Link to="/login" className="btn btn-primary mt-6">
            Go to Login
          </Link>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-base-100 px-4 py-10 sm:px-6">
      <div className="glass-panel apple-glass mx-auto w-full max-w-3xl overflow-hidden rounded-2xl">
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-content text-xl font-bold">
              {companyInitial}
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">{user.name}</h1>
              <p className="text-sm opacity-80">Company Account</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-6 sm:px-8">
          <h2 className="text-lg font-semibold">Profile Details</h2>
          <div className="mt-5 grid gap-4">
            <div className="apple-glass apple-glass-hover rounded-xl p-4 transition-all duration-300">
              <p className="text-xs uppercase tracking-wide opacity-70">Company Name</p>
              <p className="mt-1 font-semibold">{user.name}</p>
            </div>
            <div className="apple-glass apple-glass-hover rounded-xl p-4 transition-all duration-300">
              <p className="text-xs uppercase tracking-wide opacity-70">Email</p>
              <p className="mt-1 font-semibold break-all">{user.emailId}</p>
            </div>
            <div className="apple-glass apple-glass-hover rounded-xl p-4 transition-all duration-300">
              <p className="text-xs uppercase tracking-wide opacity-70">Registration Number</p>
              <p className="mt-1 font-semibold">{user.registrationNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
