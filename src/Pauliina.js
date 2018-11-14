import React, {Component} from 'react';

{/*function handleClick() {
    console.log('Painoit nappia, wow');
}*/}

class SelectArea extends React.Component {
    state = {
        items: this.props.items,
        showItems: false,
    }

    dropDown = () => {
        this.setState(prevState => ({
            showItems: !prevState.showItems,
        }))
    }

    render() {
        return <div>
            <div
                className="add-new-button"
                onClick={this.dropDown}
            >
                <span className={`${this.state.showItems ? 'add-new-button-up' :'add-new-button-down'}`} />

            </div>
            <div
                style={{display: this.state.showItems ? 'block' : 'none'}}>
            {
                this.state.items.map(item => <div key={ item.id }>
                    {item.value}
                    </div>)
            }
        </div>
        </div>
    }
}

class Modal extends React.Component {
    render() {
        // Render nothing if the "show" prop is false
        if(!this.props.show) {
            return null;
            
}

export default SelectArea
export default Modal

