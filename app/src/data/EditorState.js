import Immutable from 'immutable';
import ActionTypes from "../actions/ActionTypes";
import Orders from "./Orders";

const EditorState = Immutable.Record({

    actionId: null,
    audioFilter: '',
    chooseTagNewScene: false,
    chooseTagRightbar: false,
    completionInput: null,
    isEditAudioOn: false,
    isAudioLocal: false,
    mentionType: null,
    mode: ActionTypes.LOGIN_MODE_ON,
    newSceneNameTyped: false,
    objectId: null,
    objectsNameFilter: '',
    objectsTypeFilter: 'scene',
    navbarSelection: 'scene',
    rightbarSelection: 'scene',
    role: null,
    scenesOrder: Orders.CHRONOLOGICAL,
    scenesNameFilter: '',
    selectedAudioToEdit: null,
    selectedFile: null,
    selectedMediaToEdit: null,
    selectedTagNewScene: 'default',
    tagFilter: '',
    user: null,

});

export default EditorState;