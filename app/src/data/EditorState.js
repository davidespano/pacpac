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
    objectsFilter: 'scene',
    objectId: null,
    navbarSelection: 'scene',
    rightbarSelection: 'scene',
    role: null,
    scenesOrder: Orders.CHRONOLOGICAL,
    scenesOrderMenu: false,
    selectedAudioToEdit: null,
    selectedFile: null,
    selectedMediaToEdit: null,
    selectedTagNewScene: 'default',
    tagFilter: '',
    user: null,

});

export default EditorState;