import React from 'react';

import {Link} from 'react-router-dom';

import './LogIn.css';

import * as ROUTES from '../../constants/routes';
import * as tuomas from '../../tuomas.js';


function LogIn() {
    return (
        <div className="LogIn">

            <div className='logIn'>
                <h1>Oma Osaaminen Näkyväksi</h1>
                <button className="loginButton"><Link to={ROUTES.HOME}><h3>Kirjaudu käyttäjänä</h3></Link></button>
                <button className="loginButton"><Link to={ROUTES.HOMEPRO}><h3>Kirjaudu ohjaavana ammattilaisena</h3>
                </Link></button>
                {/*<button onClick={ () => {
                tuomas.randomizeUrl();
            }}><h3>Generate url</h3></button>*/}
            </div>
        </div>

    );

}

export default LogIn;