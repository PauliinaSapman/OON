import React, {Component} from 'react';

import './Home.css';
import { ModalButton } from "react-modal-button";
import Select from "react-select";
import firebase from '../../firebase/firebase.js';
import * as sanna from '../../sanna.js';
import * as ROUTES from "../../constants/routes";
import { Link } from 'react-router-dom';
import {Collapse} from 'react-collapse';

function LogOut () {
    return (
        <button>
            <Link to={ROUTES.LANDING}>Log Out</Link>
        </button>
    );
}


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
            Testinappi
        </a>
    );
}

// Sivun yläpalkki.
function Header() {
    return (
        <div className="Header">
            <h1>OON</h1>
            <DbButton/>
            <LogOut/>
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

//TODO onko tää hyvä tehdä täällä frontissa?
/**
 * Valitaan väri kategorian mukaan.
 * @param category
 * @returns {string}
 */
function getColour(category) {
    let colour = '#0000';
    switch (category) {
        case 'autot':
            colour = '#590375';
            break;
        case 'it':
            colour = '#89023E';
            break;
        case 'musiikki':
            colour = '#e48255';
            break;
        case 'ruuanlaitto':
            colour = '#136F63';
            break;
        case 'talotyöt':
            colour = '#395C89';
            break;
        case 'nikkarointi':
            colour = '#FFBA5C';
            break;
    }
    return colour;
}



function toggleVisible() {

}

class ToggleCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            button: '▼'
        };
    }


    render() {
        const {isOpened} = this.state;

        return (
            <div>
                <div>
                    <div className="postTop" onClick={() => {
                        if (this.state.isOpened === true) {
                            this.setState({isOpened: false});
                            this.setState({button: '▼'});
                        }
                        else {
                            this.setState({isOpened: true});
                            this.setState({button: '▲'});
                        }
                    }
                    }>
                        <div className="postHeadline">
                            <p>{this.props.info.category}</p>
                            <h3>{this.props.info.title}</h3>
                        </div>
                        <div className="postOpen">
                            <p>{this.state.button}</p>
                        </div>
                    </div>
                </div>
                <Collapse isOpened={isOpened}>
                    <div>
                        <p>{this.props.info.tools}</p>
                        <p>{this.props.info.steps}</p>
                        <p>{this.props.info.picture}</p>
                        <p>{this.props.info.newsection1}</p>
                    </div>
                </Collapse>
            </div>
        );
    }
}


/**
 * Yksittäinen osaaminen listassa.
 * @param props
 * @returns {*}
 * @constructor
 */
function Skill(props) {
    let colour = getColour(props.skillInfo.category);
   // console.log(colour);

   // let isOpened = sanna.toggleCollapse(true);

    return (
        <li className="Skill">
            <div className="skillColorTag" style={{backgroundColor : colour}}>
            </div>
            <div className="skillContent">
                <ToggleCollapse info={props.skillInfo}/>
            </div>
        </li>
    );
    /*
                <p>{props.skillInfo.tools}</p>
                <p>{props.skillInfo.steps}</p>
                <p>{props.skillInfo.picture}</p>
                <p>{props.skillInfo.newsection1}</p>
                */
}

/**
 * Osaamisia sisältävä lista.
 * @param props
 * @returns {*}
 * @constructor
 */
function SkillList(props) {
    let postArray = props.posts;

    // Jos objekti on tyhjä, annetaan sille arvo. Näin käy kun tietokannasta ei ole haettu riittävän nopeasti.
    if(Object.keys(postArray).length === 0 && postArray.constructor === Object){
        postArray = [''];
    }

    return (
        <ul className="SkillList">
            {/* Looppaa kaikki parametrina annetun listan alkiot ja tekee jokaisesta osaamisen(Skill) */}
            {postArray.map((r, post) => {
                return <Skill key={post} skillInfo={r}/>
            })}
        </ul>
    );
}

/**
 * Osaamiset eli postit listattuna
 */
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
            //  console.log(snap.val());
        });
    }

    render() {
        // console.log(this.state.posts);

        return (
            <div>
                <SkillList posts={this.state.posts}/>
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
function Home() {
    return (
        <div className="App">
            <Header/>
            <New/>
            <Main/>
        </div>
    );
}

export default Home;
