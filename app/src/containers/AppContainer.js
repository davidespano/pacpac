import AppView from '../views/AppView';
import AppStore from '../data/AppStore';
import {Container} from 'flux/utils';
import Actions from '../data/Actions';

function getStores() {
    return [
        AppStore,
    ];
}

function getState() {
    return {
        mode: AppStore.getState(),
        switchToPlayMode: Actions.playModeOn,
        switchToEditMode: Actions.editModeOn,
    };
}

export default Container.createFunctional(AppView, getStores, getState);
