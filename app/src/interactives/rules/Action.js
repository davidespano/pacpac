import Immutable from 'immutable';

/**
 * @param subj_uuid, default null
 * @param action, default null
 * @param obj_uuid, default null
 * @type {*|Immutable.Record.Class}
 */
const Action = Immutable.Record({

    uuid: null,
    subj_uuid: null, //subject
    action: null,    //action
    obj_uuid: null,  //object
    index: 0,        //creation order

});

export default Action;