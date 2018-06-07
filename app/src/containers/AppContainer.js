import AppView from '../views/AppView';
import AppStore from '../data/AppStore';
import {Container} from 'flux/utils';

function getStores() {
    return [
        AppStore,
    ];
}

function getState() {
    return {
        things: AppStore.getState(),
    };
}

export default Container.createFunctional(AppView, getStores, getState);
