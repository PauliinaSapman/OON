import React, {Component} from 'react';

import './Home.css';
//import { ModalButton } from "react-modal-button";
import Select from "react-select";
import firebase from '../../firebase/firebase.js';
import * as sanna from '../../sanna.js';
import * as tuomas from '../../tuomas.js';
import * as ROUTES from "../../constants/routes";
import {Link} from 'react-router-dom';
import {Collapse} from 'react-collapse';
import {Form, Text, Scope, TextArea, Option, RadioGroup, Radio} from 'informed';
import {NewButton} from "../../Pauliina2";
import {FindButton} from "../../Pauliina2";
import Dialog from 'react-dialog'
import {Modal} from "react-modal-button";
import logo from '../../unknown.png';

import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Tooltip from 'react-tooltip-lite';

import commenticon from '../../iconfinder_Streamline-59_185079.png'
import ApiTest, {apiTesti} from "../../tuomas";



function LogOut() {
    return (
        <div className="headerButtonContainer">
            <button className="headerButton ">
                <Link className="headerButtonLink" to={ROUTES.LANDING}><i className="fas fa-sign-out-alt"></i><span className="navBarLinkText"> Kirjaudu ulos</span></Link>
            </button>
        </div>
    );
}


// Lähetetään esimerkkiosaaminen, testikäyttöön
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
        category: 'Ruuanlaitto',
        title: 'Perunankuorinta',
        rating: '2',
        tools: 'Peruna, kuorimaveitsi, kädet.',
        steps: 'Otetaan peruna käteen ja toisella kädellä kuoritaan kuorimaveitsellä itseenpäin vetäen.',
        picture: 'kuva tähän',
        newsection1: 'Osaan kuoria muitakin juureksia.'
    };

    // lähetetään databaseen postaukseen 1
    sanna.sendToDb(values, 1);
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

class PostTitles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: {}
        }
    }

    componentDidMount() {
        const postsRef = firebase.database().ref().child('posts/userid/');

        postsRef.on('value', snap => {
            this.setState({
                posts: snap.val()
            });
        });
    }

    render() {
        return (
            <SkillList posts={this.state.posts} justTitle='true'/>

        );
    }
}


