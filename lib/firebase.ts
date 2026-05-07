import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCHJZXueo2ZUvrewVJbZ4MqM7n0D6fmMS8",
  authDomain: "barbeque-nation-89ace.firebaseapp.com",
  databaseURL: "https://barbeque-nation-89ace-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "barbeque-nation-89ace",
  storageBucket: "barbeque-nation-89ace.firebasestorage.app",
  messagingSenderId: "930640142710",
  appId: "1:930640142710:web:e3558fd65ab6d4ef335a57",
  measurementId: "G-3HY23VDDLH"
};

let app: FirebaseApp | null = null;
let db: Database | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getDatabase(app);
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase initialization failed. Please check your credentials:", error);
}

export { app, db, auth, firestore };
