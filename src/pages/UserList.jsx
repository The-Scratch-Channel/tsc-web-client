import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function UserList() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		onAuthStateChanged(auth, (u) => {
			setUser(u);
		});
	}, []);

	useEffect(() => {
		async function fetchUsers() {
			const snapshot = await getDocs(collection(db, "users"));
			const userList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setUsers(userList);
			setLoading(false);
		}
		fetchUsers();
	}, []);

	const handleBan = async (userId) => {
		if (!window.confirm("Are you sure you want to ban this user?")) return;
		await updateDoc(doc(db, "users", userId), { banned: true });
		setUsers((prev) =>
			prev.map((u) => (u.id === userId ? { ...u, banned: true } : u))
		);
	};

	if (loading) return <p>Loading...</p>;
	return (
		<div>
			<h2>User List</h2>
			<table>
				<thead>
					<tr>
						<th>Username</th>
						<th>Email</th>
						<th>Admin</th>
						<th>Banned</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map((u) => (
						<tr key={u.id}>
							<td>{u.username}</td>
							<td>{u.email}</td>
							<td>{u.writer ? "Yes" : "No"}</td>
							<td>{u.banned ? "Yes" : "No"}</td>
							<td>
								{user && user.uid !== u.id && (
									<>
										<Link
											to={`/users/${u.username}/admin/create`}
										>
											Make Admin
										</Link>
										{!u.banned && (
											<button
												style={{ marginLeft: 8 }}
												onClick={() => handleBan(u.id)}
											>
												Ban
											</button>
										)}
									</>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
