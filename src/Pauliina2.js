import React, {Component} from 'react';
import Select from "react-select";
import {ModalButton} from "react-modal-button";
//import firebase from './firebase/firebase.js';
import * as sanna from './sanna.js'
import './components/Home/Home.css'; // luokka clickable -> kursori nappiin
// Komponentteihin lisätään myös "Lisää" -napin toiminnallisuus. Kun nappia painetaan avautuu/paljastuu uusi vaihe osaamisen
// määrittelyyn !!HUOM!! mulla oli joku syy miks oon laittanu jokasen osan omaks komponentiks mut en just nyt muista sitä..

//Valittavat Kategoriat
const Kategoriat = [
    { label: "Autot", value: 1 },
    { label: "Tietotekniikka", value: 2 },
    { label: "Musiikki", value: 3 },
    { label: "Ruuanlaitto", value: 4 },
    { label: "Talotyöt", value: 5 },
    { label: "Nikkarointi", value: 6 },
];

//Valittavat arviot
const Itsearvionti = [
    { label: 1, value: 1},
    { label: 2, value: 2},
    { label: 3, value: 3},
    { label: 4, value: 4},
];

let savedValues = {
    category    : '',
    title       : '',
    rating      : '',
    tools       : '',
    steps       : '',
    picture     : '',
    newsection1 : ''
};

/**
 * Tallennetaan lokaalisti muuttujaan savedValues kohtaan section arvo value
 * @param section
 * @param value
 */
const setValues = (section, value) => {
    savedValues[section] = value;
};


//Kategorian valitseminen
export class SelectCategory extends Component {

    // kun Selectin arvo muuttuu, kutsutaan funktiota setValues, joka tallentaa arvon tilapäisesti
    handleChange(selectedOption) {
        const value = selectedOption.label;
        setValues('category', value);
    }

    render() {
        return (
            <div>
                <Select placeholder = "Kategoria" options={Kategoriat} onChange={this.handleChange}></Select>
            </div>
        );
    }
}

//Osaamisen otsikko
export class NewTitle extends Component {

    // sama kuin selectissä, mutta tässä joudutaan ottaa event.target.value (Select on kirjasto, jossa se ei toimi)
    handleChange(event) {
        const value = event.target.value;
        setValues('title', value);
    }

    render () {
        return (
            <div>
                <div className="NewTitleMain">
                    <div className="header">
                        <form /*onSubmit={}*/>
                            <input placeholder="Otsikko" onBlur={this.handleChange}>
                            </input>
                            <button className="title" type="submit">Lisää</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

//Itsearvionti
export class SelfEvulation extends Component {

    handleChange(selectedOption) {
        const value = selectedOption.label;
        setValues('rating', value);
    }

    render() {
        return (
            <div>
                <Select placeholder="Itsearvionti"  options={Itsearvionti} onChange={this.handleChange}></Select>
            </div>
        );
    }
}

//Työkalujen listaus
export class AddTools extends Component {

    handleChange(event) {
        const value = event.target.value;
        setValues('tools', value);
    }

    render () {
        return (
            <div>
                <div className="AddToolsMain">
                    <div className="header">
                        <form>
                            <textarea placeholder="Tarvittavat työkalut" onBlur={this.handleChange}>
                            </textarea>
                            <button className="tools" type="submit">Lisää</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

//Vaiheiden luettelu
export class EnterSteps extends Component {

    handleChange(event) {
        const value = event.target.value;
        setValues('steps', value);
    }

    render () {
        return (
            <div>
                <div className="EnterStepsMain">
                    <div className="header">
                        <form>
                            <textarea placeholder="Työn vaiheet" onBlur={this.handleChange}>
                            </textarea>
                            <button className="steps" type="submit">Lisää</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

//Lisää oma osio (Tulossa)


//Modaalin sisältö kasattuna
export class NewButton extends Component {

    // lähetetään kaikki tiedot savedValues
    handleSubmit(e) {
        e.preventDefault();
        sanna.sendToDb(savedValues);
    }

    render() {
        return (
            <ModalButton
                buttonClassName="New clickable"
                windowClassName="window-container"
                modal={({ closeModal }) => (
                    <form className="NewModal" onSubmit={this.handleSubmit}>
                        <div><SelectCategory/></div>
                        <div><NewTitle/></div>
                        <div><SelfEvulation/></div>
                        <div><AddTools/></div>
                        <div><EnterSteps/></div>
                        <div>
                            <input type="file" className="AddPicture"></input>
                        </div>
                        <button className="Modal" type="submit" onClick={closeModal}><h3>Tallenna</h3></button>
                    </form>
                )}>
                <h1> + Lisää uusi osaaminen </h1>
            </ModalButton>
        );
    }
}