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


function getStores() {
    return [
        ScenesStore,
        ClickStore,
        CentralSceneStore,
        TagsStore,
        ObjectsStore,
        CurrentObjectStore,
        DatalistStore,
        CentroidsStore,
        EditorStateStore,
    ];
}

function getState() {
    //props
    return {

        //STATES

        centroids: CentroidsStore.getState(),
        click: ClickStore.getState(),
        currentScene: CentralSceneStore.getState(),
        currentObject: CurrentObjectStore.getState(),
        datalists: DatalistStore.getState(),
        editor: EditorStateStore.getState(),
        interactiveObjects: ObjectsStore.getState(),
        rules: RulesStore.getState(),
        scenes: ScenesStore.getState(),
        sceneTags: TagsStore.getState(),

        //FUNCTIONS

        //editor

        rightbarSelection: Actions.rightbarSelection,
        switchToPlayMode: Actions.playModeOn,
        switchToEditMode: Actions.editModeOn,
        switchToGeometryMode: Actions.geometryModeOn,

        //scenes

        clickScene: Actions.clickScene,
        receiveScene: Actions.receiveScene,
        removeScene: Actions.removeScene,
        removeAllScene: Actions.removeAllScene,
        updateCurrentScene: Actions.updateCurrentScene,
        updateScene: Actions.updateScene,

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

        //OTHER
        onDrop: Actions.onDrop,
        updateDatalist: Actions.updateDatalist,

    };
}

export default Container.createFunctional(AppView, getStores, getState);
