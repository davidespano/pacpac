import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import Actions from "../actions/Actions";
import InteractiveObjectAPI from "../utils/InteractiveObjectAPI";

/**
 * Returns the updated scene
 * @param scene
 * @param object
 */
function addInteractiveObjectToScene(scene, object){
    let field = defineField(object);

    // updating scene
    if(field){
        let objects = scene.get('objects');
        objects[field].push(object.uuid);
        return scene.setIn(['objects'], objects);
    }

    return scene;
}

/**
 * Updates the scene removing a given object
 * @param scene
 * @param object
 */
function removeInteractiveObject(scene, object){
    let field = defineField(object);

    // updating scene
    if(field){
        let objects = scene.get('objects');
        objects[field] = objects[field].filter((uuid) => uuid !== object.get('uuid'));
        return scene.setIn(['objects'], objects);
    }
    return scene;
}

/**
 * Updates the scene saving the given Rule, returns updated scene
 * @param scene
 * @param rule
 */
function addRuleToScene(scene, rule){
    let rules = scene.get('rules');
    rules.push(rule.uuid);
    return scene.set('rules', rules);
}

/**
 * Removes given Rule from the Scene and returns updated scene
 * @param scene
 * @param rule
 */
function removeRuleFromScene(scene, rule){
    let rules = scene.get('rules');
    rules = rules.filter((uuid) => uuid !== rule.uuid);
    return scene.set('rules', rules);
}


/**
 * Updates the scene saving the given audio, returns updated scene
 * @param scene
 * @param audio_uuid
 */
function addAudioToScene(scene, audio_uuid){
    let audios = scene.get('audios');
    audios.push(audio_uuid);
    return scene.set('audios', audios);
}

/**
 * Removes given audio from the Scene and returns updated scene
 * @param scene
 * @param audio_uuid
 */
function removeAudioFromScene(scene, audio_uuid){
    let audios = scene.get('audios');
    audios = audios.filter((uuid) => uuid !== audio_uuid);
    return scene.set('audios', audios);
}

/**
 * Updates scene property with the given value, returns new scene. DO NOT use this function to update nested properties
 * such as "objects"
 * @param scene
 * @param property
 * @param value
 * @param props
 */
function setProperty(scene, property, value, props){
    let newScene = scene.set(property, value);

    if(property === 'name'){
        props.updateSceneName(newScene, scene.name, props.editor.scenesOrder);
    } else {
        props.updateScene(newScene);
    }
}

/**
 * Returns the name of the field where the given object is saved (a Transition returns "transitions", a Switch returns
 * "switches", and so on. It is used to remove and add objects to the proper field
 * @param object
 * @returns {*}
 */
function defineField(object){
    switch(object.type){
        case InteractiveObjectsTypes.TRANSITION:
            return 'transitions';
        case InteractiveObjectsTypes.SWITCH:
            return 'switches';
        case InteractiveObjectsTypes.KEY:
            return 'collectable_keys';
        case InteractiveObjectsTypes.LOCK:
            return 'locks';
        default:
            return null;
    }
}

/**
 * Returns array of all objects belonging to the scene (with no type distinction)
 * @param scene
 * @returns {*}
 */
function allObjects(scene){
    return Object.values(scene.objects).flat();
}

export default {
    addInteractiveObjectToScene: addInteractiveObjectToScene,
    removeInteractiveObject: removeInteractiveObject,
    addRuleToScene: addRuleToScene,
    removeRuleFromScene: removeRuleFromScene,
    addAudioToScene: addAudioToScene,
    removeAudioFromScene: removeAudioFromScene,
    setProperty: setProperty,
    defineField: defineField,
    allObjects: allObjects,
}