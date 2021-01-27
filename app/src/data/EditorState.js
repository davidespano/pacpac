import Immutable from 'immutable';
import ActionTypes from "../actions/ActionTypes";
import Orders from "./Orders";

/**
 * [Vittoria] EditorState è un record immutabile, quindi a differenza degli oggetti Javascript non posso aggiungere nuove
 * proprietà, posso solo riprendermi i valori delle proprietà (tramite get) oppure modificarle tramite la set e il riassegnamento
 * es. EditorState = EditorState.set(...)
 * Questo è una sorta di prototipo dell'oggetto con tutte le proprietà che mi possono servire con valori di default
 * Quando non vengono modificate rimangono al valore corrente
 */
const EditorState = Immutable.Record({

    actionId: null,                     //EudRuleEditor
    audioFilter: '',                    //AudioMenu, contains value typed in filter
    completionInput: null,              //EudRuleEditor
    debugFromScene: null,               //set scene the debug should start from
    debugRunState: null,                //set run state for debugging the game
    debugSaves: null,                   //DebugTab
    editorExpanded: false,              //boolean to check if rules editor is expanded or not
    gameId: null,                       //used to store the code of a specific game that the user wants to play
    gameTitle: null,                    //title of the game we are editing
    homeScene: null,                    //id of game's starting scene
    isEditAudioOn: false,               //boolean to check if user is editing an existing audio or creating a new one
    leftbarSelection: 'scenes',         //tab selected in leftbar (possible values: 'scenes' and 'saves')
    mode: ActionTypes.LOGIN_MODE_ON,    //interface mode, determines which part of the interface is shown
    newSceneNameTyped: false,           //boolean that determines if the name field in InputSceneForm is completed
    objectId: null,                     //EudRuleEditor, saves original object
    objectNameRightbar: null,           //content of field "name" in object options (rightbar). Saves intermediate value before updating object
    objectsNameFilter: '',              //ObjectOptions, contains value typed in filter
    objectsTypeFilter: 'scene',         //objects shown in rightbar (possible values: 'scene' and 'all)
    rightbarSelection: 'scene',         //tab selected in rightbar (possible values: 'scene' and 'objects')
    role: null,                         //EudRuleEditor, role of rule portion that the user is modifying
    ruleCopy: null,						//save rule copy in order to replicate it
    scenesOrder: Orders.ALPHABETICAL,  //order of scenes (all orders available in data/Orders)
    scenesNameFilter: '',               //Leftbar, contains value typed in filter
    sceneOptions: null,                 //saves data of current scene, it's used in SceneOptions to show and update data
    selectedFile: null,                 //file currently selected in FileManager
    selectedMediaToEdit: null,          //property that is set when user is selecting a file ('audio-form', 'scene', etc)
    selectedTagNewScene: 'default',     //tag selected in InputSceneForm
    tagFilter: '',                      //TagMenu, contains value typed in filter
    user: null,                         //contains user data

    //audio form

    audioPositioning: false,            //boolean that checks if it's allowed to set audio position in scene (a scene must be selected, and isSpatial has to be set to true)
    audioToEdit: null,                  //when creating an audio, contains a new Audio object; when editing one, contains a copy of the Audio. It's used to store intermediate data while editing
    isItNew: false,                     //true if we are creating a new audio, false otherwise

});

export default EditorState;