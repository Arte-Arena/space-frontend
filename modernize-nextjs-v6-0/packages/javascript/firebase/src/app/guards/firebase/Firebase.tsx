// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyAN5-l2Mg-O3L-gFhdGEYkjbXxeq3afrZQ",
  authDomain: "reactprojects-b6bf1.firebaseapp.com",
  projectId: "reactprojects-b6bf1",
  storageBucket: "reactprojects-b6bf1.appspot.com",
  messagingSenderId: "645018563926",
  appId: "1:645018563926:web:ef4544ee772f67871a12f7",
  measurementId: "G-Y27B5MKNDM",
  databaseURL: "https://reactprojects-b6bf1-default-rtdb.firebaseio.com/",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Db = firebase.database();
const Auth = firebase.auth();

export { Db, Auth, firebase };
