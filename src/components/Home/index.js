import React, {Component} from 'react';

import './Home.css';
//import { ModalButton } from "react-modal-button";
import Select from "react-select";
import firebase from '../../firebase/firebase.js';
import * as sanna from '../../sanna.js';
import * as ROUTES from "../../constants/routes";
import { Link } from 'react-router-dom';
import {Collapse} from 'react-collapse';
import { Form, Text, Scope, TextArea, Option} from 'informed';
import {AddTools, EnterSteps, NewButton, NewTitle, SelectCategory, SelfEvulation} from "../../Pauliina2";
import Dialog from 'react-dialog'
import {Modal, ModalButton} from "react-modal-button";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Tooltip from 'react-tooltip-lite';

import commenticon from '../../iconfinder_Streamline-59_185079.png'

function LogOut () {
    return (
        <button>
            <Link to={ROUTES.LANDING}>Log Out</Link>
        </button>
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
    constructor(props){
        super(props);
        this.state = {
            posts: {}
        }
    }

    componentDidMount(){
        const postsRef = firebase.database().ref().child('posts/userid/');

        postsRef.on('value', snap => {
            this.setState({
                posts: snap.val()
            });
        });
    }

    render() {
        return(
            <SkillList posts={this.state.posts} justTitle='true'/>
        );
    }
}


class Notification extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false,
        }
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    // Avataan modaali heti kun saadaan prop arvo open
    componentWillReceiveProps(nextProps){
        if(nextProps.open) {
            this.setState({isModalOpen: true});
        }
    }

    render() {
        return (
            <div>
                <Modal windowClassName="window-container" isOpen={this.state.isModalOpen} onClose={this.closeModal}>
                    <div>
                        <h2>{this.props.notificationTitle}</h2>
                        <button className="clickable" onClick={this.closeModal}>Sulje</button>
                    </div>
                </Modal>
            </div>
        );
    }
}


