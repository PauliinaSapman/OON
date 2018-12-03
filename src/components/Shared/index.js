import './Shared.css';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {addUrlProps, UrlQueryParamTypes, configureUrlQuery} from 'react-url-query';
import firebase from '../../firebase/firebase.js';
import createHistory from 'history/createBrowserHistory';


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
            <img src={props.profile.pic}/>
            <h3>Nimi: {props.profile.fName} {props.profile.lName}</h3>
        </div>;
    }
    return <div className='sharedHeader'>
        <h3>Tuntematon</h3>
    </div>;
}

function SkillShared(props) {
    return (
        <li className="SkillShared">
            <div className="skillSharedContent">
                <h1>{props.skillInfo.title}</h1>
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
            posts: {},
            profile: {},
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

                const postsRef = firebase.database().ref().child(pathToUser);

                postsRef.on('value', snap => {

                    if (snap.val()) {
                        this.setState({
                            posts: snap.val()
                        });
                    } else {
                        this.setState({
                            posts: []
                        });
                    }


                });
            });
        });


        console.log(this.state.posts);
    }


    render() {

        return (
            <div className='Shared'>
                <Profile isLoggedIn={true} profile={this.state.profile}/>

                <div className='sharedMain'>

                    <SkillsListShared skillsData={this.state.posts}/>
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