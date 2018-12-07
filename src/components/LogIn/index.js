import React from 'react';

import {Link} from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import * as tuomas from '../../tuomas.js';


function LogIn() {
    return (
        <div className='LogIn'>
            <h1>This is Login</h1>
            <button><Link to={ROUTES.HOME}>Kirjaudu käyttäjänä</Link></button>
            <button><Link to={ROUTES.HOMEPRO}>Kirjaudu ohjaavana ammattilaisena</Link></button><Link to={ROUTES.HOMEPRO}></Link>
            <button onClick={ () => {
                tuomas.randomizeUrl();
            }}><h3>Generate url</h3></button>
        </div>

    );

}

export default LogIn;