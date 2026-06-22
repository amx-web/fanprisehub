import {
    addDoc,
    collection,
    doc,
    deleteDoc,
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


    const q = query(giveawaysRef(), orderBy('endDate', 'asc'));

    return onSnapshot(
        q,
        (snap) => {
            try {
                const giveaways = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                console.log('[Firestore] subscribeToGiveaways() snapshot size:', giveaways.length);

                const nowMs = Date.now();

                const computeIsActive = (g) => {
                    const status = g.status ? String(g.status) : '';
                    if (status !== 'active') return false;

                    const endMs = g.endDate?.toDate
                        ? g.endDate.toDate().getTime()
                        : new Date(g.endDate).getTime();

                    // If endDate is missing/unparseable, treat as not active.
                    if (!endMs || Number.isNaN(endMs)) return false;

                    return nowMs <= endMs;
                };

                // IMPORTANT: Do NOT filter out ended/inactive giveaways.
                // Admin dashboard needs to see + delete BOTH active and ended giveaways.
                const withComputed = giveaways.map((g) => ({
                    ...g,
                    isActive: computeIsActive(g),
                }));

                const sorted = [...withComputed].sort((a, b) => {
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

    // Delete giveaway (canonical deleteDoc)
    deletePromises.push(deleteDoc(giveawayRef));

    await Promise.all(deletePromises);
}







