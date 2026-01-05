import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB48Uldi1-0u9N4VjRnn-c3pwIRbYCP3RQ",
  authDomain: "personal-tracker-54fc6.firebaseapp.com",
  projectId: "personal-tracker-54fc6",
  storageBucket: "personal-tracker-54fc6.firebasestorage.app",
  messagingSenderId: "729260865854",
  appId: "1:729260865854:web:8657fbcdb987dd48cd546f"
};


const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)
