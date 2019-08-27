import React from 'react';
import './css/menu.css';

export default class ContextMenu extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        this.props.addNode(e.target.getAttribute('data-value'))
    }
    render() {
        const menuCSS = {
            transform: `translateX(${this.props.x}px) translateY(${this.props.y}px)`
        }

        return (
            <ul className='menu' style={menuCSS}>
                <li className='menu--item header'>Basic</li>
                <li className='menu--item'><button data-value='number' onClick={this.handleClick}>Number</button></li>
                <li className='menu--item'><button data-value='display' onClick={this.handleClick}>Display</button></li>
                <li className='menu--item'><button data-value='math' onClick={this.handleClick}>Math</button></li>
                <li className='menu--item'><button data-value='wave' onClick={this.handleClick}>Wave</button></li>
                
                <li className='menu--item header'>Colour</li>
                <li className='menu--item'><button data-value='rgbSplit' onClick={this.handleClick}>Split RGB</button></li>
                <li className='menu--item'><button data-value='rgbCombine' onClick={this.handleClick}>Combine RGB</button></li>
                <li className='menu--item'><button data-value='picker' onClick={this.handleClick}>Colour Picker</button></li>
                <li className='menu--item'><button data-value='ramp' onClick={this.handleClick}>Colour Ramp</button></li>
            </ul>
        )
    }
}