import AppView from '../views/AppView';
import AppStore from '../data/ModeTypeStore';
import LeftbarStore from '../data/LeftbarStore';
import ClickStore from '../data/ClickStore';
import {Container} from 'flux/utils';
import Actions from '../actions/Actions';

function getStores() {
    return [
        AppStore,
    ];
}

function getState() {
    //props
    return {
        mode: AppStore.getState(),
        leftbar: LeftbarStore.getState(),
        click: ClickStore.getState(),
        switchToPlayMode: Actions.playModeOn,
        switchToEditMode: Actions.editModeOn,
        addScene: Actions.addScene,
        clickScene: Actions.clickScene,
    };
}

export default Container.createFunctional(AppView, getStores, getState);