class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
        }
    }

    closeModal = () => {
        this.setState({isModalOpen: false});

    };

    // Avataan modaali heti kun saadaan prop arvo open
    componentWillReceiveProps(nextProps) {
        if (nextProps.open) {
            this.setState({isModalOpen: true});
        }
    }

    render() {
        return (
            <div>
                <Modal windowClassName="window-container" isOpen={this.state.isModalOpen} onClose={this.closeModal}>
                    <div>
                        <h2>{this.props.notificationTitle}</h2>
                        <button className="clickable click" onClick={
                            this.closeModal
                        }>Sulje
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
}


class ShareButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            checkedValues: [],
            selected: '',
            isModalOpen: false,
            openNotification: false,
            content: <div className="ShareModal">
                <h2>Mitä haluat jakaa?</h2>
                <div className="ShareRow">
                    <PostTitles/>
                    <div className="shareModalButtonContainer">
                        <button className="clickable shareModalButton" onClick={() => {
                            this.sendToShared();
                            this.changeContent('sharePDF')
                        }
                        }>Hanki jaettava linkki
                        </button>
                        <button className="clickable shareModalButton" onClick={() => {
                            this.changeContent('askComment')
                        }}>Pyydä kommenttia
                        </button>
                    </div>
                </div>


            </div>
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.send = this.send.bind(this);
    }

    // lähetetään kaikki tiedot savedValues
    handleSubmit(e) {
        this.changeContent('auto');
    }

    handleChange = (selectedOption) => {
        const option = selectedOption.value;
        this.setState({selected: option});
    };

    /*
        checked = () => {
            if (titleArray.length === 0) {
                return checks;
            }
            return titleArray;
        };
        */

    send = () => {
        let to = this.state.selected;
        let message = this.state.message;

        if (this.state.selected === '') {
            alert('Valitse henkilö, jolle haluat jakaa osaamisesi.');
        }
        else {
            if (titleArray.length === 0) { // jos käyttäjä on valinnut osan
                sanna.askComment(to, 'userid', checks, message);
            } else { // jos käyttäjä on valinnut kaikki
                sanna.askComment(to, 'userid', titleArray, message);
            }

            this.setState({openNotification: true});
        }
    };

    // Tuomaan juttuja; lähettää listan valituista postauksista databaseen jaettavaa sivua (ja pdf:ää) varten :)
    sendToShared = () => {
        if (titleArray.length === 0) { // jos käyttäjä on valinnut osan
            tuomas.sharePosts(checks);
        } else { // jos käyttäjä on valinnut kaikki
            tuomas.sharePosts(titleArray);
        }
    };


    setMessage = (event) => {
        this.setState({message: event.target.value});
    };

    changeContent(content) {
        const people = [
            {value: 'userid2', label: 'Maisa Auttaja'}
        ];

        if (titleArray.length === 0 && checks.length === 0 && content !== 'auto') {
            alert('Valitse, mitä haluat jakaa.');
        } else {
            switch (content) {
                case 'auto':
                    this.setState({
                        content: <div className="ShareRow">
                            <h2>Mitä haluat jakaa?</h2>
                            <PostTitles/>
                            <div className="shareModalButtonContainer">
                                <button className="clickable shareModalButton" onClick={() => {
                                    this.sendToShared();
                                    this.changeContent('sharePDF')
                                }
                                }>Hanki jaettava linkki
                                </button>
                                <button className="clickable shareModalButton" onClick={() => {
                                    this.changeContent('askComment')
                                }}>Pyydä kommenttia
                                </button>
                            </div>
                        </div>

                    });
                    break;
                case 'askComment':
                    this.setState({
                        content: <div className="ShareModal shareToUserModal">
                            <div><h2>Kenelle haluat jakaa?</h2>
                                <Select placeholder='Valitse henkilö...' onChange={this.handleChange}
                                        options={people}>

                                </Select>
                                <textarea className="Viesti" placeholder="Kirjoita viesti..." onBlur={this.setMessage}>

                            </textarea></div>


                            <div className="shareToUserButtonContainer">
                                <button className="clickable shareToUserButton" onClick={() => {
                                    this.changeContent('auto');
                                    this.resetChecks();
                                }}><i className="fas fa-ban"></i> Peruuta
                                </button>
                                <button className="clickable shareToUserButton" onClick={() => {
                                    this.send();
                                    this.closeModal();
                                }}>Lähetä
                                </button>

                            </div>

                        </div>
                    });
                    break;
                case 'sharePDF':
                    this.setState({
                        content: <div className="ShareModal pdf">
                            <div>

                                <h1>Jaa osaamisesi</h1>

                                <div className="sharePDFSection">
                                    <p>Jaettavan sivusi osoite</p>
                                    <div className="sharePDFTextAreaContainer clickable">
                                        <textarea></textarea>
                                        <div onClick={() => {
                                            tuomas.copyToClipboard();
                                        }} className="copyToClipboard"><i className="fas fa-paste"></i></div>
                                    </div>
                                </div>

                                <hr className="hr"/>

                                <div className="sharePDFSection">
                                    <p>Generoi uusi osoite jaettavalle sivullesi ja samalla mitätöi vanha. Muistathan jakaa uuden linkin uudestaan niille henkilöille, joiden
                                        haluat näkevän sivusi, sillä vanha linkki poistetaan käytöstä.</p>
                                    <button className="clickable" onClick={() => {
                                        tuomas.randomizeUrl();
                                        tuomas.copyToClipboard();
                                    }
                                    }><i class="fas fa-redo-alt"></i> Generoi uusi osoite
                                    </button>

                                </div>
                                <hr className="hr"/>
                            </div>



                            <button className="clickable click" onClick={() => {
                                this.changeContent('auto');
                                this.resetChecks();
                            }}><i className="fas fa-ban"></i> Peruuta
                            </button>
                        </div>
                    });
                    break;
            }
        }
    }

    openModal = () => {
        this.setState({isModalOpen: true});
        this.setState(
            {openNotification: false}
        );
        this.changeContent('auto');
    };

    closeModal = () => {
        this.setState({isModalOpen: false});

    };

    resetChecks = () => {
        checks = [];
        titleArray = [];
    };

    // TODO kaikki checkboxit checkautuvat kun valitaan 'Kaikki'

    render() {
        return (
            <div className="headerButtonContainer">
                <button className="headerButton clickable" onClick={this.openModal}>
                    <a className="headerButtonLink"><i className="fas fa-share-alt"></i><span className="navBarLinkText"> Jaa</span></a>
                </button>
                <Modal windowClassName="window-container" isOpen={this.state.isModalOpen} onClose={this.closeModal}>
                    {this.state.content}
                </Modal>
                <Notification windowClassName="window-containertwo" open={this.state.openNotification}
                              notificationTitle='Jakaminen onnistui.'/>
            </div>


            /*
            <ModalButton
                buttonClassName="shareButton clickable"
                windowClassName="window-container"
                modal={({ closeModal }) => (
                    <Form id="sendForm" >
                        {this.state.content}
                        {/*<button className="Modal" type="submit" onClick={closeModal}><h3>Sulje</h3></button>*/ /*)}
                    </Form>
                )}>
                <h2> Jaa ↷</h2>
            </ModalButton>
*/
        );
    }
}

