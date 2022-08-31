import firebaseConfig from './config/firebase'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
const app = initializeApp(firebaseConfig)
export default getAuth(app)
