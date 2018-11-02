import InteractiveObjectsTypes from "../InteractiveObjectsTypes";
import Rule from "./Rule";
import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
let uuid = require('uuid');

/**
 * Generates a default rule depending on the given object and assigns it to the given scene
 * @param scene
 * @param object
 */
function generateDefaultRule(scene, object){
    let r;
    switch(object.type){
        case InteractiveObjectsTypes.TRANSITION:
            r = Rule({
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
    InteractiveObjectAPI.saveRule(scene, r);
}

export default {
    generateDefaultRule : generateDefaultRule,
};