import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    where,
    serverTimestamp,
    Timestamp,
    getDocs,
} from 'firebase/firestore';


import { db } from '../firebaseClient';

const COLLECTION = 'giveaways';

const giveawaysRef = () => collection(db, COLLECTION);

export function subscribeToGiveaways(callback) {
    console.log('[Firestore] subscribeToGiveaways() initialising...');

    const q = query(giveawaysRef(), orderBy('endDate', 'asc'));

    return onSnapshot(
        q,
        (snap) => {
            try {
                const giveaways = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                console.log('[Firestore] subscribeToGiveaways() snapshot size:', giveaways.length);

                // Prefer active docs, but never drop docs with missing status.
                const active = giveaways.filter((g) => !g.status || String(g.status) === 'active' || g.isActive);

                const sorted = [...active].sort((a, b) => {
                    const da = a.endDate?.toDate ? a.endDate.toDate().getTime() : new Date(a.endDate).getTime();
                    const db = b.endDate?.toDate ? b.endDate.toDate().getTime() : new Date(b.endDate).getTime();
                    return da - db;
                });

                callback(sorted);
            } catch (e) {
                console.error('[Firestore] subscribeToGiveaways() processing error:', e);
                callback([]);
            }
        },
        (err) => {
            console.error('[Firestore] subscribeToGiveaways() listener error:', err);
            callback([]);
        }
    );
}

export async function getGiveawayById(giveawayId) {
    const ref = doc(db, COLLECTION, giveawayId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
}

export async function addGiveaway(giveaway) {
    const prepared = {
        ...giveaway,
        // Ensure documents created from admin/form are visible to the app
        status: giveaway?.status ?? 'active',
        isActive: giveaway?.isActive ?? true,
    };

    // Convert endDate to Firestore Timestamp before storing
    // Accept Date instances or parsable date strings.
    if (prepared.endDate instanceof Date) {
        prepared.endDate = Timestamp.fromDate(prepared.endDate);
    } else if (typeof prepared.endDate === 'string' || typeof prepared.endDate === 'number') {
        const d = new Date(prepared.endDate);
        if (!Number.isNaN(d.getTime())) prepared.endDate = Timestamp.fromDate(d);
    }


    if (!prepared.createdAt) prepared.createdAt = serverTimestamp();
    if (!prepared.updatedAt) prepared.updatedAt = serverTimestamp();

    const docRef = await addDoc(giveawaysRef(), prepared);
    return docRef.id;
}

export async function updateGiveaway(giveawayId, updates) {
    const ref = doc(db, COLLECTION, giveawayId);

    const prepared = { ...updates };

    // Convert endDate to Firestore Timestamp before updating
    if (prepared.endDate instanceof Date) {
        prepared.endDate = Timestamp.fromDate(prepared.endDate);
    } else if (typeof prepared.endDate === 'string' || typeof prepared.endDate === 'number') {
        const d = new Date(prepared.endDate);
        if (!Number.isNaN(d.getTime())) prepared.endDate = Timestamp.fromDate(d);
    }


    if (!prepared.updatedAt) prepared.updatedAt = serverTimestamp();

    await updateDoc(ref, prepared);
    console.log('Giveaway updated in Firebase:', giveawayId, updates);
}

export async function deleteGiveaway(giveawayId) {
    if (!giveawayId) throw new Error('deleteGiveaway: giveawayId is required');

    // Delete giveaway + all related entries
    const giveawayRef = doc(db, COLLECTION, giveawayId);
    const entriesRef = collection(db, 'entries');
    const q = query(entriesRef, where('giveawayId', '==', giveawayId));

    // Delete entries first so we don't leave orphan entries
    const entriesSnap = await getDocs(q);
    const deletePromises = entriesSnap.docs.map((d) => d.ref.delete());

    // Delete giveaway
    deletePromises.push(giveawayRef.delete());

    await Promise.all(deletePromises);
}



