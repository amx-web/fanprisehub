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
    where,
    getDoc,
    runTransaction,
} from 'firebase/firestore';
import { db } from '../firebaseClient';

const COLLECTION = 'entries';
const entriesRef = () => collection(db, COLLECTION);

// ─── Submit a new giveaway entry + safely increment participants ─────
// Prevent duplicates by: email + giveawayId
export async function submitEntry(data) {
    const {
        giveawayId,
        fullName,
        email,
        country = '',
        payoutMethod = 'none',
        payoutDetails = {},
        tasks = {},
        referralCode = null, // incoming referral code from URL
    } = data;

    if (!giveawayId) throw new Error('submitEntry: giveawayId is required');
    if (!email) throw new Error('submitEntry: email is required');

    // Duplicate prevention
    const q = query(entriesRef(), where('email', '==', email), where('giveawayId', '==', giveawayId));
    const existing = await getDocs(q);
    if (!existing.empty) {
        return { id: existing.docs[0].id, created: false };
    }

    // Generate unique referral code for this entry
    const newReferralCode = `ref_${giveawayId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create entry
    const docRef = await addDoc(entriesRef(), {
        giveawayId,
        fullName,
        email,
        country,
        payoutMethod,
        payoutDetails,
        tasks: {
            instagramFollowed: tasks.instagramFollowed || false,
            facebookFollowed: tasks.facebookFollowed || false,
            tiktokFollowed: tasks.tiktokFollowed || false,
            youtubeSubscribed: tasks.youtubeSubscribed || false,
        },
        status: 'pending',
        referralCode: newReferralCode,
        referredBy: referralCode || null, // Track who referred this user
        referralCount: 0, // Will be updated when others use this code
        createdAt: serverTimestamp(),
    });

    // If this entry came from a referral, increment the referrer's count
    if (referralCode) {
        const referrerQuery = query(entriesRef(), where('referralCode', '==', referralCode), where('giveawayId', '==', giveawayId));
        const referrerSnap = await getDocs(referrerQuery);
        if (!referrerSnap.empty) {
            const referrerDoc = referrerSnap.docs[0];
            await updateDoc(referrerDoc.ref, {
                referralCount: (referrerDoc.data().referralCount || 0) + 1,
            });
        }
    }

    // Increment participants
    const giveawayDocRef = doc(db, 'giveaways', giveawayId);
    await runTransaction(db, async (tx) => {
        const giveawaySnap = await tx.get(giveawayDocRef);
        if (!giveawaySnap.exists()) return;
        const current = giveawaySnap.data()?.participants ?? 0;
        tx.update(giveawayDocRef, { participants: current + 1, updatedAt: serverTimestamp() });
    });

    return {
        id: docRef.id,
        created: true,
        referralCode: newReferralCode,
        referralCount: 0,
    };
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

// Backward-compatible alias
export const checkEmailExistsForGiveaway = async ({ giveawayId, email }) => {
    if (!giveawayId || !email) return false;
    const q = query(entriesRef(), where('email', '==', email), where('giveawayId', '==', giveawayId));
    const snap = await getDocs(q);
    return !snap.empty;
};
