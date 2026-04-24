import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser, removeUser } from "../utils/userSlice";
import { Pencil } from "lucide-react";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companyInitial = user?.name?.charAt(0)?.toUpperCase() || "C";
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [address, setAddress] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setPhotoUrl(user.photoUrl || "");
    setAddress(user.address || "");
  }, [user]);

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

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: name.trim(),
        address: address.trim(),
      };

      const res = await axios.put(BASE_URL + "/profile/edit", payload, {
        withCredentials: true,
      });

      dispatch(addUser(res.data?.data || user));
      setMessage(res.data?.message || "Profile updated successfully.");
      setIsEditingName(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to update profile.";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) {
      setError("Please choose an image file first.");
      return;
    }

    try {
      setUploadingPhoto(true);
      setError("");
      setMessage("");
      const formData = new FormData();
      formData.append("photo", photoFile);

      const res = await axios.post(BASE_URL + "/profile/upload-photo", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data?.data || user;
      dispatch(addUser(updatedUser));
      setPhotoUrl(updatedUser.photoUrl || "");
      setPhotoFile(null);
      setMessage(res.data?.message || "Profile photo uploaded successfully.");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to upload profile photo.";
      setError(errorMessage);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeleteAccount = async () => {
    const typedConfirmation = window.prompt(
      'Type "delete" to permanently delete your account.'
    );
    if (!typedConfirmation) return;
    if (typedConfirmation.trim().toLowerCase() !== "delete") {
      setError('Account deletion cancelled. Please type "delete" exactly.');
      return;
    }

    try {
      setDeletingAccount(true);
      setError("");
      setMessage("");
      await axios.delete(BASE_URL + "/profile/delete", {
        withCredentials: true,
      });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to delete account.";
      setError(errorMessage);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-base-100 px-4 py-10 sm:px-6">
      <div className="glass-panel apple-glass mx-auto w-full max-w-3xl overflow-hidden rounded-2xl">
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary text-primary-content text-xl font-bold overflow-hidden flex items-center justify-center">
              {photoUrl ? (
                <img src={photoUrl} alt="Company profile" className="h-full w-full object-cover" />
              ) : (
                companyInitial
              )}
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
              <div className="relative mt-2">
                <input
                  type="text"
                  className="input input-bordered w-full pr-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly={!isEditingName}
                  placeholder="Company Name"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-base-content/70 hover:text-base-content"
                  onClick={() => setIsEditingName((value) => !value)}
                  title={isEditingName ? "Lock company name field" : "Edit company name"}
                  aria-label={isEditingName ? "Lock company name field" : "Edit company name"}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="apple-glass apple-glass-hover rounded-xl p-4 transition-all duration-300">
              <p className="text-xs uppercase tracking-wide opacity-70">Email</p>
              <p className="mt-1 font-semibold break-all">{user.emailId}</p>
            </div>
            <div className="apple-glass apple-glass-hover rounded-xl p-4 transition-all duration-300">
              <p className="text-xs uppercase tracking-wide opacity-70">Registration Number</p>
              <p className="mt-1 font-semibold">{user.registrationNumber}</p>
            </div>
            <div className="apple-glass apple-glass-hover rounded-xl p-4 transition-all duration-300">
              <p className="text-xs uppercase tracking-wide opacity-70">Upload Profile Picture</p>
              <input
                type="file"
                accept="image/*"
                className="input input-bordered w-full mt-2"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
              <button
                className="btn btn-outline btn-sm mt-3"
                onClick={handleUploadPhoto}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
            <div className="apple-glass apple-glass-hover rounded-xl p-4 transition-all duration-300">
              <p className="text-xs uppercase tracking-wide opacity-70">Address</p>
              <textarea
                className="textarea textarea-bordered w-full mt-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Company Address"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              className="btn btn-primary"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            <button
              className="btn btn-error btn-outline ml-3"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? "Deleting..." : "Delete Account"}
            </button>
            {message && <p className="text-success text-sm mt-3">{message}</p>}
            {error && <p className="text-error text-sm mt-3">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
