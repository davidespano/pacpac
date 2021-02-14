import React, {Component} from "react";
import toString from "../../../rules/toString";
import InteractiveObjectsTypes from "../../../interactives/InteractiveObjectsTypes";
import RuleActionTypes from "../../../rules/RuleActionTypes";
import InteractiveObject from "../../../interactives/InteractiveObject";
import {ValuesMap} from "../../../rules/maps";
import Action from "../../../rules/Action";
import EudRulePart from "./EudRulePart";
import EudRuleStaticPart from "./EudRuleStaticPart";
import EudRuleNumericPart from "./EudRuleNumericPart";
import CentralSceneStore from "../../../data/CentralSceneStore";

export default class EudAction extends Component {

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
        let originalText = subject == null ? "" : toString.objectTypeToString(subject.type) + subject.name;

        if(subject){
            //se è un oggetto globale non voglio che si scriva "la vita Vita", questo non è necessario per gli oggetti flag e numero
            if(subject.type === InteractiveObjectsTypes.PLAYTIME || subject.type === InteractiveObjectsTypes.SCORE ||
                subject.type === InteractiveObjectsTypes.HEALTH){
                originalText = toString.objectTypeToString(subject.type);
            }
        }

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
                originalText={originalText}
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
        let operationRendering =
            <EudRulePart
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
            case RuleActionTypes.REACH_TIMER:
                objectRendering =
                    <EudRuleNumericPart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        rule={this.props.rule}
                        placeholder={"seconds"}
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
            case RuleActionTypes.DECREASE_NUMBER:
            case RuleActionTypes.INCREASE_NUMBER:
            case RuleActionTypes.INCREASE:
                //i secondi li metto solo se si tratta del tempo di gioco
                let placeholder ="";
                if(subject)
                    placeholder = subject.type===InteractiveObjectsTypes.PLAYTIME ?"minutes" : "";
                objectRendering =
                    <EudRuleNumericPart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        placeholder = {placeholder}
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
            case RuleActionTypes.TRIGGERS:
                //è possibile avviare una regola o un timer
                let object_t = this.getInteractiveObjectReference(this.props.action.obj_uuid); //è un oggetto
                let rule=false; //se è una regola e non un timer
                if(object_t===undefined){ //è una regola
                    rule=true;
                    object_t = sceneRulesOnly(this.props).get(this.props.action.obj_uuid); //riferimento alla regola
                }
                let originalText = rule? (object_t == null ? "" : toString.objectTypeToString(object_t.type) + object_t.name) : (
                    object_t == null ? "" : "il timer "+ object_t.name);


                let objectCompletionRule = this.showCompletion(actionId, "object"); //prendi completion della regola
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
                        originalText={ originalText }
                        inputText={this.props.editor.get('completionInput')}
                        showCompletion={objectCompletionRule}
                        changeText={(text, role) => this.changeText(text, role)}
                        updateRule={(rule, role) => this.updateRule(rule, role, this.props.interactiveObjects)}
                        scenes={this.props.scenes}
                        assets={this.props.assets}
                        audios={this.props.audios}
                        role={"object"}
                    />;
                break;
            case RuleActionTypes.INSERT:
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
            case RuleActionTypes.REACH_KEYPAD:
                //se il soggetto è il keypad allora arriverà a n cifre, non semplicemente numerico
                let cifre ="";
                if(subject)
                    cifre = subject.type===InteractiveObjectsTypes.KEYPAD ?"digits" : "";
                objectRendering =
                    <EudRuleNumericPart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        rule={this.props.rule}
                        placeholder={cifre}
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
                object = this.getInteractiveObjectReference(this.props.action.obj_uuid); //riferimento alla regola
                let objectCompletion = this.showCompletion(actionId, "object"); //prendi completion della regola

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

        if (uuid == InteractiveObjectsTypes.GAME) {
            return InteractiveObject({
                type: InteractiveObjectsTypes.GAME,
                uuid: InteractiveObjectsTypes.GAME,
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
function sceneRulesOnly(props) {
    let current_scene = props.scenes.get(CentralSceneStore.getState());
    let rules = props.rules.filter(x => current_scene.get('rules').includes(x.uuid));
    let current_rule_uuid = props.rule._map._root.entries[0][1];
    //filtro in modo tale da non avere la regola corrente tra le completions, altrimenti si creerebbe un loop
    return rules.filter(x=>
        !x.includes(current_rule_uuid)
    );
}
