import React, {Component} from 'react';
import EventTypes from "../../interactives/rules/EventTypes"
import RuleActionTypes from "../../interactives/rules/RuleActionTypes"
import InteractiveObjectTypes from "../../interactives/InteractiveObjectsTypes"
import Action from "../../interactives/rules/Action"

export default class EudRuleEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let scene = this.props.scenes.get(this.props.currentScene);
        if (this.props.currentScene) {
            let rules = scene.get('rules');
            let rulesRendering = rules.map(
                rule => {
                    return <EudRule
                        interactiveObjects={this.props.interactiveObjects}
                        scenes={this.props.scenes}
                        rules={this.props.rules}
                        rule={rule}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                    />
                });
            return <div className={"rules"}>
                <div className={"rule-editor"}
                     onClick={() => {
                         this.onClick();
                     }}>
                    {rulesRendering}
                </div>
            </div>;
        } else {
            return <p>Nessuna scena selezionata</p>
        }
    }

    onClick() {
        //let originalObject = this.props.interactiveObjects.get(this.props.rules.get('objectId'));
        //let text = objectTypeToString(originalObject.type) + " " + originalObject.name;
        this.props.ruleEditorCallback.eudShowCompletions(null, null)
    }


}

class EudRule extends Component {
    /**
     *
     * @param props
     *          interactiveObjects -> list of interactive objects in the game
     *          scenes -> the list of scenes in the game
     *          rules -> the list of rules in the game
     *          rule -> the current rule
     *          ruleEditorCallback -> callback functions for the rules store
     */
    constructor(props) {
        super(props);
    }

    render() {
        let rule = this.props.rules.get(this.props.rule);
        if (rule) {
            let actionRendering = rule.actions.map(
                action => {
                    return <EudAction
                        interactiveObjects={this.props.interactiveObjects}
                        scenes={this.props.scenes}
                        rules={this.props.rules}
                        rule={rule}
                        action={action}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                    />
                });
            return <p id={"rule-" + rule.uuid}>
                <span className={"keyword when"}>Quando </span>
                <EudEvent
                    interactiveObjects={this.props.interactiveObjects}
                    rules={this.props.rules}
                    rule={rule}
                    ruleEditorCallback={this.props.ruleEditorCallback}
                /><br/>
                <EudCondition condition={rule.condition}/>
                <span className={"keyword if"}>allora </span>{actionRendering}
            </p>
        } else {
            return <p>Regola non trovata</p>
        }
    }

}

class EudEvent extends Component {
    /**
     *
     * @param props
     *          interactiveObjects -> list of interactive objects in the game
     *          rules -> the list of rules in the game
     *          rule -> the current rule
     *          ruleEditorCallback -> callback functions for the rules store
     *
     *
     */
    constructor(props) {
        super(props);
    }

    render() {
        /*
        <EudObject
                interactiveObjects={this.props.interactiveObjects}
                rules={this.props.rules}
                rule={this.props.rule}
                ruleId={this.props.rule.uuid}
                subject={"PLAYER"}
                object={this.props.rule.object_uuid}
                part={this.props.rule.event}
                action={this.props.rule.event}
                ruleEditorCallback={this.props.ruleEditorCallback}
            />
         */
        return <span className={"event"}>
        <span className={"subject"}>il giocatore </span>
        <span className={"operation"}>{eventTypeToString(this.props.rule.event)} </span>

    </span>
    }
}

class EudCondition extends Component {
    /**
     *
     * @param props
     *          condition -> the current condition to render
     *
     */
    constructor(props) {
        super(props);
    }

    render() {
        if (Object.keys(this.props.condition).length !== 0 || this.props.condition.constructor !== Object) {
            return [<span className={"keyword if"}>se </span>, "[Condizione]", <br/>]
        }
        return null;
    }
}

//TODO [davide] il riferimento alla rule deve sparire una volta modificate le regole
class EudAction extends Component {

    /**
     *
     * @param props
     *          interactiveObjects -> list of interactive objects in the game
     *          scenes -> list of scenes in the game
     *          rules -> the list of rules in the game
     *          rule -> the current rule
     *          action -> the action type in the current rule
     *          ruleEditorCallback -> callback functions for the rules store
     *
     *
     */
    constructor(props) {
        super(props);
    }


