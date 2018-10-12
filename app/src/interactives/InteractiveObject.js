import Rule from "./rules/Rule";
let uuid = require('uuid');

class InteractiveObject {

    constructor(id = null, name = null, media = "", vertices = "", rules = []){

        if(id === null){
            this.uuid = uuid.v4();
        } else {
            this.uuid = uuid;
        }

        this.name = name;
        this.media = media;
        this.vertices = vertices;
        this.rules = rules;
    }

    addNewRule(event, condition, action){
        this.rules.push(new Rule({
            event: event,
            condition: condition,
            action: action
        }));
    }

    setUuid(uuid){
        this.uuid = uuid;
    }

    setName(name){
        this.name = name;
    }

    setMedia(media){
        this.media = media;
    }

    setVertices(vertices){
        this.vertices = vertices;
    }

    setRules(rules){
        this.rules = rules;
    }

}

export default InteractiveObject;