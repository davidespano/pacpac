import Immutable from 'immutable';
import ActionTypes from "../actions/ActionTypes";
import Orders from "./Orders";

const EditorState = Immutable.Record({
    audioFilter: '',
    chooseTagNewScene: false,
    chooseTagRightbar: false,
    isEditAudioOn: false,
    isAudioLocal: false,
    selectedAudioToEdit: null,
    selectedFile: null,
    selectedMediaToEdit: null,
    mode: ActionTypes.LOGIN_MODE_ON,
    objectsFilter: 'scene',
    navbarSelection: 'scene',
    rightbarSelection: 'scene',
    scenesOrder: Orders.CHRONOLOGICAL,
    scenesOrderMenu: false,
    selectedTagNewScene: 'default',
    tagFilter: '',
    user: null,
    mentionType: null,
    objectId: null,
    actionId: null,
    role: null,
    completionInput: null,
    newSceneNameTyped: false,
});

export default EditorState;