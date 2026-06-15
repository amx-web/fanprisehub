import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';

const COLLECTION = 'entries';

// Hard delete applicant entry
export async function deleteEntry(entryId) {
    if (!entryId) throw new Error('entryId is required');
    await deleteDoc(doc(db, COLLECTION, entryId));
}

