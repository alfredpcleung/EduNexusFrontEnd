// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
let firebaseConfig = {};
let app = null;
let auth = null;

try {
    const configStr = import.meta.env.VITE_APP_FIREBASECONFIG;
    if (configStr && configStr !== '{}') {
        firebaseConfig = JSON.parse(configStr);
        // Initialize Firebase only if config is valid
        if (firebaseConfig.projectId && !firebaseConfig.projectId.includes('YOUR_')) {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
        } else {
            console.warn('Firebase config contains placeholder values. Firebase authentication is disabled.');
        }
    }
} catch (error) {
    console.warn('Firebase initialization warning:', error.message);
}

// Provide a safe default if Firebase didn't initialize
if (!app) {
    console.warn('Firebase is not initialized. Authentication features will be unavailable.');
}

export { app, auth };
export default app;