    render() {
        switch (this.props.action.action) {
            case RuleActionTypes.TRANSITION:
                let scene = this.props.scenes.get(this.props.action.target);
                return <span className={"action"}>
                <span className={"subject"}>il giocatore </span>
                <span className={"operation"}>si sposta verso </span>
                <a href="#" className={"object"}>la scena {scene.name}</a>
            </span>;
            case RuleActionTypes.COLLECT_KEY:
                let rulePartId = this.props.rules.get('rulePartId');
                let showCompletion =
                    rulePartId != null &&
                    rulePartId == this.props.action.uuid;
                    //rulePartId != null &&
                    //rulePartId.rule == this.props.rule.uuid &&
                    //rulePartId.partType == this.props.action &&
                    //rulePartId.partId == this.props.action.obj_uuid;
                let key = this.props.interactiveObjects.get(this.props.action.obj_uuid);
                return <span className={"action"}>
                                <span className={"subject"}>il giocatore </span>
                                <span className={"operation"}>inserisce nell'inventario </span>
                                    <EudObject
                                        interactiveObjects={this.props.interactiveObjects}
                                        rules={this.props.rules}
                                        rule={this.props.rule}
                                        object={this.props.rule.object_uuid}
                                        action={this.props.action}
                                        ruleEditorCallback={this.props.ruleEditorCallback}
                                        originalText={objectTypeToString(key.type) + " " + key.name}
                                        inputText={this.props.rules.get('completionInput')}
                                        showCompletion={showCompletion}
                                        changeText = {(text) => this.changeText(text)}
                                        updateRule = {(rule) => this.updateRule(rule)}
                                    />
                    </span>;



        }
        return <span className={"action"}>[Azione]</span>
    }

    changeText(text){
        let rulePartId = this.props.action.uuid;
        //createRulePartId(this.props.rule.uuid, this.props.action, this.props.rule.object_uuid);
        this.props.ruleEditorCallback.eudShowCompletions(
            rulePartId,
            text)
    }

    updateRule(ruleUpdate){
        let rule = this.props.rule;
        // TODO [davide] inefficiente, utilizzare i metodi di immutable
        let index = -1;
        let action;
        for(var i = 0; i < rule.actions.length; i++){
            if(rule.actions[i].uuid == ruleUpdate.action){
                index = i;
                action = rule.actions[i];
            }
        }
        // TODO [davide] set da fare nel caso di piu di un elemento
        rule = rule.set('actions', [
            Action({
                uuid: action.uuid,
                action: action.action,
                subj_uuid: action.subj_uuid,
                obj_uuid: ruleUpdate.object,
            })]);

        //rule = rule.set("actions",  actions);
        this.props.ruleEditorCallback.eudUpdateRule(rule);
        this.props.ruleEditorCallback.eudShowCompletions(null, null);
    }

}

class EudObject extends Component {

    /**
     *
     * @param props
     *          interactiveObjects -> list of interactive objects in the game
     *          rules -> the list of rules in the game
     *          rule -> the curren rule
     *          subject -> the subject part in the current rule
     *          actionType -> the action type in the current rule
     *          part -> the rule part that includes the object
     *          object -> the object part in the current rule
     *          ruleEditorCallback -> callback functions for the rules store
     *
     *
     */
    constructor(props) {
        super(props);

    }

    render() {
        let autocomplete = null;
        let buttonVisible="eudObjectButtonHide";
        let text = this.props.originalText;
        if(this.props.showCompletion){
            autocomplete = <EudAutoComplete
                subject={this.props.subject}
                action={this.props.action}
                interactiveObjects={this.props.interactiveObjects}
                input={this.props.inputText}
                originalId={this.props.object}
                changeText = {(text) => this.changeText(text)}
                updateRule = {(rule) => this.props.updateRule(rule)}
            />;
            buttonVisible = "eudObjectButton";
            text = this.props.inputText;
        }
        return <div className={"eudRulePart eudCompletionRoot"}>
            <a href="#" className={"object"}
               onClick = {
                   (e) => {
                       e.stopPropagation();
                       if(!this.props.showCompletion){
                           this.props.changeText(this.props.originalText);
                       }
                   }
               }
            >
                <span>
                    <span className={"eudObjectString"}>
                        <span>{text}</span>
                        <input type={"text"}
                              className={"eudObjectString"}
                              onChange={(e) => this.onChange(e)}
                             value={text}
                             />
                    </span>
                    <button className={buttonVisible}
                            onClick={(e) => {
                                e.stopPropagation();
                                this.onClear();
                            }}>x</button>
                </span>
            </a>
            {autocomplete}
        </div>;
    }

