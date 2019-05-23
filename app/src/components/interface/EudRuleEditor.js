import React, {Component} from 'react';
import RuleActionTypes from "../../interactives/rules/RuleActionTypes"
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes"
import InteractiveObject from "../../interactives/InteractiveObject"
import Immutable from "immutable";
import Action from "../../interactives/rules/Action"
import Rule from "../../interactives/rules/Rule";
import rules_utils from "../../interactives/rules/rules_utils";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import {Operators, SuperOperators} from "../../interactives/rules/Operators";
import Values from "../../interactives/rules/Values";
import Condition from "../../interactives/rules/Condition";
import SuperCondition from "../../interactives/rules/SuperCondition";
import interface_utils from "./interface_utils";
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
                    return (
                        <React.Fragment key={'fragment-' + rule.uuid}>
                            <EudRule
                                editor={this.props.editor}
                                interactiveObjects={this.props.interactiveObjects}
                                scenes={this.props.scenes}
                                assets={this.props.assets}
                                currentScene={this.props.currentScene}
                                rules={this.props.rules}
                                rule={rule}
                                ruleEditorCallback={this.props.ruleEditorCallback}
                                removeRule = {(rule) => {this.onRemoveRuleClick(rule)}}
                            />
                        </React.Fragment>
                    );
                });
            return <div className={"rules"}>
                <div className={"rule-container"}>
                    <div className={"rule-editor"}
                         onClick={() => {
                             this.onOutsideClick();
                         }}>
                        <h2>Regole della scena</h2>
                        {rulesRendering}
                        <div className={'rules-footer'}></div>
                    </div>
                    <div className={"eudFloating"}>
                        <button className={"btn select-file-btn new-rule-btn"}
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
            isMouseInside: false,
        };
    }

    mouseEnter(){
        this.setState({isMouseInside: true});
    }

    mouseLeave(){
        this.setState({isMouseInside: false});
    }

    actionBtn(rule, action){
        let disabled = rule.actions.size <= 1;
        return (
            <button
                title={"Cancella l'azione"}
                className={"action-buttons-container eudDeleteAction "}
                key={'remove-btn-' + action.uuid}
                onClick={() => {
                    let newRule = rules_utils.deleteAction(rule, action);
                    this.props.ruleEditorCallback.eudUpdateRule(newRule);
                }}
                disabled={disabled}
            >
                <img  className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={'Cancella l\'azione'}/>
            </button>
        );
    }

    conditionBtn(rule, condition){
        return (
            <button
                title={"Cancella la condizione"}
                key={'remove-btn-' + condition.uuid}
                className={"action-buttons-container eudDeleteCondition "}
                onClick={() => {
                    let newRule = rules_utils.deleteCondition(rule, condition);
                    this.props.ruleEditorCallback.eudUpdateRule(newRule);
                }}
            >
                <img  className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={'Cancella la condizione'}/>
            </button>
        );
    }

    generateConditions(props, condition, rule){
        if(condition instanceof Condition){ //passo base
            return (
                <React.Fragment key={'fragment-' + condition.uuid}>
                    <EudCondition
                        editor={this.props.editor}
                        condition={condition}
                        interactiveObjects={this.props.interactiveObjects}
                        assets={this.props.assets}
                        scenes={this.props.scenes}
                        rule={rule}
                        rules={this.props.rules}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                    />
                    {this.conditionBtn(rule, condition)}
                    <br/>
                </React.Fragment>
            );

        } else {
            return (
                <React.Fragment key={'fragment-' + condition.uuid}>
                    {this.generateConditions(props, condition.condition1, rule)}
                    {this.generateOperatorSelector(props, condition, rule)}
                    {this.generateConditions(props, condition.condition2, rule)}
                </React.Fragment>
            );
        }
    }


    generateOperatorSelector(props, condition, rule){
        return(
            <span className={"eudIf"}>
                <select defaultValue={condition.operator}
                        id={"selectOperator" + condition.uuid}
                        key={'select-operator-'+ condition.uuid}
                        className={'eudOperator'}
                        onChange={() => {
                            let e = document.getElementById("selectOperator" + condition.uuid);
                            let value = e.options[e.selectedIndex].value;
                            this.editSuperConditionOperator(rule.condition, condition, value);
                            this.props.ruleEditorCallback.eudUpdateRule(rule);
                        }}
                >
                    <option value={SuperOperators.AND}>{superOperatorsToString(SuperOperators.AND)}</option>
                    <option value={SuperOperators.OR}>{superOperatorsToString(SuperOperators.OR)}</option>
                </select>
            </span>
        );
    }

    editSuperConditionOperator(condition, conditionToEdit, value){
        if(condition === conditionToEdit){
            condition.operator = value;
        } else {
            if(condition instanceof SuperCondition){
                this.editSuperConditionOperator(condition.condition1, conditionToEdit, value);
                this.editSuperConditionOperator(condition.condition2, conditionToEdit, value);
            }
        }
    }


    render() {
        let rule = this.props.rules.get(this.props.rule);
        let buttonBar = this.state.isMouseInside ? "eudAction" : "eudAction eudHidden";
        let ruleCssClass = this.state.isMouseInside ?  "eudRule eudHighlight" : "eudRule";
        let eudCondition = null;
        if (rule) {
            let actionRendering = rule.actions.map(
                action => {
                    return <React.Fragment key={'fragment-' + action.uuid} >
                        <EudAction
                        editor={this.props.editor}
                        interactiveObjects={this.props.interactiveObjects}
                        scenes={this.props.scenes}
                        assets={this.props.assets}
                        rules={this.props.rules}
                        rule={rule}
                        action={action}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                        />
                        {this.actionBtn(rule, action)}
                    </React.Fragment>
                });
            // (Object.keys(this.props.rule.condition).length !== 0 || this.props.rule.condition.constructor !== Object)
            let conditions = null;
            if (rule.condition instanceof Condition || rule.condition instanceof SuperCondition){
                conditions =
                    <React.Fragment>
                        <span className={"eudIf"}>se </span>
                        {this.generateConditions(this.props, rule.condition, rule)}
                    </React.Fragment>
            }

            return <div className={ruleCssClass}
                        key={'eud-rule-' + rule.uuid}
                        onMouseEnter={() => {this.mouseEnter()}}
                        onMouseLeave={() => {this.mouseLeave()}}>
                <span className={"eudWhen"}>Quando </span>
                <EudAction
                    editor={this.props.editor}
                    interactiveObjects={this.props.interactiveObjects}
                    scenes={this.props.scenes}
                    assets={this.props.assets}
                    rules={this.props.rules}
                    rule={rule}
                    action={rule.event}
                    ruleEditorCallback={this.props.ruleEditorCallback}
                /><br/>
                {conditions}
                <span className={"eudThen"}>allora </span>
                {actionRendering}
                <div className={buttonBar}>
                    <button title={"Aggiungi una condizione"}
                            key={'add-condition-' + rule.uuid}
                            onClick={()=>{
                        let newRule = rules_utils.addEmptyCondition(rule);
                        this.props.ruleEditorCallback.eudUpdateRule(newRule);
                    }}
                            className={"eudDelete action-buttons-container"}>
                        <img className={"action-buttons"} src={"icons/icons8-condition-128.png"} alt={"Aggiungi una condizione"}/>
                        &nbsp;Aggiungi Condizione
                    </button>
                    <button title={"Aggiungi un'azione"}
                            key={'add-action-' + rule.uuid}
                            onClick={()=>{
                        let newRule = rules_utils.addEmptyAction(rule);
                        this.props.ruleEditorCallback.eudUpdateRule(newRule);
                    }}
                            className={"eudDelete action-buttons-container"}>
                        <img className={"action-buttons"} src={"icons/icons8-action-128.png"} alt={"Aggiungi un'azione"}/>
                        &nbsp;Aggiungi Azione
                    </button>
                    <button title={"Cancella la regola"}
                            key={'remove-rule-' + rule.uuid}
                            onClick={()=>{this.props.removeRule(this.props.rule)}}
                            className={"eudDelete action-buttons-container"}>
                        <img className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={"Elimina la regola"}/>
                        &nbsp;Elimina Regola
                    </button>
                </div>
            </div>
        } else {
            return <p key={'rule-not-found-'+rule.uuid}>Regola non trovata</p>
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
    /**
     *
     * @param props
     *          interactiveObjects -> list of interactive objects in the game
     *          scenes -> list of scenes in the game
     *          rule -> the current rule
     *          rules -> list of rules in the game
     *          condition -> current rule condition
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
        let subject = this.getInteractiveObjectReference(this.props.condition.obj_uuid);
        let subjectRendering =
            <EudRulePart
                interactiveObjects={this.props.interactiveObjects}
                rules={this.props.rules}
                rule={this.props.rule}
                rulePartType={'condition'}
                subject={subject}
                complement={this.props.rule.object_uuid}
                verb={this.props.condition}
                ruleEditorCallback={this.props.ruleEditorCallback}
                originalText={subject == null? "" : objectTypeToString(subject.type) + subject.name}
                inputText={this.props.editor.get('completionInput')}
                showCompletion={subjectCompletion}
                changeText = {(text, role) => this.changeText(text, role)}
                updateRule = {(rule, role) => this.updateRule(rule, role)}
                scenes={this.props.scenes}
                assets={this.props.assets}
                role={"subject"}
            />;


        let operatorCompletion = this.showCompletion(actionId, "operator");
        let operatorRendering =
            <EudRulePart
                interactiveObjects={this.props.interactiveObjects}
                rules={this.props.rules}
                rule={this.props.rule}
                rulePartType={'condition'}
                subject={subject}
                complement={this.props.rule.object_uuid}
                verb={this.props.condition}
                ruleEditorCallback={this.props.ruleEditorCallback}
                originalText={operatorUuidToString(this.props.condition.operator)}
                inputText={this.props.editor.get('completionInput')}
                showCompletion={operatorCompletion}
                changeText = {(text, role) => this.changeText(text, role)}
                updateRule = {(rule, role) => this.updateRule(rule, role)}
                scenes={this.props.scenes}
                assets={this.props.assets}
                role={"operator"}

        /> ;

        let valueCompletion = this.showCompletion(actionId, "value");
        let value = this.getValuesReference(this.props.condition.state);
        let valueRendering =
            <EudRulePart
                interactiveObjects={this.props.interactiveObjects}
                rules={this.props.rules}
                rule={this.props.rule}
                rulePartType={'condition'}
                subject={subject}
                complement={this.props.rule.object_uuid}
                verb={this.props.condition}
                ruleEditorCallback={this.props.ruleEditorCallback}
                originalText={value == null? "" : interface_utils.valueUuidToString(value.uuid)}
                inputText={this.props.editor.get('completionInput')}
                showCompletion={valueCompletion}
                changeText = {(text, role) => this.changeText(text, role)}
                updateRule = {(rule, role) => this.updateRule(rule, role)}
                scenes={this.props.scenes}
                assets={this.props.assets}
                role={"value"}
            />;


        return <span className={"eudAction"} key={this.props.condition.uuid}>
            {subjectRendering}
            {operatorRendering}
            {valueRendering}
            </span>;

    }

    changeText(text, role){
        let actionId = this.props.condition.uuid;
        this.props.ruleEditorCallback.eudShowCompletions(
            actionId, role, text)
    }


    getInteractiveObjectReference(uuid){
        if(uuid == InteractiveObjectsTypes.PLAYER){
            return InteractiveObject({
                type: InteractiveObjectsTypes.PLAYER,
                uuid: InteractiveObjectsTypes.PLAYER,
                name:""});
        }

        if(this.props.scenes.has(uuid)){
            return this.props.scenes.get(uuid);
        }

        if(this.props.assets.has(uuid)){
            return this.props.assets(uuid);
        }

        return this.props.interactiveObjects.get(uuid);
    }

    getValuesReference(uuid){
        return ValuesMap.get(uuid);
    }

    updateRule(ruleUpdate, role){

        let rule = this.props.rule;
        let condition = this.props.condition;

        this.editSubCondition(rule.condition, condition.uuid, role, ruleUpdate);

        rule = rule.set('condition', rule.condition);

        this.props.ruleEditorCallback.eudUpdateRule(rule);
        this.props.ruleEditorCallback.eudShowCompletions(null, null);

    }

    editSubCondition(condition, subConditionId, role, ruleUpdate){
        if(condition instanceof Condition && condition.uuid === subConditionId) {
            switch(role){
                case 'subject':
                    condition['obj_uuid'] = ruleUpdate.item;
                    break;
                case 'operator':
                    condition['operator'] = ruleUpdate.item;
                    break;
                case 'value':
                    condition['state'] = ruleUpdate.item;
                    break;
            }
            return;
        }
        if(condition instanceof SuperCondition){
            this.editSubCondition(condition.condition1, subConditionId, role, ruleUpdate);
            this.editSubCondition(condition.condition2, subConditionId, role, ruleUpdate);
        }
    }


    showCompletion(actionId, role){
        return actionId != null &&
            role == this.props.editor.get('role') &&
            actionId == this.props.condition.uuid;
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
            rulePartType={'action'}
            subject={subject}
            complement={this.props.rule.object_uuid}
            verb={this.props.action}
            ruleEditorCallback={this.props.ruleEditorCallback}
            originalText={subject == null? "" : objectTypeToString(subject.type) + subject.name}
            inputText={this.props.editor.get('completionInput')}
            showCompletion={subjectCompletion}
            changeText = {(text, role) => this.changeText(text, role)}
            updateRule = {(rule, role) => this.updateRule(rule, role)}
            scenes={this.props.scenes}
            assets={this.props.assets}
            role={"subject"}
        />;


        let operationCompletion = this.showCompletion(actionId, "operation");
        let operationRendering = <EudRulePart
            interactiveObjects={this.props.interactiveObjects}
            rules={this.props.rules}
            rule={this.props.rule}
            rulePartType={'action'}
            subject={subject}
            complement={this.props.rule.object_uuid}
            verb={this.props.action}
            ruleEditorCallback={this.props.ruleEditorCallback}
            originalText={eventTypeToString(this.props.action.get('action'))}
            inputText={this.props.editor.get('completionInput')}
            showCompletion={operationCompletion}
            changeText = {(text, role) => this.changeText(text, role)}
            updateRule = {(rule, role) => this.updateRule(rule, role)}
            scenes={this.props.scenes}
            assets={this.props.assets}
            role={"operation"}
        /> ;

        let objectCompletion = this.showCompletion(actionId, "object");
        let object = this.getInteractiveObjectReference(this.props.action.obj_uuid);
        let objectRendering =
            <EudRulePart
            interactiveObjects={this.props.interactiveObjects}
            rules={this.props.rules}
            rule={this.props.rule}
            rulePartType={'action'}
            subject={subject}
            complement={this.props.rule.object_uuid}
            verb={this.props.action}
            ruleEditorCallback={this.props.ruleEditorCallback}
            originalText={object == null? "" : objectTypeToString(object.type) + object.name}
            inputText={this.props.editor.get('completionInput')}
            showCompletion={objectCompletion}
            changeText = {(text, role) => this.changeText(text, role)}
            updateRule = {(rule, role) => this.updateRule(rule, role)}
            scenes={this.props.scenes}
            assets={this.props.assets}
            role={"object"}
        />;


        return <span className={"eudAction"} key={this.props.action.uuid}>
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

        if(uuid == InteractiveObjectsTypes.PLAYER){
            return InteractiveObject({
                type: InteractiveObjectsTypes.PLAYER,
                uuid: InteractiveObjectsTypes.PLAYER,
                name:""});
        }

        if(this.props.scenes.has(uuid)){
            return this.props.scenes.get(uuid);
        }

        if(this.props.assets.has(uuid)){
            return this.props.assets.get(uuid);
        }

        if(ValuesMap.has(uuid)){
            return ValuesMap.get(uuid);
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
            if(rule.actions.get(i).uuid == ruleUpdate.action.uuid){
                index = i;
                action = rule.actions.get(i);
            }
        }
        if(index == -1 && ruleUpdate.action.uuid == rule.event.uuid){
            // TODO [davide] gestire la parte nell'evento
            action = rule.event;
            event = true;
        }

        let list = rule.get('actions');

        switch(role){
            case "subject":
                if(event){
                    rule = rule.set('event',
                        Action({
                            uuid: action.uuid,
                            action: null,
                            subj_uuid: ruleUpdate.item,
                            obj_uuid: null,
                            index: action.index,
                        }));
                }else {
                    list = list.set(index,
                        Action({
                            uuid: action.uuid,
                            action: null,
                            subj_uuid: ruleUpdate.item,
                            obj_uuid: null,
                            index: action.index,
                        }));
                }
                break;
            case "object":
                if(event){
                    rule = rule.set('event',
                        Action({
                            uuid: action.uuid,
                            action: action.action,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: ruleUpdate.item,
                            index: action.index,
                        }));
                }else{
                    list = list.set(index,
                        Action({
                            uuid: action.uuid,
                            action: action.action,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: ruleUpdate.item,
                            index: action.index,
                        }));
                }

                break;
            case "operation":
                if(event){
                    rule = rule.set('event',
                        Action({
                            uuid: action.uuid,
                            action: ruleUpdate.item,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: null,
                            index: action.index,
                        }));
                }else{
                    list = list.set(index,
                        Action({
                            uuid: action.uuid,
                            action: ruleUpdate.item,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: null,
                            index: action.index,
                        }));
                }

        }
        rule = rule.set('actions', list);
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
                verb={this.props.verb}
                interactiveObjects={this.props.interactiveObjects}
                input={this.props.inputText}
                originalId={this.props.complement}
                changeText = {(text, role) => this.changeText(text, role)}
                updateRule = {(rule, role) => this.props.updateRule(rule, role)}
                role = {this.props.role}
                rulePartType={this.props.rulePartType}
                scenes = {this.props.scenes}
                assets={this.props.assets}
            />;
            buttonVisible = "eudObjectButton";
            text = this.props.inputText;
        }
        return <div className={css} key={this.props.rule.uuid + this.props.role}>
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
            case "operator":{
                return "[è nello stato]";
            }
            case "value": {
                return "[valore]";
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
            verb: this.props.verb,
            role: this.props.role,
            scenes: this.props.scenes,
            rulePartType: this.props.rulePartType,
            assets: this.props.assets,
        });
        let li = items.valueSeq()
            .filter(i => {
                let key = objectTypeToString(i.type) + i.name;
                let n = (this.props.input ? this.props.input : "").split(" ");
                const word = n[n.length - 1];
                return key.includes(word);
            })
            .map(i => {
                return <EudAutoCompleteItem item={i}
                                            verb={this.props.verb}
                                            subject={this.props.subject}
                                            role={this.props.role}
                                            changeText = {(text, role) => this.changeText(text, role)}
                                            updateRule = {(rule, role) => this.props.updateRule(rule, role)}
                />
            });
        return <div className={"eudCompletionPopup"} >
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

        let text = objectTypeToString(this.props.item.type) +  this.props.item.name;

        return <li
            key={this.props.item.name}
            onClick={(e) =>{
                e.stopPropagation();
                this.changeSelection(text);
            }}>
            {text}
            </li>;
    }

    changeSelection(){
        const ruleUpdate = {
            action: this.props.verb,
            item: this.props.item.uuid
        };

        this.props.updateRule(ruleUpdate, this.props.role);
    }
}

/**
 * Retrieves the set of the possible completions, given a subject and action type
 * @param props
 *          subject-> the subject that executes the action
 *          verb -> the type of action the subject executes
 *          interactiveObjects -> the list of the objects in the game
 *          rulePartType -> type of rule portion we are returning the completions for
 * @returns {the list of possible completions}
 */
function getCompletions(props) {
    // TODO [davide] stub implemenation
    
    switch(props.role){
        case "subject":
            let subjects = props.interactiveObjects.filter(x => x.type !== InteractiveObjectsTypes.TRANSITION).set(
                InteractiveObjectsTypes.PLAYER,
                InteractiveObject({
                    type: InteractiveObjectsTypes.PLAYER,
                    uuid: InteractiveObjectsTypes.PLAYER,
                    name:""
                })
            );

            return props.rulePartType === 'condition' ? subjects : subjects.merge(props.scenes);
        case "object":
            let allObjects = props.interactiveObjects.merge(props.scenes).merge(props.assets);
            allObjects = allObjects.merge(filterValues(props.subject, props.verb));

            if(props.verb.action){
                let objType = RulesActionMap.get(props.verb.action).obj_type;
                allObjects = allObjects.filter(x => objType.includes(x.type));
            }
            return allObjects;
        case "operation":
            return props.subject ? RulesActionMap.filter(x => x.subj_type.includes(props.subject.type)) : RulesActionMap;
        case "operator":
            return OperatorsMap;
        case 'value':
            return props.subject ? ValuesMap.filter(x =>
                x.subj_type.includes(props.subject.type)) : ValuesMap;

    }

}

function filterValues(subject, verb){
    let v = ValuesMap;
    if(subject){
        v = v.filter(x => x.subj_type.includes(subject.type));
        if(verb){
            v = v.filter(x => x.verb_type.includes(verb.action));
        }
    }
    return v;
}


function eventTypeToString(eventType) {
    switch (eventType) {
        case  RuleActionTypes.CLICK:
            return "clicca";
        case RuleActionTypes.COLLECT_KEY:
            return "raccoglie";
        case RuleActionTypes.UNLOCK_LOCK:
            return "sblocca";
        case RuleActionTypes.TRANSITION:
            return "si sposta verso";
        case RuleActionTypes.CHANGE_BACKGROUND:
            return 'cambia sfondo con';
        case RuleActionTypes.ON:
            return 'accende';
        case RuleActionTypes.OFF:
            return 'spegne';
        case RuleActionTypes.FLIP_SWITCH:
            return 'preme';
        case RuleActionTypes.CHANGE_STATE:
            return 'cambia stato a';
        case RuleActionTypes.CHANGE_VISIBILITY:
            return 'diventa';
        default:
            return "";
    }
}

function operatorUuidToString(operatorUuid) {
    switch (operatorUuid) {
        case Operators.EQUAL:
            return "è";
        case Operators.NOT_EQUAL:
            return "non è";
        case Operators.LESS_THAN:
            return "è minore di";
        case Operators.LESS_EQUAL:
            return "è minore o uguale di";
        case Operators.GREATER_THAN:
            return "è maggiore di";
        case Operators.GREATER_EQUAL:
            return "è maggiore o uguale di";
        default:
            return "operatore sconosciuto";
    }
}


function superOperatorsToString(superoperatorUuid){
    switch(superoperatorUuid){
        case SuperOperators.AND:
            return 'e';
        case SuperOperators.OR:
            return 'o';
        default:
            return '?';
    }
}

function objectTypeToString(objectType) {
    let type = "";
    switch (objectType) {
        case InteractiveObjectsTypes.BUTTON:
            type = "il pulsante"; break;
        case InteractiveObjectsTypes.COUNTER:
            type = "il contatore"; break;
        case InteractiveObjectsTypes.CUMULABLE:
            type = "l'oggetto"; break;
        case InteractiveObjectsTypes.LOCK:
            type =  "la serratura"; break;
        case InteractiveObjectsTypes.SELECTOR:
            type =  "il selettore"; break;
        case InteractiveObjectsTypes.SWITCH:
            type =  "l'interruttore"; break;
        case InteractiveObjectsTypes.TIMER:
            type =  "il timer"; break;
        case InteractiveObjectsTypes.KEY:
            type =  "la chiave"; break;
        case InteractiveObjectsTypes.TRANSITION:
            type =  "la transizione"; break;
        case InteractiveObjectsTypes.PLAYER:
            type =  "il giocatore"; break;
        case Values.THREE_DIM:
        case Values.TWO_DIM:
            type =  "la scena"; break;
        case "operation":
        case "operator":
        case "value":
            return type;
        case 'video':
            type =  'il video'; break;
        case 'img':
            type =  "l'immagine"; break;
        case 'file':
            type =  'il file'; break;
        default:
            type =  "l'oggetto sconosciuto"; break;
    }
    return type + " ";
}


const ValuesMap = Immutable.Map([
    [
        Values.VISIBLE,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.KEY
            ],
            verb_type: [RuleActionTypes.CHANGE_VISIBILITY],
            name: interface_utils.valueUuidToString(Values.VISIBLE),
            uuid: Values.VISIBLE,
        },

    ],
    [
        Values.INVISIBLE,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.KEY],
            verb_type: [RuleActionTypes.CHANGE_VISIBILITY],
            name: interface_utils.valueUuidToString(Values.INVISIBLE),
            uuid: Values.INVISIBLE,
        },

    ],
    [
        Values.ON,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.SWITCH],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: interface_utils.valueUuidToString(Values.ON),
            uuid: Values.ON,
        },

    ],
    [
        Values.OFF,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.SWITCH],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: interface_utils.valueUuidToString(Values.OFF),
            uuid: Values.OFF,
        },

    ],
    [
        Values.LOCKED,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.LOCK],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: interface_utils.valueUuidToString(Values.LOCKED),
            uuid: Values.LOCKED,
        },

    ],
    [
        Values.UNLOCKED,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.LOCK],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: interface_utils.valueUuidToString(Values.UNLOCKED),
            uuid: Values.UNLOCKED,
        },

    ],
    [
        Values.COLLECTED,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.KEY],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: interface_utils.valueUuidToString(Values.COLLECTED),
            uuid: Values.COLLECTED,
        },

    ],
    [
        Values.NOT_COLLECTED,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.KEY],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: interface_utils.valueUuidToString(Values.NOT_COLLECTED),
            uuid: Values.NOT_COLLECTED,
        },

    ],
]);

