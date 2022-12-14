const firebase = require("firebase")
import {firebaseConfig} from "./config"

const db = firebase.initializeApp(firebaseConfig)

export default db