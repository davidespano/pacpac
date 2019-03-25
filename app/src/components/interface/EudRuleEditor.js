import React, {Component} from 'react';
import RuleActionTypes from "../../interactives/rules/RuleActionTypes"
import InteractiveObjectTypes from "../../interactives/InteractiveObjectsTypes"
import InteractiveObject from "../../interactives/InteractiveObject"
import Immutable from "immutable";
import Action from "../../interactives/rules/Action"
import Rule from "../../interactives/rules/Rule";
let uuid = require('uuid');

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
                        editor={this.props.editor}
                        interactiveObjects={this.props.interactiveObjects}
                        scenes={this.props.scenes}
                        currentScene={this.props.currentScene}
                        rules={this.props.rules}
                        rule={rule}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                        removeRule = {(rule) => {this.onRemoveRuleClick(rule)}}
                    />
                });
            return <div className={"rules"}>
                <div className={"rule-container"}>
                    <div className={"rule-editor"}
                         onClick={() => {
                             this.onOutsideClick();
                         }}>
                        <h2>Regole della scena</h2>
                        {rulesRendering}
                    </div>
                    <div className={"eudFloating"}>
                        <button className={"propertyForm geometryBtn"}
                                onClick={() => {
                                    this.onNewRuleClick();
                                }}>
                            Nuova Regola
                        </button>
                    </div>
                </div>
            </div>;
        } else {
            return <p>Nessuna scena selezionata</p>
        }
    }

    onOutsideClick() {
        this.props.ruleEditorCallback.eudShowCompletions(null, null)
    }

    onNewRuleClick(){
        let scene = this.props.scenes.get(this.props.currentScene);
        let event = Action().set("uuid", uuid.v4());
        let acts = Immutable.List([Action({uuid: uuid.v4()})]);
        let rule = Rule().set("uuid", uuid.v4()).set("event", event).set("actions", acts);
        this.props.addNewRule(scene, rule);
    }

    onRemoveRuleClick(ruleId){
        let scene = this.props.scenes.get(this.props.currentScene);
        let rule = this.props.rules.get(ruleId);
        this.props.removeRule(scene, rule);
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
        this.state = {
            isMouseInside: false
        };
    }

    mouseEnter(){
        this.setState({isMouseInside: true});
    }

    mouseLeave(){
        this.setState({isMouseInside: false});
    }


    render() {
        let rule = this.props.rules.get(this.props.rule);
        let buttonBar = this.state.isMouseInside ? "eudAction" : "eudAction eudHidden";
        let ruleCssClass = this.state.isMouseInside ?  "eudRule eudHighlight" : "eudRule";
        if (rule) {
            let actionRendering = rule.actions.map(
                action => {
                    return <EudAction
                        editor={this.props.editor}
                        interactiveObjects={this.props.interactiveObjects}
                        scenes={this.props.scenes}
                        rules={this.props.rules}
                        rule={rule}
                        action={action}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                    />
                });
            return <div className={ruleCssClass}
                    onMouseEnter={() => {this.mouseEnter()}}
                      onMouseLeave={() => {this.mouseLeave()}}>
                <span className={"eudWhen"}>Quando </span>
                <EudAction
                    editor={this.props.editor}
                    interactiveObjects={this.props.interactiveObjects}
                    scenes={this.props.scenes}
                    rules={this.props.rules}
                    rule={rule}
                    action={rule.event}
                    ruleEditorCallback={this.props.ruleEditorCallback}
                /><br/>
                <EudCondition condition={rule.condition}/>
                <span className={"eudThen"}>allora </span>
                {actionRendering}
                <div className={buttonBar}>
                    <button title={"Cancella la regola"} onClick={()=>{}}
                            className={"eudDelete action-buttons-container"}>
                        <img className={"action-buttons"} src={"icons/icons8-condition-128.png"} alt={"Elimina la regola"}/>
                        &nbsp;Aggiungi Condizione
                    </button>
                    <button title={"Cancella la regola"} onClick={()=>{}}
                            className={"eudDelete action-buttons-container"}>
                        <img className={"action-buttons"} src={"icons/icons8-action-128.png"} alt={"Elimina la regola"}/>
                        &nbsp;Aggiungi Azione
                    </button>
                    <button title={"Cancella la regola"} onClick={()=>{this.props.removeRule(this.props.rule)}}
                            className={"eudDelete action-buttons-container"}>
                        <img className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={"Elimina la regola"}/>
                        &nbsp;Elimina Regola
                    </button>
                </div>
            </div>
        } else {
            return <p>Regola non trovata</p>
        }
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
        let actionId = this.props.editor.get('actionId');
        let subjectCompletion = this.showCompletion(actionId, "subject");
        let subject = this.getInteractiveObjectReference(this.props.action.subj_uuid);
        let actionRendering =
            <EudRulePart
            interactiveObjects={this.props.interactiveObjects}
            rules={this.props.rules}
            rule={this.props.rule}
            subject={subject}
            object={this.props.rule.object_uuid}
            action={this.props.action}
            ruleEditorCallback={this.props.ruleEditorCallback}
            originalText={subject == null? "" : objectTypeToString(subject.type) + " " + subject.name}
            inputText={this.props.editor.get('completionInput')}
            showCompletion={subjectCompletion}
            changeText = {(text, role) => this.changeText(text, role)}
            updateRule = {(rule, role) => this.updateRule(rule, role)}
            role={"subject"}
        />;


        let operationCompletion = this.showCompletion(actionId, "operation");
        let operationRendering = <EudRulePart
            interactiveObjects={this.props.interactiveObjects}
            rules={this.props.rules}
            rule={this.props.rule}
            subject={subject}
            object={this.props.rule.object_uuid}
            action={this.props.action}
            ruleEditorCallback={this.props.ruleEditorCallback}
            originalText={eventTypeToString(this.props.action.get('action'))}
            inputText={this.props.editor.get('completionInput')}
            showCompletion={operationCompletion}
            changeText = {(text, role) => this.changeText(text, role)}
            updateRule = {(rule, role) => this.updateRule(rule, role)}
            role={"operation"}
        /> ;

        let objectCompletion = this.showCompletion(actionId, "object");
        let object = this.getInteractiveObjectReference(this.props.action.obj_uuid);
        let objectRendering =
            <EudRulePart
            interactiveObjects={this.props.interactiveObjects}
            rules={this.props.rules}
            rule={this.props.rule}
            subject={subject}
            object={this.props.rule.object_uuid}
            action={this.props.action}
            ruleEditorCallback={this.props.ruleEditorCallback}
            originalText={object == null? "" : objectTypeToString(object.type) + " " + object.name}
            inputText={this.props.editor.get('completionInput')}
            showCompletion={objectCompletion}
            changeText = {(text, role) => this.changeText(text, role)}
            updateRule = {(rule, role) => this.updateRule(rule, role)}
            role={"object"}
        />;


        return <span className={"eudAction"}>
            {actionRendering}
            {operationRendering}
            {objectRendering}
        </span>;

    }

    changeText(text, role){
        let actionId = this.props.action.uuid;
        this.props.ruleEditorCallback.eudShowCompletions(
            actionId, role, text)
    }

    getInteractiveObjectReference(uuid){
        if(uuid == "player"){
            return InteractiveObject({
                type: InteractiveObjectTypes.PLAYER,
                uuid: "player",
                name:""});
        }

        return this.props.interactiveObjects.get(uuid);
    }

    updateRule(ruleUpdate, role){

        let rule = this.props.rule;
        // TODO [davide] inefficiente, utilizzare i metodi di immutable
        let index = -1;
        let action;
        let event = false;
        for(var i = 0; i < rule.actions.size; i++){
            if(rule.actions.get(i).uuid == ruleUpdate.action){
                index = i;
                action = rule.actions.get(i);
            }
        }
        if(index == -1 && ruleUpdate.action == rule.event.uuid){
            // TODO [davide] gestire la parte nell'evento
            action = rule.event;
            event = true;
        }


        switch(role){
            case "subject":
                if(event){
                    rule = rule.set('event',
                        Action({
                            uuid: action.uuid,
                            action: null,
                            subj_uuid: ruleUpdate.object,
                            obj_uuid: null,
                        }));
                }else {
                    // TODO [davide] set da fare nel caso di piu di un elemento
                    rule = rule.set('actions', [
                        Action({
                            uuid: action.uuid,
                            action: null,
                            subj_uuid: ruleUpdate.object,
                            obj_uuid: null,
                        })]);
                }

                break;
            case "object":
                if(event){
                    rule = rule.set('event',
                        Action({
                            uuid: action.uuid,
                            action: action.action,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: ruleUpdate.object,
                        }));
                }else{
                    // TODO [davide] set da fare nel caso di piu di un elemento
                    rule = rule.set('actions', Immutable.List([
                        Action({
                            uuid: action.uuid,
                            action: action.action,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: ruleUpdate.object,
                        })]));
                }

                break;
            case "operation":
                if(event){
                    rule = rule.set('event',
                        Action({
                            uuid: action.uuid,
                            action: ruleUpdate.object,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: null,
                        }));
                }else{
                    // TODO [davide] set da fare nel caso di piu di un elemento
                    rule = rule.set('actions', Immutable.List([
                        Action({
                            uuid: action.uuid,
                            action: ruleUpdate.object,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: null,
                        })]));
                }

        }
        this.props.ruleEditorCallback.eudUpdateRule(rule);
        this.props.ruleEditorCallback.eudShowCompletions(null, null);

    }

    showCompletion(actionId, role){
        return actionId != null &&
            role == this.props.editor.get('role') &&
            actionId == this.props.action.uuid;
    }

}


