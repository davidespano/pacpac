import React from 'react';
import TopBar from "../components/interface/Topbar";
import LeftBar from "../components/interface/Leftbar";
import RightBar from "../components/interface/Rightbar";
import Canvas from "../components/interface/Canvas";
import PlayTest from "../components/aframe/playtest";
import CentralScene from "../components/interface/CentralScene";

/* La cosa migliore è gestire lo stato solo all'interno dello Store, e lasciare nella view solo funzioni*/
function AppView(props) {

    //console.log('hello' + props.mode);

    switch(props.mode){
        case 'EDIT_MODE_ON':
            return (
                <div className={'grid-container'}>
                    <TopBar {...props} />
                    <LeftBar {...props} />
                    <RightBar {...props} />
                    <CentralScene {...props} />
                    <Canvas {...props} />
                </div>
            );
        case 'PLAY_MODE_ON':
            return(
                <div>
                    <PlayTest {...props}/>
                </div>
            );
        default:
            return(
                <div>SOMETHING WENT WRONG!</div>
            );

    }
}

export default AppView;