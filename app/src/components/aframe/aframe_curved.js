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
        let scale = this.props.is3Dscene?"-1 1 1":"1 1 1 ";
        //TODO [debug] add to origin
        let material = this.props.onDebugMode ? "opacity:0.3;visible:true;side:double" : "opacity:0; visible:false; side:double";
        return(
            <Entity material={material} geometry={"primitive: polyline; vertices: " + this.props.vertices}
                    id={"curv" + this.props.object_uuid} selectable={'object_uuid:' + this.props.object_uuid + '; visible: ' + this.props.visible}
                    position={this.props.position} scale={scale}/>
        );
    }

}

class CurvedGeometry extends Component
{
    constructor(props){
        super(props)
    }

    render() {
        let scale = this.props.is3Dscene?"-1 1 1":"1 1 1 ";
        return(
            <Entity id={'curve_' + this.props.id} geometry={"primitive: polyline; vertices: " + this.props.vertices}
                    scale={scale} material={"side: double; opacity: 0.50; color: " + this.props.color} position={this.props.position}/>
        )
    }
}

export {Curved, CurvedGeometry}