import React, {Component} from 'react';

import './Home.css';
import { ModalButton } from "react-modal-button";
import Select from "react-select";
import firebase from '../../firebase/firebase.js';
import * as sanna from '../../sanna.js';
import * as ROUTES from "../../constants/routes";
import { Link } from 'react-router-dom';
import {Collapse} from 'react-collapse';
import { Form, Text, Scope, TextArea, Option} from 'informed';

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
        category    : 'Autot',
        title       : 'Renkaidenvaihto',
        rating      : '4',
        tools       : 'Uudet renkaat, tunkki, jakoavain, työhanskat, auto.',
        steps       : 'Nostetaan autoa, otetaan vanhat renkaat pois ja laitetaan uudet tilalle.',
        picture     : '',
        newsection1  : 'Osaan vaihtaa myös vanteet.'
        */
        category    : 'Ruuanlaitto',
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
        { label: "Tietotekniikka", value: 2 },
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
        case 'Autot':
            colour = '#590375';
            break;
        case 'Tietotekniikka':
            colour = '#89023E';
            break;
        case 'Musiikki':
            colour = '#e48255';
            break;
        case 'Ruuanlaitto':
            colour = '#136F63';
            break;
        case 'Talotyöt':
            colour = '#395C89';
            break;
        case 'Nikkarointi':
            colour = '#FFBA5C';
            break;
    }
    return colour;
}

// TODO tarkistetaan, että tietokannassa on haluttavat tiedot ettei mene rikki kun jätetään jokin osio pois osaamisesta!
// TODO Poistetaan osio jos se jätetään tyhjäksi?
// TODO CSS lomakkeelle
// TODO Kuvan toteuttaminen ?
// TODO Ratingin toteuttaminen ?

/**
 * Osaaminen eli post esitetään muokattavana lomakkeena.
 */
class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:'',
            selected: ''
        };
    }

    // Lähetetään lomakkeen arvot databaseen.
    handleSubmit = (e) => {
        const values = {
            category: this.state.selected,
            title: e.title,
            rating : e.rating,
            tools : e.tools,
            steps : e.steps,
            picture : e.picture,
            newsection1 : e.newsection1
        };

        const id = this.props.id;
        sanna.sendToDb(values, id);
    };

    // Valitaan selectistä kategorian arvo.
    handleChange = (selectedOption) => {
        const option = selectedOption.value;
        this.setState({ selected: option });
    };


    // Asetetaan kategorian arvo placeholderiksi selectiin, sekä sen arvoksi.
    componentDidMount() {
        let category = '';

        if(this.props.info.category) {
            category = this.props.info.category;
        }
        this.setState({selected: category});
    }

    render() {
        const Kategoriat = [
            { label: "Autot", value: 'Autot' },
            { label: "Tietotekniikka", value: 'Tietotekniikka' },
            { label: "Musiikki", value: 'Musiikki' },
            { label: "Ruuanlaitto", value: 'Ruuanlaitto' },
            { label: "Talotyöt", value: 'Talotyöt' },
            { label: "Nikkarointi", value: 'Nikkarointi' },
        ];

        return(
            <Form id="form-api-form" onSubmit={this.handleSubmit}>
                <div>
                    {/*<p>{this.props.id}</p>*/}
                    <Select placeholder={this.state.selected} value={this.state.selected} onChange={this.handleChange} options={Kategoriat}>Kategoria</Select>
                    <br></br>
                    <TextArea field="title" id="textarea-title" initialValue={this.props.info.title}/>
                    <br></br>
                    <label htmlFor="textarea-tools">Työvälineet:</label>
                    <br></br>
                    <TextArea field="tools" id="textarea-tools" initialValue={this.props.info.tools}/>
                    <br></br>
                    <label htmlFor="textarea-steps">Työvaiheet:</label>
                    <br></br>
                    <TextArea field="steps" id="textarea-steps" initialValue={this.props.info.steps}/>
                    <br></br>
                    <Text field="rating" id="text-rating" initialValue={this.props.info.rating}/>
                    <br></br>
                    <Text field="picture" id="text-picture" initialValue={this.props.info.picture}/>
                    <br></br>
                    {/*TODO otsikko muokattavissa, on käyttäjän lisäämä uusi osio*/}
                    <label htmlFor="textarea-newsection1">Muuta:</label>
                    <br></br>
                    <TextArea field="newsection1" id="textarea-newsection1" initialValue={this.props.info.newsection1}/>
                    <br></br>
                    <button type="submit">
                        Tallenna
                    </button>
                </div>
            </Form>
    )}
}

/**
 * Osaamisen aukeaminen ja sulkeutuminen.
 */
class ToggleCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            button: '▼',
            value:'',
            category: '',
            title: ''
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
                    <PostForm info={this.props.info} id={this.props.id}/>
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
class Skill extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            button: '▼',
            value:'',
            category: '',
            title: ''
        };
    }

    render() {
        let colour = getColour(this.props.skillInfo.category);

        return (
            <li className="Skill">
                <div className="skillColorTag" style={{backgroundColor: colour}}>
                </div>
                <div className="skillContent">
                    <ToggleCollapse info={this.props.skillInfo} id={this.props.id}/>
                </div>
            </li>
        )
    }
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
                return <Skill key={post} skillInfo={r} id={post}/>
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
        // TODO tämä Sannaan? Päivitysjuttu tänne?
        const postsRef = firebase.database().ref().child('posts/userid/');

        postsRef.on('value', snap => {
            this.setState({
                posts: snap.val()
            });
        });
    }

    render() {
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
