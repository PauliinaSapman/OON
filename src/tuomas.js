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


export function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

export function profileToDb(values) {
    firebase.database().ref('profile/userid/urlId').set(
        values.urlId,
    );

    let sharedUrl = window.location.host + '/shared?id=' + values.urlId;
    copyToClipboard(sharedUrl);
    window.open(sharedUrl);
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

    console.log(randomStr);

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

