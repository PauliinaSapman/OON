import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { ModalButton } from "react-modal-button";
import Select from "react-select";
import firebase from './firebase.js';
import * as sanna from './sanna.js';


/*
let skills;

// Listassa näkyvä yksittäinen osaaminen
// Parametrinä annetaan objekti jonka sisällä on osaamisen nimi, kategoria ja väri
function Skill(props) {
    return (
        <li className="Skill">
            <div className="skillColorTag" style={{backgroundColor : props.skillInfo.color}}>
            </div>
            <div className="skillContent">
                <p>{props.skillInfo.category}</p>
                <h3>{props.skillInfo.name}</h3>
            </div>
        </li>
    );
}

// Osaamisia sisältävä lista.
// Parametrinä annetaan lista kaikista osaamisista.
function SkillList(props) {
    return (
        <ul className="SkillList">
            {/* Looppaa kaikki parametrina annetun listan alkiot ja tekee jokaisesta osaamisen(Skill) */ /*}
            {props.skillList.map( (skill, i)=> {
                return <Skill key={i} skillInfo={skill}/>
            } )}
        </ul>
    );
}
*/
// Lähetetään osaaminen
const sendToDb = () => {
    // TODO haetaan arvot lomakkeesta
    const values = {
        /*
        category    : 'autot',
        title       : 'Renkaidenvaihto',
        rating      : '4',
        tools       : 'Uudet renkaat, tunkki, jakoavain, työhanskat, auto.',
        steps       : 'Nostetaan autoa, otetaan vanhat renkaat pois ja laitetaan uudet tilalle.',
        picture     : '',
        newsection1  : 'Osaan vaihtaa myös vanteet.'
        */
        category    : 'ruuanlaitto',
        title       : 'Perunankuorinta',
        rating      : '2',
        tools       : 'Peruna, kuorimaveitsi, kädet.',
        steps       : 'Otetaan peruna käteen ja toisella kädellä kuoritaan kuorimaveitsellä itseenpäin vetäen.',
        picture     : 'kuva tähän',
        newsection1  : 'Osaan kuoria muitakin juureksia.'
    };

    // lähetetään databaseen postaukseen 1
    sanna.sendToDb(values, 1);
    sanna.testDb();
};


// Nappi lähettää databaseen arvon
function DbButton() {
    return (
        <a href="#" onClick={sendToDb}>
            Click me
        </a>
    );
}

// Sivun yläpalkki.
function Header() {
    return (
        <div className="Header">
            <h1>Yläpalkki</h1>
            <DbButton/>
        </div>
    );
}


//Uusi osaaminen nappula ja modaalin sisältöä
function New() {
    const Kategoriat = [
        { label: "Autot", value: 1 },
        { label: "IT", value: 2 },
        { label: "Musiikki", value: 3 },
        { label: "Ruuanlaitto", value: 4 },
        { label: "Talotyöt", value: 5 },
        { label: "Nikkarointi", value: 6 },
    ];
    return (
        <ModalButton
            buttonClassName="New"
            windowClassName="window-container"
            modal={({ closeModal }) => (
                <div className="Modal">
                    <button className="tallenna" onClick={closeModal}><h3>Tallenna</h3></button>
                    <Select options={Kategoriat}>Valitse kategoria</Select>
                    <button className="ominaisuus"><h4>Uusi ominaisuus</h4></button>
                </div>
            )}
        >
            <h1> + Lisää uusi osaaminen </h1>
        </ModalButton>
    );

}


class Posts extends Component {
    constructor(props){
        super(props);
        this.state = {

            posts: {}
        };
    }
    componentDidMount(){
        const postsRef = firebase.database().ref().child('posts/userid/');


        postsRef.once('value', snap => {
                this.setState({
                  posts: snap.val()
                });
                console.log(snap.val());
            });

     /*   const listOfPosts = this.state.listOfPosts.map(post =>
            <div>
                <h1>{post.id}</h1>
                <h1>{post.category}</h1>
                <h1>{post.title}</h1>
                <h1>{post.tools}</h1>
                <h1>{post.steps}</h1>
                <h1>{post.picture}</h1>
                <h1>{post.newsection1}</h1>
            </div>
        );
        console.log(listOfPosts);
*/


    }
    render() {
        console.log(this.state.posts);

        let postArray = this.state.posts;
        let renderedList = [];

        for(let post in postArray) {
            if (postArray.hasOwnProperty(post)) {
                // console.log(post); // key
                console.log(postArray[post]); // value

                let r = postArray[post];

                renderedList.push(<li key={post}> <ul>
                    <li>{r.category} </li>
                    <li>{r.title}</li>
                    <li>{r.tools}</li>
                    <li>{r.steps}</li>
                    <li>{r.picture}</li>
                    <li>{r.newsection1}</li>
                </ul></li>);

                // rendered += '<li>' + postArray[post].category + '</li>';
            }
        }

        return (
            <div>
                <ul>
                    {
                        renderedList
                    }
                </ul>
            </div>
        );
    }
}


