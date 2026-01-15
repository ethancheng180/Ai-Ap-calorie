import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    serverTimestamp,
    where,
    Timestamp
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

/**
 * Get today's totals (calories, protein, carbs, fats).
 * @param {string} userId - The authenticated user's UID.
 * @returns {Promise<object>} - { calories, protein, carbs, fats }
 */
export async function getTodayStats(userId) {
    const foodLogRef = collection(db, 'users', userId, 'foodLog');

    // Get start of today
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startTimestamp = Timestamp.fromDate(startOfDay);

    const q = query(
        foodLogRef,
        where('createdAt', '>=', startTimestamp),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        calories += data.calories || 0;
        if (data.macros) {
            protein += data.macros.protein || 0;
            carbs += data.macros.carbs || 0;
            fats += data.macros.fats || 0;
        }
    });

    return { calories, protein, carbs, fats, mealCount: snapshot.docs.length };
}

/**
 * Get aggregated chart data for a given timeframe.
 * @param {string} userId - The authenticated user's UID.
 * @param {string} timeframe - 'daily', 'weekly', 'monthly', 'yearly'
 * @returns {Promise<Array>} - Chart data array
 */
export async function getChartData(userId, timeframe) {
    const foodLogRef = collection(db, 'users', userId, 'foodLog');

    const now = new Date();
    let startDate;

    switch (timeframe) {
        case 'daily':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'weekly':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
            break;
        case 'monthly':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 30);
            break;
        case 'yearly':
            startDate = new Date(now);
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        default:
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const startTimestamp = Timestamp.fromDate(startDate);

    const q = query(
        foodLogRef,
        where('createdAt', '>=', startTimestamp),
        orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);

    // Group by time period
    const grouped = {};

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate() || new Date();
        let key;

        switch (timeframe) {
            case 'daily':
                key = date.getHours() + ':00';
                break;
            case 'weekly':
                key = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
                break;
            case 'monthly':
                key = date.getDate().toString();
                break;
            case 'yearly':
                key = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
                break;
            default:
                key = date.toDateString();
        }

        if (!grouped[key]) {
            grouped[key] = 0;
        }
        grouped[key] += data.calories || 0;
    });

    // Convert to array format for Recharts
    return Object.entries(grouped).map(([name, calories]) => ({ name, calories }));
}
