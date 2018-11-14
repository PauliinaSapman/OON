import firebase from './firebase.js';

let number = 0;


function getFromDb () {
    const testRef = firebase.database().ref('test/testnumber');
    testRef.on('value', function (snapshot) {
        number = snapshot.val();
    });
}

export function sendToDb(e)  {
    e.preventDefault();

    number += 1;

    firebase.database().ref('test/').set({
        testnumber: number
    });

    getFromDb();
}