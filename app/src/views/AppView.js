import React from 'react';
import TopBar from "../components/interface/Topbar";
import LeftBar from "../components/interface/Leftbar";
import RightBar from "../components/interface/Rightbar";
import DebugTab from "../components/interface/DebugTab";
import VRScene from "../components/aframe/create_scene2";
//import VRScene from "../components/aframe/create_debug_scene";
import DebugVRScene from "../components/aframe/create_debug_scene";
import '../components/look-controls_us';
import CentralScene from "../components/interface/CentralScene";
import GeometryScene from "../components/aframe/geometryScene";
import FileContainer from "../components/interface/FileContainer";
import FileForm from "../components/interface/FileForm";
import MediaEditingform from "../components/interface/MediaEditingForm";
import Login from "../components/interface/Login";
import GameList from "../components/interface/GameList";
import EudRuleEditor from "../components/interface/EudRuleEditor";
import activePlayAudio from "../components/aframe/aframeUtils"
import StoryEditor from "../components/interface/StoryEditor";

function AppView(props) {

    let propsAssets = {
        props: props,
        component: 'assets',
    };
    
    switch (props.editor.mode) {
        case 'EDIT_MODE_ON':
            let scene = null;
            if(!props.editor.editorExpanded){
                scene = <CentralScene {...props} />
            }
            return (
                <div onClick={(event) => closeDropdowns(event, props)}>
                    <TopBar {...props} />
                    <FileForm {...props}/>
                    <div className={'grid-container ' + checkEditor(props)}>
                        <LeftBar {...props} />
                        <RightBar {...props} />
                        {scene}
                        <EudRuleEditor {...props} />
                    </div>
                </div>
            );
        case 'FILE_MANAGER_MODE_ON':
            return (
                <div>
                    <TopBar {...props}/>
                    <FileContainer {...propsAssets}/>
                </div>
            );
        case 'PLAY_MODE_ON':
            return (
                <div>
                    <VRScene {...props}/>
                </div>

            );
        case 'GAME_SELECTION_MODE_ON':
            return (<GameList {...props}/>);
        case 'GEOMETRY_MODE_ON':
            return (
                <div>
                    <GeometryScene {...props}/>
                </div>
            );
        case 'LOGIN_MODE_ON':
            return (
                <Login {...props}/>
            );
        case 'DEBUG_MODE_ON':
            let vrScene = <VRScene debug={true} {...props}/>;
            return (
                <div onClick={(event) => closeDropdowns(event, props)}>
                    <TopBar {...props} />
                    <div className={'grid-container'}>
                        <LeftBar {...props} />
                        <DebugTab {...props} />
                        <div className={"scene"} id={"debug-scene"}>
                            {vrScene}
                        </div>
                        <EudRuleEditor {...props} VRScene={vrScene}/>
                    </div>
                </div>
            );
        case 'STORY_EDITOR_MODE_ON':
            return (
                <div>
                    <TopBar {...props} />
                    <StoryEditor {...props} />
					<FileForm {...props}/>
                </div>
            );

        default:
            return (
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
function closeDropdowns(event, props) {
    if (event.target.className && typeof event.target.className !== 'object') {
        props.dropdownTagsRightbar(!(props.editor.chooseTagRightbar) && event.target.className.includes('chosen-tag-rightbar'));
    }
}

function checkEditor(props){
    return props.editor.editorExpanded ? 'expanded' : '';
}

export default AppView;