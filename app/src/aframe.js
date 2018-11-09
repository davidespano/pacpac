import 'aframe';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import "./components/aframe/aframe_selectable";

class VRScene extends React.Component {
    constructor() {
        super()
    }

    render () {
        return (
            <Scene>
                <script id="provaBELLA" type = "text/html">
                    <img id="sfondo1" crossorigin="anonymous" src={process.env.PUBLIC_URL + '/Image360/sample2.jpg'}/>

                    <a-sky id="blabla" radius="10" src="#sfondo1"/>
                    <a-curvedimage geometry="sphere" id="curved" selectable="#provaBELLA2" height="3.0"
                                   radius="12.5" theta-length="11" rotation="5 75 130" scale="0.8 0.8 0.8" position= "-2.313 -4 5"/>
                </script>

                <script id="provaBELLA2" type = "text/html">
                    <img id="sfondo2" crossorigin="anonymous" src={process.env.PUBLIC_URL + '/Image360/sample3.jpg'}/>
                    <a-sky id="blabla" radius="10" src="#sfondo2"/>
                </script>

                <a-entity id="templateBello" template="src: #provaBELLA" src="process.env.PUBLIC_URL + '/Image360/sample2.jpg'" />
                <a-entity id="templateBello2" template="src: #provaBELLA2" visible = "false"/>


                <a-entity camera look-controls="pointerLockEnabled: true;">
                    <a-entity mouse-cursor>
                        <a-cursor id="cursor"></a-cursor>
                    </a-entity>
                </a-entity>
            </Scene>
        );
    }
}

ReactDOM.render(<VRScene/>, document.querySelector('#sceneContainer'));