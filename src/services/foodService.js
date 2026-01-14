import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';

/**
 * Save a food entry to the user's food log in Firestore.
 * @param {string} userId - The authenticated user's UID.
 * @param {object} entry - The food entry object { foodName, calories, macros, description, imageDataUrl }.
 * @returns {Promise<string>} - The ID of the newly created document.
 */
export async function saveFoodEntry(userId, entry) {
    const foodLogRef = collection(db, 'users', userId, 'foodLog');
    const docRef = await addDoc(foodLogRef, {
        ...entry,
        createdAt: serverTimestamp()
    });
    return docRef.id;
}

/**
 * Fetch the user's food history, ordered by most recent first.
 * @param {string} userId - The authenticated user's UID.
 * @returns {Promise<Array>} - Array of food entry objects with IDs.
 */
export async function getFoodHistory(userId) {
    const foodLogRef = collection(db, 'users', userId, 'foodLog');
    const q = query(foodLogRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
