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
import CentroidsStore from "../data/CentroidsStore";
import ObjectToSceneStore from "../data/ObjectToSceneStore";
import AssetsStore from "../data/AssetsStore";
import AudioStore from "../data/AudioStore";
import ScenesNamesStore from "../data/ScenesNamesStore";
import StoryCollectionsStore from '../data/StoryCollectionsStore';
import StoryImagesStore from '../data/StoryImagesStore';
import StoriesStore from '../data/StoriesStore';
import EditStoriesStore from '../data/EditStoriesStore';
import FormImagesStore from '../data/FormImagesStore';

/**
 * [Vittoria] Quando creo un nuovo store:
 * 1) dev'essere importato qua sopra,
 * 2) dev'essere aggiunto alla funzione getStores qua sotto
 * 3) aggiungilo all'elenco degli stati dello store (funzione getState in questo file)
 */
function getStores() {
    return [
        ScenesStore,
        ClickStore,
        CentralSceneStore,
        TagsStore,
        ObjectsStore,
        ObjectToSceneStore,
        CurrentObjectStore,
        CentroidsStore,
        EditorStateStore,
        AssetsStore,
        RulesStore,
        AudioStore,
        ScenesNamesStore,
		StoriesStore,
	    EditStoriesStore,
		StoryCollectionsStore,
	    StoryImagesStore,
		FormImagesStore,
    ];
}

function getState() {
    //props
    return {

        //STATES
        assets: AssetsStore.getState(),
        audios: AudioStore.getState(),
        centroids: CentroidsStore.getState(),
        click: ClickStore.getState(),
        currentScene: CentralSceneStore.getState(),
        currentObject: CurrentObjectStore.getState(),
        editor: EditorStateStore.getState(),
        interactiveObjects: ObjectsStore.getState(),
        objectToScene: ObjectToSceneStore.getState(),
        rules: RulesStore.getState(),
        scenes: ScenesStore.getState(),
        scenesNames: ScenesNamesStore.getState(),
        tags: TagsStore.getState(),
		stories: StoriesStore.getState(),
		editStories: EditStoriesStore.getState(),
		storyCollections: StoryCollectionsStore.getState(),
		storyImages: StoryImagesStore.getState(),	
		formImages: FormImagesStore.getState(),

        //FUNCTIONS

        reset: Actions.reset,
        
        //EDITOR

        //Interface modes
        switchToPlayMode: Actions.playModeOn,
        switchToDebugMode: Actions.debugModeOn,
        switchToEditMode: Actions.editModeOn,
        switchToLoginMode: Actions.loginModeOn,
        switchToFileManager: Actions.fileManagerModeOn,
        switchToGeometryMode: Actions.geometryModeOn,
        switchToStoryEditorMode: Actions.storyEditorModeOn,
        switchToGameList: Actions.gameSelectionModeOn,

        audioPositioning: Actions.audioPositioning,
        debugSaves: Actions.debugSaves,
        expandEditor: Actions.expandEditor,
        isItNew: Actions.isItNew,
        leftbarSelection: Actions.leftbarSelection,
        newAudioNameTyped: Actions.newAudioNameTyped,
        newSceneNameTyped: Actions.newSceneNameTyped,
        rightbarSelection: Actions.rightbarSelection,
        selectFile: Actions.selectFile,
        selectMediaToEdit: Actions.selectMediaToEdit,
        selectAudioToEdit: Actions.selectAudioToEdit,
        selectTagNewScene: Actions.selectTagNewScene,
        setHomeScene: Actions.setHomeScene,
        setGameTitle: Actions.setGameTitle,

        updateAudioFilter: Actions.updateAudioFilter,
        updateTagFilter: Actions.updateTagFilter,
        updateObjectNameRightbar: Actions.updateObjectNameRightbar,
        updateSceneOptions: Actions.updateSceneOptions,


        //scenes

        clickScene: Actions.clickScene,
        receiveScene: Actions.receiveScene,
        removeScene: Actions.removeScene,
        removeAllScenes: Actions.removeAllScenes,
        sortScenes: Actions.sortScenes,
        updateCurrentScene: Actions.updateCurrentScene,
        updateScene: Actions.updateScene,
        updateSceneName: Actions.updateSceneName,

        //tags

        addNewTag: Actions.addNewTag,
        updateTag: Actions.updateTag,

        //interactive objects

        removeObject: Actions.removeObject,
        addNewObject: Actions.addNewObject,
        selectAllObjects: Actions.selectAllObjects,
        updateCurrentObject: Actions.updateCurrentObject,
        updateObject: Actions.updateObject,
        updateObjectNameFilter: Actions.updateObjectNameFilter,
        updateOtherScenesObjectNameFilter: Actions.updateOtherScenesObjectNameFilter,
        updateObjectTypeFilter: Actions.updateObjectTypeFilter,
        updateSceneNameFilter: Actions.updateSceneNameFilter,
        editVertices: Actions.editVertices,

        //rules

        addNewRule: Actions.addNewRule,
        copyRule: Actions.copyRule,
        removeRule: Actions.removeRule,
        updateRule: Actions.updateRule,
        ruleEditorCallback: {
            eudShowCompletions: Actions.eudShowCompletions,
            eudSaveOriginalObject: Actions.eudSaveOriginalObject,
            eudUpdateRule: Actions.updateRule,
        },

        //audios

        addNewAudio: Actions.addNewAudio,
        removeAudio: Actions.removeAudio,
        updateAudio: Actions.updateAudio,
		
		//STORY EDITOR
		
		receiveCollection: Actions.receiveCollection,
		removeCollection: Actions.removeCollection,		
		receiveImage: Actions.receiveImage,		
		
		receiveStory: Actions.receiveStory,
		removeStory: Actions.removeStory,
		restoreStory: Actions.restoreStory,
		updateStory: Actions.updateStory,
		onEditStory: Actions.editStory,
		startEditingStory: Actions.startEditingStory,
		stopEditingStory: Actions.stopEditingStory,
		
		addFormImage: Actions.addFormImage,
		receiveFormImage: Actions.receiveFormImage,
		updateFormImage: Actions.updateFormImage,
		updateFormImageName: Actions.updateFormImageName,
		removeFormImage: Actions.removeFormImage,
		resetFormImage: Actions.resetFormImage,

    };
}

export default Container.createFunctional(AppView, getStores, getState);
