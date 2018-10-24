import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";

/**
 * Updates the scene saving the object in the proper list
 * @param scene
 * @param object
 */
function addInteractiveObjectToScene(scene, object){
    let field = defineField(object);

    // updating scene
    if(field){
        let objects = scene.get('objects');
        objects[field].push(object);
        scene.setIn(['objects'], objects);
    }
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
        objects[field].filter((element) => element.uuid !== object.uuid);
        scene.setIn(['objects'], objects);
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
            break;
        default:
            return null;
    }
}

export default {
    addInteractiveObjectToScene: addInteractiveObjectToScene,
    removeInteractiveObject: removeInteractiveObject,
}