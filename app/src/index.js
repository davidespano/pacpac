import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import Actions from './actions/Actions';
//import '../public/style.css';
//import './aframe.js';


ReactDOM.render(<AppContainer />, document.getElementById('sceneContainer'));

console.log('aggiunta di cose');

Actions.addScene(1,"ciao","./ratio-2-1.png");

Actions.addScene(2,"ciao2","./ratio-2-1.png");


/*
// l'elemento game è definito da questa classe.
class Editor extends React.Component {
    constructor(props) {
        super(props);

    }

    // Possiamo restituire del codice dichiarativo, viene tradotto in istruzioni javascript, className è class del css
    // Posso chidiarare un altro componente react dentro un'altro (Board)
    render() {
        return (
            <div class="grid-container">
                <div class="topbar">Header  
                    <a href={"/play.html"}>Play</a>
                </div>
                <div class="leftbar">Leftbar</div>
                <div class="scene">
                    <img src="./Image360/sample1.jpg"/>
                </div>
                <div class="rightbar">Rightbar</div>
                <div class="canvas">Canvas</div>
            </div>
        );
    }
}

// ========================================

//ReactDOM.render(
  //  <Editor />,
    //document.getElementById('root')
//);
*/