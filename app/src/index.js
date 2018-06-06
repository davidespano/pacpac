import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';



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
                <div class="topbar">Header</div>
                <div class="leftbar">Leftbar</div>
                <div class="scene">
                    <img src="ratio-2-1.png"/>
                </div>
                <div class="rightbar">Rightbar</div>
                <div class="canvas">Canvas</div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Editor />,
    document.getElementById('root')
);