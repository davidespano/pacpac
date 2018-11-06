import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import Actions from "../actions/Actions";

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
    rules.filter((uuid) => uuid !== rule.uuid);
    return scene.set('rules', rules);
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
        default:
            return null;
    }
}

export default {
    addInteractiveObjectToScene: addInteractiveObjectToScene,
    removeInteractiveObject: removeInteractiveObject,
    addRuleToScene: addRuleToScene,
    removeRuleFromScene: removeRuleFromScene,
    defineField: defineField,
}