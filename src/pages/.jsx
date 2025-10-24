import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Camera, X, Edit3 } from "lucide-react";

export default function ProfileCard() {
  const mockUser = {
    id: 1,
    name: "Sita Devi",
    email: "sita@example.com",
    avatar: "https://i.pravatar.cc/150?img=47",
    currentPassword: "secret123",
  };

  const [user, setUser] = useState(mockUser);
  const [inputs, setInputs] = useState({
    name: user.name,
    email: user.email,
    current: "",
    newPass: "",
    confirm: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [message, setMessage] = useState(null);
  const fileRef = useRef(null);

  const card = "bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow";
  const inputBase = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200";

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  function removeAvatar() {
    setAvatarPreview("https://i.pravatar.cc/150?img=65");
    if (fileRef.current) fileRef.current.value = null;
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleSaveAll(e) {
    e.preventDefault();

    if (!inputs.name.trim()) {
      setMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputs.email)) {
      setMessage({ type: "error", text: "Invalid email format." });
      return;
    }

    if (inputs.current !== user.currentPassword) {
      setMessage({ type: "error", text: "Current password is incorrect." });
      return;
    }

    if (inputs.newPass.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    if (inputs.newPass !== inputs.confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setUser({
      ...user,
      name: inputs.name.trim(),
      email: inputs.email,
      currentPassword: inputs.newPass,
      avatar: avatarPreview,
    });

    setInputs({ ...inputs, current: "", newPass: "", confirm: "" });
    setMessage({ type: "success", text: "Profile updated successfully (mock)." });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`max-w-3xl w-full ${card} p-6`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile</h2>
        <p className="text-sm text-gray-600 mb-6">Update your avatar, name, email and password</p>

        <form onSubmit={handleSaveAll} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Avatar */}
          <div className="col-span-1 flex flex-col items-center gap-3 p-4">
            <div className="relative">
              <img src={avatarPreview} alt="avatar" className="w-36 h-36 rounded-full object-cover border-2 border-gray-100 shadow-sm" />
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 bg-white rounded-full p-1 shadow-sm hover:scale-105"
                title="Remove avatar"
              >
                <X size={16} />
              </button>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Camera size={16} />
              <span className="text-sm text-gray-700">Change avatar</span>
              <input ref={fileRef} onChange={handleAvatarChange} type="file" accept="image/*" className="hidden" />
            </label>
            <p className="text-xs text-gray-500 text-center">Mock upload preview only</p>
          </div>

          {/* Inputs */}
          <div className="md:col-span-2 space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <User className="text-indigo-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">Member ID: #{user.id}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="name" value={inputs.name} onChange={handleInputChange} placeholder="Full Name" className={inputBase} />
              <input name="email" value={inputs.email} onChange={handleInputChange} placeholder="Email" className={inputBase} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <input
                type="password"
                name="current"
                placeholder="Current Password"
                value={inputs.current}
                onChange={handleInputChange}
                className={inputBase}
              />
              <input
                type="password"
                name="newPass"
                placeholder="New Password"
                value={inputs.newPass}
                onChange={handleInputChange}
                className={inputBase}
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm New Password"
                value={inputs.confirm}
                onChange={handleInputChange}
                className={inputBase}
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Save All Changes</button>
              <button
                type="button"
                onClick={() => {
                  setInputs({ name: user.name, email: user.email, current: "", newPass: "", confirm: "" });
                  setAvatarPreview(user.avatar);
                  setMessage(null);
                }}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Reset
              </button>
            </div>

            {message && (
              <div className={`mt-2 px-3 py-2 rounded-md text-sm ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
                {message.text}
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}