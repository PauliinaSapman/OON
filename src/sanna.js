import firebase from './firebase.js';

let number = 0;
let postNumber;

function getFromDb () {
    const testRef = firebase.database().ref('test/testnumber');
    testRef.on('value', function (snapshot) {
        number = snapshot.val();
    });
}


export function testDb()  {
    number += 1;

    firebase.database().ref('test/').set({
        testnumber: number
    });

    getFromDb();
}


const getPostNumber = () => {
    const testRef = firebase.database().ref('posts/userid');
    testRef.on('value', function(snapshot)
    {
        //   console.log(snapshot.numChildren());
        postNumber = snapshot.numChildren();
    });
};

getPostNumber();

/*
const deletePosts = () => {
    const testRef = firebase.database().ref('posts/userid/undefined');
    testRef.remove();
};
*/

export function sendToDb(values, number) {
    // in case of new post
    if(!number) {
        number = postNumber + 1;
    }
    // posts start at 1
    if(postNumber === 0){
        number = 1;
    }

    console.log('post number ' + number);

    firebase.database().ref('posts/userid/' + number + '').set({
        category    : values.category,
        title       : values.title,
        rating      : values.rating,
        tools       : values.tools,
        steps       : values.steps,
        picture     : values.picture,
        newsection1 : values.newsection1
    });
}

let values;

export function getAllPosts() {
    /*
    for(let nmr = 1; nmr!==postNumber; nmr ++) {
        let testRef = firebase.database().ref('posts/userid' + '/' + nmr);
        if(testRef) {
            testRef.on('value', function(snapshot)
            {
                console.log(snapshot);
            });
        }
    }
    */


    let testRef = firebase.database().ref('posts/userid');
    console.log(testRef);
    firebase.database().ref('posts/userid').on('value', function(snapshot)
    {
        console.log(snapshot.val());
        values = snapshot.val();
        console.log(values);
        return values;
    });
}