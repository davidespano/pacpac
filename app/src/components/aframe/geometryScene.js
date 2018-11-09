import 'aframe';
import './aframe_selectable'
import './aframe_newGeometry'
import InteractiveObjectAPI from '../../utils/InteractiveObjectAPI'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import interface_utils from "../interface/interface_utils";

function Curved(props)
{
    return(
        <Entity geometry={"primitive: polyline; vertices: " + props.vertices} scale= "-1 1 1" material="side: double; opacity: 0.50"/>
    );
}

class Bubble extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const curves = this.props.transitions.map(curve =>
        {
            return(
                <Curved vertices={curve.vertices}/>
            );
        });

        return(
            <Entity _ref={elem => this.nv = elem} primitive="a-sky" id={this.props.name} src={"http://localhost:3000/media/" + this.props.img} radius="10">
                {curves}
            </Entity>
        );
    }
}

export function givePoints(props)
{
    let cursor = document.querySelector('a-cursor');
    let puntisalvati = cursor.getAttribute("pointsaver").points;

    puntisalvati = puntisalvati.map(punto =>
        punto.toArray().join(" ")
    );
    console.log(puntisalvati.join())
    interface_utils.setPropertyFromValue(props.interactiveObjects.get(props.currentObject), 'vertices', puntisalvati.join(), props)
    //props.currentObject.vertices = puntisalvati.join();
}

export default class GeometryScene extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            scenes: this.props.scenes.get(props.currentScene)
        };
    }

    handleSceneChange()
    {
        this.setState({
            scenes: this.props.scenes.get(this.props.currentScene)
        })
    }

    handleFeedbackChange() {
        if(document.querySelector('#cursor').getAttribute('pointsaver') != null) {
            let a_point = document.querySelector('#cursor').getAttribute('pointsaver').points;

            //Punti
            let length = a_point.length;
            let idPoint = "point" + (length - 1).toString();
            let tmp = document.createElement('a-entity');
            tmp.setAttribute('geometry', 'primitive: sphere; radius: 0.09');
            a_point[(length-1)].x *= -1;
            tmp.setAttribute('position',  a_point[(length - 1)].toArray().join(" "));
            a_point[(length-1)].x *= -1;
            tmp.setAttribute('id', idPoint);
            tmp.setAttribute('material', 'color: green; shader: flat');
            tmp.setAttribute('class', 'points');
            document.querySelector('a-sky').appendChild(tmp);


            //Linee, purtroppo è poco intuitivo. Provandolo sembra bellino

            let lengthLine = a_point.length;
            if (lengthLine >= 2) {
                let tmp = document.createElement('a-entity');
                tmp.setAttribute('scale', '-1 1 1');
                tmp.setAttribute('line', 'start: ' + a_point[(lengthLine - 2)].toArray().join(" "));
                tmp.setAttribute('line', 'end: ' + a_point[(lengthLine - 1)].toArray().join(" "));
                document.querySelector('a-sky').appendChild(tmp);
            }

        }
    }

    componentDidMount () {
        document.querySelector('#mainscene').addEventListener('keydown', (event) => {
            const keyName = event.key;
            if(keyName === 'c' || keyName === 'C')
            {
                let pointsaver = document.querySelector('#cursor').getAttribute('pointsaver');
                if(pointsaver != null && pointsaver.points.length != 0) {
                    let cursor = document.querySelector('#cursor');
                    givePoints(this.props);
                    this.handleSceneChange();
                    cursor.setAttribute('color', 'black');
                    cursor.removeEventListener('click', function pointSaver(evt) {});
                    cursor.removeEventListener('click', this.handleFeedbackChange);
                    cursor.removeAttribute("pointsaver");
                    let scene = document.querySelector("a-sky");
                    let removeSphere = scene.querySelectorAll(".points");
                    removeSphere.forEach(point => {
                        scene.removeChild(point);
                    });
                    this.props.updateCurrentObject(this.props.currentObject);
                    this.handleSceneChange();
                }
            }

            if(keyName === 'e' || keyName === 'E')
            {
                let scene = document.querySelector("a-sky");
                let removeSphere = scene.querySelectorAll(".points");
                removeSphere.forEach(point => {
                    scene.removeChild(point);
                });

                let cursor = document.querySelector('#cursor');
                cursor.setAttribute('color', 'green');
                cursor.setAttribute('pointsaver', true);
                cursor.addEventListener('click', this.handleFeedbackChange);
            }

            if(keyName === 'u' || keyName === 'U')
            {
                let pointsaver = document.querySelector('#cursor').getAttribute('pointsaver');
                if(pointsaver != null && pointsaver.points.length != 0){
                    let points = pointsaver.points;
                    let lastID = points.length - 1;
                    let scene = document.querySelector('a-sky');
                    let lastChild = scene.querySelector('#point' + lastID.toString());
                    points.splice(-1);
                    scene.removeChild(lastChild);
                }
            }

            if(keyName === 'q' || keyName === 'Q')
            {
                InteractiveObjectAPI.saveObject(this.props.currentScene, this.props.currentObject);
                this.props.switchToEditMode();
            }
        });
    }

    render()
    {
        let sky = this.state.scenes;
        let curvedImages = [];
        curvedImages = this.props.scenes.get(this.props.currentScene).get('objects');
        curvedImages = curvedImages['transitions'].map(uuid => this.props.interactiveObjects.get(uuid));

        let skies = <Bubble key={"key" + sky.img} name={sky.img} img={`${window.localStorage.getItem("gameID")}/` + sky.img}
                            transitions={curvedImages} handler={() => this.handleSceneChange()}/>

        return(
            <div id="mainscene" tabIndex="0">
                <div id="UI">
                    <div id="keyMap">
                        <h1>Keys</h1>
                        <li class="keyElements">
                            <ul>E: Start Edit</ul>
                            <ul>C: Create Geometry</ul>
                            <ul>U: Undo</ul>
                            <ul>Q: Go Back</ul>
                        </li>

                    </div>
                </div>
                <Scene>
                    {skies}


                    <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" id="cursor"/>
                        </Entity>
                    </Entity>
                </Scene>
            </div>
        );
    }
}
//Aggiungere due text, button, qualcosa che indichi all'utente come utilizzare salvataggio e edit.
//Meglio non usare le linee, usa semplicemente i punti che indicano come fare

