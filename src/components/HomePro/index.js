import React, {Component} from 'react';
import './HomePro.css';
import firebase from '../../firebase/firebase.js';
import * as sanna from '../../sanna.js';
import * as ROUTES from "../../constants/routes";
import {Link} from 'react-router-dom';
import {Collapse} from 'react-collapse';
import {getColour, Comments} from "../Home";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {Profile} from "../Profile";
import logo from "../../OON.svg";

function LogOut() {
    return (
        <div className="headerButtonContainer">
            <button className="headerButton">
                <Link className="headerButtonLink" to={ROUTES.LANDING}><i className="fas fa-sign-out-alt"></i> Kirjaudu
                    ulos</Link>
            </button>
        </div>
    );
}

// Lähetetään osaaminen
const sendToDb = () => {
    sanna.testDb();
};

/*
// Nappi lähettää databaseen testiarvon.
function DbButton() {
    return (
        <a href="#" onClick={sendToDb}>
            Testinappi
        </a>
    );
}
*/


// Sivun yläpalkki.
function Header() {
    return (
        <div className="Header">
            <div className="logoContainer">
                <img src="https://cdn.discordapp.com/attachments/507585455999418368/521387737161400342/Asset_2.png"/>
            </div>
            <div className="headerButtons">
                <LogOut/>
            </div>
        </div>
    );
}

/**
 * Valitaan väri riippuen siitä, onko kommenttipyyntö uusi vai onko sitä jo katsottu.
 * @param seen
 * @returns {string}
 */
function getColor(seen) {
    if (seen === 'false') {
        return '#e48255';
    }
    return '#47C786';
}

