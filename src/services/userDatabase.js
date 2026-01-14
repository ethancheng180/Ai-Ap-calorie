import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function createUserProfile(user, additionalData = {}) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const { email, displayName, photoURL } = user;
        const createdAt = serverTimestamp();

        try {
            await setDoc(userRef, {
                uid: user.uid,
                email,
                displayName: displayName || '',
                photoURL: photoURL || '',
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user profile", error);
        }
    }
}