    onChange(e) {
        this.props.changeText(e.target.value);
    }

    onClear(){
        this.props.changeText("");
    }
}


class EudAutoComplete extends Component {
    /**
     *
     * @param props
     *          subject -> the subject that executes the action
     *          actionType -> the type of action the subject executes
     *          interactiveObjects -> the list of the objects in the game
     *          input -> the current user input for the autocompletion
     *          text -> the text field containing the object name
     *          originalId -> the uuid of the original object (before user editing)
     */
    constructor(props) {
        super(props);

    }

    render() {
        let items = getCompletions({
            interactiveObjects: this.props.interactiveObjects,
            subject: this.props.subject,
            actionType: this.props.action.action
        });
        let li = items.valueSeq()
            .filter(i => {
                let key = objectTypeToString(i.type) + " " + i.name;
                let n = (this.props.input ? this.props.input : "").split(" ");
                const word = n[n.length - 1];
                return key.includes(word);
            }).map(i => {
                return <EudAutoCompleteItem item={i}
                                            action={this.props.action}
                                            changeText = {(text) => this.changeText(text)}
                                            updateRule = {(rule) => this.props.updateRule(rule)}
                />
            });
        return <div className={"eudCompletionPopup"}>
            <ul>
                {li}
            </ul>
        </div>

    }
}


class EudAutoCompleteItem extends Component {

    /**
     *
     * @param props
     *          item: interactive object for the completion
     *
     *
     */
    constructor(props) {
        super(props);
    }

    render() {
        let text =  objectTypeToString(this.props.item.type) + " " +  this.props.item.name;
        return <li
            onClick={(e) =>{
                e.stopPropagation();
                this.changeSelection(text);
            }}>
            {text}
            </li>;
    }

    changeSelection(){
        const ruleUpdate = {
            action: this.props.action.uuid,
            object: this.props.item.uuid
        };
        this.props.updateRule(ruleUpdate);
    }
}

/**
 * Retrieves the set of the possible completions, given a subject and action type
 * @param props
 *          subject-> the subject that executes the action
 *          actionType -> the type of action the subject executes
 *          interactiveObjects -> the list of the objects in the game
 * @returns {the list of possible completions}
 */
function getCompletions(props) {
    // TODO [davide] stub implemenation
    return props.interactiveObjects;
}


function eventTypeToString(eventType) {
    switch (eventType) {
        case  EventTypes.CLICK:
            return "clicca";
        default:
            return "evento sconosciuto";
    }
}

function objectTypeToString(objectType) {
    switch (objectType) {
        case InteractiveObjectTypes.BUTTON:
            return "il pulsante";
        case InteractiveObjectTypes.COUNTER:
            return "il contatore";
        case InteractiveObjectTypes.CUMULABLE:
            return "l'oggetto";
        case InteractiveObjectTypes.LOCK:
            return "la serratura";
        case InteractiveObjectTypes.SELECTOR:
            return "il selettore";
        case InteractiveObjectTypes.SWITCH:
            return "l'interruttore";
        case InteractiveObjectTypes.TIMER:
            return "il timer";
        case InteractiveObjectTypes.KEY:
            return "la chiave";
        case InteractiveObjectTypes.TRANSITION:
            return "la transizione";
        default:
            return "l'oggetto sconosciuto";
    }
}

function createRulePartId(rule, rulePartType, rulePartId){
    return {
        rule: rule,
        partType: rulePartType,
        partId: rulePartId,
    }
}