/**
 * Yksittäinen käyttäjä listassa.
 * @param props
 * @returns {*}
 * @constructor
 */
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seen: 'true',
            fName: '',
            lName: ''
        };
    }

    // Lähetetään parentille käsky onSelectUser eli kerrotaan mikä käyttäjä valitaan.
    handleUserChange = () => {
        this.setState({
            seen: 'true'
        });

        firebase.database().ref().child('shareToUser/userid2/' + this.props.userId + '/seen').set('true');
        this.props.onSelectUser(this.props.userId);
    };

    componentDidMount() {
        const postsRef = firebase.database().ref().child('shareToUser/userid2/' + this.props.userId + '/seen');

        postsRef.on('value', snap => {
            this.setState({
                seen: snap.val()
            });
        });

        const ref = firebase.database().ref('profile/' + this.props.userId + '');
       // console.log(this.props.userId);
        ref.once('value', snap => {
           // console.log(snap.val());
            this.setState({
                fName: snap.val().fName,
                lName: snap.val().lName
            })
        });
    }

    render() {
        let colour = getColor(this.state.seen);

        return (
            <li className="Skill">
                <div className="skillColorTag" style={{backgroundColor: colour}}>
                </div>
                <div className="skillContent clickable" onClick={this.props.buttonClick}>
                    <p className="selectUserButton"
                       onClick={this.handleUserChange}>{this.state.fName} {this.state.lName}</p>
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
    if (Object.keys(userArray).length === 0 && userArray.constructor === Object) {
        userArray = [''];
    }

    return (
        <ul className="SkillList">
            {userArray.map((content, id) => {
                return <User key={id} userId={content} id={id} buttonClick={props.buttonClick}
                             onSelectUser={props.onSelectUser}/>
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

    componentDidMount() {
        const postsRef = firebase.database().ref().child('shareToUser/userid2/');

        postsRef.on('value', snap => {
            let ar = [];

            snap.forEach(function (childSnapshot) {
                ar[ar.length] = childSnapshot.key;
            });
            this.setState({
                users: ar
            });
        });
    }

    // Vaihdetaan sisältöä, jos nappia on klikattu.
    changeButtonState(event) {
        this.setState({content: !this.state.content});
    }

    // Childiltä tulee arvo, joka kertoo minkä käyttäjän tietoja halutaan nähdä.
    handleUser(value) {
        this.setState({userid: value});
    };

    render() {

        // Näytetään tietyn käyttäjän jakamat postaukset Posts.
        if (this.state.content === false) {
            return (
                <div>
                    <div className="headerButtonContainer greenButton">
                        <button className="headerButton clickable "
                                onClick={this.changeButtonState.bind(this)}>
                            <a className="headerButtonLink"><i className="fas fa-long-arrow-alt-left"></i> Takaisin</a>
                        </button>
                    </div>
                    <Posts userid={this.state.userid}/>
                </div>
            )
        }
        // Näytetään lista käyttäjistä.
        return (
            <div className="usersListWrapper">
                <h3>Henkilöt, jotka ovat jakaneet osaamisensa sinulle:</h3>
                <UserList users={this.state.users} buttonClick={this.changeButtonState.bind(this)}
                          onSelectUser={this.handleUser.bind(this)}/>
            </div>
        )
    }
}

// Palautetaan muotoiltu sisältö, jos osaamisessa on tiettyjä alueita.

function GetTools(props) {
    if (props.info.tools) {
        return (
            <div>
                <h4>Työvälineet:</h4>
                <br></br>
                <p>{props.info.tools}</p>
                <br></br>
            </div>
        );
    }
    return (<div></div>)
}

function GetSteps(props) {
    if (props.info.steps) {
        return (
            <div>
                <h4>Työvaiheet:</h4>
                <br></br>
                <p>{props.info.steps}</p>
                <br></br>
            </div>
        );
    }
    return (<div></div>)
}

function GetRating(props) {
    if (props.info.rating) {
        return (
            <div>
                <h4>Itsearviointi</h4>
                <br></br>
                <p>{props.info.rating} / 4</p>
                <br></br>
            </div>
        );
    }
    return (<div></div>)
}

function GetPicture(props) {
    if (props.info.picture) {
        return (
            <div>
                <img className="postImg" src={props.info.picture}/>
                <br></br>
                <br></br>
            </div>
        );
    }
    return (<div></div>)
}

function GetNewSection1(props) {
    if (props.info.newsection1) {
        return (
            <div>
                {/*TODO otsikko muokattavissa, on käyttäjän lisäämä uusi osio*/}
                <h4>Muuta:</h4>
                <br></br>
                <p>{props.info.newsection1}</p>
                <br></br>
            </div>
        );
    }
    return (<div></div>)
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
            <div className="postFormPro">
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
            button: <i className="fas fa-angle-down openPostArrow"></i>,
            value: '',
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
                            this.setState({button: <i className="fas fa-angle-down openPostArrow"></i>,});
                        }
                        else {
                            this.setState({isOpened: true});
                            this.setState({button: <i className="fas fa-angle-up openPostArrow"></i>,});
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
                    <Tabs>
                        <TabList>
                            <Tab>Osaaminen</Tab>
                            <Tab>Kommentit</Tab>
                        </TabList>
                        <TabPanel>
                            <PostForm info={this.props.info} id={this.props.id}/>
                        </TabPanel>
                        <TabPanel>
                            <Comments postid={this.props.info.postId} userid='userid2'
                                      user={true}/> {/*TODO hae oikea userid*/}
                        </TabPanel>
                    </Tabs>
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
            <div className="skillColorTag" style={{backgroundColor: colour}}>
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
    if (Object.keys(postArray).length === 0 && postArray.constructor === Object) {
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
    constructor(props) {
        super(props);
        this.state = {
            posts: {},
            message: '',
            fName: '',
            lName: ''
        };
    }

    componentDidMount() {
        const user = this.props.userid;
       // console.log(user);
        const sharedPosts = firebase.database().ref().child('shareToUser/userid2/' + user + '/posts/');

        sharedPosts.on('value', snap => {
            let postid = snap.val();
            let postArray = [];

            // Tehdään jaetuista osaamisista lista.
            postid.forEach((post) => {
                let postsRef = firebase.database().ref().child('posts/' + user + '/' + post + '');
                postsRef.on('value', snap => {
                    // Jos käyttäjä on poistanut jaetun postauksen, antaisi errorin ilman tätä if-lausetta.
                    if (snap.val()) {
                        const addId = snap.val(); // Lisätään objektiin postauksen id //TODO pitäiskö olla suoraan databasessa?
                        addId.postId = post;
                        postArray[postArray.length] = addId;
                    }
                });
            });

            this.setState({
                posts: postArray
            });
        });

        // Haetaan viesti.
        const sharedMessage = firebase.database().ref().child('shareToUser/userid2/' + user + '/message/');

        sharedMessage.on('value', snap => {
            this.setState({
                message: snap.val()
            });
        });

        const ref = firebase.database().ref('profile/' + this.props.userid + '');
       // console.log(this.props.userId);
        ref.once('value', snap => {
           // console.log(snap.val());
            this.setState({
                fName: snap.val().fName,
                lName: snap.val().lName
            })
        });
    }

    render() {
        if (this.state.message !== '') {
            return (
                <div>
                    <div className="userHeadlines">
                        <h2>Henkilön {this.state.fName} {this.state.lName} osaaminen</h2>
                        <div className="proMessageContainer">
                            <p className="messageHeader">Viesti:</p>
                            <p>{this.state.message}</p>
                        </div>
                    </div>
                    <SkillList posts={this.state.posts}/>
                </div>
            );
        }
        return (
            <div>
                <div className="userHeadlines">
                    <h2 className="pelle">Henkilön {this.state.fName} {this.state.lName} osaaminen</h2>
                </div>
                <SkillList posts={this.state.posts}/>
            </div>
        );
    }
}

// Sivun varsinanen sisältö
function Main() {
    return (
        <div className="Main homeProMain">

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