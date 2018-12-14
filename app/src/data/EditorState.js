import Immutable from 'immutable';
import ActionTypes from "../actions/ActionTypes";
import Orders from "./Orders";

const EditorState = Immutable.Record({
    mode: ActionTypes.EDIT_MODE_ON,
    objectsFilter: 'scene',
    navbarSelection: 'scene',
    rightbarSelection: 'scene',
    scenesOrder: Orders.CHRONOLOGICAL,
    scenesOrderMenu: false,
});

export default EditorState;