// Sivun varsinanen sisältö
function Main() {
    return (
        <div className="Main">
            <Posts/>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <Header/>
            <New/>
            <Main/>
        </div>
    );
}

export default App;

/*
// Sivun varsinanen sisältö
function Main() {
    // Placeholder lista tietokannasta haetuista osaamisista.
    const skillsList = [
        {   name: "renkaat",
            category: "autot",
            color: "#a826d9"},

        {   name: "makkaraperunat",
            category: "ruoka",
            color: "#52bcd9"},

        {   name: "kurkkumopo",
            category: "autot",
            color: "#a826d9"},

        {   name: "1 burtsa + kylmä kolle",
            category: "ruoka",
            color: "#52bcd9"}
    ];

   // skills = sanna.getAllPosts();
   // console.log(skills);
/*
    return (
        <div className="Main">
            <SkillList skillList={skillsList}/>
        </div>
    );
*/
/*
    const listOfPosts = this.state.listOfPosts.map(post =>
        <div>
            <h1>{post.id}</h1>
            <h1>{post.category}</h1>
            <h1>{post.title}</h1>
            <h1>{post.tools}</h1>
            <h1>{post.steps}</h1>
            <h1>{post.picture}</h1>
            <h1>{post.newsection1}</h1>
        </div>
    );
    return (
        <div>{listOfPosts}</div>
    );
}
*/
/*
function App() {
    return (
        <div className="App">
            <Header/>
            <New/>
            <Main/>
        </div>
    );
}

export default App;
*/

/*

class App extends Component {

    constructor(){
        super();
        this.state = {
            listOfPosts: []
        };
    }


    componentDidMount() {
        const rootRef = firebase.database().ref().child('posts/userid');

        rootRef.once('value').then(function (snap) {
            const previousList = this.state.listOfPosts;

            console.log(snap);

            previousList.append({
                id: snap.key,
                category: snap.val().category,
                title: snap.val().title,
                rating: snap.val().rating,
                tools: snap.val().tools,
                steps: snap.val().steps,
                picture: snap.val().picture,
                newsection1: snap.val().newsection1
            });
            this.setState({
                listOfPosts: previousList
            });
        });

        console.log(this.state.listOfPosts);

        rootRef.on('child_added', snap => {
            const previousList = this.state.listOfPosts;
            previousList.append({
                id: snap.key,
                category: snap.val().category,
                title: snap.val().title,
                rating: snap.val().rating,
                tools: snap.val().tools,
                steps: snap.val().steps,
                picture: snap.val().picture,
                newsection1: snap.val().newsection1
            });
            this.setState({
                listOfPosts: previousList
            });
        });


        // tää pitäis saada näkymään
        let listOfPosts = this.state.listOfPosts.map(post =>
            <div>
                <h1>{post.id}</h1>
                <h1>{post.category}</h1>
                <h1>{post.title}</h1>
                <h1>{post.tools}</h1>
                <h1>{post.steps}</h1>
                <h1>{post.picture}</h1>
                <h1>{post.newsection1}</h1>
            </div>
        );
        /*   return (
               <div>{listOfPosts}</div>
           );

   */
/*
    }
    render() {
        return (
            /*
            <div className="App">
                <h1>{this.state.id}</h1>
                <h1>{this.state.latitude}</h1>
                <h1>{this.state.longitude}</h1>
            </div>
            */
/*
            <div className="App">
                <Header/>
                <New/>
                <div>{this.state.listOfPosts}</div>
            </div>
        );
    }
}

*/

// export default App;