class ShareButton extends Component {
    constructor(props){
        super(props);
        this.state = {
            message : '',
            checkedValues: [],
            selected:'',
            isModalOpen: false,
            openNotification: false,
            content:  <div>
                <h2>Mitä haluat jakaa?</h2>
                <PostTitles/>
                <button className="clickable">Tallenna PDF</button>
                <button className="clickable">Hanki jaettava linkki</button>
                <button className="clickable" onClick={()=>{this.changeContent('askComment')}}>Pyydä kommenttia</button>
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
        this.setState({ selected: option });
    };


    checked = () => {
        if(titleArray.length === 0){
            return checks;
        }
        return titleArray;
    };

    send = () => {
        let to = this.state.selected;
        let message = this.state.message;

        if(this.state.selected==='') {
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

    setMessage = (event) => {
        this.setState({message: event.target.value});
    };

    changeContent(content){
        const people = [
            {value: 'userid2', label: 'Maisa Auttaja'}
        ];

        if(titleArray.length===0 && checks.length===0){
            alert('Valitse, mitä haluat jakaa.');
        } else {
            switch (content) {
                case 'auto':
                    this.setState({
                        content: <div>
                            <h2>Mitä haluat jakaa?</h2>
                            <PostTitles/>
                            <button className="clickable">Tallenna PDF</button>
                            <button className="clickable">Hanki jaettava linkki</button>
                            <button className="clickable" onClick={() => {
                                this.changeContent('askComment')
                            }}>Pyydä kommenttia
                            </button>
                        </div>
                    });
                    break;
                case 'askComment':
                    this.setState({
                        content: <div>
                            <h2>Kenelle haluat jakaa?</h2>
                            <Select placeholder='Valitse henkilö...' onChange={this.handleChange}
                                    options={people}></Select>
                            <textarea placeholder="Kirjoita viesti..." onBlur={this.setMessage}></textarea>
                            <button className="clickable" onClick={() => {
                                this.send();
                                this.closeModal();
                            }}>Lähetä
                            </button>
                            <button className="clickable" onClick={() => {
                                this.changeContent('auto');
                                this.resetChecks();
                            }}>Peruuta
                            </button>
                        </div>
                    });
                    break;
            }
        }
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
        this.resetChecks();
    };

    resetChecks = () => {
        checks = [];
        titleArray = [];
    };

    // TODO kaikki checkboxit checkautuvat kun valitaan 'Kaikki'

    render() {
        return (

            <div>
                <button className="shareButton clickable" onClick={this.openModal}>Jaa ↷</button>
                <Modal windowClassName="window-container" isOpen={this.state.isModalOpen} onClose={this.closeModal}>
                    {this.state.content}
                </Modal>
                <Notification open={this.state.openNotification} notificationTitle='Jakaminen onnistui.'/>
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

// Sivun yläpalkki.
function Header() {
    return (
        <div className="Header">
            <h1>OON</h1>
            <LogOut/>
            <ShareButton/>
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
            <Form id="postForm" onSubmit={this.handleSubmit}>
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
                    <button className="clickable" type="submit">
                        Tallenna
                    </button>
                </div>
            </Form>
        )}
}

/**
 * Yksittäinen kommentti.
 */
class Comment extends Component {
    constructor(props){
        super(props);
        this.state = {
            seen: <div className="checkmarkIcon center clickable"><p>✓</p></div>
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const me = this;
        const postid = this.props.postid;
        const commentId = this.props.info.commentId;

        // tarkistetaan onko käyttäjä merkinnyt kommentin nähdyksi
        firebase.database().ref('comments/userid/'+postid+'/'+commentId+'').once('value', function(snapshot)
        {
           const value = snapshot.val();
           if(value){
               if(value.seen === 'true'){
                   me.setState({seen: <div></div>})
               }
           }
        });
    }

    handleClick() {
        if(!this.props.user){
            this.setState({seen: <div></div>});
            const postid = this.props.postid;
            const commentId = this.props.info.commentId;

            sanna.setCommentSeen(postid, commentId);
        }

    }

    render() {
        if(this.props.info) {
            if(this.props.user){
                return (
                    <li className="singleComment">
                        <div className="commentLeft">
                            <h5>{this.props.info.userid}</h5>
                            <p>{this.props.info.comment}</p>
                        </div>
                        <div className="commentRight center" onClick={this.handleClick}>
                            <Tooltip content={'Kommenttiasi ei ole vielä huomioitu.'} background="#F0F0F0">
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
                        <Tooltip content={'Paina tästä kertoaksesi, että olet huomannut kommentin.'} background="#F0F0F0">
                            {this.state.seen}
                        </Tooltip>
                    </div>
                </li>
            );
        }
        return(<li className="center"><p>Ei kommentteja.</p></li>);
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
    if(Object.keys(commentArray).length === 0 && commentArray.constructor === Object){
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
    constructor(props){
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
        sanna.sendComment('Maisa Auttaja:', this.props.postid, newComment)
        this.setState({value: ''});
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    componentDidMount() {
        const me = this;
        const postid = this.props.postid;
        const ref = firebase.database().ref('comments/userid/'+postid+'');

        ref.on('value', function(snap){
            if(snap.val()) {
                let value;
                let newArray = [];
                // lisätään objektiin sen avain eli kommentin id
                snap.forEach(function(childSnapshot) {
                    value = childSnapshot.val();
                    value.commentId = childSnapshot.key;
                    newArray[childSnapshot.key] = value;
                });
                me.setState({comments: newArray});
            }
        });
    }

    render(){
        if(this.props.user){ // ohjaava ammattilainen
            return(
                <div>
                    <CommentList comments={this.state.comments} postid={this.props.postid} user={true}/>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" value={this.state.value} onChange={this.handleChange} autoComplete='off'/>
                        <button className="clickable" type="submit">Kommentoi</button>
                    </form>
                </div>
            );
        }
        return( // käyttäjä
            <div>
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

    openDialog = () => this.setState({ isDialogOpen: true });
    handleClose = () => this.setState({ isDialogOpen: false });

    confirmDelete () {
        if(this.props.postid){
            sanna.deletePost(this.props.postid);
        } else {
            console.log('Could not get post id.');
        }
        this.handleClose();
    };

    render() {
        return (
            <div className="container">
                <button className="deletePost" type="button" onClick={this.openDialog}>Poista osaaminen</button>
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
            button: '▼',
            value:'',
            id: '',
            commenticon: <div/>
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const post = this.props.id;

        if (window.confirm('Haluatko varmasti poistaa tämän osaamisen?')){
            sanna.deletePost(post);
        }

    }

    componentDidMount() {
        const me = this;
        const postid = this.props.id;

        // tarkistetaan onko kommenttia, jota käyttäjä ei ole merkinnyt nähdyksi
        firebase.database().ref('comments/userid/'+postid+'').once('value', function(snapshot)
        {
            const value = snapshot.val();
            if(value) {
                if (value.constructor.name === "Array") {
                    value.forEach((val) => {
                        if(val.seen === 'false'){
                            me.setState({commenticon:
                                <Tooltip content={'Uusi kommentti.'} background="#F0F0F0">
                                    <img className="icon" src={commenticon}/>
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
    if(titleArray.length === 0) {
        {
            postArray.map((r, post) => {
                titleArray[titleArray.length] = post;
            })
        }
    } else{
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
                       className="clickable"
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

    if(props.justTitle){
        return (
            <li>
                <div className="flexBetween">
                    <p>{props.skillInfo.title}</p>
                    {/*} <input type="checkbox" id="myCheck" checked={checked} onClick={()=>{getChecks(props.id)}}></input>*/}
                    <Checkbox id={props.id}/>
                </div>
            </li>
        );
    }
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

    // Haetaan vain postauksien otsikko, menee jakomodaaliin
    if(props.justTitle){
        return (
            <ul className="SkillTitleList">
                <li>
                    <div className="flexBetween">
                        <p>Kaikki</p>
                        {/*<input type="checkbox" id="myCheck" onClick={()=>{checkAll()}}></input>*/}
                        <input type="checkbox" className="clickable" onClick={()=>{handleAllChecked(postArray)}}/>
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
    constructor(props){
        super(props);
        this.state = {
            posts: {}
        };
    }

    componentDidMount(){
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
            <NewButton/>
            <Main/>
        </div>
    );
}

export default Home;