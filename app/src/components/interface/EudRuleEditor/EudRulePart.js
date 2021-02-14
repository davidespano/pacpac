import React, {Component} from "react";
import EudAutoComplete from "./EudAutoComplete";

export default class EudRulePart extends Component {

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
