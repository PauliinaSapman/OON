import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import './Profile.css';
import firebase from "../../firebase/firebase";



class Post extends Component {
    constructor(props){
        super(props);

        this.state = {
            posts: []
        }
    }

    render() {
        return (
            <li className="list">{this.props.info}</li>
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
            console.log(this.state.posts);
        });

    }

    render() {
        return (
            <div className="skillListWrapper">
                <h4>Henkilölle Maisa Auttaja:</h4>
                    <ul className="SkillList">
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
            userinfo : {}
        }
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
            }
        });
    }

    render() {
        return(
            <div className="full">
                <h1>Profiili</h1>
                <div className="content">
                    <div className="profileinfo">
                        <div className="profilename">
                            <h2>{this.state.userinfo.fName} {this.state.userinfo.lName}</h2>
                        </div>
                        <img className="profilepicture" src={this.state.userinfo.pic}/>
                        <div className="profileadditionalinfo">
                            <p>masa.testi@gmail.com</p>
                            <p>0401239875</p>
                        </div>
                        <button className="editButton">Muokkaa</button>
                    </div>
                    <div className="shared">
                        <h2>Jaetut osaamiset</h2>
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
                <button><Link to={ROUTES.HOME}>Takaisin</Link></button>
            </div>
        </div>
    );
}

function Profile() {
    return (
        <div className="main">
            <Header/>
            <UserInfo/>
        </div>

    );

}

export default Profile;