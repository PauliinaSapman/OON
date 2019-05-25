import firebase from "./firebase/firebase";
import JsPDF from "jspdf";




export const makePDF = (props) => {
    let doc = new JsPDF("p", "px", "a4", true);

    let bodyElement = document.querySelector('.sharedPaper');
    let name = props.fName + '_' + props.lName + '_osaamiset.pdf';

    let specialElementHandlers = {
        '#ignorePDF1': function(element, renderer){
            return true;
        },
        '.skillPicture': function(element, renderer){
            return true;
        }
    };

    doc.fromHTML(
        bodyElement,
        25,
        25,
        {
            'width': 298,
            'elementHandlers': specialElementHandlers
        },
        () => {

            doc.save(name);
        }, 0);


};

export const makeBetterPDF = (props) => {
    let doc = new JsPDF("p", "mm", "a4", true);

    let name = props.fName + '_' + props.lName + '_osaamiset.pdf';


};


export function copyToClipboard() {
    let el = document.querySelector('.sharePDFTextAreaContainer textarea');

    firebase.database().ref().child("profile/userid/urlId").on('value', snap => {


        let str = snap.val();

        if (str) {




            let sharedUrl = window.location.host + '/shared?id=' + str;



            el.value = sharedUrl;

            el.select();
            document.execCommand('copy');
            window.open(sharedUrl);


        }


    });


}

export function profileToDb(values) {
    firebase.database().ref('profile/userid/urlId').set(
        values.urlId,
    );
}

function randomString(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }

    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

export function randomizeUrl() {
    let randomStr = randomString(8);


    let values = {
        urlId: randomStr,
    };

    profileToDb(values);
}

export function sharePosts(listOfSkills) {
    firebase.database().ref('shareToEveryone/userid/').set({
        posts: listOfSkills,
    });


}


export function apiTesti() {
    fetch('https://api.microcompetencies.com/microcompetencies?action=semantic_suggestion&type=skill&lang=xx&word=mekaniikka&word_limit=10&token=7125d5g8m6d9i9c6t8c7y3f8b57ecnm1h')
        .then((result) => {
            // Get the result
            // If we want text, call result.text()
            return result.json();
        }).then((jsonResult) => {
        // Do something with the result

        for (const i of jsonResult.data){
            console.log(i);
        }

    })
}