const OperatorsMap = Immutable.Map([
    [
        Operators.EQUAL,
        {
            type: "operator",
            name: operatorUuidToString(Operators.EQUAL),
            uuid: Operators.EQUAL,
        },
    ],
    [
        Operators.NOT_EQUAL,
        {
            type: "operator",
            name: operatorUuidToString(Operators.NOT_EQUAL),
            uuid: Operators.NOT_EQUAL,
        },
    ],
    /*
    [
        Operators.LESS_EQUAL,
        {
            type: "operator",
            name: operatorUuidToString(Operators.LESS_EQUAL),
            uuid: Operators.LESS_EQUAL,
        },
    ],
    [
        Operators.LESS_THAN,
        {
            type: "operator",
            name: operatorUuidToString(Operators.LESS_THAN),
            uuid: Operators.LESS_THAN,
        },
    ],
    [
        Operators.GREATER_EQUAL,
        {
            type: "operator",
            name: operatorUuidToString(Operators.GREATER_EQUAL),
            uuid: Operators.GREATER_EQUAL,
        },
    ],
    [
        Operators.GREATER_THAN,
        {
            type: "operator",
            name: operatorUuidToString(Operators.GREATER_THAN),
            uuid: Operators.GREATER_THAN,
        },
    ],
    */

]);