class EudRulePart extends Component {

    /**
     *
     * @param props
     *          interactiveObjects -> list of interactive objects in the game
     *          rules -> the list of rules in the game
     *          rule -> the current rule
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
        let buttonVisible="eudHide";
        let text = this.props.originalText;
        let css = "eudRulePart eudCompletionRoot eud" +  this.props.role;
        if(this.props.showCompletion){
            autocomplete = <EudAutoComplete
                subject={this.props.subject}
                action={this.props.action}
                interactiveObjects={this.props.interactiveObjects}
                input={this.props.inputText}
                originalId={this.props.object}
                changeText = {(text, role) => this.changeText(text, role)}
                updateRule = {(rule, role) => this.props.updateRule(rule, role)}
                role = {this.props.role}
            />;
            buttonVisible = "eudObjectButton";
            text = this.props.inputText;
        }
        return <div className={css}>
            <span className={"eudInputBox"}
               onClick = {
                   (e) => {
                       e.stopPropagation();
                       if(!this.props.showCompletion){
                           this.props.changeText(this.props.originalText, this.props.role);
                       }
                   }
               }
            >
                <span>
                    <span className={"eudObjectString"}>
                        <span>{text == "" ? this.getPlaceholder(this.props.role) : text}</span>
                        <input type={"text"}
                              className={"eudObjectString"} placeholder={this.getPlaceholder(this.props.role)}
                              onChange={(e) => this.onChange(e)}
                             value={text}
                             />
                    </span>
                    <button className={buttonVisible}
                            onClick={(e) => {
                                e.stopPropagation();
                                this.onClear();
                            }}><img className={"action-buttons"} src={"icons/icons8-x-128.png"} alt={"Cancella la regola"}/></button>
                </span>
            </span>
            {autocomplete}
        </div>;
    }

    getPlaceholder(partType){
        switch(partType){
            case "subject":{
                return "[un soggetto]";
            }
            case "operation":{
                return "[aziona]";
            }
            case "object":{
                return "[un oggetto]";
            }
        }
        return "[nessuno]"
    }

    onChange(e) {
        this.props.changeText(e.target.value, this.props.role);
    }

    onClear(){
        this.props.changeText("", this.props.role);
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
            actionType: this.props.action.action,
            role: this.props.role
        });
        let li = items.valueSeq()
            .filter(i => {
                let key = objectTypeToString(i.type) + " " + i.name;
                let n = (this.props.input ? this.props.input : "").split(" ");
                const word = n[n.length - 1];
                return key.includes(word);
            })
            .map(i => {
                return <EudAutoCompleteItem item={i}
                                            action={this.props.action}
                                            subject={this.props.subject}
                                            role={this.props.role}
                                            changeText = {(text, role) => this.changeText(text, role)}
                                            updateRule = {(rule, role) => this.props.updateRule(rule, role)}
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

        let text = objectTypeToString(this.props.item.type) + " " +  this.props.item.name;

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
        this.props.updateRule(ruleUpdate, this.props.role);
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
    switch(props.role){
        case "subject":
        case "object":
            return props.interactiveObjects.set("player",
                InteractiveObject({
                    type: InteractiveObjectTypes.PLAYER,
                    uuid: "player",
                    name:""}));
        case "operation":
            if(props.subject.uuid == "player"){
                return Immutable.Map([
                    [
                    RuleActionTypes.CLICK,
                        {
                            type: "operation",
                            name: eventTypeToString(RuleActionTypes.CLICK),
                            uuid: RuleActionTypes.CLICK
                        },
                ]]);
            }else{
                return Immutable.Map([
                    [
                        RuleActionTypes.COLLECT_KEY,
                        {
                            type: "operation",
                            name: eventTypeToString(RuleActionTypes.COLLECT_KEY),
                            uuid: RuleActionTypes.COLLECT_KEY
                        }
                    ],
                    [
                        RuleActionTypes.TRANSITION,
                        {
                            type: "operation",
                            name: eventTypeToString(RuleActionTypes.TRANSITION),
                            uuid: RuleActionTypes.TRANSITION
                        }
                    ],
                ]);
            }

    }

}


function eventTypeToString(eventType) {
    switch (eventType) {
        case  RuleActionTypes.CLICK:
            return "clicca";
        case RuleActionTypes.COLLECT_KEY:
            return "raccoglie";
        case RuleActionTypes.TRANSITION:
            return "si sposta verso";
        default:
            return "";
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
        case InteractiveObjectTypes.PLAYER:
            return "il giocatore";
        case "operation":
            return "";
        default:
            return "l'oggetto sconosciuto";
    }
}
