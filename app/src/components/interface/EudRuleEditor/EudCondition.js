import React, {Component} from "react";
import toString from "../../../rules/toString";
import InteractiveObjectsTypes from "../../../interactives/InteractiveObjectsTypes";
import {Operators} from "../../../rules/Operators";
import InteractiveObject from "../../../interactives/InteractiveObject";
import {ValuesMap} from "../../../rules/maps";
import Condition from "../../../rules/Condition";
import SuperCondition from "../../../rules/SuperCondition";
import EudRulePart from "./EudRulePart";
import EudRuleNumericPart from "./EudRuleNumericPart";


export default class EudCondition extends Component {
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
        let originalText = subject == null ? "" : toString.objectTypeToString(subject.type) + subject.name;
        if(subject){
            //se è un oggetto globale non voglio che si scriva "la vita Vita", questo non è necessario per gli oggetti flag e numero
            if(subject.type === InteractiveObjectsTypes.PLAYTIME || subject.type === InteractiveObjectsTypes.SCORE ||
                subject.type === InteractiveObjectsTypes.HEALTH){
                originalText = toString.objectTypeToString(subject.type);
            }
        }
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
                originalText={originalText}
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
            case Operators.IS_SELECTOR_STATE:
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
                //TODO Per il selettore sarebbe meglio mettere un controllo affinchè non inserisca uno stato che non esiste
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
        if (uuid == InteractiveObjectsTypes.COMBINATION) {
            return InteractiveObject({
                type: InteractiveObjectsTypes.COMBINATION,
                uuid: InteractiveObjectsTypes.COMBINATION,
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