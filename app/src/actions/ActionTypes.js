/**[Vittoria]
 * Costanti per i tipi di azioni, per convenzione ogni costante ha come valore se stesso in forma di stringa
 * Sono in ordine alfabetico
 * Non possono esserci duplicati
 */

const ActionTypes = {

    RESET: 'RESET',

    //EDITOR

    //Interface modes
    SET_INTERFACE_MODE: 'SET_INTERFACE_MODE',

    DEBUG_MODE_ON : 'DEBUG_MODE_ON',
    EDIT_MODE_ON : 'EDIT_MODE_ON',
    FILE_MANAGER_MODE_ON : 'FILE_MANAGER_MODE_ON',
    GAME_SELECTION_MODE_ON : 'GAME_SELECTION_MODE_ON' ,
    GEOMETRY_MODE_ON : 'GEOMETRY_MODE_ON',
    LOGIN_MODE_ON : 'LOGIN_MODE_ON',
    PLAY_MODE_ON : 'PLAY_MODE_ON',
    STORY_EDITOR_MODE_ON: 'STORY_EDITOR_MODE_ON',
    GRAPH_VIEW_MODE_ON:'GRAPH_VIEW_MODE_ON',
    HELP_MODE_ON: 'HELP_MODE_ON',

    AUDIO_POSITIONING: 'AUDIO_POSITIONING',
    DEBUG_SAVES : 'DEBUG_SAVES',
    DROPDOWN_SCENES_ORDER : 'DROPDOWN_SCENES_ORDER',
    DROPDOWN_TAGS_NEW_SCENE : 'DROPDOWN_TAGS_NEW_SCENE',
    EDITOR_EXPANDED: 'EDITOR_EXPANDED',
    IS_IT_NEW: 'IS_IT_NEW',
    LEFTBAR_SELECTION : 'LEFTBAR_SELECTION',
    RIGHTBAR_SELECTION : 'RIGHTBAR_SELECTION',
    NEW_AUDIO_NAME_TYPED: 'NEW_AUDIO_NAME_TYPED',
    NEW_SCENE_NAME_TYPED: 'NEW_SCENE_NAME_TYPED',
    SELECT_TAG_NEW_SCENE : 'SELECT_TAG_NEW_SCENE',
    SELECT_FILE : 'SELECT_FILE',
    SELECT_MEDIA_TO_EDIT : 'SELECT_MEDIA_TO_EDIT',
    SELECT_AUDIO_TO_EDIT : 'SELECT_AUDIO_TO_EDIT',
    SET_HOME_SCENE: 'SET_HOME_SCENE',
    SET_GAME_TITLE: 'SET_GAME_TITLE',
    UPDATE_AUDIO_FILTER: 'UPDATE_AUDIO_FILTER',
    UPDATE_TAG_FILTER: 'UPDATE_TAG_FILTER',
    UPDATE_OBJECT_NAME_RIGHTBAR: 'UPDATE_OBJECT_NAME_RIGHTBAR',
    UPDATE_OBJECTS_NAME_FILTER: 'UPDATE_OBJECTS_NAME_FILTER',
    UPDATE_OBJECTS_TYPE_FILTER : 'UPDATE_OBJECTS_TYPE_FILTER',
    UPDATE_SCENE_NAME_FILTER : 'UPDATE_SCENE_NAME_FILTER',
    UPDATE_SCENE_NAME_RIGHTBAR: 'UPDATE_SCENE_NAME_RIGHTBAR',
    UPDATE_SCENE_OPTIONS: 'UPDATE_SCENE_OPTIONS',

    //SCENES

    CLICK_SCENE : 'CLICK_SCENE',
    LOAD_ALL_SCENES : 'LOAD_ALL_SCENES',
    RECEIVE_SCENE : 'RECEIVE_SCENE',
    REMOVE_SCENE : 'REMOVE_SCENE',
    REMOVE_ALL_SCENES : 'REMOVE_ALL_SCENES',
    SORT_SCENES : 'SORT_SCENES',
    UPDATE_CURRENT_SCENE : 'UPDATE_CURRENT_SCENE',
    UPDATE_SCENE : 'UPDATE_SCENE',
    UPDATE_SCENE_NAME : 'UPDATE_SCENE_NAME',

    // TAGS

    ADD_NEW_TAG : 'ADD_NEW_TAG',
    RECEIVE_TAG : 'RECEIVE_TAG',
    REMOVE_TAG : 'REMOVE_TAG',
    UPDATE_TAG: 'UPDATE_TAG',

    // INTERACTIVE OBJECTS

    ADD_NEW_OBJECT : 'ADD_NEW_OBJECT',
    LOAD_ALL_OBJECTS : 'LOAD_ALL_OBJECTS',
    RECEIVE_OBJECT : 'RECEIVE_OBJECT',
    REMOVE_OBJECT : 'REMOVE_OBJECT',
    SELECT_ALL_OBJECTS : 'SELECT_ALL_OBJECTS',
    UPDATE_CURRENT_OBJECT : 'UPDATE_CURRENT_OBJECT',
    UPDATE_OBJECT : 'UPDATE_OBJECT',
    UPDATE_VERTICES : 'UPDATE_VERTICES',

    // RULES

    ADD_NEW_RULE : 'ADD_NEW_RULE',
    COPY_RULE: 'COPY_RULE',
    RECEIVE_RULE : 'RECEIVE_RULE',
    REMOVE_RULE : 'REMOVE_RULE',
    UPDATE_RULE : 'UPDATE_RULE',
    UPDATE_RULE_NAME: 'UPDATE_RULE_NAME',
    UPDATE_RULE_EDITOR_CONTENT: 'UPDATE_RULE_EDITOR_CONTENT',
    UPDATE_RULE_EDITOR_RAW: 'UPDATE_RULE_EDITOR_RAW',
    UPDATE_RULE_EDITOR_STATE: 'UPDATE_RULE_EDITOR_STATE',
    UPDATE_SUGGESTION: 'UPDATE_SUGGESTION',
    // [davide] gestione dello stato dell'editor
    EUD_SHOW_COMPLETIONS: 'EUD_SHOW_COMPLETION',
    EUD_SAVE_ORIGINAL_OBJECT: 'EUD_SAVE_ORIGINAL_OBJECT',

    // AUDIO

    ADD_NEW_GLOBAL_AUDIO : 'ADD_NEW_GLOBAL_AUDIO',
    ADD_NEW_SPATIAL_AUDIO : 'ADD_NEW_SPATIAL_AUDIO',
    RECEIVE_GLOBAL_AUDIO: 'RECEIVE_GLOBAL_AUDIO',
    RECEIVE_SPATIAL_AUDIO: 'RECEIVE_SPATIAL_AUDIO',
    REMOVE_GLOBAL_AUDIO : 'REMOVE_GLOBAL_AUDIO',
    REMOVE_SPATIAL_AUDIO : 'REMOVE_SPATIAL_AUDIO',
    UPDATE_AUDIO: 'UPDATE_AUDIO',

    // MEDIA

    LOAD_ALL_ASSETS : 'LOAD_ALL_ASSETS',

    // OTHER
    RECEIVE_USER : 'RECEIVE_USER',
	
	//STORY EDITOR
	LOAD_ALL_COLLECTIONS: 'LOAD_ALL_COLLECTIONS',
	RECEIVE_COLLECTION: 'RECEIVE_COLLECTION',
	UPDATE_COLLECTION: 'UPDATE_COLLECTION',
	REMOVE_COLLECTION: 'REMOVE_COLLECTION',
	
	RECEIVE_IMAGE: 'RECEIVE_IMAGE',
	UPDATE_IMAGE: 'UPDATE_IMAGE',
	REMOVE_IMAGE: 'REMOVE_IMAGE',
	
	RECEIVE_STORY: 'RECEIVE STORY',
	UPDATE_STORY: 'UPDATE_STORY',
	EDIT_STORY: 'EDIT_STORY',		
	REMOVE_STORY: 'REMOVE_STORY',	
	
	START_EDITING_STORY: 'START_EDITING_STORY',
	STOP_EDITING_STORY: 'STOP_EDITING_STORY',	
	
	ADD_FORM_IMAGE: 'ADD_FORM_IMAGE',
	RECEIVE_FORM_IMAGE: 'RECEIVE_FORM_IMAGE',
	UPDATE_FORM_IMAGE: 'UPDATE_FORM_IMAGE',
	UPDATE_FORM_IMAGE_NAME: 'UPDATE_FORM_IMAGE_NAME',
	REMOVE_FORM_IMAGE: 'REMOVE_FORM_IMAGE',
	RESET_FORM_IMAGE: 'RESET_FORM_IMAGE',
	
};

export default ActionTypes;