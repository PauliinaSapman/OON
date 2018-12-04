import React, {Component} from 'react';
import './HomePro.css';
import firebase from '../../firebase/firebase.js';
import * as sanna from '../../sanna.js';
import * as ROUTES from "../../constants/routes";
import { Link } from 'react-router-dom';
import {Collapse} from 'react-collapse';
import {getColour} from "../Home";

function LogOut () {
    return (
        <button>
            <Link to={ROUTES.LANDING}>Log Out</Link>
        </button>
    );
}

// Lähetetään osaaminen
const sendToDb = () => {
    sanna.testDb();
};

// Nappi lähettää databaseen testiarvon.
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
            <h1>OON - ohjaavan ammattilaisen sivu</h1>
            <DbButton/>
            <LogOut/>
        </div>
    );
}

/**
 * Valitaan väri riippuen siitä, onko kommenttipyyntö uusi vai onko sitä jo katsottu.
 * @param seen
 * @returns {string}
 */
function getColor(seen) {
    if(seen === 'false'){
        return 'red';
    }
    return 'green';
}

/**
 * Yksittäinen käyttäjä listassa.
 * @param props
 * @returns {*}
 * @constructor
 */
class User extends Component{
    constructor(props) {
        super(props);
        this.state = {
            seen: 'true'
        };
    }

    // Lähetetään parentille käsky onSelectUser eli kerrotaan mikä käyttäjä valitaan.
    handleUserChange = () => {
        this.setState({
            seen:  'true'
        });

        firebase.database().ref().child('shareToUser/userid2/'+this.props.userId+'/seen').set('true');
        this.props.onSelectUser(this.props.userId);
    };

    componentDidMount() {
        const postsRef = firebase.database().ref().child('shareToUser/userid2/'+this.props.userId+'/seen');

        postsRef.on('value', snap => {
            this.setState({
                seen:  snap.val()
            });
        });
    }

    render() {
        let colour = getColor(this.state.seen);

        return (
            <li className="Skill">
                <div className="skillColorTag" style={{backgroundColor : colour}}>
                </div>
                <div className="skillContent clickable" onClick={this.props.buttonClick}>
                    <p className="selectUserButton" onClick={this.handleUserChange}>{this.props.userId}</p>
                </div>
            </li>
        )
    }
}

/**
 * Käyttäjiä sisältävä lista.
 * @param props
 * @returns {*}
 * @constructor
 */
function UserList(props) {
    let userArray = props.users;

    // Jos objekti on tyhjä, annetaan sille arvo. Näin käy kun tietokannasta ei ole haettu riittävän nopeasti.
    if(Object.keys(userArray).length === 0 && userArray.constructor === Object){
        userArray = [''];
    }

    return (
        <ul className="SkillList">
            {userArray.map((content, id) => {
                return <User key={id} userId={content} id={id} buttonClick={props.buttonClick} onSelectUser={props.onSelectUser}/>
            })}
        </ul>
    );
}

/**
 * Käyttäjät, jotka ovat jakaneet ohjaavalle ammattilaiselle listattuna.
 */
class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            content: true,
            userid: ''
        };
    }

    componentDidMount(){
        const postsRef = firebase.database().ref().child('shareToUser/userid2/');

        postsRef.on('value', snap => {
            let ar = [];

            snap.forEach(function(childSnapshot) {
                ar[ar.length] = childSnapshot.key;
            });
            this.setState({
                users:  ar
            });
        });
    }

    // Vaihdetaan sisältöä, jos nappia on klikattu.
    changeButtonState(event) {
        this.setState({content: !this.state.content});
    }

    // Childiltä tulee arvo, joka kertoo minkä käyttäjän tietoja halutaan nähdä.
    handleUser (value) {
        this.setState({userid: value});
    };

    render() {
        // Näytetään tietyn käyttäjän jakamat postaukset Posts.
        if(this.state.content === false){
            return (
                <div>
                    <button onClick={this.changeButtonState.bind(this)}>Takaisin</button>
                    <Posts userid={this.state.userid}/>
                </div>
            )
        }
        // Näytetään lista käyttäjistä.
        return (
            <div>
                <UserList users={this.state.users} buttonClick={this.changeButtonState.bind(this)} onSelectUser={this.handleUser.bind(this)}/>
            </div>
        )
    }
}

