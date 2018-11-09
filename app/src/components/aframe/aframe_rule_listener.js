import ConditionUtils from '../../interactives/rules/ConditionUtils'
let AFRAME = require('aframe');

AFRAME.registerComponent('rule_listener', {
    schema: {
        sceneList: {default: [], parse: JSON.parse, stringify: JSON.stringify}
    },
    init: function () {
        console.log(this.data.sceneList)
    },
    update: function () {
        console.log(this.data.sceneList);
        let elem = this.el;
        this.data.sceneList.forEach(rule => {
            elem.addEventListener('click-'+rule.object_uuid, function () {
                if(ConditionUtils.evalCondition(rule.condition)){
                    console.log('click in object!'+rule.object_uuid)
                    //rule.actions.forEach(action => executeAction(action))
                }
            })
        })
    }
});