import 'aframe';
import 'aframe-href-components';
import React,{Component} from 'react'
import {Entity} from "aframe-react";
import interface_utils from "../interface/interface_utils";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import {calculate2DSceneImageBounds, convertRelativeCoordinates} from "./aframe_curved";

class Textbox extends Component
{
    constructor(props) {
        super(props);
    }

    render(){
        let position = this.props.position ? this.props.position.split(" "): "0 0 0";
        let activable = this.props.activable;
        let visible = this.props.visible;
        //let textstring = this.props.string

        position = convertRelativeCoordinates(this.props.position, this.props.assetsDimention)

        let selectable = `object_uuid: ${this.props.object_uuid}; activable: ${activable}; visible: ${visible}; object_type: ${this.props.type}`;
        return(
            <Entity
                visible={true}
                geometry={"primitive: plane; width: 4; height: auto"}
                material={"color: black"}
                text={"value: This text will be 4 units wide."}
                position={position}
                selectable ={selectable}>
            </Entity>
        );
    }
}