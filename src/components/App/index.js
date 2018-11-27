import React, {Component} from 'react';

import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import HomePage from '../Home';
import LandingPage from '../Landing';
import HomeProPage from '../HomePro';

import * as ROUTES from '../../constants/routes';

import Landing from '../Landing/index.js'




function App () {

    return (
        <Router>
            <div>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route exact path={ROUTES.HOME} component={HomePage} />
                <Route exact path={ROUTES.HOMEPRO} component={HomeProPage} />
            </div>

        </Router>
    );

}

export default App;