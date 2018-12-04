import firebase from './firebase/firebase.js';

let number = 0;
let postNumber;

/**
 * Testikäyttöön
 */
function getFromDb () {
    const testRef = firebase.database().ref('test/testnumber');
    testRef.on('value', function (snapshot) {
        number = snapshot.val();
    });
}

/**
 * Testikäyttöön
 */
export function testDb()  {
    number += 1;

    firebase.database().ref('test/').set({
        testnumber: number
    });

    getFromDb();
}

/**
 * Haetaan viimeisimmän osaamisen numero
 */
const getPostNumber = () => {
    const testRef = firebase.database().ref('posts/userid');
    testRef.on('value', function(snapshot)
    {
        postNumber = snapshot.numChildren();

        // loopataan läpi postaukset ja annetaan viimeisimmän arvo postNumberille
        for(let i = 0; i < snapshot.numChildren(); i++) {
            //  console.log(Object.keys(snapshot.val())[i]);
            postNumber = Object.keys(snapshot.val())[i];
        }

        // console.log(postNumber);
    });
};

getPostNumber();


/**
 * Poistetaan osaaminen jolla on id post
 * @param post
 */
export function deletePost (post) {
    const testRef = firebase.database().ref('posts/userid/'+post+'');
    testRef.remove();
}

/**
 * Lähetetään databaseen kohtaan number arvot values
 * @param values
 * @param number
 */
export function sendToDb(values, number) {
    // jottei tulisi tyhjiä osaamisia
    if(values.category) {
        // in case of new post
        if (!number) {
            number = Number(postNumber) + 1;
        }
        // posts start at 1
        if (postNumber === 0) {
            number = 1;
        }

        firebase.database().ref('posts/userid/' + number + '').set({
            category: values.category,
            title: values.title,
            rating: values.rating,
            tools: values.tools,
            steps: values.steps,
            picture: values.picture,
            newsection1: values.newsection1
        });
    }
}

/**
 * Lähetetään databaseen tieto keneltä, kenelle ja mitkä osaamiset jaetaan
 * @param to
 * @param from
 * @param posts
 * @param message
 */
export function askComment(to, from, posts, message) {
    firebase.database().ref('shareToUser/'+to+'/'+from+'').set({
        userid  : from,
        message : message,
        posts   : posts,
        seen    : 'false'
    });
    firebase.database().ref('shareToUser/'+to+'/testuser').set({
        userid  : 'testuser',
        message : message,
        posts   : posts,
        seen    : 'false'
    });
}