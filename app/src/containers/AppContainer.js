import AppView from '../views/AppView';
import ModeTypeStore from '../data/ModeTypeStore';
import LeftbarStore from '../data/LeftbarStore';
import ClickStore from '../data/ClickStore';
import CentralSceneStore from '../data/CentralSceneStore'
import {Container} from 'flux/utils';
import Actions from '../actions/Actions';
import LabelsStore from "../data/LabelsStore";
import ObjectsStore from "../data/ObjectsStore";
import RightbarStore from "../data/RightbarStore";


function getStores() {
    return [
        ModeTypeStore,
        LeftbarStore,
        ClickStore,
        CentralSceneStore,
        LabelsStore,
        ObjectsStore,
        RightbarStore,
    ];
}

function getState() {
    //props
    return {

        //STATES

        mode: ModeTypeStore.getState(),
        leftbar: LeftbarStore.getState(),
        click: ClickStore.getState(),
        sceneName: CentralSceneStore.getState(),
        sceneLabels: LabelsStore.getState(),
        interactiveObjects: ObjectsStore.getState(),
        rightbar: RightbarStore.getState(),

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