function Profile() {
    return (
        <div className="headerButtonContainer">
            <button className="headerButton">
                <Link className="headerButtonLink" to={ROUTES.PROFILE}><i className="fas fa-user"></i><span className="navBarLinkText"> Profiili</span></Link>
            </button>
        </div>

    );
}
function CopyRight() {
    return (
        <div className="copyrightContainer">
            <hr className="copyRightDivider"/>
            <p className="copyRightText">Copyright 2018 © NäytönPaikka</p>
        </div>

    );
}


// Sivun yläpalkki.
function Header() {
    return (
        <div className="Header">
            <div className="logoContainer">
                <img src="https://cdn.discordapp.com/attachments/507585455999418368/531509068632686611/np-logo.png"/>

            </div>
            <div className="headerButtons">
                <Profile/>
                <ShareButton/>
                <div className="logOutButton">
                     <LogOut/>
                    <CopyRight/>
                </div>
            </div>
        </div>
    );
}


/**
 * Valitaan väri kategorian mukaan.
 * @param category
 * @returns {string}
 */
export function getColour(category) {
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

// TODO CSS lomakkeelle
// TODO Kuvan toteuttaminen ?
// TODO Ratingin toteuttaminen ?
// TODO modaali sulkeutuu kun lähetetään ja info että onnistui

/**
 * Osaaminen eli post esitetään muokattavana lomakkeena.
 */
class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            selected: ''
        };
    }

    // Lähetetään lomakkeen arvot databaseen.
    handleSubmit = (e) => {
        const values = {
            category: this.state.selected,
            title: e.title,
            rating: e.rating,
            tools: e.tools,
            steps: e.steps,
            picture: e.picture,
            newsection1: e.newsection1
        };

        const id = this.props.id;
        sanna.sendToDb(values, id);
    };

    // Valitaan selectistä kategorian arvo.
    handleChange = (selectedOption) => {
        const option = selectedOption.value;
        this.setState({selected: option});
    };

    // Asetetaan kategorian arvo placeholderiksi selectiin, sekä sen arvoksi.
    componentDidMount() {
        let category = '';

        if (this.props.info.category) {
            category = this.props.info.category;
        }
        this.setState({selected: category});
    }

    render() {
        const Kategoriat = [
            {label: "Autot", value: 'Autot'},
            {label: "Tietotekniikka", value: 'Tietotekniikka'},
            {label: "Musiikki", value: 'Musiikki'},
            {label: "Ruuanlaitto", value: 'Ruuanlaitto'},
            {label: "Talotyöt", value: 'Talotyöt'},
            {label: "Nikkarointi", value: 'Nikkarointi'},
        ];

        return (
            <Form id="postForm" className="postForm" onSubmit={this.handleSubmit}>
                <div className="editPostFormWrap">
                    {/*<p>{this.props.id}</p>*/}
                    <Select placeholder={this.state.selected} value={this.state.selected} onChange={this.handleChange}
                            options={Kategoriat} className="postFormSelect" theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: '#F0F0F0',
                            primary: 'none',
                            primary75: '#E9ECF0',
                            primary50: '#E9ECF0'
                        },
                    })}>Kategoria</Select>
                    <br></br>
                    <label htmlFor="textarea-title">Otsikko:</label>
                    <br></br>
                    <TextArea field="title" id="textarea-title" className="postFormTitle"
                              initialValue={this.props.info.title}/>
                    <br></br>
                    <br></br>
                    <label htmlFor="textarea-tools">Työvälineet:</label>
                    <br></br>
                    <TextArea field="tools" id="textarea-tools" initialValue={this.props.info.tools}/>
                    <br></br>
                    <br></br>
                    <label htmlFor="textarea-steps">Työvaiheet:</label>
                    <br></br>
                    <TextArea field="steps" id="textarea-steps" initialValue={this.props.info.steps}/>
                    <br></br>
                    <br></br>
                    {/*<Text field="rating" id="text-rating" initialValue={this.props.info.rating}/>*/}
                    <label htmlFor="radio-rating">Itsearviointi: </label>
                    <br></br>
                    <RadioGroup field="rating" id="radio-rating" initialValue={this.props.info.rating}>
                        <label htmlFor="radio-one">1</label>
                        <Radio value="1" id="radio-one" className="radioButton"/>
                        <label htmlFor="radio-two">2</label>
                        <Radio value="2" id="radio-two" className="radioButton"/>
                        <label htmlFor="radio-three">3</label>
                        <Radio value="3" id="radio-three" className="radioButton"/>
                        <label htmlFor="radio-four">4</label>
                        <Radio value="4" id="radio-four" className="radioButton"/>
                    </RadioGroup>
                    <br></br>
                    <br></br>
                    <img src={this.props.info.picture} alt='' className="postImg"/>
                    <br></br>
                    <label htmlFor="text-picture">Kuvan url: </label>
                    <br></br>
                    <Text field="picture" id="text-picture" initialValue={this.props.info.picture}/>
                    <br></br>
                    <br></br>
                    {/*TODO otsikko muokattavissa, on käyttäjän lisäämä uusi osio*/}
                    <label htmlFor="textarea-newsection1">Muuta:</label>
                    <br></br>
                    <TextArea field="newsection1" id="textarea-newsection1" initialValue={this.props.info.newsection1}/>
                    <br></br>
                    <div className="savePostButtonWrapper">
                        <button className="clickable savePostButton" type="submit">
                            Tallenna
                        </button>
                    </div>
                </div>
            </Form>
        )
    }
}

