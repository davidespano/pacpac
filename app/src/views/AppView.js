import React from 'react';
import TopBar from "../components/interface/Topbar";
import LeftBar from "../components/interface/Leftbar";
import RightBar from "../components/interface/Rightbar";
import Rules from "../components/interface/Rules";
import VRScene from "../components/aframe/create_scene2";
import '../components/look-controls_us';
//import PlayTest from "../components/aframe/playtest";
import CentralScene from "../components/interface/CentralScene";
import GeometryScene from "../components/aframe/geometryScene";

function AppView(props) {

    switch(props.mode){
        case 'EDIT_MODE_ON':
            return (
                <div>
                    <TopBar {...props} />
                    <div className={'grid-container'}>
                        <LeftBar {...props} />
                        <RightBar {...props} />
                        <CentralScene {...props} />
                        <Rules {...props} />
                    </div>
                </div>
            );
        case 'PLAY_MODE_ON':
            return(
                <div>
                    <VRScene {...props}/>
                </div>
            );
        case 'GEOMETRY_MODE_ON':
            return(
                <div>
                    <GeometryScene {...props}/>
                </div>
            );

        default:
            return(
                <div>SOMETHING WENT WRONG!</div>
            );

    }
}

export default AppView;