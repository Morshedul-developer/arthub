"use client";

import { use, useEffect, useState } from "react";
import { api } from "../../../../lib/api";
import ImageUpload from "../../../../components/ImageUpload";

export default function ProfilePage({ params }) {
  const { role } = use(params);
  const [profileForm, setProfileForm] = useState({ name: "", avatarUrl: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/profile/me")
      .then((u) => setProfileForm({ name: u.name || "", avatarUrl: u.avatarUrl || "" }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setProfileMsg("");
    try {
      await api("/profile/me", { method: "PATCH", body: JSON.stringify(profileForm) });
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileMsg(err.message);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwMsg("");
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwMsg("New passwords do not match.");
    try {
      const res = await api("/profile/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      });
      setPwMsg(res.message);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwMsg(err.message);
    }
  }

  if (loading) return <div className="card h-48 animate-pulse" />;

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-black">Edit Profile</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="card p-5">
          <h2 className="text-lg font-black">Personal Info</h2>
          {profileMsg && <p className="mt-2 text-sm font-semibold text-emerald-700">{profileMsg}</p>}
          <div className="mt-4 grid gap-3">
            <input className="field" placeholder="Display name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
            <label className="text-sm font-semibold text-stone-600">Avatar</label>
            <ImageUpload value={profileForm.avatarUrl} onChange={(url) => setProfileForm({ ...profileForm, avatarUrl: url })} label="Avatar" aspectRatio="aspect-square" />
            <button className="btn btn-dark mt-1">Save Profile</button>
          </div>
        </form>

        <form onSubmit={changePassword} className="card p-5">
          <h2 className="text-lg font-black">Change Password</h2>
          {pwMsg && <p className="mt-2 text-sm font-semibold text-emerald-700">{pwMsg}</p>}
          <div className="mt-4 grid gap-3">
            <input className="field" type="password" placeholder="Current password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
            <input className="field" type="password" placeholder="New password (min 8 chars)" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
            <input className="field" type="password" placeholder="Confirm new password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required />
            <button className="btn btn-dark">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}
