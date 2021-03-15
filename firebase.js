import firebaseApp from 'firebase/app'
import 'firebase/firestore'

const firebase = firebaseApp.initializeApp('Credenciais firebase')
export { firebase, firebaseApp }