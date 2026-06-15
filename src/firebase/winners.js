import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseClient';

const COLLECTION = 'winners';

const winnersRef = () => collection(db, COLLECTION);

export async function addWinner({ giveawayId, name, prize, giveawayTitle, date = new Date() }) {
    if (!giveawayId) throw new Error('giveawayId is required');
    if (!name) throw new Error('name is required');

    const docRef = await addDoc(winnersRef(), {
        giveawayId,
        name,
        prize: prize ?? '',
        giveawayTitle: giveawayTitle ?? '',
        date,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}

export function subscribeToWinners(callback) {
    // Most recent first
    const q = query(winnersRef(), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        const winners = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(winners);
    });
}

export function subscribeToWinnersByGiveaway(giveawayId, callback) {
    const q = query(
        winnersRef(),
        where('giveawayId', '==', giveawayId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snap) => {
        const winners = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(winners);
    });
}

