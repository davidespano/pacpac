import Immutable from 'immutable';
import ActionTypes from "../actions/ActionTypes";
import Orders from "./Orders";

const EditorState = Immutable.Record({
    chooseTagNewScene: false,
    chooseTagRightbar: false,
    mode: ActionTypes.EDIT_MODE_ON,
    objectsFilter: 'scene',
    navbarSelection: 'scene',
    rightbarSelection: 'scene',
    scenesOrder: Orders.CHRONOLOGICAL,
    scenesOrderMenu: false,
    selectedTagNewScene: 'default',
});

export default EditorState;