import React, {Component} from 'react';
import Select from "react-select";
import {ModalButton} from "react-modal-button";
//import firebase from './firebase/firebase.js';
import * as sanna from './sanna.js'
import Modal from 'react-responsive-modal';
import firebase from "./firebase/firebase";
import Tooltip from "react-tooltip-lite";
import {Collapse} from "react-collapse";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {Comments} from "./components/Home";

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
            <div className="addPostFormSection">
                <Select className="Category" placeholder = "Kategoria" options={Kategoriat} onChange={this.handleChange}></Select>
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
            <div className="addPostFormSection">
                            <input placeholder="Otsikko" onBlur={this.handleChange}>
                            </input>
            </div>
        );
    }
}

//Itsearvionti
export class SelfEvulation extends Component {

    handleChange(selectedOption) {
        const value = selectedOption.target.value;
        setValues('rating', value);
    }

    render() {
        return (
            <div className="addPostFormSection">
                <div className="selfEval">
                    <p>Itsearvionti</p>
                    <div className="radio">
                        <input type="radio" value="1" name="rating"  onChange={this.handleChange}></input> 1
                        <input type="radio" value="2" name="rating"  onChange={this.handleChange}></input> 2
                        <input type="radio" value="3" name="rating"  onChange={this.handleChange}></input> 3
                        <input type="radio" value="4" name="rating"  onChange={this.handleChange}></input> 4
                    </div>
                </div>
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
            <div className="addPostFormSection">
                            <textarea placeholder="Tarvittavat työkalut" onBlur={this.handleChange}>
                            </textarea>
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
            <div className="addPostFormSection">
                            <textarea placeholder="Työn vaiheet" onBlur={this.handleChange}>
                            </textarea>

            </div>
        );
    }
}

//Lisää kuva
export class AddFile extends Component {
    handleChange(event) {
        const value = event.target.value;
        setValues('picture', value)
    }

    render () {
        return (
            <div  className="addPostFormSection">
                <input placeholder="Lisää kuvan URL" onChange={this.handleChange}/>
            </div>
        )
    }}

//Lisää oma osio (Tulossa)
export  class NewSection extends Component {
    handleChange(event) {
        const value = event.target.value;
        setValues('newsection1', value);
    }

    render () {
        return (
            <div className="addPostFormSection">
                           <textarea placeholder="Muuta" onBlur={this.handleChange}>
                            </textarea>

            </div>
        )
    }}


//Lisää uusi osaamisen määrittely

let contents = [];

export class AddButton extends Component {
    constructor() {
        super();
        this.state = {
            showMenu: false,
        };

        this.showMenu = this.showMenu.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    showMenu(event) {
        event.preventDefault();

        this.setState({
            showMenu: true,
        });
    }

    //Uuden komponentin valitseminen "+Lisää" napin alta
    handleClick(e, compName){
        e.preventDefault();
       // console.log(compName);
        contents[contents.length] = compName;
       // console.log(contents);
        //  this.setState({render:compName});
        this.setState({render: contents});
    }

    renderComponent(){
        let r = contents;
        let s = <div></div>

        let rating = <div></div>;
        let tools = <div></div>;
        let steps = <div></div>;
        let picture = <div></div>;
        let newsection1 = <div></div>;

        if(r) {
            r.forEach((render) => {
                // console.log(render);
                switch (render) {
                    case 'rating':
                        //  return <SelfEvulation/>
                        rating = <SelfEvulation/>
                        break;
                    case 'tools' :
                        //  return <AddTools/>
                        tools = <AddTools/>
                        break;
                    case 'steps':
                        //  return <EnterSteps/>
                        steps = <EnterSteps/>
                        break;
                    case 'picture' :
                        //  return <AddFile/>
                        picture = <AddFile/>
                        break;
                    case 'newsection1'  :
                        // return <NewSection/>
                        newsection1 = <NewSection/>
                        break;


                }
              //  console.log(s);
            });

            let n = <div>{rating}{tools}{steps}{picture}{newsection1}</div>;

            return <div>{n}</div>;
        }
        switch(this.state.render){
            case 'rating': return <SelfEvulation/>
            case 'tools' : return <AddTools/>
            case 'steps': return <EnterSteps/>
            case 'picture' : return <AddFile/>
            case 'newsection1'  : return <NewSection/>
        }
    }
    render () {
        return (
            <div>

                {this.state.showMenu
                    ? (
                        <div className="AddButton">
                            { this.renderComponent()}
                            <button className="delButton1" onClick={ (e) => {
                                this.handleClick(e, 'rating');
                                document.querySelector('.delButton1').classList.add('hideButton');
                            }}>Itsearvionti</button>
                            <button className="delButton2" onClick = { (e) => {
                                this.handleClick(e, 'tools');
                                document.querySelector('.delButton2').classList.add('hideButton');
                            }} >Työkalut </button>
                            <button className="delButton3" onClick={ (e) => {
                                this.handleClick(e, 'steps');
                                document.querySelector('.delButton3').classList.add('hideButton');
                            }}>Vaiheet</button>
                            <button className="delButton4"  onClick = { (e) => {
                                this.handleClick(e, 'picture');
                                document.querySelector('.delButton4').classList.add('hideButton');
                            }} >Kuva </button>
                            <button className="delButton5"  onClick = { (e) => {
                                this.handleClick(e, 'newsection1');
                                document.querySelector('.delButton5').classList.add('hideButton');
                            }} >Muuta</button>
                        </div>
                    ) : (null)}
                <button className="Lisaa" onClick={ (e) => {
                    this.showMenu(e);
                    document.querySelector('.Lisaa').classList.add('hideButton');
                }}>+Lisää</button>
            </div>
        );
    }
}

//Modaalin sisältö kasattuna
// Modaali muutettu haitariksi
export class NewButton extends Component {
    state = {
        open: false,
        isOpened: false,
    };

    componentDidMount() {
        const me = this;
    }

    // lähetetään kaikki tiedot savedValues
    handleSubmit(e) {
        e.preventDefault();
        sanna.sendToDb(savedValues);
    };

    onCloseModal = () => {
        this.setState({ open: false });
        contents = []; // tyhjennetään
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    render() {
        const { open } = this.state;
        const {isOpened} = this.state;
        return (
            <div className="kys">

                <div className="New clickable" onClick={() => {
                    if (this.state.isOpened === true) {
                        this.setState({isOpened: false});
                    }
                    else {
                        this.setState({isOpened: true});
                    }
                }
                }>
                    <div className="addButtonTexts">
                        <h4><i className="fas fa-plus"></i> Uusi osaaminen</h4>
                        <p>{this.state.button}</p>
                    </div>
                </div>
                <Collapse isOpened={isOpened}>
                    <form className="addPostWrapper" onSubmit={this.handleSubmit}>
                        <SelectCategory/>
                        <NewTitle/>
                        <SelfEvulation/>
                        <AddTools/>
                        <EnterSteps/>
                        <AddFile/>
                        <NewSection/>
                        <button className="ModalSave" type="submit" onClick={this.onCloseModal}>Tallenna</button>
                    </form>
                </Collapse>
            </div>
        );
    }
}


// Haitari

