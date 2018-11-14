import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
<<<<<<< HEAD
import MoreInfo from "./Pauliina2";
import { ModalButton } from "react-modal-button";
import Select from "react-select";
=======


>>>>>>> e801e950ff440a179bf13ee3fd6111a078524326

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

// Sivun yläpalkki.
function Header() {
    return (
        <div className="Header">
            <h1>Yläpalkki</h1>

        </div>
    );
}

<<<<<<< HEAD
//Uusi osaaminen nappula ja modaalin sisältöä
function New() {
    const Kategoriat = [
        { label: "Autot", value: 1 },
        { label: "IT", value: 2 },
        { label: "Musiikki", value: 3 },
        { label: "Ruuanlaitto", value: 4 },
        { label: "Talotyöt", value: 5 },
        { label: "Nikkarointi", value: 6 },
    ];
    return (
        <ModalButton
            buttonClassName="New"
            windowClassName="window-container"
            modal={({ closeModal }) => (
                <div className="Modal">
                    <button className="tallenna" onClick={closeModal}><h3>Tallenna</h3></button>
                    <Select options={Kategoriat}>Valitse kategoria</Select>
                    <button onClick={MoreInfo}>Uusi ominaisuus</button>
                </div>
            )}
        >
            <h1> + Lisää uusi osaaminen </h1>
        </ModalButton>
    );

}


=======
>>>>>>> e801e950ff440a179bf13ee3fd6111a078524326
// Sivun varsinanen sisältö
function Main() {

    // Placeholder lista tietokannasta haetuista osaamisista.
    const skillsList = [
        {   name: "renkaat",
<<<<<<< HEAD
            category: "autot lol",
=======
            category: "autot",
>>>>>>> e801e950ff440a179bf13ee3fd6111a078524326
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
<<<<<<< HEAD
=======
            <h1>+ lisää uus =)</h1>
>>>>>>> e801e950ff440a179bf13ee3fd6111a078524326
            <SkillList skillList={skillsList}/>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <Header/>
<<<<<<< HEAD
            <New/>
=======
>>>>>>> e801e950ff440a179bf13ee3fd6111a078524326
            <Main/>
        </div>
    );
}

<<<<<<< HEAD

=======
>>>>>>> e801e950ff440a179bf13ee3fd6111a078524326
export default App;
