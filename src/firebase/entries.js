/**
 * Firebase / Firestore service for giveaway entries.
 *
 * Collection: "entries"
 * Each document holds one applicant's submission.
 */
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseClient';

const COLLECTION = 'entries';
const entriesRef = () => collection(db, COLLECTION);

// ─── Submit a new giveaway entry ────────────────────────────────────────────
export async function submitEntry(data) {
    const {
        fullName,
        email,
        country = '',
        favoriteSong = '',
        reasonForLiking = '',
        payoutMethod,
        payoutDetails = {},
        tasks = {},
    } = data;

    const docRef = await addDoc(entriesRef(), {
        fullName,
        email,
        country,
        favoriteSong,
        reasonForLiking,
        payoutMethod,
        payoutDetails,
        tasks: {
            instagramFollowed: tasks.instagramFollowed || false,
            facebookFollowed:  tasks.facebookFollowed  || false,
            tiktokFollowed:    tasks.tiktokFollowed    || false,
            youtubeSubscribed: tasks.youtubeSubscribed || false,
        },
        status: 'pending',
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}

// ─── Fetch all entries (one-time) ────────────────────────────────────────────
export async function fetchAllEntries() {
    const q = query(entriesRef(), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Real-time listener for admin dashboard ───────────────────────────────
export function subscribeToEntries(callback) {
    const q = query(entriesRef(), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        const entries = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(entries);
    });
}

// ─── Approve / Reject an entry ────────────────────────────────────────────
export async function updateEntryStatus(entryId, status) {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
        throw new Error('Invalid status');
    }
    await updateDoc(doc(db, COLLECTION, entryId), { status });
}
