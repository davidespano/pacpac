import React, {Component} from 'react';
import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes"
import InteractiveObject from "../../interactives/InteractiveObject"
import Immutable from "immutable";
import Action from "../../interactives/rules/Action"
import ActionTypes from "../../actions/ActionTypes"
import Rule from "../../interactives/rules/Rule";
import rules_utils from "../../interactives/rules/rules_utils";
import {Operators, SuperOperators} from "../../interactives/rules/Operators";
import Values from "../../interactives/rules/Values";
import Condition from "../../interactives/rules/Condition";
import SuperCondition from "../../interactives/rules/SuperCondition";
import toString from "../../interactives/rules/toString";
import { RuleActionMap, ValuesMap, OperatorsMap } from "../../interactives/rules/maps";

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
                            />
                        </React.Fragment>
                    );
                });
            //TODO [debug] add to origin master
            if (this.props.editor.mode === ActionTypes.DEBUG_MODE_ON) {
                return <div className={"rules"}>
                    <div className={"rule-container"}>
                        <div className={"rule-editor"}
                             onClick={() => {
                                 this.onOutsideClick();
                             }}>
                            <h2>Regole della scena</h2>
                            {rulesRendering}
                        </div>
                    </div>
                </div>;
            } else {
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
            }
            //TODO END of [debug] add to origin master
        } else {
            return <p>Nessuna scena selezionata</p>
        }
    }

    onOutsideClick() {
        this.props.ruleEditorCallback.eudShowCompletions(null, null)
    }

    onNewRuleClick() {
        let scene = this.props.scenes.get(this.props.currentScene);
        let event = Action().set("uuid", uuid.v4());
        let acts = Immutable.List([Action({uuid: uuid.v4()})]);
        let rule = Rule().set("uuid", uuid.v4()).set("event", event).set("actions", acts);
        this.props.addNewRule(scene, rule);
    }

    onRemoveRuleClick(ruleId) {
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

    mouseEnter() {
        this.setState({isMouseInside: true});
    }

    mouseLeave() {
        this.setState({isMouseInside: false});
    }


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
                                    alert("Not yet implemented");
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

            //TODO [debug] add to origin master (id rule)
            return <div className={ruleCssClass}
                        id={'eudRule' + rule.uuid}
                        key={'eud-rule-' + rule.uuid}
                        onMouseEnter={() => {
                            this.mouseEnter()
                        }}
                        onMouseLeave={() => {
                            this.mouseLeave()
                        }}>
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
            </div>
        } else {
            return <p key={'rule-not-found-' + rule.uuid}>Regola non trovata</p>
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
        if (condition instanceof SuperCondition) {
            this.editSubCondition(condition.condition1, subConditionId, role, ruleUpdate);
            this.editSubCondition(condition.condition2, subConditionId, role, ruleUpdate);
        }
    }


    showCompletion(actionId, role) {
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
                rulePartType={this.props.rulePartType}
                subject={subject}
                complement={this.props.rule.object_uuid}
                verb={this.props.action}
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
            updateRule={(rule, role) => this.updateRule(rule, role)}
            scenes={this.props.scenes}
            assets={this.props.assets}
            audios={this.props.audios}
            role={"operation"}
        />;

        let objectCompletion = this.showCompletion(actionId, "object");
        let object = this.getInteractiveObjectReference(this.props.action.obj_uuid);
        let objectRendering =
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
                updateRule={(rule, role) => this.updateRule(rule, role)}
                scenes={this.props.scenes}
                assets={this.props.assets}
                audios={this.props.audios}
                role={"object"}
            />;


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

    updateRule(ruleUpdate, role) {

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
                if (event) {
                    rule = rule.set('event',
                        Action({
                            uuid: action.uuid,
                            action: action.action,
                            subj_uuid: action.subj_uuid,
                            obj_uuid: ruleUpdate.item,
                            index: action.index,
                        }));
                } else {
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

    showCompletion(actionId, role) {
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
                       onChange={(e) => this.onChange(e)}
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
                                            changeText={(text, role) => this.changeText(text, role)}
                                            updateRule={(rule, role) => this.props.updateRule(rule, role)}
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
            if(props.rulePartType === 'event'){
                return Immutable.Map().set(
                    InteractiveObjectsTypes.PLAYER,
                    InteractiveObject({
                        type: InteractiveObjectsTypes.PLAYER,
                        uuid: InteractiveObjectsTypes.PLAYER,
                        name: ""
                    })
                );
            }
            let subjects = props.interactiveObjects.set(
                InteractiveObjectsTypes.PLAYER,
                InteractiveObject({
                    type: InteractiveObjectsTypes.PLAYER,
                    uuid: InteractiveObjectsTypes.PLAYER,
                    name: ""
                })
            );

            return props.rulePartType === 'condition' ? subjects : subjects.merge(props.scenes);
        case "object":
            let allObjects = props.interactiveObjects.merge(props.scenes).merge(props.assets).merge(props.audios);
            allObjects = allObjects.merge(filterValues(props.subject, props.verb));

            if (props.verb.action) {
                let objType = RuleActionMap.get(props.verb.action).obj_type;
                allObjects = allObjects.filter(x => objType.includes(x.type));
            }

            return allObjects;
        case "operation":
            console.log(props.rulePartType)
            if(props.rulePartType === 'event'){
                console.log('evento')
                return RuleActionMap.filter(x => x.uuid === RuleActionTypes.CLICK);
            }
            return props.subject ? RuleActionMap.filter(x => x.subj_type.includes(props.subject.type)) : RuleActionMap;
        case "operator":
            return OperatorsMap;
        case 'value':
            return props.subject ? ValuesMap.filter(x =>
                x.subj_type.includes(props.subject.type)) : ValuesMap;
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