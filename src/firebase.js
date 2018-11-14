// Initialize Firebase
import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyABQYT76t3JXnbGRd806EzTi6hMbcOy6OI",
    authDomain: "mediapalveluprojekti.firebaseapp.com",
    databaseURL: "https://mediapalveluprojekti.firebaseio.com",
    projectId: "mediapalveluprojekti",
    storageBucket: "mediapalveluprojekti.appspot.com",
    messagingSenderId: "613648462946"
};

firebase.initializeApp(config);
export default firebase;


