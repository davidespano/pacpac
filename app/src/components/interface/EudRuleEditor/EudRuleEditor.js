import React, {Component} from 'react';
import RuleActionTypes from "../../../rules/RuleActionTypes";
import InteractiveObjectsTypes from "../../../interactives/InteractiveObjectsTypes"
import InteractiveObject from "../../../interactives/InteractiveObject"
import Immutable, {List} from "immutable";
import Action from "../../../rules/Action"
import ActionTypes from "../../../actions/ActionTypes"
import Rule from "../../../rules/Rule";
import rules_utils from "../../../rules/rules_utils";
import {Operators, SuperOperators} from "../../../rules/Operators";
import Condition from "../../../rules/Condition";
import SuperCondition from "../../../rules/SuperCondition";
import toString from "../../../rules/toString";
import {RuleActionMap, ValuesMap, OperatorsMap} from "../../../rules/maps";
import CentralSceneStore from "../../../data/CentralSceneStore";
import scene_utils from "../../../scene/scene_utils";
import eventBus from "../../aframe/eventBus";
import ObjectToSceneStore from "../../../data/ObjectToSceneStore";
import RulesStore from "../../../data/RulesStore";
import EudRule from "./EudRule";
import EventTypes from "../../../rules/EventTypes";

let uuid = require('uuid');
var ghostScene = null;

export default class EudRuleEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let scene = this.props.scenes.get(this.props.currentScene); //uuid
        if (this.props.currentScene) {
            let rules = scene.get('rules'); //elenco uuid
            let rulesRendering = rules.map(
                rule => {
                    let rule_obj = RulesStore.getState().get(rule);
                    if (rule_obj.global !== true) {
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
                                    updateRuleName={this.props.updateRuleName}
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

            if (ghostSceneUuid === undefined) {
                return (<div className={"rules"}>
                    <div className={"expand-btn"}>
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
                    >Regole di scena
                    </button>

                    <div className="panel">
                        <div className={"rule-container"}>
                            <div className={"eudBar"}>
                                <div id={'rule-editor-btns'}>
                                    <button
                                        disabled={this.props.editor.ruleCopy === null}
                                        onClick={() => {
                                            this.onCopyRuleClick(scene, false);
                                        }}
                                    >
                                        <img className={"action-buttons dropdown-tags-btn-topbar btn-img"}
                                             src={"icons/icons8-copia-50.png"}/>
                                        Copia qui
                                    </button>
                                    <button className={"btn select-file-btn"}
                                            onClick={() => {
                                                this.onNewRuleClick(false);
                                            }}>
                                        <img className={"action-buttons dropdown-tags-btn-topbar btn-img"}
                                             src={"icons/icons8-plus-white-30.png"}/>
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
                </div>)
            }
            ghostScene = this.props.scenes.get(ghostSceneUuid);
            let ghostSceneRules = ghostScene.get('rules');
            let globalRulesRendering = ghostSceneRules.map(
                rule => {
                    let rule_obj = RulesStore.getState().get(rule);
                    if (rule_obj.global) {
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
                                updateRuleName={this.props.updateRuleName}
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
                    <div className={"expand-btn"}>
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
                    >Regole di scena
                    </button>

                    <div className="panel">
                        <div className={"rule-container"}>
                            <div className={"eudBar"}>
                                <div id={'rule-editor-btns'}>
                                    <button
                                        disabled={this.props.editor.ruleCopy === null}
                                        onClick={() => {
                                            this.onCopyRuleClick(scene);
                                        }}
                                    >
                                        <img className={"action-buttons dropdown-tags-btn-topbar btn-img"}
                                             src={"icons/icons8-copia-50.png"}/>
                                        Copia qui
                                    </button>
                                    <button className={"btn select-file-btn"}
                                            onClick={() => {
                                                this.onNewRuleClick(false);
                                            }}>
                                        <img className={"action-buttons dropdown-tags-btn-topbar btn-img"}
                                             src={"icons/icons8-plus-white-30.png"}/>
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

                    <button className="accordion" id={"accordionGlobal"} onClick={
                        () => {
                            onAccordionClick('accordionGlobal')
                        }
                    }
                    >Regole globali
                    </button>

                    <div className="panel">
                        <div className={"rule-container"}>
                            <div className={"eudBar"}>

                                <div id={'rule-editor-btns'}>
                                    <button
                                        disabled={this.props.editor.ruleCopy === null}
                                        onClick={() => {
                                            this.onCopyRuleClick(scene, true);
                                        }}
                                    >
                                        <img className={"action-buttons dropdown-tags-btn-topbar btn-img"}
                                             src={"icons/icons8-copia-50.png"}/>
                                        Copia qui
                                    </button>
                                    <button className={"btn select-file-btn"}
                                            onClick={() => {
                                                this.onNewRuleClick(true);
                                            }}>
                                        <img className={"action-buttons dropdown-tags-btn-topbar btn-img"}
                                             src={"icons/icons8-plus-white-30.png"}/>
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

        if (global) {
            rule = Rule().set("uuid", uuid.v4()).set("event", event).set("actions", acts).set("name", 'global_rl'
                + ghostScene.rules.length + "").set("global", global);
            this.props.addNewRule(ghostScene, rule); //se è globale lo aggiungo alla regola fantasma
        } else {
            rule = Rule().set("uuid", uuid.v4()).set("event", event).set("actions", acts).set("name", scene.name + '_rl'
                + scene.rules.length + 1 + "").set("global", global);
            this.props.addNewRule(scene, rule); //aggiungo la regola alla scena
        }


        console.log("added rule: ", rule)

    }

    onRemoveRuleClick(ruleId, global = false) {
        let scene = this.props.scenes.get(this.props.currentScene);
        let rule = this.props.rules.get(ruleId);
        if (global) {
            console.log("removed rule from ghostScene")
            this.props.removeRule(ghostScene, rule);
        } else {
            this.props.removeRule(scene, rule);
        }
    }

    onCopyRuleClick(scene, global = false) {
        let newId = uuid.v4() + (global ? "_global" : "");
        console.log(this.props.editor.ruleCopy)

        let copiedRule = this.props.editor.ruleCopy.set('uuid', newId);
        let event = Action({
            uuid: uuid.v4(),
            subj_uuid: copiedRule.event.subj_uuid,
            action: copiedRule.event.action,
            obj_uuid: copiedRule.event.obj_uuid,
        });
        //TODO condizione
        let listOfActions =[];
        copiedRule.actions.forEach(
            action =>{
                action.uuid=uuid.v4();
                listOfActions.push(action);
            }
        )
        console.log(copiedRule.conditions)
        let actions = listOfActions;

        let rule = Rule({
            uuid: newId,
            name: copiedRule.name + '_copia',
            event: event,
            actions: actions,
        });

        if(!global){
            this.props.addNewRule(scene, rule); //aggiungo la regola alla scena
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
    if (acc != null) { //ha caricato
        acc.classList.toggle("active");
        var panel = acc.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }

}

