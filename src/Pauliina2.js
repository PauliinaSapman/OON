import React, {Component} from 'react';
import Select from "react-select";
import {ModalButton} from "react-modal-button";
//import firebase from './firebase/firebase.js';

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

//Kategorian valitseminen
export class SelectCategory extends Component {
    render() {
        return (
            <div>
                <Select placeholder = "Kategoria" options={Kategoriat}></Select>
            </div>
        );
    }
}

//Osaamisen otsikko
export class NewTitle extends Component {
    render () {
        return (
            <div>
                <div className="NewTitleMain">
                    <div className="header">
                        <form /*onSubmit={}*/>
                            <input placeholder="Otsikko">
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
    render() {
        return (
            <div>
                <Select placeholder="Itsearvionti"  options={Itsearvionti}></Select>
            </div>
        );
    }
}

//Työkalujen listaus
export class AddTools extends Component {
    render () {
        return (
            <div>
                <div className="AddToolsMain">
                    <div className="header">
                        <form>
                            <textarea placeholder="Tarvittavat työkalut">
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
    render () {
        return (
            <div>
                <div className="EnterStepsMain">
                    <div className="header">
                        <form>
                            <textarea placeholder="Työn vaiheet">
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
    render() {
        return (
            <ModalButton
                buttonClassName="New"
                windowClassName="window-container"
                modal={({ closeModal }) => (
                    <form className="NewModal" /*onSubmit={}*/>
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