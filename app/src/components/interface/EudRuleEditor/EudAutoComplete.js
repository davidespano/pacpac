import React, {Component} from "react";
import CentralSceneStore from "../../../data/CentralSceneStore";
import InteractiveObjectsTypes from "../../../interactives/InteractiveObjectsTypes";
import toString from "../../../rules/toString";
import ObjectToSceneStore from "../../../data/ObjectToSceneStore";
import InteractiveObject from "../../../interactives/InteractiveObject";
import RuleActionTypes from "../../../rules/RuleActionTypes";
import {OperatorsMap, RuleActionMap, ValuesMap} from "../../../rules/maps";
import scene_utils from "../../../scene/scene_utils";

export default class EudAutoComplete extends Component {
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
                    let items = sceneObjectsOnly(this.props).valueSeq();
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
                    x.type !== InteractiveObjectsTypes.POINT_OF_INTEREST );//&&
                //x.type !== InteractiveObjectsTypes.HEALTH &&
                //x.type !== InteractiveObjectsTypes.SCORE &&
                //x.type !== InteractiveObjectsTypes.PLAYTIME);
                //mi prendo le scene coinvolte
                let scenes =returnScenes(sceneObj, this.props);

                //Secondo gruppo, tutti gli altri oggetti, quindi mi basta filtrare quelli che sono presenti in sceneObj
                let notSceneObj = items.filter(d => !sceneObj.includes(d));
                //trasformo in un oggetto che può essere inserito nel dropdown
                let liNotSceneObj = listableItems(notSceneObj.valueSeq(), this.props);

                let fragment = scenes.map( element => {
                    let scene_name = null;
                    var obj = mapSceneWithObjects(this.props, element, sceneObj);
                    let objects = null;
                    if(element.name==='Ghost Scene' ){ //faccio in modo di mostrare gli oggetti globali una volta sola
                        scene_name = 'Oggetti globali';
                        objects = listableItems(obj, this.props); //trasformo in un oggetto inseribile nel dropdown

                    }
                    else {
                        objects = listableItems(obj.filter(x=> x.type !== InteractiveObjectsTypes.HEALTH &&
                            x.type !== InteractiveObjectsTypes.SCORE &&
                            x.type !== InteractiveObjectsTypes.PLAYTIME), this.props); //filtro gli oggetti globali
                        scene_name = objects!="" ? element.name : ""; //se ho risultati metto il nome della scena, altrimenti nulla
                    }

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
                            <div className={"line"}/>
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
                        x.type !== InteractiveObjectsTypes.SCORE
                        && x.type !== InteractiveObjectsTypes.PLAYTIME
                    ).merge(props.audios).set(
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

                    let result = null;
                    if(combinationSubject(props)){
                        result = subjects.set(InteractiveObjectsTypes.COMBINATION,
                            InteractiveObject({
                                type: InteractiveObjectsTypes.COMBINATION,
                                uuid: InteractiveObjectsTypes.COMBINATION,
                                name: ""
                            }));
                    }
                    else{
                        result =subjects.merge(props.scenes).filter(x=>
                            x.uuid != 'ghostScene');
                    }
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

                //se il verbo è spostarsi verso allora faccio in modo che non appaia la scena corrente (non mi posso
                // spostare nella scena in cui sono già)
                if(props.verb.action === RuleActionTypes.TRANSITION){
                    let current_scene_uuid = props.scenes.get(CentralSceneStore.getState()).uuid;
                    let items = (props.scenes.filter(x=>
                        !x.includes(current_scene_uuid) && x.name != 'Ghost Scene'
                    ));
                    return {items, graph};
                }

                //deve restituire "di stato"
                if(props.verb.action === RuleActionTypes.PROGRESS && props.subject.type === InteractiveObjectsTypes.SELECTOR){
                    let items = ValuesMap.filter(x => x.subj_type.includes(props.subject.type)
                        && x.verb_type.includes(props.verb.action));
                    return {items, graph}
                }

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


                return {items, graph};

            case "operation":
                if(props.rulePartType === 'event'){
                    if(props.subject){
                        let items = RuleActionMap
                            //.filter(x => x.uuid === RuleActionTypes.CLICK || x.uuid === RuleActionTypes.IS)
                            .filter(x => x.subj_type.includes(props.subject.type)
                                && x.uuid !== RuleActionTypes.TRANSITION );

                        if(props.subject.type ===InteractiveObjectsTypes.KEYPAD){ //se siamo nell'event e il soggetto è il tastierino
                            items = RuleActionMap
                                .filter(x => //lascio solo la action
                                   x.uuid === RuleActionTypes.REACH_KEYPAD) //"arriva a", perchè aggiunge alla combinazione non lo gestiamo come evento
                        }
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
                let items = props.subject ? ValuesMap.filter(x => x.subj_type.includes(props.subject.type) &&
                    x.uuid !== "STATE") : ValuesMap; //filtro il valore "di stato"
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
                    console.log("items operation", items);

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
                    items= items.filter(x=> !x.includes(current_scene_uuid) &&
                        x.uuid!='ghostScene'
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

/* Funzione che controlla quando usare la combinazione,
 faccio in modo che "se la combinazione è corretta"
 appaia solo se la prima parte della frase è "il giocatore ha cliccato il tastierino"
 oppure "il tastierino arriva a n cifre"
 */
function combinationSubject(props){
    if(props.rulePartType === 'condition' && props.rule.event){
        if (props.interactiveObjects.get(props.rule.event.obj_uuid) &&
            props.interactiveObjects.get(props.rule.event.obj_uuid).type === InteractiveObjectsTypes.KEYPAD &&
            props.rule.event.subj_uuid === InteractiveObjectsTypes.PLAYER &&
            props.rule.event.action === RuleActionTypes.CLICK) {
            return true;
        } else if (props.interactiveObjects.get(props.rule.event.subj_uuid)){
            if(props.interactiveObjects.get(props.rule.event.subj_uuid).type === InteractiveObjectsTypes.KEYPAD &&
                props.rule.event.action === RuleActionTypes.REACH_KEYPAD) {
                return true;
            }
        }

    }
    return false;
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