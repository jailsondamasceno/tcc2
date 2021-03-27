import firebaseApp from 'firebase/app'
import 'firebase/firestore'

const firebase = firebaseApp.initializeApp({
    apiKey: "AIzaSyB3UNiVvFJdvyZFv79aA_ELG9s6ETetFoo",
    authDomain: "tcc-2-33e61.firebaseapp.com",
    projectId: "tcc-2-33e61",
    storageBucket: "tcc-2-33e61.appspot.com",
    messagingSenderId: "1056586347095",
    appId: "1:1056586347095:web:779f49f1bc4db9caff6912"
})
export { firebase, firebaseApp }