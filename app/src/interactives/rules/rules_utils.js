import InteractiveObjectsTypes from "../InteractiveObjectsTypes";
import Rule from "./Rule";
import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes";
let uuid = require('uuid');

/**
 * Generates a default rule depending on the given object and assigns it to the given scene
 * @param scene
 * @param object
 */
function generateDefaultRule(scene, object){
    switch(object.type){
        case InteractiveObjectsTypes.TRANSITION:
            const r =  Rule({
                uuid : uuid.v4(),
                object_uuid : object.uuid,
                event : EventTypes.CLICK,
                actions : [{
                    type : RuleActionTypes.TRANSITION,
                    target : "",
                }],
            });

            // updating current scene
            let rules = scene.get('rules');
            rules.push(r);
            scene.setIn(['rules'], rules);
            break;
        default:
            return;
    }
}

export default {
    generateDefaultRule : generateDefaultRule,
};