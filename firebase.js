import firebaseApp from 'firebase/app'
import 'firebase/firestore'

const firebase = firebaseApp.initializeApp('suas credenciais firebase')
export { firebase, firebaseApp }