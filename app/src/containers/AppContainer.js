import AppView from '../views/AppView';
import ScenesStore from '../data/ScenesStore';
import ClickStore from '../data/ClickStore';
import CentralSceneStore from '../data/CentralSceneStore'
import {Container} from 'flux/utils';
import Actions from '../actions/Actions';
import ObjectsStore from "../data/ObjectsStore";
import CurrentObjectStore from "../data/CurrentObjectStore";
import TagsStore from "../data/TagsStore";
import EditorStateStore from "../data/EditorStateStore";
import RulesStore from "../data/RulesStore";
import DatalistStore from "../data/DatalistStore";
import CentroidsStore from "../data/CentroidsStore";
import ObjectToSceneStore from "../data/ObjectToSceneStore";
import AssetsStore from "../data/AssetsStore";
import RulesEditorStore from "../data/RulesEditorStore";
import MentionsStore from "../data/MentionsStore";


function getStores() {
    return [
        ScenesStore,
        ClickStore,
        CentralSceneStore,
        TagsStore,
        ObjectsStore,
        ObjectToSceneStore,
        CurrentObjectStore,
        DatalistStore,
        CentroidsStore,
        EditorStateStore,
        AssetsStore,
        RulesEditorStore,
        MentionsStore,
    ];
}

function getState() {
    //props
    return {

        //STATES
        assets: AssetsStore.getState(),
        centroids: CentroidsStore.getState(),
        click: ClickStore.getState(),
        currentScene: CentralSceneStore.getState(),
        currentObject: CurrentObjectStore.getState(),
        datalists: DatalistStore.getState(),
        editor: EditorStateStore.getState(),
        interactiveObjects: ObjectsStore.getState(),
        mentions: MentionsStore.getState(),
        objectToScene: ObjectToSceneStore.getState(),
        rules: RulesStore.getState(),
        rulesEditor: RulesEditorStore.getState(),
        scenes: ScenesStore.getState(),
        tags: TagsStore.getState(),

        //FUNCTIONS

        //editor

        dropdownScenesOrder: Actions.dropdownScenesOrder,
        dropdownTagsNewScene: Actions.dropdownTagsNewScene,
        dropdownTagsRightbar: Actions.dropdownTagsRightbar,
        rightbarSelection: Actions.rightbarSelection,
        selectFile: Actions.selectFile,
        selectMediaToEdit: Actions.selectMediaToEdit,
        selectTagNewScene: Actions.selectTagNewScene,
        switchToPlayMode: Actions.playModeOn,
        switchToEditMode: Actions.editModeOn,
        switchToLoginMode: Actions.loginModeOn,
        switchToFileManager: Actions.fileManagerModeOn,
        switchToGeometryMode: Actions.geometryModeOn,

        //scenes

        clickScene: Actions.clickScene,
        receiveScene: Actions.receiveScene,
        removeScene: Actions.removeScene,
        removeAllScenes: Actions.removeAllScenes,
        sortScenes: Actions.sortScenes,
        updateCurrentScene: Actions.updateCurrentScene,
        updateScene: Actions.updateScene,
        updateSceneName: Actions.updateSceneName,

        //tags

        addNewTag: Actions.addNewTag,
        updateTag: Actions.updateTag,

        //interactive objects

        removeObject: Actions.removeObject,
        addNewObject: Actions.addNewObject,
        selectAllObjects: Actions.selectAllObjects,
        updateCurrentObject: Actions.updateCurrentObject,
        updateObject: Actions.updateObject,
        filterObjectFunction: Actions.filterObject,
        editVertices: Actions.editVertices,

        //rules

        addNewRule: Actions.addNewRule,
        removeRule: Actions.removeRule,
        updateRule: Actions.updateRule,
        updateRuleEditorFromState: Actions.updateRuleEditorFromState,
        updateRuleEditorFromHTML: Actions.updateRuleEditorFromHTML,
        updateSuggestion: Actions.updateSuggestion,

        //OTHER

        onDrop: Actions.onDrop,
        updateDatalist: Actions.updateDatalist,

    };
}

export default Container.createFunctional(AppView, getStores, getState);
