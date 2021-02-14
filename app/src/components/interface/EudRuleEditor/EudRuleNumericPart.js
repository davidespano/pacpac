import React, {Component} from "react";

export default class EudRuleNumericPart extends Component {

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
        //se è un valore che ha a che fare con i secondi/minuti/cifre uso la classe css che mette il placeholder
        let className = null;
        if(this.props.placeholder === "seconds")
            className = "eudObjectSeconds";
        else if(this.props.placeholder==="minutes"){
            className = "eudObjectMinutes"
        }
        else if(this.props.placeholder==="digits"){
            className = "eudObjectDigits"
        }
        else{
            className = "eudObjectString";
        }
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
