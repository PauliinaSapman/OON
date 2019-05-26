import firebase from "./firebase/firebase";
import JsPDF from "jspdf";
import * as pauliina from './Pauliina2.js'
export const makePDF = (props) => {
    let doc = new JsPDF("p", "px", "a4", true);

    let bodyElement = document.querySelector('.sharedPaper');
    let name = props.fName + '_' + props.lName + '_osaamiset.pdf';

    let specialElementHandlers = {
        '#ignorePDF1': function (element, renderer) {
            return true;
        },
        '.skillPicture': function (element, renderer) {
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


export function fetchApi(param) {
    fetch(param.url)
        .then((result) => {
            // Get the result
            // If we want text, call result.text()
            return result.json();
        }).then((jsonResult) => {
        // Do something with the result

        console.log(jsonResult.data);

        return jsonResult.data;

    })
}

export let skillsArray = [];
export let skillPositionArray = [];
export let nSkillInposition = 0;

export function apiTesti() {
    resetResults();
    let texts = '';

    const testRef = firebase.database().ref('posts/userid');
    testRef.on('value', function (snapshot) {

        // loopataan läpi postaukset ja annetaan viimeisimmän arvo postNumberille
        for (let i = 0; i < snapshot.numChildren(); i++) {
            let post = Object.keys(snapshot.val())[i];

            let textCategory = firebase.database().ref('posts/userid/' + post + '/category');
            textCategory.on('value', function (snapshot) {
                texts += ' ' + snapshot.val();
            });

            let textTitle = firebase.database().ref('posts/userid/' + post + '/title');
            textTitle.on('value', function (snapshot) {
                texts += ' ' + snapshot.val();
            });

            let textTools = firebase.database().ref('posts/userid/' + post + '/tools');
            textTools.on('value', function (snapshot) {
                texts += ' ' + snapshot.val();
            });

            let textSteps = firebase.database().ref('posts/userid/' + post + '/steps');
            textSteps.on('value', function (snapshot) {
                texts += ' ' + snapshot.val();
            });

            let textOther = firebase.database().ref('posts/userid/' + post + '/newsection1');
            textOther.on('value', function (snapshot) {
                texts += ' ' + snapshot.val();
            });

        }

        fetch('https://api.microcompetencies.com/microcompetencies?action=text_to_skills&token=7125d5g8m6d9i9c6t8c7y3f8b57ecnm1h&text=' + texts)
            .then((result) => {
                return result.json();
            }).then((jsonResult) => {
            let newStr;
            for (let skill of jsonResult.data){
                newStr+= skill + ','
            }
            return newStr;})
            .then((skills) => {
                    fetch('https://api.microcompetencies.com/microcompetencies?action=semantic_suggestion&type=skill&lang=fi&word=' + skills + '&word_limit=100&token=7125d5g8m6d9i9c6t8c7y3f8b57ecnm1h')
                    .then((result) => {
                    return result.json();
                }).then((jsonResult) => {
                    skillsArray = jsonResult.data;
                     for (let result of skillsArray) {

                        document.querySelector('#resultBox3').innerHTML += '<div class="result clickable" id="' + result + '">\n' +
                            '                                                   <p>'+ result.replace(/_/g, " ") + '</p>\n' +
                            '                                               </div>';

                         let element = document.getElementById(result);
                         let positionInfo = element.getBoundingClientRect();
                         let width = positionInfo.width;

                         element.addEventListener("click", (e) => {
                             this.console.log('sos');
                         });
                         skillPositionArray.push(width);


                     }
                    console.log(skillsArray);
                        document.querySelector('#resultContainer3').style.height = '3rem';
                        document.querySelector('#resultContainer3').style.opacity = '1';
                        document.querySelector('#resultContainer3').style.paddingTop = '1.5rem';

                        document.querySelector('.valintaOhje3').style.display = 'block';

                        for (let suggestedSkill of document.querySelectorAll('.result')) {

                            console.log(suggestedSkill);


                            suggestedSkill.onclick = function(){pauliina.openNewPost(true,suggestedSkill.innerText )};


                        }

                });
        })


        // console.log(postNumber);
    });
}


export function scrollToLeft(element) {

    console.log(nSkillInposition);

    if (nSkillInposition > 0) {
        console.log(skillPositionArray[nSkillInposition-1]);
        scrollTo( document.querySelector(element), -1 *(skillPositionArray[nSkillInposition - 1] + 7.65 + skillPositionArray[nSkillInposition - 2] + 7.65), 140);
        nSkillInposition -= 2;
    }


}

export function scrollToRight(element) {

    console.log('numero: ' + nSkillInposition);
    console.log('arvo: ' + skillPositionArray[nSkillInposition]);

        scrollTo(document.querySelector(element), skillPositionArray[nSkillInposition] + 8.45 + skillPositionArray[nSkillInposition + 1] + 8.45, 140);
    nSkillInposition += 2;


}

function scrollTo(element, to, duration) {
    let start = element.scrollLeft,
        change = to,
        currentTime = 0,
        increment = 2;

    let animateScroll = function(){
        currentTime += increment;
        let val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollLeft = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};


export function resetResults ()  {
    console.log(skillPositionArray);
    console.log(skillsArray);
    console.log(nSkillInposition);

    document.querySelector('#resultContainer3').style.height = '0rem';
    document.querySelector('#resultContainer3').style.opacity = '0';
    document.querySelector('#resultContainer3').style.paddingTop = '0rem';
    document.querySelector('.valintaOhje3').style.display = 'none';

    skillPositionArray = [];
    skillsArray = [];
    nSkillInposition = 0;

    document.querySelector('.resultBox3').scrollLeft = 0;

    console.log(skillPositionArray);
    console.log(skillsArray);
    console.log(nSkillInposition);

}