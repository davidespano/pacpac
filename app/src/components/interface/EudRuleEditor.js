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
import {RuleActionMap, ValuesMap, OperatorsMap} from "../../rules/maps";
import CentralSceneStore from "../../data/CentralSceneStore";
import scene_utils from "../../scene/scene_utils";
import interface_utils from "./interface_utils";
import eventBus from "../aframe/eventBus";
import ObjectToSceneStore from "../../data/ObjectToSceneStore";
import {Widget, addResponseMessage, addLinkSnippet, addUserMessage, renderCustomComponent} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import stores_utils from "../../data/stores_utils";
import EventTypes from "../../rules/EventTypes";
import RulesStore from "../../data/RulesStore";
import ScenesNamesStore from "../../data/ScenesNamesStore";
import ObjectsStore from "../../data/ObjectsStore";
import ScenesStore from "../../data/ScenesStore";
import SceneAPI from "../../utils/SceneAPI";
import Orders from "../../data/Orders";
import Transition from "../../interactives/Transition";
import Switch from "../../interactives/Switch";
import Lock from "../../interactives/Lock";
import Key from "../../interactives/Key";

let uuid = require('uuid');
var ghostScene=null;

export default class EudRuleEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elementoMancante: "", //Variabile dove scrivo di volta in volta l'elemento che manca al bot per completare la regola
            queryPrecedente: "",  //Variabile d'appoggio dove salvo la query precedente
            response: {
                intent: "",
                scenaIniziale: "",
                scenaFinale: "",
                oggetto: "",
                tipo: "regola"
            },
            ultimaRegolaCreata: rules_utils.generateDefaultRule("TRANSITION", this.props.scenes.get(this.props.currentScene))
        };
    }

    render() {
        let icon = "icons/icon_chat-bot.png";

        let scene = this.props.scenes.get(this.props.currentScene); //uuid
        // console.log("this.props.currentScene. ", this.props.currentScene)
        if (this.props.currentScene) {
            let rules = scene.get('rules'); //elenco uuid
            let rulesRendering = rules.map(
                rule => {
                    let rule_obj = RulesStore.getState().get(rule);
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

            if(ghostSceneUuid===undefined ){
                 return (<div className={"rules"}>
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
                 </div>)
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
                            <Widget
                                title={"PAC-PAC BOT"}
                                subtitle={""}
                                profileAvatar={icon}
                                handleNewUserMessage={this.handleNewUserMessage}
                                senderPlaceHolder={"Scrivi qui la regola"}/>
                            <br/>
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
                                <Widget
                                    title={"PAC-PAC BOT"}
                                    subtitle={""}
                                    profileAvatar={icon}
                                    handleNewUserMessage={this.handleNewUserMessage}
                                    senderPlaceHolder={"Scrivi qui la regola"}/>
                                <br/>
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


    /** Luca - Widget Bot */

    /* Messaggio di benvenuto. */
    componentDidMount() {
        addResponseMessage("Benvenuto nel bot delle regole di Pac-Pac, scrivi subito la prima regola! Ricorda che puoi scrivere \"reset\" " +
            "in qualsiasi momento per resettare tutto e scrivere una regola da capo. ");
    }

    /* Metodo per inviare un messaggio. Capire se il bot ha trovato una transizione, se quella transizione ha tutti i
    campi corretti allora creo la scena con tutto corretto, se no risolvo i conflitti in locale. */
    handleNewUserMessage = async (newMessage) => {
        let scelte = ["Si", "No"];
        /* Si da l'opportunità all'utente di resettare in ogni momento la regola che sta scrivendo e di scriverne una da capo. */
        if (newMessage !== "reset") {
            /* La prima query verrà sempre mandata al bot. */
            if (this.state.elementoMancante === "") {
                this.setState({response: await sendRequest(newMessage, this.state.response.tipo)});
            } else {
                /* Se dopo aver mandato al bot la prima query ci dovesse mancare qualche elemento per la regola allora risolviamo localmente, modificando
                * lo stato di response, usando una variabile d'appoggio "risposta". Il campo mancante prenderà ciò che scriviamo
                * nell'input, successivamente processiamo ciò che abbiamo scritto in "queryControl". */
                let risposta = this.state.response;
                /* A seconda di cosa viene settato nel queryControl si esegue uno di questi case. */
                switch (this.state.elementoMancante) {
                    case "scenaFinale":
                        risposta.scenaFinale = newMessage;
                        this.setState({response: risposta});
                        break;
                    case "oggetto": //Nome dell'oggetto
                        risposta.oggetto = newMessage;
                        this.setState({response: risposta});
                        break;
                    case "statoIniziale":
                        risposta.statoIniziale = newMessage;
                        this.setState({response: risposta});
                        break;
                    case "statoFinale":
                        risposta.statoFinale = newMessage;
                        this.setState({response: risposta});
                        break;
                    /* Quando la scena non ha l'oggetto che serve per la regola  allora il bot chiede all'utente se
                    vuole crearlo di default. In caso affermativo viene creato e posto come oggetto della regola
                    che l'utente sta creando. In caso negativo invece viene resettata la regola e viene data la
                    possibilità di crearne una da zero. */
                    case "confermaCreazioneOggetto":
                        if (newMessage.trim().toLowerCase() === "si") {
                            switch (risposta.intent) {
                                case "transizione":
                                    risposta.oggetto = await this.createDefaultObject(this.props, "TRANSITION");
                                    addResponseMessage("Transizione aggiunta");
                                    break;
                                case "interazioneSwitch":
                                    risposta.oggetto = await this.createDefaultObject(this.props, "SWITCH");
                                    addResponseMessage("Switch aggiunto");
                                    break;
                                case "interazioneLucchetto":
                                    risposta.oggetto = await this.createDefaultObject(this.props, "LOCK");
                                    addResponseMessage("Lucchetto aggiunto");
                                    break;
                                case "interazioneChiave":
                                    risposta.oggetto = await this.createDefaultObject(this.props, "KEY");
                                    addResponseMessage("Chiave aggiunta");
                                    break;
                                default:
                                    addResponseMessage("C'è stato qualche problema nella creazione dell'oggetto.")
                            }
                            this.setState({response: risposta});
                        } else if (newMessage.trim().toLowerCase() === "no") {
                            this.resetAll();
                            return;
                        } else {
                            //In caso l'utente non scriva ne si e ne no
                            addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            return;
                        }
                        break;
                    case "confermaCreazioneRegola":
                        if (newMessage.trim().toLowerCase() === "si") {
                            //Creo la regola
                            switch (risposta.intent) {
                                case "transizione":
                                    let transitionObj = this.returnObjectByName(risposta.oggetto, "TRANSITION");
                                    let finalSceneUuid = this.returnUuidSceneByName(risposta.scenaFinale, this.props);
                                    this.state.ultimaRegolaCreata = this.createTransitionRule(transitionObj, finalSceneUuid);
                                    break;
                                case "interazioneSwitch":
                                    let switchObj = this.returnObjectByName(risposta.oggetto, "SWITCH");
                                    this.state.ultimaRegolaCreata = this.createSwitchRule(switchObj, risposta.statoIniziale, risposta.statoFinale);
                                    break;
                                case "interazioneLucchetto":
                                    let padlockObject = this.returnObjectByName(risposta.oggetto, "LOCK");
                                    this.state.ultimaRegolaCreata = this.createPadlockRule(padlockObject);
                                    break;
                                case "interazioneChiave":
                                    let keyObject = this.returnObjectByName(risposta.oggetto, "KEY");
                                    this.state.ultimaRegolaCreata = this.createKeyRule(keyObject);
                                    break;
                                default:
                                    addResponseMessage("C'è stato qualche problema nella creazione della regola.")
                            }

                            addResponseMessage("Regola creata!");
                            addResponseMessage("Vuoi aggiungere una nuova azione legata a quest'ultima regola creata?");
                            this.setState({elementoMancante: "richiestaAzioneAggiuntiva"});
                            this.stampaBottoni(scelte);
                            return;
                        } else if (newMessage.trim().toLowerCase() === "no") {
                            this.resetAll();
                            return;
                        } else {
                            addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            return;
                        }
                    case "richiestaAzioneAggiuntiva":
                        if (newMessage.trim().toLowerCase() === "si") {
                            addResponseMessage("Scrivi l'azione aggiuntiva.");
                            this.responseReset();
                            this.responseSetActionOrCondition("azione"); //Setto che la risposta sarà un azione da aggiungere e non una regola intera;
                            return;
                        } else if (newMessage.trim().toLowerCase() === "no") {
                            addResponseMessage("Vuoi aggiungere una nuova condizione legata a quest'ultima regola creata?");
                            this.setState({elementoMancante: "richiestaCondizioneAggiuntiva"});
                            this.stampaBottoni(scelte);
                            return;
                        } else {
                            addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            return;
                        }
                    case "confermaAggiuntaAzione":
                        if (newMessage.trim().toLowerCase() === "si") {
                            let newRule;
                            //Aggiungo l'azione
                            switch (risposta.intent) {
                                case "transizione":
                                    let finalSceneUuid = this.returnUuidSceneByName(risposta.scenaFinale, this.props);
                                    newRule = this.addTransitionAction(this.state.ultimaRegolaCreata, finalSceneUuid);
                                    break;
                                case "interazioneSwitch":
                                    let switchObj = this.returnObjectByName(risposta.oggetto, "SWITCH");
                                    newRule = this.addSwitchAction(this.state.ultimaRegolaCreata, switchObj, risposta.statoFinale);
                                    break;
                                case "interazioneLucchetto":
                                    let padlockObject = this.returnObjectByName(risposta.oggetto, "LOCK");
                                    newRule = this.addPadlockAction(this.state.ultimaRegolaCreata, padlockObject, risposta.statoFinale);
                                    break;
                                case "interazioneChiave":
                                    let keyObject = this.returnObjectByName(risposta.oggetto, "KEY");
                                    newRule = this.addKeyAction(this.state.ultimaRegolaCreata, keyObject, risposta.statoFinale);
                                    break;
                                default:
                                    addResponseMessage("C'è stato qualche problema nell'aggiunta dell'azione.")
                            }

                            this.setState({ultimaRegolaCreata: newRule});
                            this.props.ruleEditorCallback.eudUpdateRule(newRule);
                            addResponseMessage("Azione corrispondente aggiunta.");
                            addResponseMessage("Vuoi aggiungere una nuova azione?");
                            this.setState({elementoMancante: "richiestaAzioneAggiuntiva"});
                            this.stampaBottoni(scelte);
                            return;
                        } else if (newMessage.trim().toLowerCase() === "no") {
                            addResponseMessage("Vuoi scriverne una nuova?");
                            this.setState({elementoMancante: "richiestaAzioneAggiuntiva"});
                            this.stampaBottoni(scelte);
                            return;
                        } else {
                            addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            return;
                        }
                    case "richiestaCondizioneAggiuntiva":
                        if (newMessage.trim().toLowerCase() === "si") {
                            addResponseMessage("Scrivi la condizione aggiuntiva.");
                            this.responseReset();
                            this.responseSetActionOrCondition("condizione"); //Setto che la risposta sarà un azione o una condizione da aggiungere e non una regola intera;
                            return;
                        } else if (newMessage.trim().toLowerCase() === "no") {
                            this.resetAll();
                            return;
                        } else {
                            addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            return;
                        }
                    case "confermaAggiuntaCondizione":
                        if (newMessage.trim().toLowerCase() === "si") {
                            let newRule;
                            let object;
                            //Aggiungo la condizione
                            switch (risposta.intent) {
                                case "transizione":
                                    object = this.returnObjectByName(risposta.oggetto, "TRANSITION");
                                    break;
                                case "interazioneSwitch":
                                    object = this.returnObjectByName(risposta.oggetto, "SWITCH");
                                    break;
                                case "interazioneLucchetto":
                                    object = this.returnObjectByName(risposta.oggetto, "LOCK");
                                    break;
                                case "interazioneChiave":
                                    object = this.returnObjectByName(risposta.oggetto, "KEY");
                                    break;
                                default:
                                    addResponseMessage("C'è stato qualche problema nell'aggiunta della condizione.")
                            }

                            newRule = this.addObjectCondition(this.state.ultimaRegolaCreata, object.uuid, this.state.response.statoIniziale);
                            this.setState({ultimaRegolaCreata: newRule});
                            this.props.ruleEditorCallback.eudUpdateRule(newRule);
                            addResponseMessage("Condizione corrispondente aggiunta.");

                            addResponseMessage("Vuoi aggiungere una nuova condizione?");
                            this.setState({elementoMancante: "richiestaCondizioneAggiuntiva"});
                            this.stampaBottoni(scelte);
                            return;
                        } else if (newMessage.trim().toLowerCase() === "no") {
                            addResponseMessage("Vuoi aggiungere una nuova condizione?");
                            this.setState({elementoMancante: "richiestaCondizioneAggiuntiva"});
                            this.stampaBottoni(scelte);
                            return;
                        } else {
                            addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            return;
                        }
                    default:
                        addResponseMessage("Ci dev'essere qualche errore, mancano degli elementi, ma non riesco a capire quali. ")
                }
            }
            /* Controlliamo tutti i dati di response. */
            this.queryControl(this.state.response);
        } else {
            this.responseReset();
            this.responseSetActionOrCondition("regola"); //Setto che la risposta non sarà un azione da aggiungere, ma una regola intera;
            addResponseMessage("La regola è stata resettata! Puoi scriverne una da capo quando vuoi.");
        }
    };

    /* Metodo per il controllo dei dati che abbiamo salvato in "response". */
    queryControl() {
        switch (this.state.response.intent) {
            case "transizione":
                this.transitionElementsControl();
                break;
            case "interazioneSwitch" :
                this.switchElementsControl();
                break;
            case "interazioneLucchetto":
                this.padlockElementsControl();
                break;
            case "interazioneChiave":
                this.keyElementControl();
                break;
            default:
                addResponseMessage("Non è una transizione, una interazione con lo switch e neanche un interazione con " +
                    "un lucchetto. Verrà implementato in futuro.");
        }
    }

    resetAll() {
        addResponseMessage("Va bene!");
        addResponseMessage("Scrivi pure una nuova regola, il bot è sempre qui ad ascoltarti.");
        //Resetto i campi di response
        this.responseReset();
        this.responseSetActionOrCondition("regola"); //Setto che la risposta non sarà un azione da aggiungere, ma una regola intera;
    }

    /* Resetto response per la prossima richiesta di nuova regola. */
    responseReset() {
        this.setState({elementoMancante: ""});
        let risposta = this.state.response;
        risposta.intent = "";
        risposta.scenaIniziale = "";
        risposta.scenaFinale = "";
        risposta.oggetto = "";
        risposta.tipo = this.state.response.tipo;
        this.setState({response: risposta});
    }

    responseSetActionOrCondition(state) {
        let risposta = this.state.response;
        risposta.tipo = state;
        this.setState({response: risposta});
    }

    /* Metodo usato per mandare la query quando viene cliccato il bottone corrispondente. */
    oggettoCliccato(oggetto) {
        this.handleNewUserMessage(oggetto);
    }

    /* Ritorna i nomi delle sceneFinali possibili. */
    returnFinalScenesNames() {
        let scene = this.props.scenes;
        let nomeScenaCorrente = this.props.scenes.get(this.props.currentScene).name;
        let nomiScene = []; // Array che conterrà tutti i nomi delle scene, tranne quello della scena corrente.

        //Aggiungo i nome di tutte le scene, ma saltando la scena corrente
        scene.forEach(function (singleScene) {
            if (singleScene.name !== nomeScenaCorrente)
                nomiScene.push(singleScene.name);
        });
        return nomiScene;
    }

    /* Torna true se la scena passsata come parametro (stringa) esiste tra i nomi delle scene nella quale è possibile spostarsi, false altrimenti. */
    doesFinalSceneExists(scene) {
        let sceneNames = this.returnFinalScenesNames();

        for (var i = 0; i < sceneNames.length; i++) {
            if (scene === sceneNames[i]) {
                return true;
            }
        }
        return false;
    }

    /* Ritorna l'oggetto scena corrispondente al nome passato. */
    returnUuidSceneByName(sceneName, props) {
        let scene = this.props.scenes;
        let uuid = undefined;
        //Quando trovo il nome della scena corrispondente allora lo restituisco
        scene.forEach(function (singleScene) {
            if (singleScene.name === sceneName) {
                uuid = props.scenes.get(singleScene.uuid).uuid;
            }
        });
        return uuid;
    }

    /* Torna true se il nome dell'oggetto passato come parametro (stringa) esiste, false altrimenti. bisogna passare
    anche il tipo dell'oggetto, in modo tale da usare la stessa funzione per tutti gli oggetti. */
    doesObjectExists(objectName, objectType) {
        let objectNames = this.returnObjectNames(objectType);
        for (var i = 0; i < objectNames.length; i++) {
            if (objectName === objectNames[i]) {
                return true;
            }
        }
        return false;
    }

    /* Ritorna i nomi degli oggetti della scena corrente che hanno il tipo passato come parametro. */
    returnObjectNames(objectType) {
        let sceneObjects = this.props.interactiveObjects.filter(x => x.type === objectType);

        let objects = mapSceneWithObjects(this.props, this.props.scenes.get(this.props.currentScene), sceneObjects);
        for (var i = 0; i < objects.length; i++) {
            objects[i] = objects[i].name;
        }
        return objects;
    }

    /* Ritorna l'oggetto corrispondente al nome e al tipo passato. */
    returnObjectByName(objectName, objectType) {
        let sceneObjects = this.props.interactiveObjects.filter(x =>
            x.type === objectType);

        let objects = mapSceneWithObjects(this.props, this.props.scenes.get(this.props.currentScene), sceneObjects);
        for (var i = 0; i < objects.length; i++) {
            if (objectName === objects[i].name) {
                return objects[i];
            }
        }
        return undefined;
    }

    /* Crea un oggetto di default quando non esistono oggetti inerenti alla regola che stiamo creando
    e l'utente vuole creare quest'ultima trarmite bot. */
    createDefaultObject(props, objectType) {
        let scene = props.scenes.get(props.currentScene);
        let name = "";
        let obj = null;

        switch (objectType) {
            case "TRANSITION":
                name = scene.name + '_tr' + (scene.objects.transitions.length + 1);
                obj = Transition({
                    uuid: uuid.v4(),
                    name: name,
                });
                break;

            case "SWITCH":
                name = scene.name + '_sw' + (scene.objects.switches.length + 1);
                obj = Switch({
                    uuid: uuid.v4(),
                    name: name,
                });
                break;
            case "LOCK":
                name = scene.name + '_lk' + (scene.objects.locks.length + 1);
                obj = Lock({
                    uuid: uuid.v4(),
                    name: name,
                });
                break;
            case "KEY":
                name = scene.name + '_key' + (scene.objects.collectable_keys.length + 1);
                obj = Key({
                    uuid: uuid.v4(),
                    name: name,
                });
                break;
            default:
                addResponseMessage("C'è stato un problema con la creazione dell'oggetto di default. ");
        }


        props.addNewObject(scene, obj);
        return name;
    }

    addObjectCondition(rule, objectUuid, state) {
        let newRule = rules_utils.addEmptyCondition(rule);
        this.props.ruleEditorCallback.eudUpdateRule(newRule);
        let c = new Condition(uuid.v4(), objectUuid, state, "EQUAL");

        if (rule.condition instanceof Condition || rule.condition instanceof SuperCondition) {
            c = new SuperCondition(uuid.v4(), rule.condition, new Condition(uuid.v4(), objectUuid, state, "EQUAL"));
        }

        rule = rule.set('condition', c);

        console.log(c);
        return rule;
    }

    stampaBottoni(oggetti) {
        renderCustomComponent(ButtonObjectNames, {
            oggetti: oggetti,
            oggettoCliccato: (o) => this.oggettoCliccato(o)
        });
    }

    /** TRANSITIONS **/

    /* Metodo per controllare se tutti gli elementi della regola transizione che vogliamo creare sono corretti. */
    transitionElementsControl() {
        let transizioni = this.returnObjectNames("TRANSITION");
        let sceneFinali = this.returnFinalScenesNames();
        let scelte = ["Si", "No"];
        let statoTransizione = ["Attivabile", "Non attivabile", "Visibile", "Non visibile"];

        /* Controllo se la scenaIniziale che ha scritto l'utente corrisponde effettivamente con la scena corrente.
         * Se non dovesse corrispondere, do per scontato che sia quella e la aggiungo a response. */
        if (this.state.response.scenaIniziale !== this.props.scenes.get(this.props.currentScene).name) {
            let risposta = this.state.response;
            risposta.scenaIniziale = this.props.scenes.get(this.props.currentScene).name;
            this.setState({response: risposta});
        }
        /* Controllo che la scena finale che ha inserito l'utente esista, cioè che si trovi effettivamente tra le scene del gioco,
        * ma che non sia la scena corrente. */
        if (!this.doesFinalSceneExists(this.state.response.scenaFinale) && this.state.response.tipo !== "condizione") {
            if (this.state.response.scenaFinale === "") {
                addResponseMessage("Scrivimi qual'è la scena finale alla quale vuoi arrivare. Perfavore scegli tra una di queste: ");
            } else {
                addResponseMessage("La scena finale che hai inserito non esiste. Perfavore scegli tra una di queste: ");
            }
            //Serve per far capire al form dove inserisco il messaggio che non deve mandare una richiesta al bot, ma può risolvere in locale.
            this.setState({elementoMancante: "scenaFinale"});
            this.stampaBottoni(sceneFinali);
        } else if (!this.doesObjectExists(this.state.response.oggetto, "TRANSITION") && this.state.response.tipo !== "azione") { //Faccio la stessa cosa per il nome della transizione, ma dopo aver inserito la scena finale corretta.
            if (this.returnObjectNames("TRANSITION").length > 0) { //Se esiste qualche transizione le elenchiamo

                //Serve per far capire al form dove inserisco il messaggio che non deve mandare una richiesta al bot, ma può risolvere in locale.
                this.setState({elementoMancante: "oggetto"});
                if (this.state.response.oggetto === "") {
                    addResponseMessage("Quale transizione vuoi cliccare per effettuare l'azione? Perfavore scegli tra una di queste: ");
                    this.stampaBottoni(transizioni);
                } else {
                    addResponseMessage("La transizione che hai inserito non esiste. Perfavore scegli tra una di queste: ");
                    this.stampaBottoni(transizioni);
                }
            } else { //Se non esiste neanche una transizione chiediamo se ne vuole aggiungere una
                addResponseMessage("Sembra che tu non abbia transizioni per interagire. Vuoi crearne una? " +
                    "Scrivi \"si\" se vuoi crearla, oppure \"no\" se vuoi scrivere da capo la regola.  ");
                this.setState({elementoMancante: "confermaCreazioneOggetto"});
                this.stampaBottoni(scelte);
            }
        } else {
            //Se l'utente sta scrivendo una condizione
            if (this.state.response.tipo === "condizione") {
                /* Setto lo stato della chiave in caso l'utente voglia aggiungere una condizione. */
                let risposta = this.state.response;
                risposta.statoIniziale = this.getTransitionState(risposta.statoIniziale, risposta.numNegazioni);
                this.setState({response: risposta});
            }

            /* Se non ci sono più errori allora comunico che ho tutto, e chiedo conferma per la creazione della regola */
            addResponseMessage("Ho tutto.");

            switch (this.state.response.tipo) {
                case "regola":
                    this.setState({elementoMancante: "confermaCreazioneRegola"});
                    addResponseMessage("I dati della tua regola sono questi: SCENA INIZIALE: " + this.state.response.scenaIniziale +
                        " SCENA FINALE: " + this.state.response.scenaFinale + " NOME TRANSIZIONE: " + this.state.response.oggetto);
                    addResponseMessage("Scrivi \"si\" se vuoi confermare la creazione della regola, oppure \"no\" se vuoi creare una nuova regola. ");
                    this.stampaBottoni(scelte);
                    break;
                case "azione":
                    this.setState({elementoMancante: "confermaAggiuntaAzione"});
                    addResponseMessage("I dati della tua azione sono questi: Passa alla SCENA FINALE: " + this.state.response.scenaFinale);
                    addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi creare una nuova regola. ");
                    this.stampaBottoni(scelte);
                    break;
                case "condizione":
                    if (this.state.response.statoIniziale === "non trovato") {
                        addResponseMessage("Scrivimi qual'è lo stato che deve avere la transizione. Attivabile, non attivabile, visibile, non visibile?");
                        //Serve per far capire quale elemento manca, senza dover mandare al bot un'altra richiesta, ma si può risolvere in locale.
                        this.setState({elementoMancante: "statoIniziale"});
                        this.stampaBottoni(statoTransizione);
                    } else {
                        this.setState({elementoMancante: "confermaAggiuntaCondizione"});
                        addResponseMessage("I dati della tua azione sono questi: Se la transizione " + this.state.response.oggetto +
                            " è " + this.state.response.statoIniziale);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi creare una nuova regola. ");
                        this.stampaBottoni(scelte);
                    }

                    break;
                default:
                    addResponseMessage("C'è stato qualche errore dopo aver preso tutti i dati.");
            }
        }
    }

    /* Crea la regola transizione data la transizione (oggetto) e l'uuid della scena finale. Non abbiamo bisogno di
     * altri campi visto che per la transizione sono sempre li stessi. */
    createTransitionRule(transition, finalSceneUuid) {
        let r;
        r = Rule({
            uuid: uuid.v4(),
            name: 'regola della transizione ' + transition.name,
            event: Action({
                uuid: uuid.v4(),
                subj_uuid: InteractiveObjectsTypes.PLAYER,
                action: EventTypes.CLICK,
                obj_uuid: transition.uuid,
            }),
            actions: Immutable.List([Action({
                uuid: uuid.v4(),
                subj_uuid: InteractiveObjectsTypes.PLAYER,
                action: RuleActionTypes.TRANSITION,
                obj_uuid: finalSceneUuid,
            })]),
        });

        this.props.addNewRule(this.props.scenes.get(CentralSceneStore.getState()), r);

        return r;
    }

    addTransitionAction(rule, finalSceneUuid) {
        let list = rule.get('actions');
        let index = list.size > 0 ? list.get(list.size - 1).get('index') + 1 : 0;
        list = list.push(Action({
            uuid: uuid.v4(),
            subj_uuid: InteractiveObjectsTypes.PLAYER,
            action: RuleActionTypes.TRANSITION,
            obj_uuid: finalSceneUuid,
            index: index,
        }));
        rule = rule.set('actions', list);
        return rule;
    }

    getTransitionState(state, numNegazioni) {
        if (["attivabile"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 === 0) {
                return "ACTIVABLE";
            } else return "NOT_ACTIVABLE";
        }
        if (["non attivabile"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 === 0) {
                return "NOT_ACTIVABLE";
            } else return "ACTIVABLE";
        }
        if (["visibile"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 === 0) {
                return "VISIBLE";
            } else return "INVISIBLE";
        }
        if (["non visibile"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 === 0) {
                return "INVISIBLE";
            } else return "VISIBLE";
        }
        return "non trovato";
    }

    /** SWITCH **/

    /* Metodo per controllare se tutti gli elementi della regola per lo switch che vogliamo creare siano corretti. Se dovesse mancare qualcosa
    * lo settiamo su "elementoMancante" in modo tale da ricavarcelo poi in "handleNewUserMessage" */
    switchElementsControl() {
        let interruttori = this.returnObjectNames("SWITCH");
        let statoInterruttore = ["Acceso", "Spento"];
        let scelte = ["Si", "No"];

        //Controllo se nella scena esistono switch se no chiedo all'utente se ne vuole creare uno di default.
        if (this.returnObjectNames("SWITCH").length > 0) {

            /* Controllo che il NOME dello switch inserito dall'utente esista tra gli switch esistenti nel gioco. */
            if (!this.doesObjectExists(this.state.response.oggetto, "SWITCH")) {
                addResponseMessage("Hai inserito il nome di uno switch che non esiste. Perfavore scegli tra uno di questi: ");
                this.setState({elementoMancante: "oggetto"});
                this.stampaBottoni(interruttori);
            } else {
                /* Setto lo stato inziale e quello finale con valore ON o OFF a seconda di cosa contengono. */
                let risposta = this.state.response;

                risposta.statoIniziale = this.getSwitchState(risposta.statoIniziale, risposta.numNegazioni);
                risposta.statoFinale = this.getSwitchState(risposta.statoFinale, 0);
                this.setState({response: risposta});

                //Se non contengono qualcosa riconducibile ad ON o OFF allora chiedo all'utente di specificarlo
                //Controllo STATO INIZIALE
                if (this.state.response.statoIniziale === "non trovato" && this.state.response.tipo !== "azione") {
                    addResponseMessage("Scrivimi qual'è lo stato inziale dello switch. È acceso o spento?");
                    //Serve per far capire quale elemento manca, senza dover mandare al bot un'altra richiesta, ma si può risolvere in locale.
                    this.setState({elementoMancante: "statoIniziale"});
                    this.stampaBottoni(statoInterruttore);
                } else if (this.state.response.statoFinale === "non trovato" && this.state.response.tipo !== "condizione") {  //Controllo STATO FINALE
                    addResponseMessage("Scrivimi quale sarà lo stato finale dello switch. Vuoi che sia acceso o spento?");
                    //Serve per far capire quale elemento manca, senza dover mandare al bot un'altra richiesta, ma si può risolvere in locale.
                    this.setState({elementoMancante: "statoFinale"});
                    this.stampaBottoni(statoInterruttore);
                } else {
                    // Se HO TUTTO
                    /* Se non ci sono più errori allora comunico che ho tutto, e chiedo conferma per la creazione della regola */
                    addResponseMessage("Ho tutto.");

                    switch (this.state.response.tipo) {
                        case "regola":
                            this.setState({elementoMancante: "confermaCreazioneRegola"});
                            addResponseMessage("I dati della tua regola sono questi: STATO INIZIALE: " + this.state.response.statoIniziale +
                                " STATO FINALE: " + this.state.response.statoFinale + " NOME SWITCH: " + this.state.response.oggetto);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare la creazione della regola, oppure \"no\" se vuoi creare una nuova regola. ");
                            this.stampaBottoni(scelte);
                            break;
                        case "azione":
                            this.setState({elementoMancante: "confermaAggiuntaAzione"});
                            addResponseMessage("I dati della tua azione sono questi: Lo switch: " + this.state.response.oggetto +
                                " cambia stato a: " + this.state.response.statoFinale);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi creare una nuova regola. ");
                            this.stampaBottoni(scelte);
                            break;
                        case "condizione":
                            this.setState({elementoMancante: "confermaAggiuntaCondizione"});
                            addResponseMessage("I dati della tua condizione sono questi: Se lo switch: " + this.state.response.oggetto +
                                " è " + this.state.response.statoIniziale);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta della condizione, oppure \"no\" se vuoi creare una nuova regola. ");
                            this.stampaBottoni(scelte);
                            break;
                    }
                }
            }
        } else {
            //Se non esistono switch gli propongo di crearne uno di default
            addResponseMessage("Sembra che tu non abbia switch per interagire. Vuoi crearne uno? " +
                "Scrivi \"si\" se vuoi crearlo, oppure \"no\" se vuoi scrivere da capo la regola.  ");
            this.setState({elementoMancante: "confermaCreazioneOggetto"});
            this.stampaBottoni(scelte);
        }
    }

    /* Crea la regola per lo switch data lo switch (oggetto), il suo stato iniziale e finale. */
    createSwitchRule(switchObject, initialState, finalState) {
        let r;
        r = Rule({
            uuid: uuid.v4(),
            name: 'regola dell\'interruttore ' + switchObject.name,
            event: Action({
                uuid: uuid.v4(),
                subj_uuid: InteractiveObjectsTypes.PLAYER,
                action: EventTypes.CLICK,
                obj_uuid: switchObject.uuid,
            }),
            condition: new Condition(uuid.v4(), switchObject.uuid, initialState, Operators.EQUAL),
            actions: Immutable.List([Action({
                uuid: uuid.v4(),
                subj_uuid: switchObject.uuid,
                action: RuleActionTypes.CHANGE_STATE,
                obj_uuid: finalState
            })]),
        });
        this.props.addNewRule(this.props.scenes.get(CentralSceneStore.getState()), r);

        return r;
    }

    /* Funzione che controlla se la stringa passata come parametro corrisponde ad uno stato possibile per uno switch.
    * Se lo trova ne restituisce uno di default in modo da sostituirlo anche nella response. Infatti verranno messi ON oppure
    * OFF a seconda di cosa scrive l'utente. */
    getSwitchState(state, numNegazioni) {
        if (["on", "acceso", "attivo", "accendilo", "attivalo", "attivato", "attiva"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 === 0) {
                return "ON"
            } else return "OFF"
        } else {
            if (["off", "spento", "disattivo", "spegnilo", "disattivalo", "disattivato", "disattiva"].includes(state.trim().toLowerCase())) {
                if (numNegazioni % 2 === 0) {
                    return "OFF"
                } else return "ON"
            } else return "non trovato";
        }
    }

    addSwitchAction(rule, switchObject, finalState) {
        let list = rule.get('actions');
        let index = list.size > 0 ? list.get(list.size - 1).get('index') + 1 : 0;
        list = list.push(Action({
            uuid: uuid.v4(),
            subj_uuid: switchObject.uuid,
            action: RuleActionTypes.CHANGE_STATE,
            obj_uuid: finalState,
            index: index,
        }));
        rule = rule.set('actions', list);
        return rule;
    }


    /** PADLOCKS */

    /* Metodo per controllare se tutti gli elementi della regola per il lucchetto che vogliamo creare siano corretti.
    * In realtà per il lucchetto basta controllare se ne esistono o se quello che ha inserito l'utente esiste. */
    padlockElementsControl() {
        let lucchetti = this.returnObjectNames("LOCK");
        let scelte = ["Si", "No"];
        let statoLucchetto = ["Aperto", "Chiuso"];

        //Controllo se nella scena esistono lucchetti se no chiedo all'utente se ne vuole creare uno di default.
        if (this.returnObjectNames("LOCK").length > 0) {

            /* Controllo che il NOME del lucchetto inserito dall'utente esista tra i lucchetti esistenti nel gioco. */
            if (!this.doesObjectExists(this.state.response.oggetto, "LOCK")) {
                addResponseMessage("Hai inserito il nome di un lucchetto che non esiste. Perfavore scegli tra uno di questi: ");
                this.setState({elementoMancante: "oggetto"});
                this.stampaBottoni(lucchetti);
            } else {
                //Se l'utente sta scrivendo una condizione
                if (this.state.response.tipo === "condizione") {
                    /* Setto lo stato del lucchetto in caso l'utente voglia aggiungere una condizione. */
                    let risposta = this.state.response;
                    risposta.statoIniziale = this.getPadlockState(risposta.statoIniziale, risposta.numNegazioni);
                    this.setState({response: risposta});
                }

                // Se HO TUTTO
                /* Se non ci sono più errori allora comunico che ho tutto, e chiedo conferma per la creazione della regola */
                addResponseMessage("Ho tutto.");
                switch (this.state.response.tipo) {
                    case "regola":
                        this.setState({elementoMancante: "confermaCreazioneRegola"});
                        addResponseMessage("Presumo che se stai scrivendo una regola base per il lucchetto il tuo intento è quello di " +
                            "sbloccarlo quando lo clicchi. " +
                            "Dunque: I dati della tua regola sono questi: STATO FINALE: " + this.state.response.statoFinale +
                            " NOME LUCCHETTO: " + this.state.response.oggetto);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare la creazione della regola, oppure \"no\" se vuoi creare una nuova regola. ");
                        this.stampaBottoni(scelte);
                        break;
                    case "azione":
                        this.setState({elementoMancante: "confermaAggiuntaAzione"});
                        addResponseMessage("I dati della tua azione sono questi: Il giocatore sblocca il lucchetto: " + this.state.response.oggetto);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi creare una nuova regola. ");
                        this.stampaBottoni(scelte);
                        break;
                    case "condizione":
                        //Se non contiene qualcosa riconducibile ad APERTO o CHIUSO allora chiedo all'utente di specificarlo
                        //Controllo STATO INIZIALE
                        if (this.state.response.statoIniziale === "non trovato") {
                            addResponseMessage("Scrivimi qual'è lo stato che dovrà avere il lucchetto. È aperto o chiuso?");
                            //Serve per far capire quale elemento manca, senza dover mandare al bot un'altra richiesta, ma si può risolvere in locale.
                            this.setState({elementoMancante: "statoIniziale"});
                            this.stampaBottoni(statoLucchetto);
                        } else {
                            this.setState({elementoMancante: "confermaAggiuntaCondizione"});
                            addResponseMessage("I dati della tua condizione sono questi: Se il lucchetto: " + this.state.response.oggetto
                                + " è " + this.state.response.statoIniziale);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta della condizione, oppure \"no\" se vuoi creare una nuova regola. ");
                            this.stampaBottoni(scelte);
                        }
                        break;
                }
            }
        } else {
            //Se non esistono lucchetti gli propongo di crearne uno di default
            addResponseMessage("Sembra che tu non abbia lucchetti per interagire. Vuoi crearne uno? " +
                "Scrivi \"si\" se vuoi crearlo, oppure \"no\" se vuoi scrivere da capo la regola.  ");
            this.setState({elementoMancante: "confermaCreazioneOggetto"});
            this.stampaBottoni(scelte);
        }
    }

    /* Crea la regola per il lucchetto dato il lucchetto (oggetto). */
    createPadlockRule(lucchetto) {
        let r;

        r = Rule({
            uuid: uuid.v4(),
            name: 'regola del lucchetto ' + lucchetto.name,
            event: Action({
                uuid: uuid.v4(),
                subj_uuid: InteractiveObjectsTypes.PLAYER,
                action: EventTypes.CLICK,
                obj_uuid: lucchetto.uuid,
            }),
            actions: Immutable.List([Action({
                uuid: uuid.v4(),
                subj_uuid: InteractiveObjectsTypes.PLAYER,
                action: RuleActionTypes.UNLOCK_LOCK,
                obj_uuid: lucchetto.uuid,
            })]),
        });

        this.props.addNewRule(this.props.scenes.get(CentralSceneStore.getState()), r);
        return r;
    }

    addPadlockAction(rule, padlockObject) {
        let list = rule.get('actions');
        let index = list.size > 0 ? list.get(list.size - 1).get('index') + 1 : 0;
        list = list.push(Action({
            uuid: uuid.v4(),
            subj_uuid: InteractiveObjectsTypes.PLAYER,
            action: RuleActionTypes.UNLOCK_LOCK,
            obj_uuid: padlockObject.uuid,
            index: index,
        }));
        rule = rule.set('actions', list);
        return rule;
    }

    getPadlockState(state, numNegazioni) {
        if (["aperto"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 < 0) {
                return "UNLOCKED";
            } else return "LOCKED";
        } else {
            if (["chiuso"].includes(state.trim().toLowerCase())) {
                if (numNegazioni % 2 < 0) {
                    return "LOCKED";
                } else {
                    return "UNLOCKED";
                }
            } else return "non trovato";
        }
    }

    /** KEYS */

    /* Metodo per controllare se tutti gli elementi della regola per la chiave che vogliamo creare siano corretti.
    * In realtà per la chiave basta controllare se ne esistono o se quella che ha inserito l'utente esiste. */
    keyElementControl() {
        let chiavi = this.returnObjectNames("KEY");
        let scelte = ["Si", "No"];
        let statoChiave = ["Raccolta", "Non raccolta"];

        //Controllo se nella scena esistono chiavi se no chiedo all'utente se ne vuole creare una di default.
        if (this.returnObjectNames("KEY").length > 0) {

            /* Controllo che il NOME della chiave inserito dall'utente esista tra le chiavi esistenti nel gioco. */
            if (!this.doesObjectExists(this.state.response.oggetto, "KEY")) {
                addResponseMessage("Hai inserito il nome di una chiave che non esiste. Perfavore scegli tra una di queste: ");
                this.setState({elementoMancante: "oggetto"});
                this.stampaBottoni(chiavi);
            } else {
                //Se l'utente sta scrivendo una condizione
                if (this.state.response.tipo === "condizione") {
                    /* Setto lo stato della chiave in caso l'utente voglia aggiungere una condizione. */
                    let risposta = this.state.response;
                    risposta.statoIniziale = this.getKeyState(risposta.statoIniziale, risposta.numNegazioni);
                    this.setState({response: risposta});
                }

                // Se HO TUTTO
                /* Se non ci sono più errori allora comunico che ho tutto, e chiedo conferma per la creazione della regola */
                addResponseMessage("Ho tutto.");
                switch (this.state.response.tipo) {
                    case "regola":
                        this.setState({elementoMancante: "confermaCreazioneRegola"});
                        addResponseMessage("Presumo che se stai scrivendo una regola base per la chiave, il tuo intento è quello di " +
                            "raccoglierla quando la clicchi. " +
                            "Dunque: I dati della tua regola sono questi: AZIONE: raccogli" +
                            " NOME CHIAVE: " + this.state.response.oggetto);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare la creazione della regola, oppure \"no\" se vuoi creare una nuova regola. ");
                        this.stampaBottoni(scelte);
                        break;
                    case "azione":
                        this.setState({elementoMancante: "confermaAggiuntaAzione"});
                        addResponseMessage("I dati della tua azione sono questi: Il giocatore raccoglie la chiave: " + this.state.response.oggetto);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi andare avanti. ");
                        this.stampaBottoni(scelte);
                        break;
                    case "condizione":
                        //Se non contiene qualcosa riconducibile ad APERTO o CHIUSO allora chiedo all'utente di specificarlo
                        //Controllo STATO INIZIALE
                        if (this.state.response.statoIniziale === "non trovato") {
                            addResponseMessage("Scrivimi qual'è lo stato che dovrà avere la chiave. Raccolta o non raccolta?");
                            //Serve per far capire quale elemento manca, senza dover mandare al bot un'altra richiesta, ma si può risolvere in locale.
                            this.setState({elementoMancante: "statoIniziale"});
                            this.stampaBottoni(statoChiave);
                        } else {
                            this.setState({elementoMancante: "confermaAggiuntaCondizione"});
                            addResponseMessage("I dati della tua condizione sono questi: Se la chiave: " + this.state.response.oggetto + " è " +
                                this.state.response.statoIniziale);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta della condizione, oppure \"no\" se vuoi andare avanti. ");
                            this.stampaBottoni(scelte);
                        }
                }
            }
        } else {
            //Se non esistono chiavi gli propongo di crearne una di default
            addResponseMessage("Sembra che tu non abbia chiavi per interagire. Vuoi crearne una? " +
                "Scrivi \"si\" se vuoi crearla, oppure \"no\" se vuoi scrivere da capo la regola.  ");
            this.setState({elementoMancante: "confermaCreazioneOggetto"});
            this.stampaBottoni(scelte);
        }
    }

    /* Crea la regola per la chiave data la chiave (oggetto). */
    createKeyRule(chiave) {
        let r;

        r = Rule({
            uuid: uuid.v4(),
            name: 'regola della chiave ' + chiave.name,
            event: Action({
                uuid: uuid.v4(),
                subj_uuid: InteractiveObjectsTypes.PLAYER,
                action: EventTypes.CLICK,
                obj_uuid: chiave.uuid,
            }),
            actions: Immutable.List([Action({
                uuid: uuid.v4(),
                subj_uuid: InteractiveObjectsTypes.PLAYER,
                action: RuleActionTypes.COLLECT_KEY,
                obj_uuid: chiave.uuid,
            })]),
        });

        this.props.addNewRule(this.props.scenes.get(CentralSceneStore.getState()), r);

        return r;
    }

    addKeyAction(rule, keyObject) {
        let list = rule.get('actions');
        let index = list.size > 0 ? list.get(list.size - 1).get('index') + 1 : 0;
        list = list.push(Action({
            uuid: uuid.v4(),
            subj_uuid: InteractiveObjectsTypes.PLAYER,
            action: RuleActionTypes.COLLECT_KEY,
            obj_uuid: keyObject.uuid,
            index: index,
        }));
        rule = rule.set('actions', list);
        return rule;
    }

    getKeyState(state, numNegazioni) {
        if (["raccolta"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 === 0) {
                return "COLLECTED"
            } else {
                return "NOT COLLECTED"
            }
        } else return "non trovato";
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
                    <img className={"action-buttons"} src={"icons/icons8-waste-50.png"}
                         alt={'Cancella l\'azione'}/>
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
                    <img className={"action-buttons"} src={"icons/icons8-waste-50.png"}
                         alt={'Cancella la condizione'}/>
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
                        <button className={"select-file-btn btn btnNext"} id={"btnNext" + rule.uuid}
                                title={"Avanti"}
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
                originalText={subject == null ? "" : toString.objectTypeToString(subject.type) + subject.name}
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

        switch (this.props.action.action) {
            case RuleActionTypes.INCREASE_STEP:
            case RuleActionTypes.DECREASE_STEP:
                let subj = this.props.action.subj_uuid;
                let step = 1;
                if (subj && this.props.interactiveObjects.has(subj)) {
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
            case RuleActionTypes.INCREASE:
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
            case RuleActionTypes.TRIGGERS:
                let rule = sceneRulesOnly(this.props).get(this.props.action.obj_uuid); //riferimento alla regola
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
                        originalText={rule == null ? "" : rule.name}
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

        if (this.props.audios.has(uuid)) {
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
                            if (action.subj_uuid) {
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

    updateNumericRule(props, value) {
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


    render() {
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
                          (e) => {
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
        return <div className={css} key={'numeric-input' + this.props.rule.uuid + this.props.role}>
                <span>
                <span className={"eudObjectString"}>
                <span>{text == "" ? "[un valore]" : text}</span>
                <input type={"text"}
                       className={"eudObjectString"} placeholder={"[digita un numero]"}
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

        let {items: items, graph: graph} = getCompletions({
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
        });
        let li = listableItems(items.valueSeq(), this.props);  //trasformo in un oggetto che può essere inserito nel dropdown

        if (this.props.interactiveObjects.size === 0) {
            graph = 0;
        }
        if (li.toArray()[0]) { //controllo che ci siano elementi da mostrare
            let info = li.toArray()[0].props.item;
        } else graph = 0;
        if (graph != 0) { //ho bisogno del grafo

            //in questi due casi gli oggetti fanno tutti parte della scena corrente
            if (graph === 2) {
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
            if (graph === 3) {
                return <div className={"eudCompletionPopupForGraph"}>
                    <span>{this.props.scenes.get(CentralSceneStore.getState()).name}</span>
                    <ul>
                        {listableItems(sceneObjectsOnly(this.props).valueSeq(), this.props)}
                    </ul>

                    <ul>
                        <div className={"line"}/>
                        {li}
                    </ul>
                </div>
            }

            //Se ho necessità di un grafo devo scindere gli items in due gruppi: un gruppo con gli Interactive object
            //che hanno bisogno di un nome della scena, e tutti gli altri

            //Primo gruppo, TUTTI gli oggetti appartenenti alle scene
            let sceneObj = this.props.interactiveObjects.filter(x =>
                x.type !== InteractiveObjectsTypes.POINT_OF_INTEREST);
            //mi prendo le scene coinvolte
            let scenes = returnScenes(sceneObj, this.props);

            //Secondo gruppo, tutti gli altri oggetti, quindi mi basta filtrare quelli che sono presenti in sceneObj
            let notSceneObj = items.filter(d => !sceneObj.includes(d));
            //trasformo in un oggetto che può essere inserito nel dropdown
            let liNotSceneObj = listableItems(notSceneObj.valueSeq(), this.props);

            let fragment = scenes.map(element => {
                var obj = mapSceneWithObjects(this.props, element, sceneObj);
                let objects = listableItems(obj, this.props); //trasformo in un oggetto inseribile nel dropdown
                let scene_name = objects != "" ? element.name : ""; //se ho risultati metto il nome della scena, altrimenti nulla
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
        } else { //caso di verbi, operatori etc..
            return <div className={"eudCompletionPopup"}>
                <ul>
                    {li}
                </ul>
            </div>
        }
    }
}

class ButtonObjectNames extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return this.returnObjectButtons(this.props.oggetti);
    }

    /* Ritorna i bottoni degli oggetti richiesti della scena corrente. */
    returnObjectButtons(nomiOggetti) {
        return <div className={"divBottoniOggettoBot"}>
            {nomiOggetti.map(o =>
                <button className={"bottoniOggettoBot"} key={o}
                        onClick={() => this.props.oggettoCliccato(o)}>{o}
                </button>)}
        </div>
    }

}

/* Funzione per fare la richiesta a wit.ai e restituire l'intent di risposta trovato (Luca) */
async function sendRequest(sentence, tipo) {
    let CLIENT_TOKEN = "ZURQC5XOJEARGLPUHYYUV4V6HH5IBR6K"; //Token bot Wit.ai
    /* Variabile che verrà restituita dal bot */
    let risposta = {
        intent: "",
        scenaIniziale: "",
        scenaFinale: "",
        statoIniziale: "",
        statoFinale: "",
        oggetto: "",
        tipo: tipo,
        numNegazioni: sentence.split("non").length - 1
    };

    const q = encodeURIComponent(sentence);
    const uri = 'https://api.wit.ai/message?v=20200513&q=' + q;
    const auth = 'Bearer ' + CLIENT_TOKEN;

    /* Se il bot non trova qualche pezzo allora il campo resta come inizializzato cioè: "" */
    return await fetch(uri, {headers: {Authorization: auth}})
        .then(res => res.json())
        .then(res => {
                if (res.intents !== undefined) {
                    risposta.intent = res.intents[0].name;

                    //Transizione
                    if (res.entities["scenaIniziale:scenaIniziale"] !== undefined) {
                        risposta.scenaIniziale = res.entities["scenaIniziale:scenaIniziale"][0].value;
                    }
                    if (res.entities["scenaFinale:scenaFinale"] !== undefined) {
                        risposta.scenaFinale = res.entities["scenaFinale:scenaFinale"][0].value;
                    }
                    if (res.entities["oggetto:oggetto"] !== undefined) {
                        risposta.oggetto = res.entities["oggetto:oggetto"][0].value;
                    }
                    if (res.entities["statoIniziale:statoIniziale"] !== undefined) {
                        risposta.statoIniziale = res.entities["statoIniziale:statoIniziale"][0].value;
                    }

                    //Switch
                    if (risposta.intent === "interazioneSwitch") {
                        if (res.entities["statoFinale:statoFinale"] !== undefined) {
                            risposta.statoFinale = res.entities["statoFinale:statoFinale"][0].value;
                        }
                    }

                } else {
                    console.log("Ricevuto intent sbagliato da Wit.AI");
                }
                return risposta;
            }
        )
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
function returnScenes(items, props) {
    if (items.size == 0) { //se la lista è vuota non restituisco niente
        return "";
    }
    let scenes = [];
    let array = items.toArray();

    for (var i = 0; i < array.length; i++) {
        if (array[i]) {
            let scene_uuid = ObjectToSceneStore.getState().get(array[i].uuid);
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
function mapSceneWithObjects(props, scene, objects) {
    let return_result = [];
    let array = objects.toArray();
    for (var i = 0; i < objects.size; i++) {
        if (scene.uuid === ObjectToSceneStore.getState().get(array[i].uuid)) {
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
        let text = toString.objectTypeToString(this.props.item.type) + this.props.item.name;

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
 * @returns {the list of possible completions, int that indicates if a graph is necessary}
 */
function getCompletions(props) {
    let graph = 0;
    switch (props.role) {
        case "subject":
            graph = 1;
            if (props.rulePartType === 'event') { // event subject: player, game, audios videos, scene objects
                //[Vittoria] ordino in modo tale che il player sia sempre in cima alla lista
                //il merge delle scene lo faccio nella render con graph
                graph = 3;
                let items = props.assets.filter(x => x.type === 'video').merge(props.audios).set(
                    InteractiveObjectsTypes.PLAYER,
                    InteractiveObject({
                        type: InteractiveObjectsTypes.PLAYER,
                        uuid: InteractiveObjectsTypes.PLAYER,
                        name: ""
                    }),
                ).sort(function (a) {
                    if (a.type === "PLAYER") {
                        return -1
                    } else
                        return 1;
                });
                return {items, graph};
            } else {
                //soggetto nella seconda parte della frase
                let subjects = props.interactiveObjects.filter(x =>
                    x.type !== InteractiveObjectsTypes.POINT_OF_INTEREST).set(
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
                let result = props.rulePartType === 'condition' ? subjects : subjects.merge(props.scenes);
                let items = result.sort(function (a) {
                    //ordino il soggetto della seconda parte della frase in modo tale che mi mostri prima gli oggetti della scena
                    // e il player
                    if (sceneObjectsOnly(props).includes(a) || a.type === "PLAYER") {
                        return -1
                    } else
                        return 1;
                });
                return {items, graph}
            }


        case "object":
            // the CLICK action is restricted to current scene objects only, might move to switch case later
            if (props.verb.action === RuleActionTypes.CLICK) {
                console.log("Case object scene object only: ", sceneObjectsOnly(props));
                graph = 2;
                let items = sceneObjectsOnly(props);
                return {items, graph};
            }


            if (props.verb.action === RuleActionTypes.TRIGGERS) {
                graph = 2;
                let items = sceneRulesOnly(props);
                return {items, graph}
            }

            let allObjects = props.interactiveObjects.merge(props.scenes).merge(props.assets).merge(props.audios);
            allObjects = allObjects.merge(filterValues(props.subject, props.verb));

            if (props.verb.action) {
                let objType = RuleActionMap.get(props.verb.action).obj_type;
                allObjects = allObjects.filter(x => objType.includes(x.type));
            }

            //complemento oggetto, ordino sempre sulla base degli oggetti nella scena
            let items = allObjects.sort(function (a) {
                if (sceneObjectsOnly(props).includes(a)) {
                    return -1
                } else
                    return 1;
            });

            //ulteriore controllo per vedere se nella lista restituita ci sono oggetti
            if (items.some(a => typeof a == props.interactiveObjects)) {
                graph = 2;
            }

            //se il verbo è spostarsi verso allora faccio in modo che non appaia la scena corrente (non mi posso
            // spostare nella scena in cui sono già)
            if (props.verb.action === RuleActionTypes.TRANSITION) {
                let current_scene_uuid = props.scenes.get(CentralSceneStore.getState()).uuid;
                items = items.filter(x =>
                    !x.includes(current_scene_uuid)
                );
            }

            return {items, graph};

        case "operation":
            if (props.rulePartType === 'event') {
                if (props.subject) {
                    let items = RuleActionMap
                        //.filter(x => x.uuid === RuleActionTypes.CLICK || x.uuid === RuleActionTypes.IS)
                        .filter(x => x.subj_type.includes(props.subject.type));

                    return {items, graph}
                }
                let items = RuleActionMap.filter(x => x.uuid === RuleActionTypes.CLICK || x.uuid === RuleActionTypes.IS);
                return {items, graph};
            }
            if (props.subject) {
                //se ho come soggetto il gioco allora mostro solo avvia come verbo
                if (props.subject.type === InteractiveObjectsTypes.GAME) {
                    let items = RuleActionMap.filter(x => x.uuid === RuleActionTypes.TRIGGERS);
                    return {items, graph};
                }
                let items = props.subject ? RuleActionMap.filter(x => x.subj_type.includes(props.subject.type)) : RuleActionMap;
                return {items, graph};
            } else {
                let items = props.subject ? RuleActionMap.filter(x => x.subj_type.includes(props.subject.type)) : RuleActionMap;
                return {items, graph};
            }

        case "operator": {
            let items = props.subject ? OperatorsMap.filter(x => x.subj_type.includes(props.subject.type)) : OperatorsMap;
            return {items, graph};
        }
        case 'value': {
            let items = props.subject ? ValuesMap.filter(x => x.subj_type.includes(props.subject.type)) : ValuesMap;
            return {items, graph};
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
function sceneObjectsOnly(props) {
    let sceneObjects = scene_utils.allObjects(props.scenes.get(CentralSceneStore.getState()));
    return props.interactiveObjects.filter(x => sceneObjects.includes(x.uuid));
}

function sceneRulesOnly(props) {
    let current_scene = props.scenes.get(CentralSceneStore.getState());
    let rules = props.rules.filter(x => current_scene.get('rules').includes(x.uuid));
    let current_rule_uuid = props.rule._map._root.entries[0][1];
    //filtro in modo tale da non avere la regola corrente tra le completions, altrimenti si creerebbe un loop
    return rules.filter(x =>
        !x.includes(current_rule_uuid)
    );
}