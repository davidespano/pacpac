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
        let vertices = this.props.vertices;

        //conversione coordinate relative per la scena 2D, molto brutto sarebbe da riscrivere meglio, ma almeno funziona
        if(!this.props.is3Dscene && this.props.vertices){
            vertices = convertRelativeCoordinates(this.props.vertices, this.props.assetsDimention)
        }

        let geometry = this.props.type === 'POINT_OF_INTEREST' ?'primitive: sphere; radius: 0.4':"primitive: polyline; vertices: " + vertices;
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
        let vertices = this.props.vertices;
        //conversione coordinate relative per la scena 2D, molto brutto sarebbe da riscrivere meglio, ma almeno funziona
        if(!this.props.is3Dscene && this.props.vertices){
            vertices = convertRelativeCoordinates(this.props.vertices, this.props.assetsDimention)
        }

        let geometry = this.props.type?'primitive: sphere; radius: 0.4':"primitive: polyline; vertices: " + vertices;
        let position = this.props.position;
        //punto di interesse
        if (this.props.type && this.props.vertices){
            let points = vertices.split(' ').map(function(x){return parseFloat(x);});
            position = -points[0].toString() + ', ' + points[1].toString() + ', ' + points[2].toString()
        }

        //console.log(position)
        return(
            <Entity id={'curve_' + this.props.id} geometry={geometry}
                    scale={scale} material={"side: double; opacity: 0.50; color: " + this.props.color} position={position}/>
        )
    }
}

export function convertRelativeCoordinates (verticesP,assetsDimention) {
    let vertices;
    let points = verticesP.split(/[, ]/).map(function(x){return parseFloat(x);});
    let index = 0;
    let Width = assetsDimention.width / 100;
    let Height = assetsDimention.height / 100;
    let ratio = Width/Height;
    let ratio2 = document.documentElement.clientWidth / document.documentElement.clientHeight;
    let canvasWidth ;
    let canvasHeight;

    if(ratio > 1 && ratio2 < 1){
        canvasWidth = document.documentElement.clientWidth / 100;
        canvasHeight = canvasWidth / ratio;
    } else {

        canvasHeight = document.documentElement.clientHeight / 100;
        canvasWidth = canvasHeight * ratio;

    }


    vertices = points.map(v => {

        let vp = v;
        if(index % 3 === 0) vp = v * canvasWidth;
        if(index % 3 === 1) vp = v * canvasHeight;
        if(index % 3 === 2) vp = 5.95
        index += 1;
        return vp;
    });
    index = 0;
    vertices = vertices.map(v => {
        let vp;
        if(index % 3 === 2)
            vp = v.toString() + ',';
        else
            vp = v.toString() + ' ';
        index += 1;
        return vp;
    });
    vertices = vertices.join('')
    vertices = vertices.slice(0, -1);
    return vertices;
}
export {Curved, CurvedGeometry}