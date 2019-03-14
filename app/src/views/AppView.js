import React from 'react';
import TopBar from "../components/interface/Topbar";
import LeftBar from "../components/interface/Leftbar";
import RightBar from "../components/interface/Rightbar";
import Rules from "../components/interface/Rules";
import MentionRules from "../components/interface/MentionRules"
import VRScene from "../components/aframe/create_scene2";
import '../components/look-controls_us';
import CentralScene from "../components/interface/CentralScene";
import GeometryScene from "../components/aframe/geometryScene";
import FileContainer from "../components/interface/FileContainer";
import FileForm from "../components/interface/FileForm";
import MediaEditingform from "../components/interface/MediaEditingForm";
import Login from "../components/interface/Login";
import GameList from "../components/interface/GameList";

function AppView(props) {

    let propsAssets = {
        props : props,
        component : 'assets',
    };

    console.log(props.rules);

    switch(props.editor.mode){
        case 'EDIT_MODE_ON':
            return (
                <div onClick={(event) => closeDropdowns(event, props)}>
                    <TopBar {...props} />
                    <MediaEditingform {...props}/>
                    <FileForm {...props}/>
                    <div className={'grid-container'}>
                        <LeftBar {...props} />
                        <RightBar {...props} />
                        <CentralScene {...props} />
                    </div>
                </div>
            );
        case 'FILE_MANAGER_MODE_ON':
            return(
                <div>
                    <TopBar {...props}/>
                    <FileContainer {...propsAssets}/>
                </div>
            );
        case 'PLAY_MODE_ON':
            return(
                    <VRScene {...props}/>
            );
        case 'GAME_SELECTION_MODE_ON':
            return (<GameList {...props}/>);
        case 'GEOMETRY_MODE_ON':
            return(
                <div>
                    <GeometryScene {...props}/>
                </div>
            );
        case 'LOGIN_MODE_ON':
            return(
                <Login {...props}/>
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
    if(event.target.className && typeof event.target.className !== 'object'){
        props.dropdownScenesOrder(!(props.editor.scenesOrderMenu) && event.target.className.includes('dropdown-btn'));
        props.dropdownTagsRightbar(!(props.editor.chooseTagRightbar) && event.target.className.includes('chosen-tag-rightbar'));
    }
}

export default AppView;