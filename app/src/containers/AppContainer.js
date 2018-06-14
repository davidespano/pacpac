import AppView from '../views/AppView';
import ModeTypeStore from '../data/ModeTypeStore';
import LeftbarStore from '../data/LeftbarStore';
import ClickStore from '../data/ClickStore';
import {Container} from 'flux/utils';
import Actions from '../actions/Actions';

function getStores() {
    return [
        ModeTypeStore,
        LeftbarStore,
        ClickStore
    ];
}

function getState() {
    //props
    return {

        //states

        mode: ModeTypeStore.getState(),
        leftbar: LeftbarStore.getState(),
        click: ClickStore.getState(),

        //functions

        switchToPlayMode: Actions.playModeOn,
        switchToEditMode: Actions.editModeOn,
        addScene: Actions.addScene,
        clickScene: Actions.clickScene,
    };
}

export default Container.createFunctional(AppView, getStores, getState);
