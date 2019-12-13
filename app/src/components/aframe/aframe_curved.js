/**
 * Curved e CurvedGeometry sono due componenti react che hanno la funzione di gestire e renderizzare le geometrie
 * gestisce inoltre i tipi di scena 2D e 3D, e la visualizzazione nel caso di modalita' EditGeometry e DubugMode
 */

//[Vittoria] ogni Bubble ha molte Curved e le curved sono i componenti su cui si può interagire
//Ci sono curved e curved geometry, nella Curved abbiamo una componente selected che, quando il raycast si incrocia con
// la geometria dell'oggetto se ne accorge e lancia un oggetto onClick
import 'aframe';
import React,{Component} from 'react';
import {Entity} from 'aframe-react';
import './aframe_selectable'

//[Vittoria] le props di Curved le lancia Bubble
class Curved extends Component
{
    constructor(props){
        super(props)
    }

    render(){
        let scale = this.props.is3Dscene?"-1 1 1":"1 1 1 "; //Se e' una scena 3D devo invertire uno degli assi in modo che si veda dall'interno
        let vertices = this.props.vertices;

        //conversione coordinate relative per la scena 2D
        if(!this.props.is3Dscene && this.props.vertices){
            vertices = convertRelativeCoordinates(this.props.vertices, this.props.assetsDimention) //[Vittoria] ricalcola sulla base della canvas
        }

        //gestico la primitiva della geometria a seconda che sia una geometria o un punto )POINT_OF_INTEREST
        let geometry = this.props.type === 'POINT_OF_INTEREST' ?'primitive: sphere; radius: 0.4':"primitive: polyline; vertices: " + vertices;
        let position = this.props.position;

        let mode = this.props.mode;
        if(mode==='edit'){
            //punto di interesse
            if (this.props.type && this.props.vertices){
                let points = vertices.split(' ').map(function(x){return parseFloat(x);});
                position = -points[0].toString() + ', ' + points[1].toString() + ', ' + points[2].toString()
            }

            return(
                <Entity id={'curve_' + this.props.id} geometry={geometry}
                        scale={scale} material={"side: double; opacity: 0.50; color: " + this.props.color} position={position}/>
            )
        }
        else{
            //Ricavo la posizione dalla stringa DEI VERTICI
            if (this.props.type === 'POINT_OF_INTEREST'){
                let points = this.props.vertices.split(' ').map(function(x){return parseFloat(x);});
                position = -points[0].toString() + ', ' + points[1].toString() + ', ' + points[2].toString()
            }
            //Sono in debug mode li rendo visibili
            //TODO [debug] add to origin
            let material = this.props.onDebugMode ? "opacity:0.3;visible:true;side:double" : "opacity:0; visible:false; side:double";

            return(
                //[Vittoria] Entity di a-frame implementato con React
                <Entity material={material}
                        geometry={geometry}
                        id={"curv" + this.props.object_uuid}
                        selectable={'object_uuid:' + this.props.object_uuid + '; activable: ' + this.props.activable + '; object_type: ' + this.props.type}
                        position={position}
                        scale={scale}/> //[Vittoria] quello che nella scena 3D inverte gli assi
            );
        }
    }

}

/**
 * Funzione che si occupa di generare le coordinate in funzione della dimensione attuale della canvas, ricordo che le coordinate
 * sono salvate in modo relativo, quindi divise per la dimensione della canvas al momento della loro creazione
 * @param verticesP vertici
 * @param assetsDimention dimensione dell'asset corrente
 * @returns {*}
 */
//TODO ci sono problemi nella dimensione delle geometrie, verificare cosa succede
export function convertRelativeCoordinates (verticesP,assetsDimention) {
    let vertices;
    let points = verticesP.split(/[, ]/).map(function(x){return parseFloat(x);});
    let index = 0;
    let Width = assetsDimention.width / 100;
    let Height = assetsDimention.height / 100;
    let bounds = calculate2DSceneImageBounds(Width, Height);
    let canvasWidth = bounds.w;
    let canvasHeight = bounds.h;


    //Moltiplico le coordinate per le proporzione della canvas precedentemente create, per quanto riguarda la z e' impostata poco davanti al piano
    vertices = points.map(v => {

        let vp = v;
        if(index % 3 === 0) vp = v * canvasWidth;
        if(index % 3 === 1) vp = v * canvasHeight;
        if(index % 3 === 2) vp = -5.95; //Piano posizionato a 6, poso davanti in modo che si vedano in fase di posizionamento
        index += 1;
        return vp;
    });
    index = 0;
    //Operazioni di creazione del formato corretto
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

export function calculate2DSceneImageBounds(sourceWidth, sourceHeight){
    // [davide] altezza del piano che contiene l'immagine nel sistema di riferimento aframe.
    // valore stabilito in modo empirico
    let destHeight = 10;
    let destWidth = (destHeight/document.documentElement.clientHeight) * document.documentElement.clientWidth;
    let scaleX = destWidth / sourceWidth;
    let scaleY = destHeight / sourceHeight;
    let scale = scaleX > scaleY ? scaleY : scaleX;
    sourceWidth *= scale;
    sourceHeight *= scale;

    return {w: sourceWidth, h: sourceHeight};
}

export {Curved}