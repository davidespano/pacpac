import React, {Component} from "react";

export default class EudRuleStaticPart extends Component {
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
