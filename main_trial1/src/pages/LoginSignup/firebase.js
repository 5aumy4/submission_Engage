import firebase from "firebase"
import "firebase/auth"

const app = firebase.initializeApp({

  /*apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID*/
  apiKey: "AIzaSyAJm7ysoPE9AbW9V9RNn_IfqEGeGoyBGFo",
    authDomain: "finalchat-a2910.firebaseapp.com",
    projectId: "finalchat-a2910",
    storageBucket: "finalchat-a2910.appspot.com",
    messagingSenderId: "269199231361",
    appId: "1:269199231361:web:46a63060f316b56e9c4080",
    measurementId: "G-QNQVF77KCD"
})

const auth = firebase.auth()
const db = app.firestore()
export {auth,db}
