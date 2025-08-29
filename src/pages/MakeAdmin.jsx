import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

export default function MakeAdmin({ user, profile }) {
    const { username } = useParams();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // State for success/error messages
    const [error, setError] = useState("");

    useEffect(() => {
        if (profile?.writer) {
            if (username === profile.username) {
                setError("You cannot change your own admin status.");
            }
        } else {
            setError("You are not authorized to make admin changes.");
        }
    }, [profile, username]);
    const handleMakeAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");
        try {
            // Fetch user by username
            const usersRef = doc(db, "users");
            const userQuery = await getDoc(usersRef);
            let targetUser = null;
            userQuery.forEach((doc) => {
                if (doc.data().username === username) {
                    targetUser = { id: doc.id, ...doc.data() };
                }
            });

            if (!targetUser) {
                setError("User not found.");
                setLoading(false);
                return;
            }
            // Update writer status
            await updateDoc(doc(db, "users", targetUser.id), {
                writer: true
            });
            setMessage(`User ${username} has been granted admin rights.`);
        } catch (err) {
            setError("Error updating user: " + err.message);
        }
        setLoading(false);
    };
    return (
        <div>
            <h2>Make User Admin</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            <form onSubmit={handleMakeAdmin}>
                <button type="submit" disabled={loading || error}>
                    {loading ? "Processing..." : `Make ${username} Admin`}
                </button>
            </form>
        </div>
    );
}