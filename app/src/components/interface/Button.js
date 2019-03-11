import React from 'react'
import { Entity } from 'draft-js'

export default class Button extends React.Component { // eslint-disable-line
    constructor(props){
        super(props)
    }

    render() {
        //const text = Entity.get(this.props.block.getEntityAt(0)).getData().text
        return (
            <div >
                <button>{this.props.blockProps.text}</button>
            </div>
        )
    }
}