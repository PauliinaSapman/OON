import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js';
import * as sanna from './sanna.js';


// Listassa näkyvä yksittäinen osaaminen
// Parametrinä annetaan objekti jonka sisällä on osaamisen nimi, kategoria ja väri
function Skill(props) {
    return (
        <li className="Skill">
            <div className="skillColorTag" style={{backgroundColor : props.skillInfo.color}}>
            </div>
            <div className="skillContent">
                <p>{props.skillInfo.category}</p>
                <h3>{props.skillInfo.name}</h3>
            </div>

        </li>
    );
}

// Osaamisia sisältävä lista.
// Parametrinä annetaan lista kaikista osaamisista.
function SkillList(props) {
    return (
        <ul className="SkillList">

            {/* Looppaa kaikki parametrina annetun listan alkiot ja tekee jokaisesta osaamisen(Skill) */}
            {props.skillList.map( (skill, i)=> {
                return <Skill key={i} skillInfo={skill}/>
            } )}

        </ul>
    );
}

function DbButton() {
    return (
        <a href="#" onClick={sanna.sendToDb}>
            Click me
        </a>
    );
}

// Sivun yläpalkki.
function Header() {
    return (
        <div className="Header">
            <h1>Yläpalkki</h1>
            <DbButton/>
        </div>
    );
}

// Sivun varsinanen sisältö
function Main() {

    // Placeholder lista tietokannasta haetuista osaamisista.
    const skillsList = [
        {   name: "renkaat",
            category: "autot",
            color: "#a826d9"},

        {   name: "makkaraperunat",
            category: "ruoka",
            color: "#52bcd9"},

        {   name: "kurkkumopo",
            category: "autot",
            color: "#a826d9"},

        {   name: "1 burtsa + kylmä kolle",
            category: "ruoka",
            color: "#52bcd9"}
    ];
    return (
        <div className="Main">
            <h1>+ lisää uus =)</h1>
            <SkillList skillList={skillsList}/>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <Header/>
            <Main/>
        </div>
    );
}

export default App;
