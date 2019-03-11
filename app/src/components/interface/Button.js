import React from 'react'
import Actions from "../../actions/Actions";
import ScenesStore from "../../data/ScenesStore";
import CentralSceneStore from "../../data/CentralSceneStore";
import RulesStore from "../../data/RulesStore";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import Condition from "../../interactives/rules/Condition";


export default class Button extends React.Component { // eslint-disable-line
    constructor(props){
        super(props)
    }

    manageRule = (type) => {

        let scene = ScenesStore.getState().get(CentralSceneStore.getState());
        let rule = RulesStore.getState().get(this.props.blockProps.uuid);
        switch (type){
            case 'buttonRemove':
                InteractiveObjectAPI.removeRule(scene, rule);
                break;
            case 'buttonAddCondition':
                console.log(rule)
                rule = rule.set('condition', {prova: 'popopooooooo'});
                console.log(rule)
                Actions.updateRule(rule);
                InteractiveObjectAPI.saveRule(scene, rule);
                break;
            case 'buttonRemoveCondition':
                rule = rule.set('condition', {});
                Actions.updateRule(rule);
                InteractiveObjectAPI.saveRule(scene, rule);
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div >
                <button onClick={() => this.manageRule('buttonRemove')}>Rimuovi regola</button>
                <button onClick={() => this.manageRule('buttonAddCondition')}>Aggiungi condizione</button>
                <button onClick={() => this.manageRule('buttonRemoveCondition')}>Rimuovi condizione</button>
            </div>
        )
    }
}

