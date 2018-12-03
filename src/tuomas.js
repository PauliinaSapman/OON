import firebase from "./firebase/firebase";


export function copyToClipboard(str){
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

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

export function randomizeUrl () {
    let randomStr = randomString(8);

    console.log(randomStr);

    let values = {
        urlId: randomStr,
    };

    profileToDb(values);

}