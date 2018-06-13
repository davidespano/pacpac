import AppView from '../views/AppView';
import AppStore from '../data/ModeTypeStore';
import LeftbarStore from '../data/LeftbarStore';
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
        switchToPlayMode: Actions.playModeOn,
        switchToEditMode: Actions.editModeOn,
        addScene: Actions.addScene,
    };
}

export default Container.createFunctional(AppView, getStores, getState);
