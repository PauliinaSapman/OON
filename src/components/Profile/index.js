import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import './Profile.css';
import firebase from "../../firebase/firebase";
import * as sanna from '../../sanna.js'

import { Form, Text, Scope, TextArea, Option} from 'informed';


class Post extends Component {
    constructor(props){
        super(props);

        this.state = {
            posts: []
        }
    }

    render() {
        return (
            <li className="profileList">{this.props.info}</li>
        )
    }
}

class GetShared extends Component {
    constructor(props){
        super(props);

        this.state = {
            posts: []
        }
    }


    componentDidMount() {
        const user = 'userid';
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
                        postArray[postArray.length] = snap.val().title;
                    }
                });
            });

            this.setState({
                posts: postArray
            });
           // console.log(this.state.posts);
        });

    }

    render() {
        return (
            <div className="skillListWrapper">
                <h4>Henkilölle Maisa Auttaja:</h4>
                    <ul className="">
                        {/* Looppaa kaikki parametrina annetun listan alkiot ja tekee jokaisesta osaamisen(Skill) */}
                        {this.state.posts.map((r, post) => {
                            return <Post key={post} info={r}/>
                        })}
                    </ul>
            </div>
        )
    }
}


class UserInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            userinfo : {},
            email: 'masa.testi@gmail.com',
            phone: '',
            editProfile: <div>
                <div className="profileName">
                    <h2></h2>
                </div>
                <img className="profilePicture" src={''}/>
                <div className="profileAdditionalInfo">
                    <p></p>
                    <p></p>
                </div>
                <button className="profileEditButton clickable" onClick={this.editInfo}><i className="far fa-edit"></i> Muokkaa</button>
            </div>
        };
        this.editInfo = this.editInfo.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.setInitialValues = this.setInitialValues.bind(this);
    }

    setInitialValues() {
        this.setState({editProfile: <div className="profileInfo">
                <div className="profileName">
                    <h2>{this.state.userinfo.fName} {this.state.userinfo.lName}</h2>
                </div>
                <img className="profilePicture" src={this.state.userinfo.pic}/>
                <div className="profileAdditionalInfo">
                    <p>{this.state.userinfo.email}</p>
                    <p>{this.state.userinfo.phone}</p>
                </div>
                <button className="profileEditButton clickable" onClick={this.editInfo}><i className="far fa-edit"></i> Muokkaa</button>
            </div>})
    }

    componentDidMount(){
        const me = this;
        const userid = 'userid';
        const ref = firebase.database().ref('profile/'+userid+'');

        ref.once('value', function(snapshot)
        {
            let info = snapshot.val();
            if(info){
                me.setState({userinfo: info});
                console.log(info);
            }
            me.setInitialValues();
        });


    }

    saveChanges(value){
        console.log('save');
        console.log(value.email);
        console.log(value.phone);

        let fName = this.state.userinfo.fName;
        let lName = this.state.userinfo.lName;
        let pic = this.state.userinfo.pic;
        let email = this.state.userinfo.email;
        let phone = this.state.userinfo.phone;

        if(value.email){
            email = value.email;
            this.setState({email:value.email});
        }
        if(value.phone) {
           phone = value.phone;
        }

        sanna.saveProfile('userid', fName, lName, pic, email, phone);


        this.setInitialValues();
    }

    showError(e) {
        console.log(e);
        if(e.fName){
            alert(e.fName);
        }
        if(e.lName){
            alert(e.lName);
        }
        if(e.email){
            alert(e.email);
        }
        if(e.phone){
            alert(e.phone);
        }
    }


    editInfo(){
        const validateName = (value) => {
            return !value || !value.match(/^[A-Za-z]+$/i) ? 'Nimi saa sisältää vain kirjaimia.' : null;
        };

        const validateEmail = (value) => {
            return !value || !value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? 'Sähköpostiosoitteen tulee olla muodossa sähkö.posti@sposti.com' : null;
        };

        const validatePhone = (value) => {
            return !value || !value.match(/^[0-9]{9,11}$/i) ? 'Puhelinnumeron tulee olla muodossa 0401231234.' : null;
        };

        this.setState({editProfile: <div className="editProfileFormWrapper">
                <Form onSubmit={this.saveChanges} onSubmitFailure={this.showError} className="editProfileForm">
                    <label htmlFor="text-fName">Etunimi</label>
                    <Text field="fName" id="text-fName" initialValue={this.state.userinfo.fName} autoComplete='off' validate={validateName}/>

                    <label htmlFor="text-lName">Sukunimi</label>
                    <Text field="lName" id="text-lName" initialValue={this.state.userinfo.lName} autoComplete='off' validate={validateName}/>

                    <label htmlFor="text-pic">Kuvan url-osoite</label>
                    <Text field="pic" id="text-pic" initialValue={this.state.userinfo.pic} autoComplete='off'/>

                    <label htmlFor="text-email">Sähköposti</label>
                    <Text field="email" id="text-email" initialValue={this.state.userinfo.email} autoComplete='off' validate={validateEmail}/>

                    <label htmlFor="text-phone">Puhelinnumero</label>
                    <Text field="phone" id="text-phone" initialValue={this.state.userinfo.phone} autoComplete='off' validate={validatePhone}/>

                    <button className="profileEditButton clickable" type="submit">Tallenna</button>
                    {/* TODO Peruuta-nappi*/}
                </Form>
            </div>})
    }

    render() {
        return(
            <div className="profileFull">
                {/*<h1>Profiili</h1>*/}
                <div className="profileContent">
                    {this.state.editProfile}
                    <div className="profileLine"></div>
                    <div className="profileShared">
                        <h2>Jakaminen</h2>
                        <GetShared/>
                    </div>
                </div>
            </div>
        )
    }
}

// Sivun yläpalkki.
function Header() {
    return (
        <div className="Header">
            <h1>OON</h1>
            <div className="headerButtons">
                <button className="returnButton"><Link to={ROUTES.HOME}><i className="fas fa-long-arrow-alt-left"></i> Takaisin</Link></button>
            </div>
        </div>
    );
}

function Profile() {
    return (
        <div className="profileMain">
            <Header/>
            <UserInfo/>
        </div>

    );

}

export default Profile;