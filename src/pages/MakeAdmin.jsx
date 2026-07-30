import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
	collection,
	query,
	where,
	getDocs,
	updateDoc,
} from "firebase/firestore";

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
			const usersRef = collection(db, "users");
			const q = query(usersRef, where("username", "==", username));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				setError("User not found.");
				setLoading(false);
				return;
			}

			const targetDoc = querySnapshot.docs[0];

			await updateDoc(targetDoc.ref, { writer: true });

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
