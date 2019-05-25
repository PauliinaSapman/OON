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
        message : '',
        posts   : [1],
        seen    : 'false'
    });
}


/**
 * Lähetetään kommentti databaseen.
 * @param from
 * @param postid
 * @param comment
 */
export function sendComment(from, postid, comment){
    const testRef = firebase.database().ref('comments/userid/'+postid+'');
    testRef.once('value', function(snapshot)
    {
        let commentNumber = snapshot.numChildren();
        commentNumber = Number(commentNumber) + 1;

        firebase.database().ref('comments/userid/'+postid+'/'+commentNumber+'').set({
            userid  : from,
            comment : comment,
            seen: 'false'
        });

    });
}

/**
 * Päivitetään kommentin arvo 'seen' trueksi eli kommentti nähdyksi.
 * @param postid
 * @param commentid
 */
export function setCommentSeen(postid, commentid) {
    firebase.database().ref('comments/userid/'+postid+'/'+commentid+'').update({
        seen: 'true'
    });
}

export function saveProfile(userid, fName, lName, pic, email, phone) {
    const ref = firebase.database().ref('profile/' + userid + '');

    ref.update(
        {
            fName: fName,
            lName: lName,
            pic: pic,
            email: email,
            phone: phone
        });

/*
    // Toiselle käyttäjälle esimerkkidataa
    const ref2 = firebase.database().ref('profile/testuser');
    ref2.set(
        {
            fName: 'Elli',
            lName: 'Esimerkki',
            pic: 'https://images.pexels.com/photos/157661/young-woman-shooting-model-157661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            email: 'elli.esimerkki@mail.com',
            phone: '0452345612'
        });

    // Ohjaava ammattilainen
    const ref2 = firebase.database().ref('profile/userid2');
    ref2.set(
        {
            fName: 'Maisa',
            lName: 'Auttaja',
            pic: 'https://www.pexels.com/photo/adult-doctor-girl-healthcare-355934/',
            email: 'maisa.auttaja@mail.com',
            phone: '0441122987'
        });
        */
}

// ultrahack

// get all texts from user's all posts to be sent to api
export function getAllTextsFromUser() {

    let texts = '';

    const testRef = firebase.database().ref('posts/userid');
    testRef.on('value', function(snapshot)
    {
        postNumber = snapshot.numChildren();

        // loopataan läpi postaukset ja annetaan viimeisimmän arvo postNumberille
        for(let i = 0; i < snapshot.numChildren(); i++) {
              console.log(Object.keys(snapshot.val())[i]);
            let post = Object.keys(snapshot.val())[i];

            let textCategory = firebase.database().ref('posts/userid/' + post + '/category');
            textCategory.on('value', function(snapshot) {
                texts += ' ' + snapshot.val();
                console.log(texts);
            });

            let textTitle = firebase.database().ref('posts/userid/' + post + '/title');
            textTitle.on('value', function(snapshot) {
                texts += ' ' + snapshot.val();
                console.log(texts);
            });

            let textTools = firebase.database().ref('posts/userid/' + post + '/tools');
            textTools.on('value', function(snapshot) {
                texts += ' ' + snapshot.val();
                console.log(texts);
            });

            let textSteps = firebase.database().ref('posts/userid/' + post + '/steps');
            textSteps.on('value', function(snapshot) {
                texts += ' ' + snapshot.val();
                console.log(texts);
            });

            let textOther = firebase.database().ref('posts/userid/' + post + '/newsection1');
            textOther.on('value', function(snapshot) {
                texts += ' ' + snapshot.val();
                console.log(texts);
            });



           // postNumber = Object.keys(snapshot.val())[i];
        }

        // console.log(postNumber);
    });
}
