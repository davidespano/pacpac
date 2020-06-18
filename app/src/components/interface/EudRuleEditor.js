import React, {Component} from 'react';
import RuleActionTypes from "../../rules/RuleActionTypes";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes"
import InteractiveObject from "../../interactives/InteractiveObject"
import Immutable, {List} from "immutable";
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
import ObjectToSceneStore from "../../data/ObjectToSceneStore";
import RulesStore from "../../data/RulesStore";
import ScenesNamesStore from "../../data/ScenesNamesStore";
import ObjectsStore from "../../data/ObjectsStore";
import ScenesStore from "../../data/ScenesStore";
import SceneAPI from "../../utils/SceneAPI";
import Orders from "../../data/Orders";

let uuid = require('uuid');
var ghostScene=null;

export default class EudRuleEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let scene = this.props.scenes.get(this.props.currentScene); //uuid
        // console.log("this.props.currentScene. ", this.props.currentScene)
        if (this.props.currentScene) {
            let rules = scene.get('rules'); //elenco uuid
            let rulesRendering = rules.map(
                rule => {
                    let rule_obj = RulesStore.getState().get(rule);
                    console.log("rule: ", rule)
                    if(rule_obj.global !== true){
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
                    }

                });
            //TODO adesso lo uuid della ghostScene dovrebbe essere ghostScene, quindi si può semplificare (attenzione
            //creazione della ghost scene però)
            let ghostSceneUuid = this.props.scenes.filter(obj => {
                return obj.name === 'Ghost Scene'
            }).keySeq().first(); //uuid della ghost scene
            if(ghostSceneUuid===undefined){
                SceneAPI.createScene('Ghost Scene', "null", 0, '2D', 'default', Orders.CHRONOLOGICAL, this.props);
                return null;
            }
            ghostScene = this.props.scenes.get(ghostSceneUuid);
            let ghostSceneRules = ghostScene.get('rules');
            let globalRulesRendering = ghostSceneRules.map(
                rule => {
                    let rule_obj = RulesStore.getState().get(rule);
                    if(rule_obj.global){
                        return (<React.Fragment key={'fragment-' + rule}>
                            <EudRule
                                VRScene={this.props.VRScene}
                                editor={this.props.editor}
                                interactiveObjects={this.props.interactiveObjects}
                                scenes={this.props.scenes}
                                assets={this.props.assets}
                                audios={this.props.audios}
                                currentScene={ghostSceneUuid}
                                rules={this.props.rules}
                                rule={rule}
                                ruleEditorCallback={this.props.ruleEditorCallback}
                                removeRule={(rule) => {
                                    this.onRemoveRuleClick(rule, true)
                                }}
                                copyRule={(rule) => {
                                    this.props.copyRule(rule, true)
                                }}
                            />

                        </React.Fragment>);
                    }
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
                    <div className={"rule-container"}>
                        <div className={'eudBar'}>
                            <h2>Regole oggetti globali</h2>
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
                    <div className={"expand-btn"} >
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
                    </div>

                    <button className="accordion" id={"accordionScene"} onClick={
                        () => {
                            onAccordionClick('accordionScene')
                        }
                    }
                    >Regole di scena</button>

                    <div className="panel">
                        <div className={"rule-container"}>
                            <div className={"eudBar"}>
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
                                                this.onNewRuleClick(false);
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
                    </div>

                    <button className="accordion" id={"accordionGlobal"}  onClick={
                        () =>{
                            onAccordionClick('accordionGlobal')
                        }
                    }
                    >Regole globali</button>

                    <div className="panel">
                        <div className={"rule-container"}>
                            <div className={"eudBar"}>

                                <div id={'rule-editor-btns'}>
                                    <button
                                        disabled={this.props.editor.ruleCopy===null}
                                        onClick={() => {
                                            this.onCopyRuleClick(scene, true);
                                        }}
                                    >
                                        <img className={"action-buttons dropdown-tags-btn-topbar btn-img"} src={"icons/icons8-copia-50.png"}/>
                                        Copia qui
                                    </button>
                                    <button className={"btn select-file-btn"}
                                            onClick={() => {
                                                this.onNewRuleClick(true);
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
                                {globalRulesRendering}

                                <div className={'rules-footer'}/>
                            </div>
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
    onNewRuleClick(global) {
        let scene = this.props.scenes.get(this.props.currentScene); //prendo la scena corrente
        let event = Action().set("uuid", uuid.v4());    //la popolo con un evento (nb azione)
        let acts = Immutable.List([Action({uuid: uuid.v4()})]);
        let rule = null;
        if(global){
            rule = Rule().set("uuid", uuid.v4()).set("event", event).set("actions", acts).set("name", 'global_rl'
                +ghostScene.rules.length+ "").set("global", global);
            this.props.addNewRule(ghostScene, rule); //se è globale lo aggiungo alla regola fantasma
        }
        else {
            rule = Rule().set("uuid", uuid.v4()).set("event", event).set("actions", acts).set("name",  scene.name + '_rl'
                +  scene.rules.length + 1 + "").set("global", global);
            this.props.addNewRule(scene, rule); //aggiungo la regola alla scena
        }
        console.log("added rule: ", rule)

    }

    onRemoveRuleClick(ruleId, global=false) {
        let scene = this.props.scenes.get(this.props.currentScene);
        let rule = this.props.rules.get(ruleId);
        if(global){
            console.log("removed rule from ghostScene")
            this.props.removeRule(ghostScene, rule);
        }
        else{
            this.props.removeRule(scene, rule);
        }
    }

    onCopyRuleClick(scene, global=false){
        let newId = uuid.v4()+ (global ? "_global" : "");
        let copiedRule = this.props.editor.ruleCopy.set('uuid', newId);

        if(global){
        }
        else{
            this.props.addNewRule(scene, copiedRule);
        }
    }


}

/**
 * Funzione per aggiungere i listener all'accordion, viene chiamata al click del button accordion
 * passando come parametro l'accordionId
 * e quando clicco il button per espandere le regole altrimenti gli accordion non funzionano
 */
function onAccordionClick(accordionId) {
    let acc = document.getElementById(accordionId);
    if(acc!= null){ //ha caricato
        acc.classList.toggle("active");
        var panel = acc.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
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
                <span className={"eudName"}>{rule.name}</span>
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
        let originalText = subject == null ? "" : toString.objectTypeToString(subject.type) + subject.name;

        if(subject){
            //se è un oggetto globale non voglio che si scriva "la vita Vita"
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
            case RuleActionTypes.REACH_TIMER:
                objectRendering =
                    <EudRuleNumericPart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        rule={this.props.rule}
                        seconds={true}
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
                let seconds = subject.type===InteractiveObjectsTypes.PLAYTIME ? true : false;
                objectRendering =
                    <EudRuleNumericPart
                        interactiveObjects={this.props.interactiveObjects}
                        rules={this.props.rules}
                        seconds = {seconds}
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
                rule={this.props.rule}
                rules={this.props.rules}
            />;
            buttonVisible = "eudObjectButton";
            text = this.props.inputText;
        }
        return <div className={css} key={this.props.rule.uuid + this.props.role}>
                <span className={"eudInputBox"}
                      onClick={
                          (e) =>
                          {
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
        //se è un valore che ha a che fare con i secondi uso la classe css che mette il placeholder
        let className = (this.props.seconds ? "eudObjectSeconds" : "eudObjectString");
        return <div className={css} key={'numeric-input' + this.props.rule.uuid + this.props.role}>
                <span>
                <span className={className}>
                <span>{text == "" ? "[un valore]" : text}</span>
                <input type={"text"}
                       className={className} placeholder={"[digita un numero]"}
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
        /*
        graph: int che mi serve per capire se devo usare il grafo dei suggerimenti o meno
        0 -> non devo usare il grafo,
        1-> devo usare il grafo
        2-> devo usare il grafo ma con una singola scena e senza altri elementi (es. object) objects scene only
        3-> devo usare il grafo con una singola scena e con altri elementi (es. subject)
        */
        if(this.props.rule.global !== true){ //regola non globale
            let  {items: items, graph: graph} = getCompletions({
                interactiveObjects: this.props.interactiveObjects,
                subject: this.props.subject,
                verb: this.props.verb,
                role: this.props.role,
                scenes: this.props.scenes,
                rulePartType: this.props.rulePartType,
                assets: this.props.assets,
                audios: this.props.audios,
                rules: this.props.rules,
                rule: this.props.rule,
            }, false);
            let li = listableItems(items.valueSeq(), this.props);  //trasformo in un oggetto che può essere inserito nel dropdown

            if(this.props.interactiveObjects.size===0){
                graph=0;
            }
            if (li.toArray()[0]) { //controllo che ci siano elementi da mostrare
                let info = li.toArray()[0].props.item;
            }
            else graph=0;
            if(graph !=0){ //ho bisogno del grafo

                //in questi due casi gli oggetti fanno tutti parte della scena corrente
                if(graph===2){
                    //Case object scene/rules object only
                    return <div className={"eudCompletionPopupForGraph"}>
                        <span>{this.props.scenes.get(CentralSceneStore.getState()).name}</span>
                        <ul>
                            {li}
                        </ul>
                    </div>
                }

                //in questi due casi ci sono oggetti che fanno parte della scena corrente e altri (audio, video ...)
                //aggiungo manualmente gli oggetti della scena
                if(graph===3){
                    //filtro gli oggetti globali
                    let items = sceneObjectsOnly(this.props).filter(
                        x => x.type != InteractiveObjectsTypes.HEALTH &&
                            x.type != InteractiveObjectsTypes.SCORE &&
                            x.type != InteractiveObjectsTypes.PLAYTIME
                    ).valueSeq();
                    return <div className={"eudCompletionPopupForGraph"}>
                        <span>{this.props.scenes.get(CentralSceneStore.getState()).name}</span>
                        <ul>
                            {listableItems(items, this.props)}
                        </ul>

                        <ul key={li}>
                            <div className={"line"}/>
                            {li}
                        </ul>
                    </div>
                }

                //Se ho necessità di un grafo devo scindere gli items in due gruppi: un gruppo con gli Interactive object
                //che hanno bisogno di un nome della scena, e tutti gli altri

                //Primo gruppo, TUTTI gli oggetti appartenenti alle scene
                let sceneObj = this.props.interactiveObjects.filter(x =>
                    x.type !== InteractiveObjectsTypes.POINT_OF_INTEREST &&
                    x.type !== InteractiveObjectsTypes.HEALTH &&
                    x.type !== InteractiveObjectsTypes.SCORE &&
                    x.type !== InteractiveObjectsTypes.PLAYTIME);
                //mi prendo le scene coinvolte
                let scenes =returnScenes(sceneObj, this.props);

                //Secondo gruppo, tutti gli altri oggetti, quindi mi basta filtrare quelli che sono presenti in sceneObj
                let notSceneObj = items.filter(d => !sceneObj.includes(d));
                //trasformo in un oggetto che può essere inserito nel dropdown
                let liNotSceneObj = listableItems(notSceneObj.valueSeq(), this.props);

                let fragment = scenes.map( element => {
                    var obj = mapSceneWithObjects(this.props, element, sceneObj);
                    let objects = listableItems(obj, this.props); //trasformo in un oggetto inseribile nel dropdown
                    let scene_name = objects!="" ? element.name : ""; //se ho risultati metto il nome della scena, altrimenti nulla
                    return (<React.Fragment>
                        <span> {scene_name} </span>
                        <ul>
                            {objects}
                        </ul>
                    </React.Fragment>)
                });
                return (
                    <div className={"eudCompletionPopupForGraph"}>
                        {fragment}
                        <ul>
                            <div class={"line"}/>
                            {liNotSceneObj}
                        </ul>

                    </div>
                )
            }
            else { //caso di verbi, operatori etc..
                return <div className={"eudCompletionPopup"}>
                    <ul>
                        {li}
                    </ul>
                </div>
            }
        }
        else{ //regola globale
            let  {items: items, graph: graph} = getCompletions({
                interactiveObjects: this.props.interactiveObjects,
                subject: this.props.subject,
                verb: this.props.verb,
                role: this.props.role,
                scenes: this.props.scenes,
                rulePartType: this.props.rulePartType,
                assets: this.props.assets,
                audios: this.props.audios,
                rules: this.props.rules,
                rule: this.props.rule,
            }, true);
            let li = listableItems(items.valueSeq(), this.props);  //trasformo in un oggetto che può essere inserito nel dropdown
            return <div className={"eudCompletionPopup"}>
                <ul>
                    {li}
                </ul>
            </div>
        }
    }

}

/**
 * Funzione che da un array di elementi restituisce i <li> che possono essere restituiti come elenco
 */
function listableItems(list, props) {
    let result = list.filter(i => {
        let key = toString.objectTypeToString(i.type) + i.name;

        let n = (props.input ? props.input : "").split(" ");
        const word = n[n.length - 1];
        return key.includes(word);
    }).map(i => {
        return <EudAutoCompleteItem item={i}
                                    key={i}
                                    verb={props.verb}
                                    subject={props.subject}
                                    role={props.role}
                                    rules={props.rules}
                                    changeText={(text, role) => this.changeText(text, role)}
                                    updateRule={(rule, role) => props.updateRule(rule, role)}
        />
    });
    return result
}

/**
 * Funzione che restituisce le scene che contengono gli item
 * Se ho quindi [item1 item1 item3 item4] dove i primi due fanno parte di scena1 e gli altri di scena2 e scena3
 * Il risultato della funzione sarà [scena1 scena1 scena2 scena3], per avere un unico risultato per scena1 alla fine
 * della funzione creo un set
 **/
function returnScenes(items, props){
    if(items.size==0){ //se la lista è vuota non restituisco niente
        return "";
    }
    let scenes=[];
    let array = items.toArray();

    for(var i =0; i<array.length;i++){
        if(array[i]){
            let scene_uuid =ObjectToSceneStore.getState().get(array[i].uuid);
            let scene_name = props.scenes.get(scene_uuid);
            scenes.push(scene_name);

        }
    }
    return [...new Set(scenes)];
}

/**
 *
 * @param props
 * @param scene: scena sulla map
 * @param objects: tutti gli oggetti presenti
 * @returns {[]}: oggetti relativi alla scena scene
 */
function mapSceneWithObjects(props, scene, objects){
    let return_result= [];
    let array = objects.toArray();
    for(var i=0; i<objects.size;i++){
        if(scene.uuid===ObjectToSceneStore.getState().get(array[i].uuid)){
            return_result.push(array[i])
        }
    }
    return return_result;
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
        let text;
        if(this.props.item.type === InteractiveObjectsTypes.HEALTH ||
            this.props.item.type === InteractiveObjectsTypes.SCORE ||
            this.props.item.type === InteractiveObjectsTypes.PLAYTIME
        ){
            text = toString.objectTypeToString(this.props.item.type);
        }
        else {
            text = toString.objectTypeToString(this.props.item.type) + this.props.item.name;
        }

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
        //action: uuid regola che modifico, item: uuid elemento che seleziono
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
 * @param global is true if the rule is global
 * @returns {the list of possible completions, int that indicates if a graph is necessary}
 * WARNING: In order to work must return a variable called items and another called graph
 */
function getCompletions(props, global) {

    if(!global){ //regole non globali
        let graph=0;
        switch (props.role) {
            case "subject":
                graph=1;
                if(props.rulePartType === 'event'){ // event subject: player, game, audios videos, scene objects
                    //[Vittoria] ordino in modo tale che il player sia sempre in cima alla lista
                    //il merge delle scene lo faccio nella render con graph
                    graph=3;
                    let items = props.assets.filter(x => x.type === 'video').filter(x =>
                        x.type !== InteractiveObjectsTypes.TIMER &&
                        x.type !== InteractiveObjectsTypes.HEALTH &&
                        x.type !== InteractiveObjectsTypes.SCORE &&
                        x.type !== InteractiveObjectsTypes.PLAYTIME).merge(props.audios).set(
                        InteractiveObjectsTypes.PLAYER,
                        InteractiveObject({
                            type: InteractiveObjectsTypes.PLAYER,
                            uuid: InteractiveObjectsTypes.PLAYER,
                            name: ""
                        }),
                    ).sort(function (a) {
                        if(a.type=== "PLAYER"){
                            return -1
                        }
                        else
                            return 1;
                    });
                    return {items, graph};
                }
                else{
                    //soggetto nella seconda parte della frase
                    let subjects = props.interactiveObjects.filter(x =>
                        x.type !== InteractiveObjectsTypes.POINT_OF_INTEREST &&
                        x.type != InteractiveObjectsTypes.HEALTH &&
                        x.type != InteractiveObjectsTypes.SCORE &&
                        x.type != InteractiveObjectsTypes.PLAYTIME).set(
                        InteractiveObjectsTypes.GAME,
                        InteractiveObject({
                            type: InteractiveObjectsTypes.GAME,
                            uuid: InteractiveObjectsTypes.GAME,
                            name: ""
                        })).set(
                        InteractiveObjectsTypes.PLAYER,
                        InteractiveObject({
                            type: InteractiveObjectsTypes.PLAYER,
                            uuid: InteractiveObjectsTypes.PLAYER,
                            name: ""
                        })
                    );
                    let result = props.rulePartType === 'condition' ? subjects : subjects.merge(props.scenes).filter(x=>
                    x.uuid != 'ghostScene');
                    let items= result.sort(function (a) {
                        //ordino il soggetto della seconda parte della frase in modo tale che mi mostri prima gli oggetti della scena
                        // e il player
                        if(sceneObjectsOnly(props).includes(a)|| a.type=== "PLAYER"){
                            return -1
                        }
                        else
                            return 1;
                    });
                    return {items, graph}
                }

            case "object":
                // the CLICK action is restricted to current scene objects only, might move to switch case later
                if(props.verb.action === RuleActionTypes.CLICK){
                    console.log("Case object scene object only: ", sceneObjectsOnly(props));
                    graph = 2;
                    let items = sceneObjectsOnly(props).filter(x =>
                        x.type !== InteractiveObjectsTypes.TIMER &&
                        x.type !== InteractiveObjectsTypes.HEALTH &&
                        x.type !== InteractiveObjectsTypes.SCORE &&
                        x.type !== InteractiveObjectsTypes.PLAYTIME
                    ); //filtro il timer e gli oggetti globali perchè non sono cliccabili
                    return {items, graph};
                }

                //si possono triggerare regole o timers
                if(props.verb.action === RuleActionTypes.TRIGGERS){
                    graph = 2;
                    let items = sceneRulesOnly(props).merge(sceneObjectsOnly(props).filter (
                        x => x.type ===InteractiveObjectsTypes.TIMER
                    ));
                    return {items, graph}
                }

                //stop va bene sia per gli audio sia per i timer, ma se il soggetto è game allora si riferisce solo ai timer
                if(props.verb.action === RuleActionTypes.STOP_TIMER && props.subject.type === InteractiveObjectsTypes.GAME){
                    let items = (sceneObjectsOnly(props).filter (
                        x => x.type ===InteractiveObjectsTypes.TIMER
                    ));
                    return {items, graph}
                }

                //entra nella scena supporta solo il nome della scena corrente
                if(props.verb.action === RuleActionTypes.ENTER_SCENE){
                    graph=0;
                    let items = (props.scenes.filter( x=> x.uuid === CentralSceneStore.getState())); //scena corrente
                    return {items, graph}
                }

                let allObjects = props.interactiveObjects.merge(props.scenes).merge(props.assets).merge(props.audios)/*.filter(x =>
                    x.type !== InteractiveObjectsTypes.HEALTH &&
                    x.type !== InteractiveObjectsTypes.SCORE &&
                    x.type !== InteractiveObjectsTypes.PLAYTIME &&
                    x.uuid !== 'ghostScene')*/;
                allObjects = allObjects.merge(filterValues(props.subject, props.verb));

                if (props.verb.action) {
                    let objType = RuleActionMap.get(props.verb.action).obj_type;
                    allObjects = allObjects.filter(x => objType.includes(x.type));
                }

                //complemento oggetto, ordino sempre sulla base degli oggetti nella scena
                let items= allObjects.sort(function (a) {
                    if(sceneObjectsOnly(props).includes(a)){
                        return -1
                    }
                    else
                        return 1;
                });

                //ulteriore controllo per vedere se nella lista restituita ci sono oggetti
                if(items.some(a => typeof a == props.interactiveObjects)){
                    graph = 2;
                }

                //se il verbo è spostarsi verso allora faccio in modo che non appaia la scena corrente (non mi posso
                // spostare nella scena in cui sono già)
                if(props.verb.action === RuleActionTypes.TRANSITION){
                    let current_scene_uuid = props.scenes.get(CentralSceneStore.getState()).uuid;
                    items= items.filter(x=>
                        !x.includes(current_scene_uuid && x.name != 'Ghost Scene')
                    );
                }

                return {items, graph};

            case "operation":
                if(props.rulePartType === 'event'){
                    if(props.subject){
                        let items = RuleActionMap
                            //.filter(x => x.uuid === RuleActionTypes.CLICK || x.uuid === RuleActionTypes.IS)
                            .filter(x => x.subj_type.includes(props.subject.type)
                                && x.uuid !== RuleActionTypes.TRANSITION);

                        return {items, graph}
                    }
                    let items = RuleActionMap.filter(x => x.uuid === RuleActionTypes.CLICK || x.uuid === RuleActionTypes.IS);
                    return {items, graph};
                }
                if(props.subject){
                    //se ho come soggetto il gioco allora mostro solo avvia come verbo
                    if(props.subject.type === InteractiveObjectsTypes.GAME){
                        let items =RuleActionMap.filter(x => x.uuid === RuleActionTypes.TRIGGERS || x.uuid ===RuleActionTypes.STOP_TIMER);
                        return {items, graph};
                    }

                    /* Decommenta se dà problemi
                    if(props.subject.type === InteractiveObjectsTypes.TIMER){
                         let items =RuleActionMap.filter(x => x.uuid === RuleActionTypes.REACH_TIMER );
                         return {items, graph};
                     }*/

                    //faccio in modo che "entra nella scena" non compaia come azione nella seconda parte della frase
                    let items = props.subject ? RuleActionMap.filter(x => x.subj_type.includes(props.subject.type)
                        && x.uuid !== RuleActionTypes.ENTER_SCENE) : RuleActionMap.filter(
                        x => x.uuid !== RuleActionTypes.ENTER_SCENE
                    );

                    return {items, graph};
                }
                else{
                    let items = props.subject ? RuleActionMap.filter(x => x.subj_type.includes(props.subject.type)) : RuleActionMap;
                    return {items, graph};
                }

            case "operator":{
                let items = props.subject ? OperatorsMap.filter(x => x.subj_type.includes(props.subject.type)) : OperatorsMap;
                return {items, graph};
            }
            case 'value':{
                let items = props.subject ? ValuesMap.filter(x => x.subj_type.includes(props.subject.type)) : ValuesMap;
                return {items, graph};
            }
        }
    }

    else{ //regole globali
        //prendo solo quelli della scena fantasma in modo che non vengano ripetuti
        //(altrimenti avrei un suggerimento vita per ogni scena che ha la vita etc..)
        let globalObjects = props.interactiveObjects.filter(x =>
            (x.type == InteractiveObjectsTypes.HEALTH && (ObjectToSceneStore.getState().get(x.uuid) ==='ghostScene')) ||
            (x.type == InteractiveObjectsTypes.SCORE && (ObjectToSceneStore.getState().get(x.uuid) ==='ghostScene'))||
            (x.type == InteractiveObjectsTypes.PLAYTIME && (ObjectToSceneStore.getState().get(x.uuid) ==='ghostScene')));

        let graph=-1;

        switch (props.role) {

            case "subject":
                if(props.rulePartType === 'event'){ // mi servono solo gli oggetti globali
                    let items = globalObjects;
                    return {items, graph};
                }
                else{
                    let items = globalObjects.set(
                        InteractiveObjectsTypes.PLAYER,
                        InteractiveObject({
                            type: InteractiveObjectsTypes.PLAYER,
                            uuid: InteractiveObjectsTypes.PLAYER,
                            name: ""
                        })
                    );
                    console.log("items operation", items)

                    return {items, graph}
                }

            case "object":

                let items = props.interactiveObjects.merge(props.scenes);
                items = items.merge(filterValues(props.subject, props.verb));

                if (props.verb.action) {
                    let objType = RuleActionMap.get(props.verb.action).obj_type;
                    items = items.filter(x => objType.includes(x.type));
                }

                //se il verbo è spostarsi verso allora faccio in modo che non appaia la scena corrente (non mi posso
                // spostare nella scena in cui sono già)
                if(props.verb.action === RuleActionTypes.TRANSITION){
                    let current_scene_uuid = props.scenes.get(CentralSceneStore.getState()).uuid;
                    //filtro la scena in cui sono e la scena fantasma
                    items= items.filter(x=> !x.includes(current_scene_uuid && x.uuid!='ghostScene')
                    );
                }

                return {items, graph};

            case "operation":
                if(props.subject){
                    let items = RuleActionMap.filter(x => x.subj_type.includes(props.subject.type));
                    if(props.rulePartType === 'action' && props.subject.type === 'PLAYER'){ //solo in questo caso aggiungo si sposta verso
                        items = items.filter(x=> x.uuid==RuleActionTypes.TRANSITION);
                        return {items, graph};
                    }
                    return {items, graph};
                }
                else { //se l'oggetto non è definito
                    let items = props.subject ? RuleActionMap.filter(x => x.subj_type.includes(props.subject.type)) : RuleActionMap;
                    return {items, graph};
                }

            case "operator":{
                let items = props.subject ? OperatorsMap.filter(x => x.subj_type.includes(props.subject.type)) : OperatorsMap;
                return {items, graph};
            }
            case 'value':{
                let items = props.subject ? ValuesMap.filter(x => x.subj_type.includes(props.subject.type)) : ValuesMap;
                return {items, graph};
            }
        }
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

function sceneRulesOnly(props) {
    let current_scene = props.scenes.get(CentralSceneStore.getState());
    let rules = props.rules.filter(x => current_scene.get('rules').includes(x.uuid));
    let current_rule_uuid = props.rule._map._root.entries[0][1];
    //filtro in modo tale da non avere la regola corrente tra le completions, altrimenti si creerebbe un loop
    return rules.filter(x=>
        !x.includes(current_rule_uuid)
    );
}