// Palautetaan muotoiltu sisältö, jos osaamisessa on tiettyjä alueita.

function GetTools (props) {
    if(props.info.tools){
        return(
            <div>
                <h4>Työvälineet:</h4>
                <br></br>
                <p>{props.info.tools}</p>
                <br></br>
            </div>
        );
    }
    return(<div></div>)
}

function GetSteps (props) {
    if(props.info.steps){
        return(
            <div>
                <h4>Työvaiheet:</h4>
                <br></br>
                <p>{props.info.steps}</p>
                <br></br>
            </div>
        );
    }
    return(<div></div>)
}

function GetRating (props) {
    if(props.info.rating){
        return(
            <div>
                <p>{props.info.rating}</p>
                <br></br>
            </div>
        );
    }
    return(<div></div>)
}

function GetPicture (props) {
    if(props.info.picture){
        return(
            <div>
                <p>{props.info.picture}</p>
                <br></br>
            </div>
        );
    }
    return(<div></div>)
}

function GetNewSection1 (props) {
    if(props.info.newsection1){
        return(
            <div>
                {/*TODO otsikko muokattavissa, on käyttäjän lisäämä uusi osio*/}
                <h4>Muuta:</h4>
                <br></br>
                <p>{props.info.newsection1}</p>
                <br></br>
            </div>
        );
    }
    return(<div></div>)
}

/**
 * Yksittäinen osaaminen.
 */
class PostForm extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <GetTools info={this.props.info}/>
                <GetSteps info={this.props.info}/>
                <GetRating info={this.props.info}/>
                <GetPicture info={this.props.info}/>
                <GetNewSection1 info={this.props.info}/>
            </div>
        )
    }
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
            id: ''
        };
    }

    render() {
        const {isOpened} = this.state;

        return (
            <div>
                <div>
                    <div className="postTop clickable" onClick={() => {
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
function Skill(props) {
    let colour = getColour(props.skillInfo.category);

    return (
        <li className="Skill">
            <div className="skillColorTag" style={{backgroundColor : colour}}>
            </div>
            <div className="skillContent">
                <ToggleCollapse info={props.skillInfo} id={props.id}/>
            </div>
        </li>
    );
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
 * Jaetut osaamiset eli postit listattuna, sekä jaettu vieti.
 */
export class Posts extends Component {
    constructor(props){
        super(props);
        this.state = {
            posts: {},
            message: ''
        };
    }

    componentDidMount(){
        const user = this.props.userid;
        const sharedPosts = firebase.database().ref().child('shareToUser/userid2/'+user+'/posts/');

        sharedPosts.on('value', snap => {
            let postid = snap.val();
            let postArray = [];

            // Tehdään jaetuista osaamisista lista.
            postid.forEach((post)=> {
                let postsRef = firebase.database().ref().child('posts/'+user+'/'+post+'');
                postsRef.on('value', snap => {
                    // Jos käyttäjä on poistanut jaetun postauksen, antaisi errorin ilman tätä if-lausetta.
                    if(snap.val()) {
                        postArray[postArray.length] = snap.val();
                    }
                });
            });

            this.setState({
                posts: postArray
            });
        });

        // Haetaan viesti.
        const sharedMessage = firebase.database().ref().child('shareToUser/userid2/'+user+'/message/');

        sharedMessage.on('value', snap => {
            this.setState({
                message: snap.val()
            });
        });
    }

    render() {
        return (
            <div>
                <p>{this.state.message}</p>
                <SkillList posts={this.state.posts}/>
            </div>
        );
    }
}

// Sivun varsinanen sisältö
function Main() {
    return (
        <div className="Main">
            <Users/>
        </div>
    );
}

function Home() {
    return (
        <div className="App">
            <Header/>
            <Main/>
        </div>
    );
}

export default Home;