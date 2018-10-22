import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";

/**
 * Updates the scene saving the object in the proper list
 * @param scene
 * @param object
 */
function addInteractiveObjectToScene(scene, object){
    let field = "";

    switch(object.type){
        case InteractiveObjectsTypes.TRANSITION:
            field = 'transitions';
            break;
        case InteractiveObjectsTypes.SWITCH:
            field = 'switches';
            break;
        default:
            return;
    }

    // updating scene
    let objects = scene.get('objects');
    objects[field].push(object);
    scene.setIn(['objects'], objects);

}

export default {
    addInteractiveObjectToScene : addInteractiveObjectToScene,
}