import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  updateProfile,
  updateEmail,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
} from "firebase/firestore";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Update Firebase Auth user profile
      await updateProfile(user, {
        displayName,
      });

      // Update email if changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Save profile to Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        displayName,
        email,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 shadow-md border rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Update Profile</h2>

      <div className="mb-4">
        <label className="block mb-1">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default Profile;
