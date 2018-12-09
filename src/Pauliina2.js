import React, {Component} from 'react';
import Select from "react-select";
import {ModalButton} from "react-modal-button";
//import firebase from './firebase/firebase.js';
import * as sanna from './sanna.js'
import Modal from 'react-responsive-modal';

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
            <div>
                <div className="NewTitleMain">
                    <div className="header">
                        <form /*onSubmit={}*/>
                            <input placeholder="Otsikko" onBlur={this.handleChange}>
                            </input>
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
        const value = selectedOption.target.value;
        setValues('rating', value);
    }

    render() {
        return (
            <div className="RadioSection"> <p>Itsearvionti</p>
                <div className="radio">
                    <input type="radio" value="1" name="rating"  onChange={this.handleChange}></input> 1
                    <input type="radio" value="2" name="rating"  onChange={this.handleChange}></input> 2
                    <input type="radio" value="3" name="rating"  onChange={this.handleChange}></input> 3
                    <input type="radio" value="4" name="rating"  onChange={this.handleChange}></input> 4
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
            <div>
                <div className="AddToolsMain">
                    <div className="header">
                        <form>
                            <textarea placeholder="Tarvittavat työkalut" onBlur={this.handleChange}>
                            </textarea>
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
                        </form>
                    </div>
                </div>
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
            <div className="pictureInput">
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
            <div>
                <div className="NewSection">
                    <div className="header" >
                        <form>
                           <textarea placeholder="Uusi osio" onBlur={this.handleChange}>
                            </textarea>
                        </form>
                    </div>
                </div>
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
    }
    showMenu(event) {
        event.preventDefault();

        this.setState({
            showMenu: true,
        });
    }

    //Uuden komponentin valitseminen "+Lisää" napin alta
    handleClick(compName, e){
        e.preventDefault();
        console.log(compName);
        contents[contents.length] = compName;
        console.log(contents);
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
                console.log(render);
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
                console.log(s);
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
                            <button onClick={ this.handleClick.bind(this, 'rating')}>Itsearvionti</button>
                            <button onClick = {this.handleClick.bind(this, 'tools')} > Työkalut </button>
                            <button onClick={this.handleClick.bind(this, 'steps')}>Vaiheet</button>
                            <button onClick = {this.handleClick.bind(this, 'picture')} > lisää kuva </button>
                            <button onClick = {this.handleClick.bind(this, 'newsection1')} > +Uusi osio </button>
                        </div>
                    ) : (null)}
                <button className="Lisaa" onClick={this.showMenu }>+Lisää</button>
            </div>
        );
    }
}

//Modaalin sisältö kasattuna
export class NewButton extends Component {
    state = {
        open: false,};

    // lähetetään kaikki tiedot savedValues
    handleSubmit(e) {
        e.preventDefault();
        sanna.sendToDb(savedValues);
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    render() {
        const { open } = this.state;
        return (
            <div className="kys">
                <button className="New clickable" onClick={this.onOpenModal}><h2><i className="fas fa-plus"></i> Uusi osaaminen</h2></button>
                <Modal className="ModalWindow" open={open} onClose={this.onCloseModal} >
                    <form className="NewModal" onSubmit={this.handleSubmit}>
                        <div><SelectCategory/></div>
                        <div><NewTitle/></div>
                        <div><AddButton/></div>
                        <button className="ModalSave" type="submit" onClick={this.onCloseModal}>Tallenna</button>
                    </form>
                </Modal>
            </div>
        );
    }
}
