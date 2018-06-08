import React from 'react';
import 'aframe';
import 'aframe-template-component';
import {Entity, Scene} from 'aframe-react';
import './aframe-selectable';

function PlayTest(props){
    return (
        <div className={'playtestContainer'}>
            <button onClick={() => props.switchToEditMode()}>EDIT</button>
            <Scene>
                <a-assets>
                    <script id="provaBELLA" type = "text/html">
                        <img id="sfondo1" crossorigin="anonymous" src={process.env.PUBLIC_URL + '/Image360/sample7.jpg'} alt="sfondo7"/>

                        <Entity primitive="a-sky" radius="10" src="#sfondo1" />
                        <a-curvedimage id="curved" selectable="#provaBELLA2" rotation="0 75 0" height="3.0"
                                       radius="9.5" theta-length="11" />
                    </script>

                    <script id="provaBELLA2" type = "text/html">
                        <img id="sfondo2" crossorigin="anonymous" src={process.env.PUBLIC_URL + '/Image360/sample3.jpg'} alt="sfondo2"/>
                        <a-sky id="blabla" radius="10" src="#sfondo2"/>
                    </script>
                </a-assets>

                <a-entity id="templateBello" template="src: #provaBELLA" />
                <a-entity id="templateBello2" template="src: #provaBELLA2" visible = "false"/>

                <a-entity camera look-controls="pointerLockEnabled: true;">
                    <a-entity mouse-cursor>
                        <a-cursor id="cursor"></a-cursor>
                    </a-entity>
                </a-entity>
            </Scene>

        </div>
    );
}

export default PlayTest;