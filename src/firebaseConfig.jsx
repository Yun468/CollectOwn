import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDdNzTruzZxL3nx6xM6wcOuLLjluMVuYJI',
  authDomain: 'collectown-2629a.firebaseapp.com',
  projectId: 'collectown-2629a',
  storageBucket: 'collectown-2629a.appspot.com',
  messagingSenderId: '775633068165',
  appId: '1:775633068165:web:96f9dfc0747e26246749ec',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
