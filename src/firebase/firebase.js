import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyBZWkXxE_dSN_eEKU_3RZ8DZeKSgcB9ouo",
  authDomain: "nowchat-8b4c2.firebaseapp.com",
  databaseURL: "https://nowchat-8b4c2.firebaseio.com",
  projectId: "nowchat-8b4c2",
  storageBucket: "nowchat-8b4c2.appspot.com",
  messagingSenderId: "1044558981039",
  appId: "1:1044558981039:web:612046a42ed7781f39b15a",
  measurementId: "G-RZ6FVTVKED"
};

firebase.initializeApp(config);

export default firebase;