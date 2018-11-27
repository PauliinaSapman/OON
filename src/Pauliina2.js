import React, {Component} from 'react';
import Select from "react-select";
import {ModalButton} from "react-modal-button";
import firebase from './firebase/firebase.js';

//myöhemmin noutaa suoraan databasesta valittavat arvot(kö?)
const Kategoriat = [
    { label: "Autot", value: 1 },
    { label: "Tietotekniikka", value: 2 },
    { label: "Musiikki", value: 3 },
    { label: "Ruuanlaitto", value: 4 },
    { label: "Talotyöt", value: 5 },
    { label: "Nikkarointi", value: 6 },
];

//myöhemmin noutaa suoraan databasesta valittavat arvot/(kö?)
const Itsearvionti = [
    { label: 1, value: 1},
    { label: 2, value: 2},
    { label: 3, value: 3},
    { label: 4, value: 4},
];


export class SelectCategory extends Component {
    render() {
        return (
            <div>
                <Select placeholder = "Kategoria" options={Kategoriat}></Select>
            </div>
        );
    }
}

export class NewTitle extends Component {
    render () {
        return (
            <div>
                <div className="NewTitleMain">
                    <div className="header">
                        <form onSubmit={this.addItem}>
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

export class SelfEvulation extends Component {
    render() {
        return (
            <div>
                <Select placeholder="Itsearvionti"  options={Itsearvionti}></Select>
            </div>
        );

    }
}


export class AddTools extends Component {
    render () {
        return (
            <div>
                <div className="AddToolsMain">
                    <div className="header">
                        <form>
                            <input type="text" placeholder="Tarvittavat työkalut">
                            </input>
                            <button className="tools" type="submit">Lisää</button>
                        </form>
                    </div>
                </div>

            </div>
        );
    }

}

export class EnterSteps extends Component {
    render () {
        return (
            <div>
                <div className="EnterStepsMain">
                    <div className="header">
                        <form>
                            <input type="text" placeholder="Työn vaiheet">
                            </input>
                            <button className="steps" type="submit">Lisää</button>
                        </form>
                    </div>
                </div>

            </div>
        );
    }

}

export class NewButton extends Component {
    render() {
        return (
            <ModalButton
                buttonClassName="New"
                windowClassName="window-container"
                modal={({ closeModal }) => (
                    <form>
                        <div><SelectCategory/></div>
                        <div><NewTitle/></div>
                        <div><SelfEvulation/></div>
                        <div><AddTools/></div>
                        <div><EnterSteps/></div>
                        <button className="Modal" type="submit" onClick={closeModal}><h3>Tallenna</h3></button> //OnClick lähettää tietokantaan
                    </form>
                )}
            >
                <h1> + Lisää uusi osaaminen </h1>
            </ModalButton>
        );
    }
}