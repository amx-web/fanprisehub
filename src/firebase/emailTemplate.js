import {
    collection,
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseClient';

const TEMPLATE_COLLECTION = 'emailTemplates';
const WINNER_TEMPLATE_DOC = 'winner';

export async function getWinnerEmailTemplate() {
    const ref = doc(db, TEMPLATE_COLLECTION, WINNER_TEMPLATE_DOC);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        return {
            subject: 'Congratulations! You Have Been Selected',
            bodyHtml: '',
            updatedAt: null,
            logoUrl: '',
            headerText: 'Congratulations',
            footerText: 'Need help? Contact our support team.',
            theme: {
                accent1: '#8B5CF6',
                accent2: '#EC4899',
                highlight: '#FDE68A',
            },
        };
    }

    return snap.data();
}

export async function upsertWinnerEmailTemplate(template) {
    const ref = doc(db, TEMPLATE_COLLECTION, WINNER_TEMPLATE_DOC);

    const payload = {
        subject: template.subject ?? 'Congratulations! You Have Been Selected',
        bodyHtml: template.bodyHtml ?? '',
        logoUrl: template.logoUrl ?? '',
        headerText: template.headerText ?? 'Congratulations',
        footerText: template.footerText ?? 'Need help? Contact our support team.',
        theme: template.theme ?? {
            accent1: '#8B5CF6',
            accent2: '#EC4899',
            highlight: '#FDE68A',
        },
        updatedAt: serverTimestamp(),
    };

    await setDoc(ref, payload, { merge: true });
}
