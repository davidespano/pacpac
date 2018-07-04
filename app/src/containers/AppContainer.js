import AppView from '../views/AppView';
import ModeTypeStore from '../data/ModeTypeStore';
import LeftbarStore from '../data/LeftbarStore';
import ClickStore from '../data/ClickStore';
import CentralSceneStore from '../data/CentralSceneStore'
import {Container} from 'flux/utils';
import Actions from '../actions/Actions';
import LabelsStore from "../data/LabelsStore";


function getStores() {
    return [
        ModeTypeStore,
        LeftbarStore,
        ClickStore,
        CentralSceneStore,
        LabelsStore,
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

        //FUNCTIONS

        //page modes

        switchToPlayMode: Actions.playModeOn,
        switchToEditMode: Actions.editModeOn,

        //scenes

        addScene: Actions.addScene,
        clickScene: Actions.clickScene,
        getScene: Actions.getScene,
        receiveScene: Actions.receiveScene,

        //other

        onDrop: Actions.onDrop,

    };
}

export default Container.createFunctional(AppView, getStores, getState);
