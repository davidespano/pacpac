const ActionTypes = {

    //EDITOR MODE

    PLAY_MODE_ON : 'PLAY_MODE_ON',
    EDIT_MODE_ON : 'EDIT_MODE_ON',
    GEOMETRY_MODE_ON: 'GEOMETRY_MODE_ON',
    //SCENES

    ADD_SCENE : 'ADD_SCENE',
    CLICK_SCENE : 'CLICK_SCENE',
    GET_SCENE : 'GET_SCENE',
    GET_SCENE_RESPONSE : 'GET_SCENE_RESPONSE',
    LOAD_ALL_SCENES : 'LOAD_ALL_SCENES',
    REMOVE_SCENE: 'REMOVE_SCENE',
    REMOVE_ALL_SCENES: 'REMOVE_ALL_SCENE',
    UPDATE_CURRENT_SCENE : 'UPDATE_CURRENT_SCENE',
    UPDATE_SCENE : 'UPDATE_SCENE',

    //LABELS

    ADD_NEW_TAG : 'ADD_NEW_TAG',
    LOAD_ALL_TAGS : 'LOAD_ALL_TAGS',

    // INTERACTIVE OBJECTS

    ADD_NEW_OBJECT : 'ADD_NEW_OBJECT',
    LOAD_ALL_OBJECTS : 'LOAD_ALL_OBJECTS',
    SELECT_ALL_OBJECTS : 'SELECT_ALL_OBJECTS',
    UPDATE_CURRENT_OBJECT : 'UPDATE_CURRENT_OBJECT',
    LOAD_OBJECT: 'LOAD_OBJECT',
    ADD_NEW_TRANSITION : 'ADD_NEW_TRANSITION',
    OBJECTS_FILTER: 'OBJECTS_FILTER',

    //OTHER
    ON_PICTURE_DROP : 'ON_PICTURE_DROP',
    UPDATE_DATALIST : 'UPDATE_DATALIST',
};

export default ActionTypes;