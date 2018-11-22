import Immutable from 'immutable';
import ActionTypes from "../actions/ActionTypes";

const EditorState = Immutable.Record({
    mode: ActionTypes.EDIT_MODE_ON,
    objectsFilter: 'scene',
    navbarSelection: 'scene',
    rightbarSelection: 'scene',
});

export default EditorState;