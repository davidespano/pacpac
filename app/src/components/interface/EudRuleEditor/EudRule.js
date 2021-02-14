import React, {Component} from "react";
import ActionTypes from "../../../actions/ActionTypes";
import rules_utils from "../../../rules/rules_utils";
import Condition from "../../../rules/Condition";
import {SuperOperators} from "../../../rules/Operators";
import toString from "../../../rules/toString";
import SuperCondition from "../../../rules/SuperCondition";
import eventBus from "../../aframe/eventBus";
import EudAction from "./EudAction";
import EudCondition from "./EudCondition";

export default class EudRule extends Component {
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
                <span className={"eudName"}>
                    <input style={{"width":"80%"}} id={"ruleName"}
                           className={"propertyForm rightbar-box"}
                           value={rule.name}
                           maxLength={50}
                           onChange={(event =>{
                               let value = event.target.value; //nuovo nome
                               let oldValue = rule.name;
                               rule = rule.set('name', value); //nuova regola con nome aggiornato
                               this.props.updateRuleName(rule, oldValue)

                           })}
                           onBlur={()=> {

                           }}
                    />
                </span>
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