const RulesActionMap = Immutable.Map([
    [
        RuleActionTypes.CLICK,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.TRANSITION,
            ],
            name: eventTypeToString(RuleActionTypes.CLICK),
            uuid: RuleActionTypes.CLICK
        },
    ],
    [
        RuleActionTypes.COLLECT_KEY,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.KEY],
            name: eventTypeToString(RuleActionTypes.COLLECT_KEY),
            uuid: RuleActionTypes.COLLECT_KEY
        }
    ],
    [
        RuleActionTypes.UNLOCK_LOCK,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.LOCK],
            name: eventTypeToString(RuleActionTypes.UNLOCK_LOCK),
            uuid: RuleActionTypes.UNLOCK_LOCK
        }
    ],
    [
        RuleActionTypes.TRANSITION,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [Values.THREE_DIM, Values.TWO_DIM],
            name: eventTypeToString(RuleActionTypes.TRANSITION),
            uuid: RuleActionTypes.TRANSITION
        }
    ],
    [
        RuleActionTypes.ON,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.SWITCH],
            name: eventTypeToString(RuleActionTypes.ON),
            uuid: RuleActionTypes.ON
        }
    ],
    [
        RuleActionTypes.OFF,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.SWITCH],
            name: eventTypeToString(RuleActionTypes.OFF),
            uuid: RuleActionTypes.OFF
        }
    ],
    [
        RuleActionTypes.FLIP_SWITCH,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.SWITCH],
            name: eventTypeToString(RuleActionTypes.FLIP_SWITCH),
            uuid: RuleActionTypes.FLIP_SWITCH
        }
    ],
    [
        RuleActionTypes.CHANGE_BACKGROUND,
        {
            type: "operation",
            subj_type: [Values.THREE_DIM, Values.TWO_DIM],
            obj_type: ['video'],
            name: eventTypeToString(RuleActionTypes.CHANGE_BACKGROUND),
            uuid: RuleActionTypes.CHANGE_BACKGROUND
        },
    ],
    [
        RuleActionTypes.CHANGE_STATE,
        {
            type: "operation",
            subj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.LOCK,
            ],
            obj_type: ['value'],
            name: eventTypeToString(RuleActionTypes.CHANGE_STATE),
            uuid: RuleActionTypes.CHANGE_STATE,
        },
    ],
    [
        RuleActionTypes.CHANGE_VISIBILITY,
        {
            type: "operation",
            subj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.TRANSITION,
            ],
            obj_type: ['value'],
            name: eventTypeToString(RuleActionTypes.CHANGE_VISIBILITY),
            uuid: RuleActionTypes.CHANGE_VISIBILITY,
        },
    ],
]);