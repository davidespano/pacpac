const ActionTypes = {

    //EDITOR

    EDIT_MODE_ON : 'EDIT_MODE_ON',
    GAME_SELECTION_MODE_ON : 'GAME_SELECTION_MODE_ON' ,
    GEOMETRY_MODE_ON : 'GEOMETRY_MODE_ON',
    NAVBAR_SELECTION : 'NAVBAR_SELECTION',
    PLAY_MODE_ON : 'PLAY_MODE_ON',
    LOGIN_MODE_ON : 'LOGIN_MODE_ON',
    FILE_MANAGER_MODE_ON : 'FILE_MANAGER_MODE_ON',
    RIGHTBAR_SELECTION : 'RIGHTBAR_SELECTION',
    DROPDOWN_SCENES_ORDER : 'DROPDOWN_SCENES_ORDER',
    DROPDOWN_TAGS_NEW_SCENE : 'DROPDOWN_TAGS_NEW_SCENE',
    DROPDOWN_TAGS_RIGHTBAR : 'DROPDOWN_TAGS_RIGHTBAR',
    SELECT_TAG_NEW_SCENE : 'SELECT_TAG_NEW_SCENE',
    SELECT_FILE : 'SELECT_FILE',
    SELECT_MEDIA_TO_EDIT : 'SELECT_MEDIA_TO_EDIT',

    //SCENES

    CLICK_SCENE : 'CLICK_SCENE',
    LOAD_ALL_SCENES : 'LOAD_ALL_SCENES',
    RECEIVE_SCENE : 'RECEIVE_SCENE',
    REMOVE_SCENE : 'REMOVE_SCENE',
    REMOVE_ALL_SCENES : 'REMOVE_ALL_SCENE',
    SORT_SCENES : 'SORT_SCENES',
    UPDATE_CURRENT_SCENE : 'UPDATE_CURRENT_SCENE',
    UPDATE_SCENE : 'UPDATE_SCENE',
    UPDATE_SCENE_NAME : 'UPDATE_SCENE_NAME',

    //TAGS

    ADD_NEW_TAG : 'ADD_NEW_TAG',
    REMOVE_TAG : 'REMOVE_TAG',
    UPDATE_TAG: 'UPDATE_TAG',

    // INTERACTIVE OBJECTS

    ADD_NEW_OBJECT : 'ADD_NEW_OBJECT',
    LOAD_ALL_OBJECTS : 'LOAD_ALL_OBJECTS',
    OBJECTS_FILTER : 'OBJECTS_FILTER',
    RECEIVE_OBJECT : 'RECEIVE_OBJECT',
    REMOVE_OBJECT : 'REMOVE_OBJECT',
    SELECT_ALL_OBJECTS : 'SELECT_ALL_OBJECTS',
    UPDATE_CURRENT_OBJECT : 'UPDATE_CURRENT_OBJECT',
    UPDATE_OBJECT : 'UPDATE_OBJECT',
    UPDATE_VERTICES : 'UPDATE_VERTICES',

    //RULES

    ADD_NEW_RULE : 'ADD_NEW_RULE',
    RECEIVE_RULE : 'RECEIVE_RULE',
    REMOVE_RULE : 'REMOVE_RULE',
    UPDATE_RULE : 'UPDATE_RULE',

    //MEDIA
    LOAD_ALL_ASSETS : 'LOAD_ALL_ASSETS',

    //OTHER

    ON_PICTURE_DROP : 'ON_PICTURE_DROP',
    RECEIVE_USER : 'RECEIVE_USER',
    UPDATE_DATALIST : 'UPDATE_DATALIST',
};

export default ActionTypes;