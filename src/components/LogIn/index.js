import React from 'react';

import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';


function LogIn() {
    return (
        <div>
            <h1>This is Login</h1>
            <button><Link to={ROUTES.HOME}>Home</Link></button><Link to={ROUTES.HOME}></Link>
            <button><Link to={ROUTES.HOMEPRO}>Home Pro</Link></button><Link to={ROUTES.HOMEPRO}></Link>
        </div>
    );

}

export default LogIn;