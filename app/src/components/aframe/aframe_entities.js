import 'aframe';
import React,{Component} from 'react';
import {Entity} from 'aframe-react';
import './aframe_selectable'

class Curved extends Component
{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Entity material="opacity: 0; visible: false; side: double" geometry={"primitive: polyline; vertices: " +
            this.props.vertices} id={"curv" + this.props.object_uuid} selectable={'object_uuid:' + this.props.object_uuid} scale="-1 1 1"/>
        );
    }

}

class CurvedGeometry extends Component
{
    constructor(props){
        super(props)
    }


    render() {
        return(
            <Entity id={'curve_' + this.props.id} geometry={"primitive: polyline; vertices: " + this.props.vertices} scale="-1 1 1" material="side: double; opacity: 0.50"/>
        )
    }
}

export {Curved, CurvedGeometry}