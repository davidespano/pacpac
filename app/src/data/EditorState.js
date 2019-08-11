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
    leftbarSelection: 'scenes',
    mentionType: null,
    mode: ActionTypes.LOGIN_MODE_ON,
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
    selectedFile: null,
    selectedMediaToEdit: null,
    selectedTagNewScene: 'default',
    soundActiveFormChecked: false,
    tagFilter: '',
    user: null,

    //scene options

    sceneOptions: null,

    //audio form

    audioPositioning: false,
    audioToEdit: null,
    isItNew: false,
    selectedAudioFile: null,

});

export default EditorState;