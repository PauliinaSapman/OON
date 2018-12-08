import './Shared.css';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {addUrlProps, UrlQueryParamTypes, configureUrlQuery} from 'react-url-query';
import firebase from '../../firebase/firebase.js';
import createHistory from 'history/createBrowserHistory';
import * as tuomas from '../../tuomas.js';


const history = createHistory();

configureUrlQuery({history});

/**
 * Specify how the URL gets decoded here. This is an object that takes the prop
 * name as a key, and a query param specifier as the value. The query param
 * specifier can have a `type`, indicating how to decode the value from the
 * URL, and a `queryParam` field that indicates which key in the query
 * parameters should be read (this defaults to the prop name if not provided).
 */
const urlPropsQueryConfig = {
    id: {type: UrlQueryParamTypes.string},
};


function Profile(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <div className='sharedHeader'>

            <div className="sharedHeaderItem">
                <img src={props.profile.pic}/>
            </div>

            <div className="sharedHeaderItem">
                <h4><i className="fas fa-user-alt"></i> {props.profile.fName} {props.profile.lName}</h4>
                <h4><i className="fas fa-envelope"></i> {props.profile.email}</h4>
                <h4><i className="fas fa-phone"></i> {props.profile.phone}</h4>
                <h4 onClick={() => {
                    tuomas.makePDF({fName: props.profile.fName, lName: props.profile.lName,});
                }} className="downloadPDFBtn" id="ignorePDF1"><i className="fas fa-download"></i> Lataa PDF</h4>
            </div>


        </div>;
    }
    return <div className='sharedHeader'>
        <h3>Tuntematon</h3>
    </div>;
}

function SharedSkillSectionCheck(props) {
    const doesExist = props.content;
    if (doesExist) {
        if (props.title === 'Kuvat') {
            return (<div className="sharedSkillContentSection innerSection">
                <div className="skillPicture">
                    <img src={props.content}/>
                </div>
                <div className="skillPictureHidden">
                    <img src={props.content}/>
                </div>


            </div>);
        } else {
            return (<div className="sharedSkillContentSection innerSection">
                <h4>{props.title}</h4>
                <p>{props.content}</p>

            </div>);
        }


    } else {
        return null;
    }
}

function SkillShared(props) {
    return (
        <li className="SkillShared">
            <div className="skillSharedContent">
                <div className="sharedSkillContentSection">
                    <h3>{props.skillInfo.title}</h3>

                    <SharedSkillSectionCheck title={"Työkalut"} content={props.skillInfo.tools}/>

                    <SharedSkillSectionCheck title={"Tyovaiheet"} content={props.skillInfo.steps}/>

                    <SharedSkillSectionCheck title={"Muuta"} content={props.skillInfo.newsection1}/>

                    <SharedSkillSectionCheck title={"Kuvat"} content={props.skillInfo.picture}/>
                </div>

            </div>
        </li>
    );
}

function SkillsListShared(props) {


    let postArray = props.skillsData;

    // Jos objekti on tyhjä, annetaan sille arvo. Näin käy kun tietokannasta ei ole haettu riittävän nopeasti.
    if (Object.keys(postArray).length === 0 && postArray.constructor === Object) {
        postArray = [''];
    }


    return (
        <ul className="SkillsListShared">
            {/* Looppaa kaikki parametrina annetun listan alkiot ja tekee jokaisesta osaamisen(Skill) */}
            {postArray.map((r, post) => {
                return <SkillShared key={post} skillInfo={r} id={post}/>
            })}


        </ul>
    );
}


class Shared extends PureComponent {
    constructor() {
        super();
        this.state = {
            posts: [],
            profile: {},
            sharedIDs: [],
        };
    }

    static propTypes = {
        id: PropTypes.string,
        // and `addChangeHandlers` isn't false. They use `replaceIn` by default, just
        // updating that single query parameter and keeping the other existing ones.
        onChangeId: PropTypes.func,
        onChangeUrlQueryParams: PropTypes.func,
    };

    static defaultProps = {
        id: '',
    };


    componentDidMount() {
        const {
            id
        } = this.props;


        let profileRef = firebase.database().ref();
        profileRef.child('profile/').orderByChild('urlId').equalTo(id).on('value', snap => {
            console.log(snap.val());
            snap.forEach(data => {
                console.log(data.key);

                if (snap.val()) {
                    this.setState({
                        profile: snap.val()[Object.keys(snap.val())[0]]
                    });
                } else {
                    this.setState({
                        profile: {}
                    });
                }

                console.log(this.state.profile);

                const pathToUser = 'posts/' + data.key + '/';

                // hakee databasesta mitä postauksia halutaan jakaa
                firebase.database().ref().child('shareToEveryone/' + data.key + '/posts/').on('value', snap => {

                    let listOfIDs = snap.val();

                    if (listOfIDs) {

                        let newPosts = [];

                        for (let i in listOfIDs) {

                            // haetaan databasesta ne postaukset jotka ovat jaettavien postauksien listalla
                            firebase.database().ref().child(pathToUser + snap.val()[i]).on('value', snap => {

                                let postFromDb = snap.val();

                                if (postFromDb) {
                                    newPosts[i] = (postFromDb);
                                }
                            });
                        }
                        this.setState({
                            posts: newPosts
                        });
                    } else {
                        this.setState({
                            sharedIDs: []
                        });
                    }
                });
            });
        });

    }



    render() {


        return (
            <div className='Shared'>
                <div className="sharedPaper">


                    <Profile isLoggedIn={true} profile={this.state.profile}/>
                    <hr/>
                    <div className='sharedMain'>

                        <SkillsListShared skillsData={this.state.posts}/>
                    </div>
                </div>

            </div>
        );

    }
}

/**
 * We use the addUrlProps higher-order component to map URL query parameters
 * to props for MainPage. In this case the mapping happens automatically by
 * first decoding the URL query parameters based on the urlPropsQueryConfig.
 */
export default addUrlProps({urlPropsQueryConfig})(Shared);