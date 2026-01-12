import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

/**
 * Custom hook to manage Firebase authentication state and user profile.
 *
 * This hook eliminates duplicate authentication patterns across the app by providing:
 * - Current authenticated user
 * - User profile from Firestore
 * - Loading state during initial auth check
 *
 * @returns {Object} Authentication state object
 * @returns {Object|null} returns.user - The authenticated Firebase user or null
 * @returns {Object|null} returns.profile - User profile data from Firestore or null
 * @returns {boolean} returns.loading - True while checking authentication state
 *
 * @example
 * function MyComponent() {
 *   const { user, profile, loading } = useAuth();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (!user) return <div>Please log in</div>;
 *
 *   return <div>Welcome {profile?.username}</div>;
 * }
 */
export function useAuth() {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
				try {
					const userDoc = await getDoc(
						doc(db, "users", firebaseUser.uid)
					);
					if (userDoc.exists()) {
						setProfile(userDoc.data());
					} else {
						setProfile(null);
					}
				} catch (error) {
					console.error("Error fetching user profile:", error);
					setProfile(null);
				}
			} else {
				setUser(null);
				setProfile(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return { user, profile, loading };
}

/**
 * Simplified authentication hook that only tracks the current user.
 * Use this when you don't need the Firestore profile data.
 *
 * @returns {Object} Authentication state object
 * @returns {Object|null} returns.user - The authenticated Firebase user or null
 * @returns {boolean} returns.loading - True while checking authentication state
 *
 * @example
 * function SimpleComponent() {
 *   const { user, loading } = useAuthUser();
 *
 *   if (loading) return <div>Loading...</div>;
 *   return user ? <div>Logged in</div> : <div>Not logged in</div>;
 * }
 */
export function useAuthUser() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return { user, loading };
}
