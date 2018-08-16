import AppView from '../views/AppView';
import ModeTypeStore from '../data/ModeTypeStore';
import ScenesStore from '../data/ScenesStore';
import ClickStore from '../data/ClickStore';
import CentralSceneStore from '../data/CentralSceneStore'
import {Container} from 'flux/utils';
import Actions from '../actions/Actions';
import ObjectsStore from "../data/ObjectsStore";
import CurrentObjectStore from "../data/CurrentObjectStore";
import TagsStore from "../data/TagsStore";
import ObjectsFilterStore from "../data/ObjectsFilterStore";
import DatalistStore from "../data/DatalistStore";


function getStores() {
    return [
        ModeTypeStore,
        ScenesStore,
        ClickStore,
        CentralSceneStore,
        TagsStore,
        ObjectsStore,
        CurrentObjectStore,
        ObjectsFilterStore,
        DatalistStore,
    ];
}

function getState() {
    //props
    return {

        //STATES

        mode: ModeTypeStore.getState(),
        scenes: ScenesStore.getState(),
        click: ClickStore.getState(),
        currentScene: CentralSceneStore.getState(),
        sceneTags: TagsStore.getState(),
        interactiveObjects: ObjectsStore.getState(),
        currentObject: CurrentObjectStore.getState(),
        objectsFilter: ObjectsFilterStore.getState(),
        datalists: DatalistStore.getState(),

        //FUNCTIONS

        //page modes

        switchToPlayMode: Actions.playModeOn,
        switchToEditMode: Actions.editModeOn,
        switchToGeometryMode: Actions.geometryModeOn,

        //scenes

        addScene: Actions.addScene,
        clickScene: Actions.clickScene,
        getScene: Actions.getScene,
        receiveScene: Actions.receiveScene,
        removeScene: Actions.removeScene,
        removeAllScene: Actions.removeAllScene,
        updateCurrentScene: Actions.updateCurrentScene,
        updateScene: Actions.updateScene,

        //interactive objects

        addNewTransition: Actions.addNewTransition,
        removeTransition: Actions.removeTransition,
        addNewObject: Actions.addNewObject,
        selectAllObjects: Actions.selectAllObjects,
        updateCurrentObject: Actions.updateCurrentObject,
        filterObjectFunction: Actions.filterObject,

        //OTHER
        onDrop: Actions.onDrop,
        updateDatalist: Actions.updateDatalist,

    };
}

export default Container.createFunctional(AppView, getStores, getState);
