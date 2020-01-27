import React, {Component} from 'react';
import RuleActionTypes from "../../rules/RuleActionTypes";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes"
import InteractiveObject from "../../interactives/InteractiveObject"
import Immutable from "immutable";
import Action from "../../rules/Action"
import ActionTypes from "../../actions/ActionTypes"
import Rule from "../../rules/Rule";
import rules_utils from "../../rules/rules_utils";
import {Operators, SuperOperators} from "../../rules/Operators";
import Values from "../../rules/Values";
import Condition from "../../rules/Condition";
import SuperCondition from "../../rules/SuperCondition";
import toString from "../../rules/toString";
import { RuleActionMap, ValuesMap, OperatorsMap } from "../../rules/maps";
import CentralSceneStore from "../../data/CentralSceneStore";
import scene_utils from "../../scene/scene_utils";
import interface_utils from "./interface_utils";
import eventBus from "../aframe/eventBus";


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
                        <React.Fragment key={'fragment-' + rule}>
                            <EudRule
                                VRScene={this.props.VRScene}
                                editor={this.props.editor}
                                interactiveObjects={this.props.interactiveObjects}
                                scenes={this.props.scenes}
                                assets={this.props.assets}
                                audios={this.props.audios}
                                currentScene={this.props.currentScene}
                                rules={this.props.rules}
                                rule={rule}
                                ruleEditorCallback={this.props.ruleEditorCallback}
                                removeRule={(rule) => {
                                    this.onRemoveRuleClick(rule)
                                }}
                                copyRule={(rule) => {
                                    this.props.copyRule(rule)
                                }}
                            />

                        </React.Fragment>
                    );
                });
            //in debug posso selezionare le regole quindi distinguo
            if (this.props.editor.mode === ActionTypes.DEBUG_MODE_ON) {
                return <div className={"rules"}>
                    <div className={"rule-container"}>
                        <div className={'eudBar'}>
                            <h2>Regole della scena</h2>
                        </div>
                        <div className={"rule-editor"}
                             onClick={() => {
                                 this.onOutsideClick();
                             }}>
                            {rulesRendering}
                        </div>
                    </div>
                </div>;
            } else {
                return <div className={"rules"}>
                    <div className={"rule-container"}>
                        <div className={"eudBar"}>
                            <figure className={'expand-btn'}
                                    onClick={() => {
                                        this.props.expandEditor(!this.props.editor.editorExpanded);
                                    }}>
                                <img className={"action-buttons dropdown-tags-btn-topbar btn-img"}
                                     src={this.props.editor.editorExpanded ? "icons/icons8-reduce-arrow-filled-50.png" :
                                         "icons/icons8-expand-arrow-filled-50.png"}
                                     alt={'Espandi'}
                                />
                            </figure>
                            <h2>Regole della scena</h2>
                            <div id={'rule-editor-btns'}>
                                <button
                                    disabled={this.props.editor.ruleCopy===null}
                                    onClick={() => {
                                        this.onCopyRuleClick(scene);
                                    }}
                                >
                                <img className={"action-buttons dropdown-tags-btn-topbar btn-img"} src={"icons/icons8-copia-50.png"}/>
                                Copia qui
                            </button>
                                <button className={"btn select-file-btn"}
                                        onClick={() => {
                                            this.onNewRuleClick();
                                        }}>
                                    <img className={"action-buttons dropdown-tags-btn-topbar btn-img"} src={"icons/icons8-plus-white-30.png"}/>
                                    Nuova Regola
                                </button>
                            </div>
                        </div>
                        <div className={"rule-editor"}
                             onClick={() => {
                                 this.onOutsideClick();
                             }}>
                            {rulesRendering}
                            <div className={'rules-footer'}></div>
                        </div>
                    </div>
                </div>;
            }
            //TODO END of [debug] add to origin master
        } else {
            return <p>Nessuna scena selezionata</p>
        }
    }

    onOutsideClick() {
        this.props.ruleEditorCallback.eudShowCompletions(null, null)
    }

    //[Vittoria] creazione nuova regola
    onNewRuleClick() {
        let scene = this.props.scenes.get(this.props.currentScene); //prendo la scena corrente
        let event = Action().set("uuid", uuid.v4());    //la popolo con un evento (nb azione)
        let acts = Immutable.List([Action({uuid: uuid.v4()})]);
        let rule = Rule().set("uuid", uuid.v4()).set("event", event).set("actions", acts).set("name",  scene.name + '_tx' + (scene.rules.length + 1));
        this.props.addNewRule(scene, rule); //aggiungo la regola alla scena
    }

    onRemoveRuleClick(ruleId) {
        let scene = this.props.scenes.get(this.props.currentScene);
        let rule = this.props.rules.get(ruleId);
        this.props.removeRule(scene, rule);
    }

    onCopyRuleClick(scene){
        let newId = uuid.v4();
        let copiedRule = this.props.editor.ruleCopy.set('uuid', newId);
        this.props.addNewRule(scene, copiedRule);
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

    mouseEnter() {
        this.setState({isMouseInside: true});
    }

    mouseLeave() {
        this.setState({isMouseInside: false});
    }

//Bottoni sotto le regole per cancellare/copiare/aggiungere condizioni
    actionBtn(rule, action) {
        let disabled = rule.actions.size <= 1;
        //TODO [debug] add to master
        if (this.props.editor.mode !== ActionTypes.DEBUG_MODE_ON)
            return (
                <button
                    title={"Cancella l'azione"}
                    className={"action-buttons-container eudDeleteAction "}
                    onClick={() => {
                        let newRule = rules_utils.deleteAction(rule, action);
                        this.props.ruleEditorCallback.eudUpdateRule(newRule);
                    }}
                    disabled={disabled}
                >
                    <img className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={'Cancella l\'azione'}/>
                </button>
            );
    }

    conditionBtn(rule, condition) {
        //TODO [debug] add to origin master
        if (this.props.editor.mode !== ActionTypes.DEBUG_MODE_ON)
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
                    <img className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={'Cancella la condizione'}/>
                </button>
            );
    }

    generateConditions(props, condition, rule) {
        if (condition instanceof Condition) { //passo base
            return (
                <React.Fragment key={'fragment-' + condition.uuid}>
                    <EudCondition
                        editor={this.props.editor}
                        condition={condition}
                        interactiveObjects={this.props.interactiveObjects}
                        assets={this.props.assets}
                        scenes={this.props.scenes}
                        audios={this.props.audios}
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

    //operatore affianco alla condizione per collegarla alla precedente condizione tramite "and" o "or"
    generateOperatorSelector(props, condition, rule) {
        return (
            <span className={"eudIf"}>
                <select defaultValue={condition.operator}
                        id={"selectOperator" + condition.uuid}
                        key={'select-operator-' + condition.uuid}
                        className={'eudOperator'}
                        onChange={() => {
                            let e = document.getElementById("selectOperator" + condition.uuid);
                            let value = e.options[e.selectedIndex].value;
                            this.editSuperConditionOperator(rule.condition, condition, value);
                            this.props.ruleEditorCallback.eudUpdateRule(rule);
                        }}
                >
                    <option value={SuperOperators.AND}>{toString.superOperatorsToString(SuperOperators.AND)}</option>
                    <option value={SuperOperators.OR}>{toString.superOperatorsToString(SuperOperators.OR)}</option>
                </select>
            </span>
        );
    }

    editSuperConditionOperator(condition, conditionToEdit, value) {
        if (condition === conditionToEdit) {
            condition.operator = value;
        } else {
            if (condition instanceof SuperCondition) {
                this.editSuperConditionOperator(condition.condition1, conditionToEdit, value);
                this.editSuperConditionOperator(condition.condition2, conditionToEdit, value);
            }
        }
    }




    render() {
        let rule = this.props.rules.get(this.props.rule);
        let buttonBar = this.state.isMouseInside ? "eudAction" : "eudAction eudHidden";
        let ruleCssClass = this.state.isMouseInside ? "eudRule eudHighlight" : "eudRule";
        let buttonBarRendering = null;
        let eudCondition = null;

        //TODO [debug] add to origin master
        if (this.props.editor.mode === ActionTypes.DEBUG_MODE_ON) {
            buttonBar = "eudAction eudHidden";
            ruleCssClass = "eudRule";
            buttonBarRendering =
                <React.Fragment>
                    <div className={"eudNext"}>
                        <button className={"select-file-btn btn btnNext"} id={"btnNext" + rule.uuid} title={"Avanti"}
                                onClick={() => {
                                    eventBus.emit('debug-step');
                                    //alert("Not yet implemented");

                                }}>
                            <img className={"action-buttons btn-img"} src={"icons/icons8-play-50.png"}
                                 alt={"Prossima regola"}/>
                            &nbsp;Avanti
                        </button>
                    </div>
                </React.Fragment>
        } else {
            buttonBarRendering =
                <React.Fragment>
                    <div className={buttonBar}>

                        <button title={"Aggiungi una condizione"}
                                key={'add-condition-' + rule.uuid}
                                onClick={() => {
                                    let newRule = rules_utils.addEmptyCondition(rule);
                                    this.props.ruleEditorCallback.eudUpdateRule(newRule);
                                }}
                                className={"eudDelete action-buttons-container"}>
                            <img className={"action-buttons"} src={"icons/icons8-condition-128.png"}
                                 alt={"Aggiungi una condizione"}/>
                            &nbsp;Aggiungi Condizione
                        </button>
                        <button title={"Aggiungi un'azione"}
                                key={'add-action-' + rule.uuid}
                                onClick={() => {
                                    let newRule = rules_utils.addEmptyAction(rule);
                                    this.props.ruleEditorCallback.eudUpdateRule(newRule);
                                }}
                                className={"eudDelete action-buttons-container"}>
                            <img className={"action-buttons"} src={"icons/icons8-action-128.png"}
                                 alt={"Aggiungi un'azione"}/>
                            &nbsp;Aggiungi Azione
                        </button>
                        <button title={"Copia la regola"}
                                key={'copy-rule-' + rule.uuid}
                                onClick={() => {
                                    this.props.copyRule(rule);
                                }}
                                className={"eudDelete action-buttons-container"}>
                            <img className={"action-buttons"} src={"icons/icons8-copia-50.png"}
                                 alt={"Copia la regola"}/>
                            &nbsp;Copia Regola
                        </button>
                        <button title={"Cancella la regola"}
                                key={'remove-rule-' + rule.uuid}
                                onClick={() => {
                                    this.props.removeRule(this.props.rule)
                                }}
                                className={"eudDelete action-buttons-container"}>
                            <img className={"action-buttons"} src={"icons/icons8-waste-50.png"}
                                 alt={"Elimina la regola"}/>
                            &nbsp;Elimina Regola
                        </button>
                    </div>
                </React.Fragment>
        }

        if (rule) {
            let actionRendering = rule.actions.map(
                action => {
                    return <React.Fragment key={'fragment-' + action.uuid}>
                        <EudAction
                            editor={this.props.editor}
                            interactiveObjects={this.props.interactiveObjects}
                            scenes={this.props.scenes}
                            assets={this.props.assets}
                            audios={this.props.audios}
                            rules={this.props.rules}
                            rule={rule}
                            rulePartType={'action'}
                            action={action}
                            ruleEditorCallback={this.props.ruleEditorCallback}
                        />
                        {this.actionBtn(rule, action)}


                    </React.Fragment>
                });
            // (Object.keys(this.props.rule.condition).length !== 0 || this.props.rule.condition.constructor !== Object)
            let conditions = null;
            if (rule.condition instanceof Condition || rule.condition instanceof SuperCondition) {
                conditions =
                    <React.Fragment>
                        <span className={"eudIf"}>se </span>
                        {this.generateConditions(this.props, rule.condition, rule)}
                    </React.Fragment>
            }

            return <div className={ruleCssClass}
                        id={'eudRule' + rule.uuid}
                        key={'eud-rule-' + rule.uuid}
                        onMouseEnter={() => {
                            this.mouseEnter()
                        }}
                        onMouseLeave={() => {
                            this.mouseLeave()
                        }}>
                <h6>{rule.name}</h6>
                <span className={"eudWhen"}>Quando </span>
                <EudAction
                    editor={this.props.editor}
                    interactiveObjects={this.props.interactiveObjects}
                    scenes={this.props.scenes}
                    assets={this.props.assets}
                    audios={this.props.audios}
                    rules={this.props.rules}
                    rule={rule}
                    rulePartType={'event'}
                    action={rule.event}
                    ruleEditorCallback={this.props.ruleEditorCallback}
                /><br/>
                {conditions}
                <span className={"eudThen"}>allora </span>
                {actionRendering}
                {buttonBarRendering}
                <br/>
            </div>
        } else {
            return <p key={'rule-not-found-' + rule.uuid}>Regola non trovata</p>
        }
    }
}

class EudCondition extends Component {
    /**
     *  @param props
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
                originalText={subject == null ? "" : toString.objectTypeToString(subject.type) + subject.name}
                inputText={this.props.editor.get('completionInput')}
                showCompletion={subjectCompletion}
                changeText={(text, role) => this.changeText(text, role)}
                updateRule={(rule, role) => this.updateRule(rule, role)}
                scenes={this.props.scenes}
                assets={this.props.assets}
                audios={this.props.audios}
                role={"subject"}
            />;


        let operatorCompletion = this.showCompletion(actionId, "operator");
        let operatorRendering =
            <EudRulePart
                VRScene={this.props.VRScene}
                interactiveObjects={this.props.interactiveObjects}
                rules={this.props.rules}
                rule={this.props.rule}
                rulePartType={'condition'}
                subject={subject}
                complement={this.props.rule.object_uuid}
                verb={this.props.condition}
                ruleEditorCallback={this.props.ruleEditorCallback}
                originalText={toString.operatorUuidToString(this.props.condition.operator)}
                inputText={this.props.editor.get('completionInput')}
                showCompletion={operatorCompletion}
                changeText={(text, role) => this.changeText(text, role)}
                updateRule={(rule, role) => this.updateRule(rule, role)}
                scenes={this.props.scenes}
                assets={this.props.assets}
                audios={this.props.audios}
                role={"operator"}

            />;

        let valueRendering = null;

        switch(this.props.condition.operator){
            case Operators.EQUAL_NUM:
            case Operators.NOT_EQUAL_NUM:
            case Operators.GREATER_THAN:
            case Operators.GREATER_EQUAL:
            case Operators.LESS_THAN:
            case Operators.LESS_EQUAL:
                valueRendering =
                    <EudRuleNumericPart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        rule={this.props.rule}
                        rulePartType={this.props.rulePartType}
                        subject={subject}
                        complement={this.props.condition.state}
                        verb={this.props.condition}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                        originalText={this.props.condition.state}
                        role={"object"}
                        updateNumericRule={(props, value) => this.updateNumericRule(props, value)}
                    />;
                break;
            default:
                let valueCompletion = this.showCompletion(actionId, "value");
                let value = this.getValuesReference(this.props.condition.state);
                valueRendering =
                    <EudRulePart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        rule={this.props.rule}
                        rulePartType={'condition'}
                        subject={subject}
                        complement={this.props.rule.object_uuid}
                        verb={this.props.condition}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                        originalText={value == null ? "" : toString.valueUuidToString(value.uuid)}
                        inputText={this.props.editor.get('completionInput')}
                        showCompletion={valueCompletion}
                        changeText={(text, role) => this.changeText(text, role)}
                        updateRule={(rule, role) => this.updateRule(rule, role)}
                        scenes={this.props.scenes}
                        assets={this.props.assets}
                        audios={this.props.audios}
                        role={"value"}
                    />;
        }

        return <span className={"eudAction"} key={this.props.condition.uuid}>
                {subjectRendering}
            {operatorRendering}
            {valueRendering}
                </span>;

    }

    changeText(text, role) {
        let actionId = this.props.condition.uuid;
        this.props.ruleEditorCallback.eudShowCompletions(
            actionId, role, text)
    }


    getInteractiveObjectReference(uuid) {
        if (uuid == InteractiveObjectsTypes.PLAYER) {
            return InteractiveObject({
                type: InteractiveObjectsTypes.PLAYER,
                uuid: InteractiveObjectsTypes.PLAYER,
                name: ""
            });
        }

        if (this.props.scenes.has(uuid)) {
            return this.props.scenes.get(uuid);
        }

        if (this.props.assets.has(uuid)) {
            return this.props.assets(uuid);
        }

        if (this.props.audios.has(uuid)){
            return this.props.audios.get(uuid);
        }


        return this.props.interactiveObjects.get(uuid);
    }

    getValuesReference(uuid) {
        return ValuesMap.get(uuid);
    }

    updateRule(ruleUpdate, role) {

        let rule = this.props.rule;
        let condition = this.props.condition;

        this.editSubCondition(rule.condition, condition.uuid, role, ruleUpdate);
        rule = rule.set('condition', rule.condition);
        this.props.ruleEditorCallback.eudUpdateRule(rule);
        this.props.ruleEditorCallback.eudShowCompletions(null, null);

    }

    editSubCondition(condition, subConditionId, role, ruleUpdate) {
        if (condition instanceof Condition && condition.uuid === subConditionId) {
            switch (role) {
                //se modifico il primo o il secondo valore di una regola gli altri andranno a null
                case 'subject':
                    condition['obj_uuid'] = ruleUpdate.item;
                    condition['operator'] = null;
                    condition['state'] = null;
                    break;
                case 'operator':
                    condition['operator'] = ruleUpdate.item;
                    condition['state'] = null;
                    break;
                case 'value':
                    condition['state'] = ruleUpdate.item;
                    break;
            }
            return;
        }
        if (condition instanceof SuperCondition) {
            this.editSubCondition(condition.condition1, subConditionId, role, ruleUpdate);
            this.editSubCondition(condition.condition2, subConditionId, role, ruleUpdate);
        }
    }

    updateNumericRule(props, value) {

        let rule = props.rule;
        let condition = props.verb;
        this.editNumericSubCondition(rule.condition, condition.uuid, value);

        rule = rule.set('condition', rule.condition);
        this.props.ruleEditorCallback.eudUpdateRule(rule);
        this.props.ruleEditorCallback.eudShowCompletions(null, null);
    }

    editNumericSubCondition(condition, subConditionId, value) {
        if (condition instanceof Condition && condition.uuid === subConditionId) {
            condition['state'] = value;
        }
        if (condition instanceof SuperCondition) {
            this.editNumericSubCondition(condition.condition1, subConditionId, value);
            this.editNumericSubCondition(condition.condition2, subConditionId, value);
        }
    }

    showCompletion(actionId, role) {
        return actionId != null &&
            role == this.props.editor.get('role') &&
            actionId == this.props.condition.uuid;
    }

}

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
                VRScene={this.props.VRScene}
                interactiveObjects={this.props.interactiveObjects}
                rules={this.props.rules}
                rule={this.props.rule}
                rulePartType={this.props.rulePartType}
                subject={subject}
                complement={this.props.rule.object_uuid}
                verb={this.props.action}
                ruleEditorCallback={this.props.ruleEditorCallback}
                originalText={subject == null ? "" : toString.objectTypeToString(subject.type) + subject.name}
                inputText={this.props.editor.get('completionInput')}
                showCompletion={subjectCompletion}
                changeText={(text, role) => this.changeText(text, role)}
                updateRule={(rule, role) => this.updateRule(rule, role, this.props.interactiveObjects)}
                scenes={this.props.scenes}
                assets={this.props.assets}
                audios={this.props.audios}
                role={"subject"}
            />;


        let operationCompletion = this.showCompletion(actionId, "operation");
        let operationRendering = <EudRulePart
            interactiveObjects={this.props.interactiveObjects}
            rules={this.props.rules}
            rule={this.props.rule}
            rulePartType={this.props.rulePartType}
            subject={subject}
            complement={this.props.rule.object_uuid}
            verb={this.props.action}
            ruleEditorCallback={this.props.ruleEditorCallback}
            originalText={toString.eventTypeToString(this.props.action.get('action'))}
            inputText={this.props.editor.get('completionInput')}
            showCompletion={operationCompletion}
            changeText={(text, role) => this.changeText(text, role)}
            updateRule={(rule, role) => this.updateRule(rule, role, this.props.interactiveObjects)}
            scenes={this.props.scenes}
            assets={this.props.assets}
            audios={this.props.audios}
            role={"operation"}
        />;

        let object = null;
        let objectRendering = null;

        switch(this.props.action.action){
            case RuleActionTypes.INCREASE_STEP:
            case RuleActionTypes.DECREASE_STEP:
                let subj = this.props.action.subj_uuid;
                let step = 1;
                if(subj && this.props.interactiveObjects.has(subj)){
                    step = this.props.interactiveObjects.get(subj).properties.step;
                }
                objectRendering =
                    <EudRuleStaticPart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        rule={this.props.rule}
                        rulePartType={this.props.rulePartType}
                        subject={subject}
                        complement={this.props.action.object_uuid}
                        verb={this.props.action}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                        originalText={step}
                        role={"object"}
                    />;
                break;
            case RuleActionTypes.INCREASE:
                objectRendering =
                    <EudRuleNumericPart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        rule={this.props.rule}
                        rulePartType={this.props.rulePartType}
                        subject={subject}
                        complement={this.props.action.obj_uuid}
                        verb={this.props.action}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                        originalText={this.props.action.obj_uuid}
                        role={"object"}
                        updateNumericRule={(props, value) => this.updateNumericRule(props, value)}
                    />;
                break;
            default:
                object = this.getInteractiveObjectReference(this.props.action.obj_uuid);
                let objectCompletion = this.showCompletion(actionId, "object");
                objectRendering =
                    <EudRulePart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        rule={this.props.rule}
                        rulePartType={this.props.rulePartType}
                        subject={subject}
                        complement={this.props.rule.object_uuid}
                        verb={this.props.action}
                        ruleEditorCallback={this.props.ruleEditorCallback}
                        originalText={object == null ? "" : toString.objectTypeToString(object.type) + object.name}
                        inputText={this.props.editor.get('completionInput')}
                        showCompletion={objectCompletion}
                        changeText={(text, role) => this.changeText(text, role)}
                        updateRule={(rule, role) => this.updateRule(rule, role, this.props.interactiveObjects)}
                        scenes={this.props.scenes}
                        assets={this.props.assets}
                        audios={this.props.audios}
                        role={"object"}
                    />;


        }

        return <span className={"eudAction"} key={this.props.action.uuid}>
                {actionRendering}
            {operationRendering}
            {objectRendering}
                </span>;

    }

    changeText(text, role) {
        let actionId = this.props.action.uuid;
        this.props.ruleEditorCallback.eudShowCompletions(
            actionId, role, text)
    }

    getInteractiveObjectReference(uuid) {

        if (uuid == InteractiveObjectsTypes.PLAYER) {
            return InteractiveObject({
                type: InteractiveObjectsTypes.PLAYER,
                uuid: InteractiveObjectsTypes.PLAYER,
                name: ""
            });
        }

        if (this.props.scenes.has(uuid)) {
            return this.props.scenes.get(uuid);
        }

        if (this.props.assets.has(uuid)) {
            return this.props.assets.get(uuid);
        }

        if (ValuesMap.has(uuid)) {
            return ValuesMap.get(uuid);
        }

        if (this.props.audios.has(uuid)){
            return this.props.audios.get(uuid);
        }

        return this.props.interactiveObjects.get(uuid);
    }

    updateRule(ruleUpdate, role, objects) {

        let rule = this.props.rule;
        let index = -1;
        let action;
        let event = false;
        for (var i = 0; i < rule.actions.size; i++) {
            if (rule.actions.get(i).uuid == ruleUpdate.action.uuid) {
                index = i;
                action = rule.actions.get(i);
            }
        }
        if (index == -1 && ruleUpdate.action.uuid == rule.event.uuid) {
            // TODO [davide] gestire la parte nell'evento
            action = rule.event;
            event = true;
        }

        let list = rule.get('actions');

        switch (role) {
            case "subject":
                if (event) {
                    rule = rule.set('event',
                        Action({
                            uuid: action.uuid,
                            action: null,
                            subj_uuid: ruleUpdate.item,
                            obj_uuid: null,
                            index: action.index,
                        }));
                } else {
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
                let a = Action({
                    uuid: action.uuid,
                    action: action.action,
                    subj_uuid: action.subj_uuid,
                    obj_uuid: ruleUpdate.item,
                    index: action.index,
                });
                if (event) {
                    rule = rule.set('event', a);
                } else {
                    list = list.set(index, a);
                }
                break;
            case "operation":
                if (event) {
                    rule = rule.set('event',
                        Action({
                            uuid: action.uuid,
                            action: ruleUpdate.item,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: null,
                            index: action.index,
                        }));
                } else {
                    switch (ruleUpdate.item) {
                        case RuleActionTypes.DECREASE_STEP:
                        case RuleActionTypes.INCREASE_STEP:
                            let val = null;
                            if(action.subj_uuid){
                                val = objects.get(action.subj_uuid).properties.step;
                            }
                            list = list.set(index,
                                Action({
                                    uuid: action.uuid,
                                    action: ruleUpdate.item,
                                    subj_uuid: action.subj_uuid,
                                    obj_uuid: val,
                                    index: action.index,
                                })
                            );
                            break;
                        default:
                            list = list.set(index,
                                Action({
                                    uuid: action.uuid,
                                    action: ruleUpdate.item,
                                    subj_uuid: action.subj_uuid,
                                    obj_uuid: null,
                                    index: action.index,
                                })
                            );
                    }
                }
        }
        rule = rule.set('actions', list);
        this.props.ruleEditorCallback.eudUpdateRule(rule);
        this.props.ruleEditorCallback.eudShowCompletions(null, null);

    }

    updateNumericRule(props, value){
        let rule = this.props.rule;
        let index = -1;
        let event = false;
        for (var i = 0; i < rule.actions.size; i++) {
            if (rule.actions.get(i).uuid == props.verb.uuid) {
                index = i;
            }
        }
        if (index == -1 && props.verb.uuid == rule.event.uuid) {
            event = true;
        }

        let list = rule.get('actions');
        let a = Action({
            uuid: props.verb.uuid,
            action: props.verb.action,
            subj_uuid: props.verb.subj_uuid,
            obj_uuid: value,
            index: props.verb.index,
        });
        if (event) {
            rule = rule.set('event', a);
        } else {
            list = list.set(index, a);
        }

        rule = rule.set('actions', list);
        this.props.ruleEditorCallback.eudUpdateRule(rule);
        this.props.ruleEditorCallback.eudShowCompletions(null, null);
    }

    showCompletion(actionId, role) {
        return actionId != null &&
            role == this.props.editor.get('role') &&
            actionId == this.props.action.uuid;
    }

}

class EudRuleStaticPart extends Component {
    /**
     *
     * @param props
     *
     *          interactiveObjects -> list of interactive objects in the game
     *          rules -> the list of rules in the game
     *          rule -> the current rule
     *          subject -> the subject part in the current rule
     *          actionType -> the action type in the current rule
     *          part -> the rule part that includes the object
     *          object -> the object part in the current rule
     *          ruleEditorCallback -> callback functions for the rules store
     *
     */
    constructor(props) {
        super(props);

    }


    render(){
        let text = this.props.originalText;
        let buttonVisible = "eudHide";
        let css = "eudRulePart eudCompletionRoot eud" + this.props.role;
        return <div className={css} key={this.props.rule.uuid + this.props.role}>
                <span className={"eudInputBox"}><span>
                <span className={"eudObjectString"}>
                <span>{text}</span>
                <input type={"text"}
                       className={"eudObjectString"} placeholder={this.getPlaceholder(this.props.role)}
                       value={text}
                       readOnly={true}
                />
                </span>
                <button className={buttonVisible}
                        onClick={(e) => {
                            e.stopPropagation();
                            this.onClear();
                        }}><img className={"action-buttons"} src={"icons/icons8-x-128.png"}
                                alt={"Cancella la regola"}/></button>
                </span>
                </span>
        </div>;
    };

    getPlaceholder() {
        return "[un valore]";
    }

    onChange(e) {
        this.props.changeText(e.target.value, this.props.role);
    }

    onClear() {
        this.props.changeText("", this.props.role);
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
        let buttonVisible = "eudHide";
        let text = this.props.originalText;
        let css = "eudRulePart eudCompletionRoot eud" + this.props.role;
        if (this.props.showCompletion) {
            autocomplete = <EudAutoComplete
                subject={this.props.subject}
                verb={this.props.verb}
                interactiveObjects={this.props.interactiveObjects}
                input={this.props.inputText}
                originalId={this.props.complement}
                changeText={(text, role) => this.changeText(text, role)}
                updateRule={(rule, role) => this.props.updateRule(rule, role)}
                role={this.props.role}
                rulePartType={this.props.rulePartType}
                scenes={this.props.scenes}
                assets={this.props.assets}
                audios={this.props.audios}
                rules={this.props.rules}
            />;
            buttonVisible = "eudObjectButton";
            text = this.props.inputText;
        }
        return <div className={css} key={this.props.rule.uuid + this.props.role}>
                <span className={"eudInputBox"}
                      onClick={
                          (e) => {
                              e.stopPropagation();
                              if (!this.props.showCompletion) {
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
                       value={text}
                       onChange={(e) => this.onChange(e)}

                />
                </span>
                <button className={buttonVisible}
                        onClick={(e) => {
                            e.stopPropagation();
                            this.onClear();
                        }}><img className={"action-buttons"} src={"icons/icons8-x-128.png"}
                                alt={"Cancella la regola"}/></button>
                </span>
                </span>
            {autocomplete}
        </div>;
    }

    getPlaceholder(partType) {
        switch (partType) {
            case "subject": {
                return "[un soggetto]";
            }
            case "operation": {
                return "[aziona]";
            }
            case "object": {
                return "[un oggetto]";
            }
            case "operator": {
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

    onClear() {
        this.props.changeText("", this.props.role);
    }
}

class EudRuleNumericPart extends Component {

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
        let buttonVisible = "eudHide";
        let text = this.props.originalText;
        let css = "eudRulePart eudCompletionRoot eud" + this.props.role;
        return <div className={css} key={'numeric-input' + this.props.rule.uuid + this.props.role}>
                <span>
                <span className={"eudObjectString"}>
                <span>{text == "" ? "[un valore]" : text}</span>
                <input type={"text"}
                       className={"eudObjectString"} placeholder={"[digita un numero]"}
                       onChange={(e) => {
                           this.onChange(e)
                       }}
                       value={text}
                />
                </span>
                <button className={buttonVisible}
                        onClick={(e) => {
                            e.stopPropagation();
                            this.onClear();
                        }}><img className={"action-buttons"} src={"icons/icons8-x-128.png"}
                                alt={"Cancella la regola"}/></button>
                </span>
        </div>;
    }

    onChange(e) {
        this.props.ruleEditorCallback.eudShowCompletions(e.target.value, this.props.role);
        this.props.updateNumericRule(this.props, e.target.value.replace(/\D+/g, ''));
    }

    onClear() {
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
            audios: this.props.audios,
            rules: this.props.rules,
        });
        let li = items.valueSeq()
            .filter(i => {
                let key = toString.objectTypeToString(i.type) + i.name;
                let n = (this.props.input ? this.props.input : "").split(" ");
                const word = n[n.length - 1];
                return key.includes(word);
            })
            .map(i => {
                return <EudAutoCompleteItem item={i}
                                            verb={this.props.verb}
                                            subject={this.props.subject}
                                            role={this.props.role}
                                            rules={this.props.rules}
                                            changeText={(text, role) => this.changeText(text, role)}
                                            updateRule={(rule, role) => this.props.updateRule(rule, role)}
                />
            });
        let h2 = "scene name";
        return <div className={"eudCompletionPopup"}>
            {h2}
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

        let text = toString.objectTypeToString(this.props.item.type) + this.props.item.name;

        return <li
            key={this.props.item.name}
            onClick={(e) => {
                e.stopPropagation();
                this.changeSelection(text);
            }}>
            {text}
        </li>;
    }

    changeSelection() {
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

    switch (props.role) {
        case "subject":
            if(props.rulePartType === 'event'){ // event subject: player, audios and videos
                //[Vittoria] ordino in modo tale che il player sia sempre in cima alla lista
                let subjects = props.assets.filter(x => x.type === 'video').merge(props.audios).merge(sceneObjectsOnly(props)).set(
                    InteractiveObjectsTypes.PLAYER,
                    InteractiveObject({
                        type: InteractiveObjectsTypes.PLAYER,
                        uuid: InteractiveObjectsTypes.PLAYER,
                        name: ""
                    })
                ).sort(function (a) {
                    if(a.type=== "PLAYER"){
                        return -1
                    }
                    else
                        return 1;
                });

                return subjects;
            }
            //soggetto nella seconda parte della frase
            let subjects = props.interactiveObjects.filter(x =>
                x.type !== InteractiveObjectsTypes.POINT_OF_INTEREST).set(
                InteractiveObjectsTypes.PLAYER,
                InteractiveObject({
                    type: InteractiveObjectsTypes.PLAYER,
                    uuid: InteractiveObjectsTypes.PLAYER,
                    name: ""
                })
            );
            let result = props.rulePartType === 'condition' ? subjects : subjects.merge(props.scenes);
            return result.sort(function (a) {
                //ordino il soggetto della seconda parte della frase in modo tale che mi mostri prima gli oggetti della scena
                // e il player
                if(sceneObjectsOnly(props).includes(a)|| a.type=== "PLAYER"){
                    return -1
                }
                else
                    return 1;
            });

        case "object":
            // the CLICK action is restricted to current scene objects only, might move to switch case later
            if(props.verb.action === RuleActionTypes.CLICK){
                console.log("Case object scene object only: ", sceneObjectsOnly(props));
                return sceneObjectsOnly(props);
            }

            //TODO forzalo a essere solo nella seconda riga
            //TODO aggiungi subject il "gioco"
            if(props.verb.action === RuleActionTypes.TRIGGERS){
                return sceneRulesOnly(props);
            }
            
            let allObjects = props.interactiveObjects.merge(props.scenes).merge(props.assets).merge(props.audios);
            allObjects = allObjects.merge(filterValues(props.subject, props.verb));

            if (props.verb.action) {
                let objType = RuleActionMap.get(props.verb.action).obj_type;
                allObjects = allObjects.filter(x => objType.includes(x.type));
            }
            //complemento oggetto, ordino sempre sulla base degli oggetti nella scena
            return allObjects.sort(function (a) {
                if(sceneObjectsOnly(props).includes(a)){
                    return -1
                }
                else
                    return 1;
            });

        case "operation":
            if(props.rulePartType === 'event'){
                if(props.subject){
                    return RuleActionMap
                        //.filter(x => x.uuid === RuleActionTypes.CLICK || x.uuid === RuleActionTypes.IS)
                        .filter(x => x.subj_type.includes(props.subject.type));
                }
                return RuleActionMap.filter(x => x.uuid === RuleActionTypes.CLICK || x.uuid === RuleActionTypes.IS);
            }
            return props.subject ? RuleActionMap.filter(x => x.subj_type.includes(props.subject.type)) : RuleActionMap;
        case "operator":
            return props.subject ? OperatorsMap.filter(x => x.subj_type.includes(props.subject.type)) : OperatorsMap;
        case 'value':
            return props.subject ? ValuesMap.filter(x => x.subj_type.includes(props.subject.type)) : ValuesMap;
    }

}


function filterValues(subject, verb) {
    let v = ValuesMap;
    if (subject) {
        v = v.filter(x => x.subj_type.includes(subject.type));
        if (verb) {
            v = v.filter(x => x.verb_type.includes(verb.action));
        }
    }
    return v;
}

/**
 * returns a map containing only the objects belonging to the current scene
 * @param props
 */
function sceneObjectsOnly(props){
    let sceneObjects = scene_utils.allObjects(props.scenes.get(CentralSceneStore.getState()));
    return props.interactiveObjects.filter(x => sceneObjects.includes(x.uuid));
}

//TODO escludere la regola in cui si sta scrivendo in modo da evitare bug
function sceneRulesOnly(props) {
    let current_scene = props.scenes.get(CentralSceneStore.getState());
    let rules = props.rules.filter(x => current_scene.get('rules').includes(x.uuid));
    /*
    let prova= rules._root.entries[0][1] //._map.flatMap(x=>x))
    console.log("prova", prova)
    console.log("prova rule: ", prova._map._root.entries[1][1])*/
    return rules;
}