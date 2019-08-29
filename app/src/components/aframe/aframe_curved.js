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
        let geometry = this.props.type === 'POINT_OF_INTEREST' ?'primitive: sphere; radius: 0.4':"primitive: polyline; vertices: " + this.props.vertices;
        let position = this.props.position;
        if (this.props.type === 'POINT_OF_INTEREST'){
            let points = this.props.vertices.split(' ').map(function(x){return parseFloat(x);});
            position = -points[0].toString() + ', ' + points[1].toString() + ', ' + points[2].toString()
        }
        //TODO [debug] add to origin
        let material = this.props.onDebugMode ? "opacity:0.3;visible:true;side:double" : "opacity:0; visible:false; side:double";
        return(
            <Entity material={material}
                    geometry={geometry}
                    id={"curv" + this.props.object_uuid}
                    selectable={'object_uuid:' + this.props.object_uuid + '; visible: ' + this.props.visible + '; object_type: ' + this.props.type}
                    position={position}
                    scale={scale}/>
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
        let geometry = this.props.type?'primitive: sphere; radius: 0.4':"primitive: polyline; vertices: " + this.props.vertices;
        let position = this.props.position;
        if (this.props.type){
            let points = this.props.vertices.split(' ').map(function(x){return parseFloat(x);});
            position = -points[0].toString() + ', ' + points[1].toString() + ', ' + points[2].toString()
        }

        console.log(position)
        return(
            <Entity id={'curve_' + this.props.id} geometry={geometry}
                    scale={scale} material={"side: double; opacity: 0.50; color: " + this.props.color} position={position}/>
        )
    }
}

export {Curved, CurvedGeometry}