/**
 * Yksittäinen kommentti.
 */
class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seen: <div className="checkmarkIcon center clickable"><i className="fas fa-check-circle"></i></div>,
            commentState: 'Paina tästä kertoaksesi, että olet huomannut kommentin.',
            commentStatePro: 'Kommenttiasi ei ole vielä huomioitu.'
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const me = this;
        const postid = this.props.postid;
        const commentId = this.props.info.commentId;

        // tarkistetaan onko käyttäjä merkinnyt kommentin nähdyksi
        firebase.database().ref('comments/userid/' + postid + '/' + commentId + '').once('value', function (snapshot) {
            const value = snapshot.val();
            if (value) {
                if (value.seen === 'true') {
                    me.setState({
                        seen: <div className="checkmarkIconChecked center clickable"><i
                            className="far fa-check-circle"></i></div>
                    });
                    me.setState({commentState: 'Olet huomannut tämän kommentin.'});
                    me.setState({commentStatePro: 'Kommenttisi on otettu huomioon.'});
                }
            }
        });
    }

    handleClick() {
        if (!this.props.user) {
            this.setState({
                seen: <div className="checkmarkIconChecked center clickable"><i className="far fa-check-circle"></i>
                </div>
            });
            this.setState({commentState: 'Olet huomannut tämän kommentin.'});
            this.setState({commentStatePro: 'Kommenttisi on otettu huomioon.'});
            const postid = this.props.postid;
            const commentId = this.props.info.commentId;

            sanna.setCommentSeen(postid, commentId);
        }

    }

    render() {
        if (this.props.info) {
            if (this.props.user) {
                return (
                    <li className="singleComment">
                        <div className="commentLeft">
                            <h5>{this.props.info.userid}</h5>
                            <p>{this.props.info.comment}</p>
                        </div>
                        <div className="commentRight center" onClick={this.handleClick}>
                            <Tooltip content={this.state.commentStatePro} background="rgba(0,0,0,0.3)" color="white">
                                {this.state.seen}
                            </Tooltip>
                        </div>
                    </li>
                );
            }
            return (
                <li className="singleComment">
                    <div className="commentLeft">
                        <h5>{this.props.info.userid}</h5>
                        <p>{this.props.info.comment}</p>
                    </div>
                    <div className="commentRight center" onClick={this.handleClick}>
                        <Tooltip content={this.state.commentState}
                                 background="rgba(0,0,0,0.3)" color="white">
                            {this.state.seen}
                        </Tooltip>
                    </div>
                </li>
            );
        }
        return (<li className="center"><p>Ei kommentteja.</p></li>);
    }
}

