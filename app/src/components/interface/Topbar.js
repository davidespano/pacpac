import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import Actions from "../../actions/Actions";

function TopBar(props){
    return (
         <div className={'topbar'}>
            Header
            <button type="button" class="btn btn-primary" onClick={() => props.switchToPlayMode()}>PLAY</button>
            <InputSceneForm {...props} />
            <button type="button" class="btn btn-primary" id={'transition'}
                    title={'Aggiungi una transizione'}
                    onClick={() => Actions.addNewObject(new Transition())}
            >+</button>
        </div>
    );
}

export default TopBar;

/*
<div className="container">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <button type="button" className="btn btn-primary" onClick={() => props.switchToPlayMode()}>PLAY</button>
                    <InputSceneForm {...props} />
                    <button type="button" className="btn btn-primary" id={'transition'}
                            title={'Aggiungi una transizione'}
                            onClick={() => Actions.addNewObject(new Transition())}
                    >+</button>
             </div>
           </div>
  </nav>
 </div>
*/