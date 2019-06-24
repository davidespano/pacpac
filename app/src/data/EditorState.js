import Immutable from 'immutable';
import ActionTypes from "../actions/ActionTypes";
import Orders from "./Orders";

const EditorState = Immutable.Record({

    actionId: null,
    audioFilter: '',
    chooseTagNewScene: false,
    chooseTagRightbar: false,
    completionInput: null,
    debugFromScene: null,
    debugRunState: null,
    debugSaves: null,
    isEditAudioOn: false,
    isAudioSpatial: false,
    leftbarSelection: 'scenes',
    loopChecked: false,
    mentionType: null,
    mode: ActionTypes.LOGIN_MODE_ON,
    newAudioNameTyped: false,
    newSceneNameTyped: false,
    objectId: null,
    objectNameRightbar: null,
    objectsNameFilter: '',
    objectsTypeFilter: 'scene',
    navbarSelection: 'scene',
    rightbarSelection: 'scene',
    role: null,
    scenesOrder: Orders.CHRONOLOGICAL,
    scenesNameFilter: '',
    sceneNameRightbar: null,
    selectedAudioToEdit: null,
    selectedAudioFile: null,
    selectedFile: null,
    selectedMediaToEdit: null,
    selectedSceneSpatialAudio: null,
    selectedTagNewScene: 'default',
    tagFilter: '',
    user: null,
});

export default EditorState;