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
import StoryEditor from "../components/interface/StoryEditor";
import ActionTypes from "../actions/ActionTypes";
import GraphViewContent from "../components/interface/GraphViewContent";

function AppView(props) {

    let propsAssets = {
        props: props,
        component: 'assets',
    };
    
    switch (props.editor.mode) {
        case ActionTypes.EDIT_MODE_ON:
            let scene = null;
            if(!props.editor.editorExpanded){
                scene = <CentralScene {...props} />
            }
            return (
                <div>
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
        case ActionTypes.FILE_MANAGER_MODE_ON:
            return (
                <div>
                    <TopBar {...props}/>
                    <FileContainer {...propsAssets}/>
                </div>
            );
        case ActionTypes.PLAY_MODE_ON:
            return (
                <div>
                    <VRScene {...props}/>
                </div>

            );
        case ActionTypes.GAME_SELECTION_MODE_ON:
            return (<GameList {...props}/>);
        case ActionTypes.GEOMETRY_MODE_ON:
            return (
                <div>
                    <GeometryScene {...props}/>
                </div>
            );
        case ActionTypes.LOGIN_MODE_ON:
            return (
                <Login {...props}/>
            );
        case ActionTypes.DEBUG_MODE_ON:
            let vrScene = <VRScene debug={true} {...props}/>;

            let debugProps = {
                ...props,
               /* debugRunState: EditorState.debugRunState*/
            };

            return (
                <div>
                    <TopBar {...debugProps}/>
                    <div className={'grid-container'}>
                        <LeftBar {...debugProps} />
                        <DebugTab {...debugProps} />
                        <div className={"scene"} id={"debug-scene"}>
                            {vrScene}
                        </div>
                        <EudRuleEditor {...debugProps} VRScene={vrScene}/>
                    </div>
                </div>
            );
        case ActionTypes.STORY_EDITOR_MODE_ON:
            return (
                <div>
                    <TopBar {...props} />
                    <StoryEditor {...props} />
					<FileForm {...props}/>
                </div>
            );
        case ActionTypes.GRAPH_VIEW_MODE_ON:
            return (
                <div>
                    <TopBar {...props}/>
                    <GraphViewContent {...props} />
                </div>
            );
        default:
            return (
                <div>SOMETHING WENT WRONG!</div>
            );

    }
}

/**
 * Returns class 'expanded' if rule editor is open
 * @param props
 * @returns {string}
 */
function checkEditor(props){
    return props.editor.editorExpanded ? 'expanded' : '';
}

export default AppView;