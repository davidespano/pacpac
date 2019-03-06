import Immutable from 'immutable';
import ActionTypes from "../actions/ActionTypes";
import Orders from "./Orders";

const EditorState = Immutable.Record({
    chooseTagNewScene: false,
    chooseTagRightbar: false,
    selectedFile: null,
    selectedMediaToEdit: null,
    mode: ActionTypes.LOGIN_MODE_ON,
    objectsFilter: 'scene',
    navbarSelection: 'scene',
    rightbarSelection: 'scene',
    scenesOrder: Orders.CHRONOLOGICAL,
    scenesOrderMenu: false,
    selectedTagNewScene: 'default',
    user: null,
    mentionType: null,
});

export default EditorState;