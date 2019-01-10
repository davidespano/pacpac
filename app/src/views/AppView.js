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
import Canvas from "../components/interface/Canvas";
import FileContainer from "../components/interface/FileContainer";

function AppView(props) {

    switch(props.editor.mode){
        case 'EDIT_MODE_ON':
            return (
                <div onClick={(event) => closeDropdowns(event, props)}>
                    <TopBar {...props} />
                    <div className={'grid-container'}>
                        <LeftBar {...props} />
                        <RightBar {...props} />
                        <CentralScene {...props} />
                        <Rules {...props} />
                    </div>
                </div>
            );
        case 'FILE_MANAGER_MODE_ON':
            return(
                <div>
                    <TopBar {...props}/>
                    <FileContainer {...props}/>
                </div>
            );
        case 'PLAY_MODE_ON':
            return(
                    <VRScene {...props}/>
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

/**
 * This function closes dropdown menus when we click outside of buttons but I really don't know how it manages to work,
 * we assume it's magic
 * @param event
 * @param props
 */
function closeDropdowns(event, props){
    props.dropdownScenesOrder(!(props.editor.scenesOrderMenu) && event.target.className.includes('dropdown-btn'));
}

export default AppView;