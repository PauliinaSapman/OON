import React, {Component} from 'react';

import './HomePro.css';
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
            <h1>OON - ohjaavan ammattilaisen sivu</h1>
            <DbButton/>
            <LogOut/>
        </div>
    );
}

/**
 * Valitaan väri riippuen, onko pyydetty kommenttia.
 * @param note
 * @returns {string}
 */
function getColour(note) {
    if(note){
        return 'red';
    }
    return 'green';
}


/**
 * Yksittäinen osaaminen listassa.
 * @param props
 * @returns {*}
 * @constructor
 */
class User extends Component{
    constructor(props) {
        super(props);
        this.state = {
            note: true
        };
    }

    render() {
        let colour = getColour(this.state.note);

        return (
            <li className="Skill">
                <div className="skillColorTag" style={{backgroundColor: colour}}>
                </div>
                <div className="skillContent">
                    <p>{this.props.userInfo} + {this.props.id}</p>
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
function UserList(props) {
    let userArray = props.users;

    // Jos objekti on tyhjä, annetaan sille arvo. Näin käy kun tietokannasta ei ole haettu riittävän nopeasti.
    if(Object.keys(userArray).length === 0 && userArray.constructor === Object){
        userArray = [''];
    }
console.log(userArray);
    return (
        <ul className="SkillList">
            {userArray.map((content, id) => {
                console.log(id);
                console.log(content);
                return <User key={id} userInfo={content} id={id}/>
            })}
        </ul>
    );
}




class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {}
        };
    }

    componentDidMount(){
        // TODO tämä Sannaan? Päivitysjuttu tänne?
        const postsRef = firebase.database().ref().child('shareToUser/userid2/');

        postsRef.on('value', snap => {
            console.log(snap.val());
            this.setState({
                users: snap.val()
            });
        });
    }

    render() {
        console.log(this.state.users);
        return (
            <div>
                <ul>
                    <UserList users={this.state.users}/>
                </ul>
            </div>
        )
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
