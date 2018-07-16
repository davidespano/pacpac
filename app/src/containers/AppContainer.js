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


function getStores() {
    return [
        ModeTypeStore,
        ScenesStore,
        ClickStore,
        CentralSceneStore,
        TagsStore,
        ObjectsStore,
        CurrentObjectStore,
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

        //FUNCTIONS

        //page modes

        switchToPlayMode: Actions.playModeOn,
        switchToEditMode: Actions.editModeOn,

        //scenes

        addScene: Actions.addScene,
        clickScene: Actions.clickScene,
        getScene: Actions.getScene,
        receiveScene: Actions.receiveScene,

        //interactive objects

        addNewObject: Actions.addNewObject,

        //OTHER

        onDrop: Actions.onDrop,

    };
}

export default Container.createFunctional(AppView, getStores, getState);