/**
 * Lista kommenteista
 * @param props
 * @returns {*}
 * @constructor
 */
function CommentList(props) {
    let commentArray = props.comments;

    // Jos objekti on tyhjä, annetaan sille arvo. Näin käy kun tietokannasta ei ole haettu riittävän nopeasti.
    if (Object.keys(commentArray).length === 0 && commentArray.constructor === Object) {
        commentArray = [''];
    }

    return (
        <ul className="SkillList">
            {/* Looppaa kaikki parametrina annetun listan alkiot ja tekee jokaisesta osaamisen(Skill) */}
            {commentArray.map((r, post) => {
                return <Comment key={post} info={r} postid={props.postid} user={props.user}/>
            })}
        </ul>
    );
}

/**
 * Kommentointiosio
 */
export class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            comments: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const newComment = this.state.value;
        // TODO Staattisen nimen tilalle haettaisiin databasesta this.props.userid :n kautta nimi
        sanna.sendComment('Maisa Auttaja:', this.props.postid, newComment);
        this.setState({value: ''});
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    componentDidMount() {
        const me = this;
        const postid = this.props.postid;
        const ref = firebase.database().ref('comments/userid/' + postid + '');

        ref.on('value', function (snap) {
            if (snap.val()) {
                let value;
                let newArray = [];
                // lisätään objektiin sen avain eli kommentin id
                snap.forEach(function (childSnapshot) {
                    value = childSnapshot.val();
                    value.commentId = childSnapshot.key;
                    newArray[childSnapshot.key] = value;
                });
                me.setState({comments: newArray});
            }
        });
    }

    render() {
        if (this.props.user) { // ohjaava ammattilainen
            return (
                <div className="commentWrap">
                    <CommentList comments={this.state.comments} postid={this.props.postid} user={true}/>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" value={this.state.value} onChange={this.handleChange} autoComplete='off'
                               className="sendCommentInput"/>
                        <button className="clickable sendCommentButton" type="submit">Kommentoi</button>
                    </form>
                </div>
            );
        }
        return ( // käyttäjä
            <div className="commentWrap">
                <CommentList comments={this.state.comments} postid={this.props.postid}/>
            </div>
        );
    }
}

/**
 * Dialogi, jolla varmistetaan osaamisen poistaminen.
 */
class DeletePostDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDialogOpen: false
        };

        this.confirmDelete = this.confirmDelete.bind(this);
    }

    openDialog = () => this.setState({isDialogOpen: true});
    handleClose = () => this.setState({isDialogOpen: false});

    confirmDelete() {
        if (this.props.postid) {
            sanna.deletePost(this.props.postid);
        } else {
            console.log('Could not get post id.');
        }
        this.handleClose();
    };

    render() {
        return (
            <div className="container">
                <button className="deletePost" type="button" onClick={this.openDialog}><i
                    className="far fa-trash-alt"></i> Poista osaaminen
                </button>

                {
                    this.state.isDialogOpen &&
                    <Dialog
                        title="Haluatko varmasti poistaa tämän osaamisen?"
                        modal={true}
                        onClose={this.handleClose}
                        buttons={
                            [{
                                text: "Kyllä",
                                onClick: () => this.confirmDelete(),
                                className: "dialogButton"
                            }, {
                                text: "Ei",
                                onClick: () => this.handleClose(),
                                className: "dialogButton"
                            }]
                        }>
                        {/* <h1>Dialog Content</h1> */}
                    </Dialog>
                }
            </div>
        );
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
            button: <i className="fas fa-caret-down"></i>,
            value: '',
            id: '',
            commenticon: <div/>
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const post = this.props.id;

        if (window.confirm('Haluatko varmasti poistaa tämän osaamisen?')) {
            sanna.deletePost(post);
        }

    }

    componentDidMount() {
        const me = this;
        const postid = this.props.id;

        // tarkistetaan onko kommenttia, jota käyttäjä ei ole merkinnyt nähdyksi
        firebase.database().ref('comments/userid/' + postid + '').once('value', function (snapshot) {
            const value = snapshot.val();
            if (value) {
                if (value.constructor.name === "Array") {
                    value.forEach((val) => {
                        if (val.seen === 'false') {
                            me.setState({
                                commenticon:
                                    <Tooltip content={'Uusi kommentti.'} background="rgba(0,0,0,0.3)" color="white">
                                        {/*<img className="icon" src={commenticon}/>*/}
                                        <i className="far fa-comment-dots"></i>
                                    </Tooltip>
                            })
                        }
                    })
                }
            }
        });
    }

    render() {
        const {isOpened} = this.state;

        return (
            <div>
                <div>
                    <div className="postTop clickable" onClick={() => {
                        if (this.state.isOpened === true) {
                            this.setState({isOpened: false});
                            this.setState({button: <i className="fas fa-caret-down openPostArrow"></i>});
                        }
                        else {
                            this.setState({isOpened: true});
                            this.setState({button: <i class="fas fa-caret-up openPostArrow"></i>});
                        }
                    }
                    }>
                        <div className="postHeadline">
                            <p>{this.props.info.category}</p>
                            <h3>{this.props.info.title}</h3>
                        </div>
                        <div className="postOpen">
                            <div>{this.state.commenticon}</div>
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
                            <br></br>
                            <DeletePostDialog postid={this.props.id}/>
                        </TabPanel>
                        <TabPanel>
                            <Comments postid={this.props.id} userid='userid'/> {/*TODO hae oikea userid*/}
                        </TabPanel>
                    </Tabs>
                </Collapse>
            </div>
        );
    }
}

let checks = [];
let titleArray = [];

function getChecks(id) {
    checks[checks.length] = id;
}

function handleAllChecked(postArray) {
    if (titleArray.length === 0) {
        {
            postArray.map((r, post) => {
                titleArray[titleArray.length] = post;
            })
        }
    } else {
        titleArray = [];
    }
}

class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
        };
    }

    toggleChange = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });

    };

    addChecked = () => {
        getChecks(this.props.id);
    };

    render() {
        return (
            <label>
                <input type="checkbox"
                       className="clickable regular-checkbox big-checkbox"

                       checked={this.state.isChecked}
                       onChange={this.toggleChange}
                       onClick={this.addChecked}
                />
            </label>
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

    if (props.justTitle) {
        return (
            <li>
                <div className="flexBetween">
                    <p>{props.skillInfo.title}</p>
                    {/* <input type="checkbox" id="myCheck" checked={checked} onClick={()=>{getChecks(props.id)}}></input>*/}
                    <Checkbox id={props.id}/>
                </div>
            </li>
        );
    }
    return (
        <li className="Skill">
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

    // Haetaan vain postauksien otsikko, menee jakomodaaliin
    if (props.justTitle) {
        return (
            <ul className="SkillTitleList">
                <li>
                    <div className="flexBetween more">
                        <p>Kaikki</p>
                        {/*<input type="checkbox" id="myCheck" onClick={()=>{checkAll()}}></input>*/}
                        <input type="checkbox" className="clickable regular-checkbox big-checkbox" onClick={() => {

                            handleAllChecked(postArray)
                        }}/>
                    </div>
                </li>
                {postArray.map((r, post) => {
                    return <Skill key={post} skillInfo={r} id={post} justTitle='true'/>
                })}
            </ul>
        );
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
    constructor(props) {
        super(props);
        this.state = {
            posts: {}
        };
    }

    componentDidMount() {
        const postsRef = firebase.database().ref().child('posts/userid/');

        postsRef.on('value', snap => {
            this.setState({
                posts: snap.val()
            });
        });
    }

    render() {
        return (
            <div className="Posts">
                <SkillList posts={this.state.posts}/>
            </div>
        );
    }
}

// Sivun varsinanen sisältö
function Main() {
    return (
        <div className="Main">
            <NewButton/>
            <FindButton/>
            <Posts/>
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