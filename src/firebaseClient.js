import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from './firebaseConfig';

// Singleton — only initialise once
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);

// Analytics (optional — fails gracefully in non-browser envs)
let analytics = undefined;
isSupported()
    .then((supported) => { if (supported) analytics = getAnalytics(app); })
    .catch(() => console.warn('[Firebase] Analytics not initialised'));

export { app, analytics };
