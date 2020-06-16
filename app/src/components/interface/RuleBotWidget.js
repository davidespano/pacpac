import React, {Component} from 'react';
import RuleActionTypes from "../../rules/RuleActionTypes";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes"
import Immutable from "immutable";
import Action from "../../rules/Action"
import Rule from "../../rules/Rule";
import rules_utils from "../../rules/rules_utils";
import {Operators, SuperOperators} from "../../rules/Operators";
import Condition from "../../rules/Condition";
import SuperCondition from "../../rules/SuperCondition";
import CentralSceneStore from "../../data/CentralSceneStore";
import {addResponseMessage, renderCustomComponent, Widget} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import EventTypes from "../../rules/EventTypes";
import Transition from "../../interactives/Transition";
import Switch from "../../interactives/Switch";
import Lock from "../../interactives/Lock";
import Key from "../../interactives/Key";
import Actions from "../../actions/Actions";
import ObjectToSceneStore from "../../data/ObjectToSceneStore";
import scene_utils from "../../scene/scene_utils";

let uuid = require('uuid');

export default class RuleBotWidget extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let icon = "icons/icon_chat-bot.png";
        return <Widget
            title={"PAC-PAC BOT"}
            subtitle={""}
            profileAvatar={icon}
            handleNewUserMessage={this.handleNewUserMessage}
            senderPlaceHolder={"Scrivi qui la regola"}/>;
    }

    /** Luca - Widget Bot */

    /* Messaggio di benvenuto o bentornato. Primo metodo effettuato per il bot. */
    componentDidMount() {
        /* Se l'elementoMancante è diverso da "" allora vuol dire che stiamo tornando dalla geometryMode. */
        if (this.props.ruleBot.elementoMancante === "") {
            addResponseMessage("Benvenuto nel bot delle regole di Pac-Pac, scrivi subito la prima regola! Ricorda che puoi scrivere" +
                "\"help\" se hai bisogno di aiuto per l'utilizzo del bot oppure puoi scrivere \"reset\" in qualsiasi momento per resettare tutto e " +
                "scrivere una regola da capo. ");
        } else {
            /* "else" eseguito quando torniamo dalla geometryMode.
             * Delay di millisecondi, si può mettere qualsiasi delay, anche molto più piccolo, è giusto per aspettare un momento prima di entrare in queryControl().*/
            setTimeout(() => {
                addResponseMessage("Bentornato!");
                this.queryControl();
            }, 0.0000000001);
        }
    }

    /* Metodo per inviare un messaggio. Capire se il bot ha trovato una transizione, se quella transizione ha tutti i
    campi corretti allora creo la scena con tutto corretto, se no risolvo i conflitti in locale. */
    handleNewUserMessage = async (newMessage) => {
        let scelte = ["Si", "No"];
        /* Si da l'opportunità all'utente di resettare in ogni momento la regola che sta scrivendo e di scriverne una da capo. */
        if (newMessage.trim().toLowerCase() !== "reset") {
            /* Si da l'opportunità all'utente di richiedere un messaggio di help in ogni momento della creazione della regola. */
            if (newMessage.trim().toLowerCase() !== "help") {
                /* La prima query verrà sempre mandata al bot. */
                if (this.props.ruleBot.elementoMancante === "") {
                    let risposta = await sendRequest(newMessage, this.props.ruleBot.tipoRisposta);
                    await Actions.updateBotResponse(risposta);
                } else {
                    /* Se dopo aver mandato al bot la prima query ci dovesse mancare qualche elemento per la regola allora risolviamo localmente, modificando
                    * lo stato di RuleBot, successivamente processiamo ciò che abbiamo scritto in "queryControl". */

                    /* A seconda di cosa viene settato nel queryControl si esegue uno di questi case. */
                    switch (this.props.ruleBot.elementoMancante) {
                        case "scenaFinale":
                            await Actions.updateBotFinalScene(newMessage);
                            break;
                        case "oggetto": //Nome dell'oggetto
                            await Actions.updateBotObject(newMessage);
                            break;
                        case "statoIniziale":
                            await Actions.updateBotInitialState(newMessage);
                            break;
                        case "statoFinale":
                            await Actions.updateBotFinalState(newMessage);
                            break;
                        case "confermaCreazioneOggetto":
                            /* Quando la scena non ha l'oggetto che serve per la regola  allora il bot chiede all'utente se
                               vuole crearlo di default. In caso affermativo viene creato e posto come oggetto della regola
                               che l'utente sta creando. In caso negativo invece viene resettata la regola e viene data la
                               possibilità di crearne una da zero. */
                            if (newMessage.trim().toLowerCase() === "si") {
                                //Creo l'oggetto di default e salvo il suo nome in "this.props.ruleBot.oggetto".
                                Actions.updateBotObject(await this.createDefaultObject(this.props, this.getObjectTypeFromIntent(this.props.ruleBot.intent)));
                                addResponseMessage(this.getObjectTypeFromIntent(this.props.ruleBot.intent) + " aggiunta");
                                /* Dopo aver aggiunto l'oggetto mancante, viene richiesto se gli si vuole aggiungere la geometria. */
                                addResponseMessage("Per poter usare questo oggetto hai bisogno di aggiungergli una geometria. " +
                                    "Vuoi andare all'editor di geometria?");
                                Actions.updateBotMissingElement("richiestaGeometria");
                                this.printButtonsOnChatBot(scelte);
                            } else if (newMessage.trim().toLowerCase() === "no") {
                                this.resetAllRuleBotData();
                            } else {
                                //In caso l'utente non scriva ne si e ne no
                                addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            }
                            return;
                        case "richiestaGeometria":
                            if (newMessage.trim().toLowerCase() === "si") {
                                /* Se l'utente decide di creare la geometria, allora aggiorniamo l'oggetto corrente, 
                                in modo tale da averlo come oggetto nella geometryMode e la avviamo. */
                                Actions.updateCurrentObject(this.returnObjectByName(this.props.ruleBot.oggetto, this.getObjectTypeFromIntent(this.props.ruleBot.intent)));
                                this.props.switchToGeometryMode();
                                return; //Non ho bisogno di andare al query control, questo perchè se no vengono stampati i bottoni con l'handleNewMessage vecchio
                            } else if (newMessage.trim().toLowerCase() === "no") {
                                addResponseMessage("Va bene continuiamo con la creazione della regola");
                            } else {
                                addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            }
                            break;
                        case "confermaCreazioneRegola":
                            if (newMessage.trim().toLowerCase() === "si") {
                                //Creo la regola
                                this.createRuleFromRuleBot();
                                Actions.updateBotMissingElement("richiestaAzioneAggiuntiva");
                                //Dopo creata, chiediamo all'utente se vuole aggiungere un'azione.
                                addResponseMessage("Vuoi aggiungere una nuova azione legata a quest'ultima regola creata?");
                                this.printButtonsOnChatBot(scelte); //Stampa "si" o "no" con i bottoni
                            } else if (newMessage.trim().toLowerCase() === "no") {
                                this.resetAllRuleBotData();
                            } else {
                                addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            }
                            return; //Non devo fare il queryControl
                        case "richiestaAzioneAggiuntiva":
                            if (newMessage.trim().toLowerCase() === "si") {
                                addResponseMessage("Scrivi l'azione aggiuntiva.");
                                /* Resetto i dati che avevo per la regola precedente, questo perchè mi servono i campi
                                * puliti per popolarli con i dati dell'azione. */
                                this.resetRuleBotResponseData();
                                Actions.updateBotResponseType("azione"); //Setto che la risposta sarà un azione da aggiungere e non una regola intera;
                            } else if (newMessage.trim().toLowerCase() === "no") {
                                addResponseMessage("Vuoi aggiungere una nuova condizione legata a quest'ultima regola creata?");
                                Actions.updateBotMissingElement("richiestaCondizioneAggiuntiva");
                                this.printButtonsOnChatBot(scelte);
                            } else {
                                addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            }
                            return; //Non devo fare il queryControl
                        case "confermaAggiuntaAzione":
                            if (newMessage.trim().toLowerCase() === "si") {
                                this.createActionFromResponse();

                                addResponseMessage("Vuoi aggiungere una nuova azione?");
                                Actions.updateBotMissingElement("richiestaAzioneAggiuntiva");
                                this.printButtonsOnChatBot(scelte);
                            } else if (newMessage.trim().toLowerCase() === "no") {
                                addResponseMessage("Vuoi scriverne una nuova?");
                                Actions.updateBotMissingElement("richiestaAzioneAggiuntiva");
                                this.printButtonsOnChatBot(scelte);
                            } else {
                                addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            }
                            return; //Non devo fare il queryControl
                        case "richiestaCondizioneAggiuntiva":
                            if (newMessage.trim().toLowerCase() === "si") {
                                addResponseMessage("Scrivi la condizione aggiuntiva.");
                                this.resetRuleBotResponseData();
                                Actions.updateBotResponseType("condizione"); //Setto che la risposta sarà un azione o una condizione da aggiungere e non una regola intera;
                            } else if (newMessage.trim().toLowerCase() === "no") {
                                this.resetAllRuleBotData();
                            } else {
                                addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            }
                            return; //Non devo fare il queryControl
                        case "confermaAggiuntaCondizione":
                            if (newMessage.trim().toLowerCase() === "si") {
                                this.createConditionFromResponse();

                                addResponseMessage("Vuoi aggiungere una nuova condizione?");
                                Actions.updateBotMissingElement("richiestaCondizioneAggiuntiva");
                                this.printButtonsOnChatBot(scelte);
                            } else if (newMessage.trim().toLowerCase() === "no") {
                                addResponseMessage("Vuoi aggiungere una nuova condizione?");
                                Actions.updateBotMissingElement("richiestaCondizioneAggiuntiva");
                                this.printButtonsOnChatBot(scelte);
                            } else {
                                addResponseMessage("Non ho capito. Per cortesia scrivere solo \"si\" o \"no\".");
                            }
                            return; //Non devo fare il queryControl
                        default:
                            addResponseMessage("Ci dev'essere qualche errore, l'elemento mancante corrente non esiste. ")
                    }
                }
                /* Controlliamo tutti i dati di response. */
                this.queryControl();

            } else {
                addResponseMessage("Questo bot ti permetterà di scrivere le regole per il tuo gioco usando semplicemente " +
                    "il linguaggio naturale. Una regola è anche formata da azioni e condizioni. Con il bot potrai aggiungerle dopo aver " +
                    "scritto la regola generale. Un esempio di regola è questo:\"Passa alla scena1 quando premo la transizione1.\". " +
                    "Dopodichè ti verrà chiesto se vuoi aggiungere azioni. Un esempio di azione è questo:" +
                    "\"attiva lo switch1\". Infine dopo le azioni potrai aggiungere le condizioni. Un esempio di condizione è:" +
                    "\"Se la chiave1 è raccolta\". Ora prova tu a scrivere una regola!");
            }
        } else {
            this.resetRuleBotResponseData();
            Actions.updateBotResponseType("regola"); //Setto che la risposta non sarà un azione da aggiungere, ma una regola intera;
            addResponseMessage("La regola è stata resettata! Puoi scriverne una da capo quando vuoi.");
        }
    };

    /* Wit.ai restituisce l'intent della regola, cioè se si tratta di una transizione, di un interazione con uno switch,
    * con un lucchetto o con una chiave. A seconda di questo si manipolano oggetti inerenti, cioè transizioni, switch,
    * lucchetti o chiavi. Con questo metodo restituiamo appunto il tipo, sottoforma di stringa. */
    getObjectTypeFromIntent(intent) {
        switch (intent) {
            case "transizione":
                return InteractiveObjectsTypes.TRANSITION;
            case "interazioneSwitch":
                return InteractiveObjectsTypes.SWITCH;
            case "interazioneLucchetto":
                return InteractiveObjectsTypes.LOCK;
            case "interazioneChiave":
                return InteractiveObjectsTypes.KEY;
            default:
                addResponseMessage("Errore: nessun tipo di oggetto rilevato.")
        }
    }

    /* Metodo utile per creare una regola a seconda degli elementi che abbiamo ricevuto da Wit.ai e che abbiamo salvato
    nello store RuleBot. */
    createRuleFromRuleBot() {
        /* Per creare la regola ho bisogno di ricavarmi l'oggetto in se, non mi basta infatti solo il nome.
        * Dunque richiamo la funzione "returnObjectByName" che grazie al tipo e al nome dell'oggetto mi restituisce
        * l'oggetto corretto. */
        let object = this.returnObjectByName(this.props.ruleBot.oggetto, this.getObjectTypeFromIntent(this.props.ruleBot.intent));
        //Creo la regola
        switch (this.props.ruleBot.intent) {
            case "transizione":
                let finalSceneUuid = scene_utils.returnUuidSceneByName(this.props.ruleBot.scenaFinale, this.props.scenes);
                Actions.updateBotLastRule(this.createTransitionRule(object, finalSceneUuid));
                break;
            case "interazioneSwitch":
                Actions.updateBotLastRule(this.createSwitchRule(object, this.props.ruleBot.statoIniziale, this.props.ruleBot.statoFinale));
                break;
            case "interazioneLucchetto":
                Actions.updateBotLastRule(this.createPadlockRule(object));
                break;
            case "interazioneChiave":
                Actions.updateBotLastRule(this.createKeyRule(object));
                break;
            default:
                addResponseMessage("C'è stato qualche problema nella creazione della regola.");
                return;
        }
        addResponseMessage("Regola creata!");
    }

    /* Metodo utile per creare un'azione a seconda degli elementi che abbiamo ricevuto da Wit.ai. */
    createActionFromResponse() {
        let newRule;
        //Aggiungo l'azione
        switch (this.props.ruleBot.intent) {
            case "transizione":
                /* Le azioni di una transizione corrispondono semplicemente al passaggio da una scena all'altra.
                 Non vengono coinvolti oggetti transizione */
                let finalSceneUuid = scene_utils.returnUuidSceneByName(this.props.ruleBot.scenaFinale, this.props.scenes);
                newRule = this.addTransitionAction(this.props.ruleBot.ultimaRegolaCreata, finalSceneUuid);
                break;
            case "interazioneSwitch":
                let switchObj = this.returnObjectByName(this.props.ruleBot.oggetto, this.getObjectTypeFromIntent(this.props.ruleBot.intent));
                newRule = this.addSwitchAction(this.props.ruleBot.ultimaRegolaCreata, switchObj, this.props.ruleBot.statoFinale);
                break;
            case "interazioneLucchetto":
                let padlockObject = this.returnObjectByName(this.props.ruleBot.oggetto, this.getObjectTypeFromIntent(this.props.ruleBot.intent));
                newRule = this.addPadlockAction(this.props.ruleBot.ultimaRegolaCreata, padlockObject, this.props.ruleBot.statoFinale);
                break;
            case "interazioneChiave":
                let keyObject = this.returnObjectByName(this.props.ruleBot.oggetto, this.getObjectTypeFromIntent(this.props.ruleBot.intent));
                newRule = this.addKeyAction(this.props.ruleBot.ultimaRegolaCreata, keyObject, this.props.ruleBot.statoFinale);
                break;
            default:
                addResponseMessage("C'è stato qualche problema nell'aggiunta dell'azione.")
        }
        Actions.updateBotLastRule(newRule);
        this.props.ruleEditorCallback.eudUpdateRule(newRule);
        addResponseMessage("Azione corrispondente aggiunta.");
    }

    /* Metodo utile per creare una condizione a seconda degli elementi che abbiamo ricevuto da Wit.ai. */
    createConditionFromResponse() {
        let newRule;
        let object;

        /* Tutto ciò di cui abbiamo bisogno è l'oggetto a cui controlliamo lo stato, a seconda dellla quale la condizione
        * è verificata o meno. Una volta ottenuto l'oggetto lo passiamo al metodo che aggiunge effettivamente
        * (tramite uuid dell'oggetto in questione, la regola generale e lo stato che deve avere l'oggetto)
        * ad una regola esistente una condizione. */
        object = this.returnObjectByName(this.props.ruleBot.oggetto, this.getObjectTypeFromIntent(this.props.ruleBot.intent));
        newRule = this.addObjectCondition(this.props.ruleBot.ultimaRegolaCreata, object.uuid, this.props.ruleBot.statoIniziale);

        Actions.updateBotLastRule(newRule);
        this.props.ruleEditorCallback.eudUpdateRule(newRule);
        addResponseMessage("Condizione corrispondente aggiunta.");
    }

    /* Metodo per il controllo dei dati che abbiamo salvato in "response". */
    queryControl() {
        switch (this.props.ruleBot.intent) {
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

    /* Reset più accurato, infatti vengono resettati del tutto tutti i campi anche il tipo, che ritorna ad essere "regola"
    cioè quello iniziale.*/
    resetAllRuleBotData() {
        addResponseMessage("Va bene!");
        addResponseMessage("Scrivi pure una nuova regola, il bot è sempre qui ad ascoltarti.");
        //Resetto i campi di response
        this.resetRuleBotResponseData();
        Actions.updateBotResponseType("regola"); //Setto che la risposta non sarà un azione da aggiungere, ma una regola intera;
    }

    /* Resetto i dati di RuleBot per la prossima richiesta di nuova regola. Attenzione, notare che non viene resettato
     il tipo della regola, cioè "regola", "azione", "condizione". Questo perchè viene usato il reset quando passo ad aggiungere
     un'azione o una condizione. */
    resetRuleBotResponseData() {
        Actions.updateBotMissingElement("");
        Actions.updateBotIntent("");
        Actions.updateBotInitialScene("");
        Actions.updateBotFinalScene("");
        Actions.updateBotObject("");
    }

    /* Ritorna i nomi delle sceneFinali possibili. */
    returnFinalScenesNames() {
        let scenes = this.props.scenes;
        let currentNameScene = this.props.scenes.get(this.props.currentScene).name;
        let sceneNames = []; // Array che conterrà tutti i nomi delle scene, tranne quello della scena corrente.

        //Aggiungo i nome di tutte le scene, ma saltando la scena corrente
        scenes.forEach(function (singleScene) {
            if (singleScene.name !== currentNameScene)
                sceneNames.push(singleScene.name);
        });
        return sceneNames;
    }

    /* Torna true se la scena passata come parametro (stringa) esiste tra i nomi delle scene nella quale è possibile spostarsi, false altrimenti. */
    doesFinalSceneExists(scenes) {
        let sceneNames = this.returnFinalScenesNames();

        for (var i = 0; i < sceneNames.length; i++) {
            if (scenes === sceneNames[i]) {
                return true;
            }
        }
        return false;
    }

    /* [LucaAs] Torna true se il nome dell'oggetto passato come parametro (stringa) esiste, false altrimenti. Bisogna passare
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

    /* [LucaAs] Ritorna i nomi degli oggetti della scena corrente che hanno il tipo passato come parametro. */
    returnObjectNames(objectType) {
        let sceneObjects = this.props.interactiveObjects.filter(x => x.type === objectType);

        let objects = mapSceneWithObjects(this.props, this.props.scenes.get(this.props.currentScene), sceneObjects);
        for (var i = 0; i < objects.length; i++) {
            objects[i] = objects[i].name;
        }
        return objects;
    }

    /* [LucaAs] Ritorna l'oggetto corrispondente al nome e al tipo passato. */
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
    e l'utente vuole creare quest'ultima trarmite bot. Restituisce il nome dell'oggetto. */
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

    /* Torna la regola con una nuova condizione, a seconda dello stato che deve avere l'oggetto in questione
     e del suo uuid. */
    addObjectCondition(rule, objectUuid, state) {
        let newRule = rules_utils.addEmptyCondition(rule);
        this.props.ruleEditorCallback.eudUpdateRule(newRule);

        /* L'operatore è sempre "è". */
        let c = new Condition(uuid.v4(), objectUuid, state, "EQUAL");

        /* Se la regola contiene già una condizione o una SuperCondizione. */
        if (rule.condition instanceof Condition || rule.condition instanceof SuperCondition) {
            c = new SuperCondition(uuid.v4(), rule.condition, new Condition(uuid.v4(), objectUuid, state, "EQUAL"));
        }
        rule = rule.set('condition', c);
        return rule;
    }

    /* Stampa i bottoni dell'array passato come parametro nella chat. */
    printButtonsOnChatBot(objects) {
        renderCustomComponent(ButtonObjectNames, {
            oggetti: objects,
            clickedObject: (o) => this.handleNewUserMessage(o) //Metodo linkato al click sui bottoni della chat
        });
    }

    /* Genera il nome della regola creata tramite chatbot. Siccome i nomi devono essere univoci viene posto il controllo
    * che se esiste un nome uguale lo continua a modificare finchè non trova un nuovo nome possibile. */
    generateRuleName(objectType, objectName) {
        let scenes = this.props.scenes.get(this.props.currentScene);
        let initialPath, ruleName;
        let i = 0;

        /* Ogni regola deve avere un nome collegato ad essa a seconda del tipo di oggetto che ne fa parte. La prima parte
        * del nome è uguale a tutti gli oggetti dello stesso tipo. */
        switch (objectType) {
            case "TRANSITION":
                initialPath = 'regola della transizione ' + objectName + '_';
                break;
            case "SWITCH":
                initialPath = 'regola dell\'interruttore ' + objectName + '_';
                break;
            case "LOCK":
                initialPath = 'regola del lucchetto ' + objectName + '_';
                break;
            case "KEY":
                initialPath = 'regola della chiave ' + objectName + '_';
                break;
            default:
                console.log("Manca il tipo nella generazione del nome della regola");
        }

        /* Se il nome della regola + il numero delle regole già esistenti esiste già, allora continuo ad aumentare il
        numero delle regole già esistenti. */
        do {
            i = i + 1;
            ruleName = initialPath + (scenes.rules.length + i);
        } while (rules_utils.doesRuleNameExists(ruleName, this.props.rules));

        return ruleName;
    }

    /** TRANSITIONS **/

    /* Metodo per controllare se tutti gli elementi della regola transizione che vogliamo creare sono corretti. */
    transitionElementsControl() {
        let transizioni = this.returnObjectNames("TRANSITION");
        let finalScenes = this.returnFinalScenesNames();
        let scelte = ["Si", "No"];
        let statoTransizione = ["Attivabile", "Non attivabile", "Visibile", "Non visibile"];

        /* Controllo se la scenaIniziale che ha scritto l'utente corrisponde effettivamente con la scena corrente.
         * Se non dovesse corrispondere, do per scontato che sia quella e la aggiungo a response. */
        if (this.props.ruleBot.scenaIniziale !== this.props.scenes.get(this.props.currentScene).name) {
            Actions.updateBotInitialScene(this.props.scenes.get(this.props.currentScene).name);
        }
        /* Controllo che la scena finale che ha inserito l'utente esista, cioè che si trovi effettivamente tra le scene del gioco,
        * ma che non sia la scena corrente. */
        if (!this.doesFinalSceneExists(this.props.ruleBot.scenaFinale) && this.props.ruleBot.tipoRisposta !== "condizione") {
            /* Ricorda: elementoMancante serve per far capire all'handleNewUserMessage che non deve mandare una richiesta
             * al bot, ma può risolvere in locale. */
            Actions.updateBotMissingElement("scenaFinale"); //Manca il nome della scenaFinale
            if (this.props.ruleBot.scenaFinale === "") {
                addResponseMessage("Scrivi qual'è la scena finale alla quale vuoi arrivare. Perfavore scegli tra una di queste: ");
            } else {
                addResponseMessage("La scena finale che hai inserito non esiste. Perfavore scegli tra una di queste: ");
            }
            this.printButtonsOnChatBot(finalScenes);
        } else if (!this.doesObjectExists(this.props.ruleBot.oggetto, "TRANSITION") && this.props.ruleBot.tipoRisposta !== "azione") { //Faccio la stessa cosa per il nome della transizione, ma dopo aver inserito la scena finale corretta.
            if (this.returnObjectNames("TRANSITION").length > 0) { //Se esiste qualche transizione le elenchiamo

                Actions.updateBotMissingElement('oggetto'); //Manca il nome dell'oggetto oppure è inesistente
                if (this.props.ruleBot.oggetto === "") {
                    addResponseMessage("Quale transizione vuoi cliccare per effettuare l'azione? Perfavore scegli tra una di queste: ");
                    this.printButtonsOnChatBot(transizioni);
                } else {
                    addResponseMessage("La transizione che hai inserito non esiste. Perfavore scegli tra una di queste: ");
                    this.printButtonsOnChatBot(transizioni);
                }
            } else { //Se non esiste neanche una transizione chiediamo se ne vuole aggiungere una
                addResponseMessage("Sembra che tu non abbia transizioni per interagire. Vuoi crearne una? " +
                    "Scrivi \"si\" se vuoi crearla, oppure \"no\" se vuoi scrivere da capo la regola.  ");
                Actions.updateBotMissingElement("confermaCreazioneOggetto");
                this.printButtonsOnChatBot(scelte);
            }
        } else {
            //Se l'utente sta scrivendo una condizione
            if (this.props.ruleBot.tipoRisposta === "condizione") {
                /* Setto lo stato della transizione in caso l'utente voglia aggiungere una condizione. */
                Actions.updateBotInitialState(this.getTransitionState(this.props.ruleBot.statoIniziale, this.props.ruleBot.numNegazioni));
            }

            /* Se non ci sono più errori allora comunico che ho tutto, e chiedo conferma per la creazione della regola,
            * della azione o della condizione. */
            addResponseMessage("Ho tutto.");

            switch (this.props.ruleBot.tipoRisposta) {
                case "regola":
                    Actions.updateBotMissingElement("confermaCreazioneRegola");
                    addResponseMessage("I dati della tua regola sono questi: SCENA INIZIALE: " + this.props.ruleBot.scenaIniziale +
                        " SCENA FINALE: " + this.props.ruleBot.scenaFinale + " NOME TRANSIZIONE: " + this.props.ruleBot.oggetto);
                    addResponseMessage("Scrivi \"si\" se vuoi confermare la creazione della regola, oppure \"no\" se vuoi creare una nuova regola. ");
                    this.printButtonsOnChatBot(scelte);
                    break;
                case "azione":
                    Actions.updateBotMissingElement("confermaAggiuntaAzione");
                    addResponseMessage("I dati della tua azione sono questi: Passa alla SCENA FINALE: " + this.props.ruleBot.scenaFinale);
                    addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi creare una nuova regola. ");
                    this.printButtonsOnChatBot(scelte);
                    break;
                case "condizione":
                    if (this.props.ruleBot.statoIniziale === "non trovato") {
                        addResponseMessage("Scrivimi qual'è lo stato che deve avere la transizione. Attivabile, non attivabile, visibile, non visibile?");
                        Actions.updateBotMissingElement("statoIniziale");
                        this.printButtonsOnChatBot(statoTransizione);
                    } else {
                        Actions.updateBotMissingElement("confermaAggiuntaCondizione");
                        addResponseMessage("I dati della tua azione sono questi: Se la transizione " + this.props.ruleBot.oggetto +
                            " è " + this.props.ruleBot.statoIniziale);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi creare una nuova regola. ");
                        this.printButtonsOnChatBot(scelte);
                    }
                    break;
                default:
                    addResponseMessage("C'è stato un errore: tipo di regola non trovata dopo aver preso tutti i dati. ");
            }
        }
    }

    /* Crea la regola transizione data la transizione (oggetto) e l'uuid della scena finale. Non abbiamo bisogno di
     * altri campi visto che per la transizione sono sempre li stessi. */
    createTransitionRule(transition, finalSceneUuid) {
        let r;

        r = Rule({
            uuid: uuid.v4(),
            name: this.generateRuleName('TRANSITION', transition.name),
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

    /* Permette di aggiungere un'azione riguardo una transizione. Il bot si aspetta dunque un "passa alla 'scena'".
    * Questo metodo grazie allo uuid della scena e alla regola alla quale aggiungere l'azione ritorna appunto la regola
    * con l'azione aggiunta. */
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

    /* Permette di capire lo stato della transizione per aggiungerlo ad una condizione. Il bot si aspetta dunque un "se la 'transizione' è attivabile".
     * Questo metodo permette di riconoscere "attiva" e di restituire il pezzo corrispondente per la condizione. Da notare
     * che vengono usate il numero di negazioni nella frase per capire se è positiva o negativa. */
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
    * lo settiamo su "elementoMancante" in modo tale da ricavarcelo poi in "handleNewUserMessage". Nota: è simile a quello
    * della transizione, solo che è adattato all'oggetto switch. */
    switchElementsControl() {
        let interruttori = this.returnObjectNames("SWITCH");
        let statoInterruttore = ["Acceso", "Spento"];
        let scelte = ["Si", "No"];

        //Controllo se nella scena esistono switch se no chiedo all'utente se ne vuole creare uno di default.
        if (this.returnObjectNames("SWITCH").length > 0) {

            /* Controllo che il NOME dello switch inserito dall'utente esista tra gli switch esistenti nel gioco. */
            if (!this.doesObjectExists(this.props.ruleBot.oggetto, "SWITCH")) {
                addResponseMessage("Hai inserito il nome di uno switch che non esiste. Perfavore scegli tra uno di questi: ");
                Actions.updateBotMissingElement("oggetto");
                this.printButtonsOnChatBot(interruttori);
            } else {
                /* Setto lo stato inziale e quello finale con valore ON o OFF a seconda di cosa contengono. */
                Actions.updateBotInitialState(this.getSwitchState(this.props.ruleBot.statoIniziale, this.props.ruleBot.numNegazioni));
                Actions.updateBotFinalState(this.getSwitchState(this.props.ruleBot.statoFinale, 0));

                //Se non contengono qualcosa riconducibile ad ON o OFF allora chiedo all'utente di specificarlo
                //Controllo STATO INIZIALE
                if (this.props.ruleBot.statoIniziale === "non trovato" && this.props.ruleBot.tipoRisposta !== "azione") {
                    addResponseMessage("Scrivimi qual'è lo stato inziale dello switch. È acceso o spento?");
                    Actions.updateBotMissingElement("statoIniziale");
                    this.printButtonsOnChatBot(statoInterruttore);
                } else if (this.props.ruleBot.statoFinale === "non trovato" && this.props.ruleBot.tipoRisposta !== "condizione") {  //Controllo STATO FINALE
                    addResponseMessage("Scrivimi quale sarà lo stato finale dello switch. Vuoi che sia acceso o spento?");
                    Actions.updateBotMissingElement("statoFinale");
                    this.printButtonsOnChatBot(statoInterruttore);
                } else {
                    // Se HO TUTTO
                    /* Se non ci sono più errori allora comunico che ho tutto, e chiedo conferma per la creazione della regola,
                    * dell'azione o della condizione. */
                    addResponseMessage("Ho tutto.");
                    switch (this.props.ruleBot.tipoRisposta) {
                        case "regola":
                            Actions.updateBotMissingElement("confermaCreazioneRegola");
                            addResponseMessage("I dati della tua regola sono questi: STATO INIZIALE: " + this.props.ruleBot.statoIniziale +
                                " STATO FINALE: " + this.props.ruleBot.statoFinale + " NOME SWITCH: " + this.props.ruleBot.oggetto);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare la creazione della regola, oppure \"no\" se vuoi creare una nuova regola. ");
                            this.printButtonsOnChatBot(scelte);
                            break;
                        case "azione":
                            Actions.updateBotMissingElement("confermaAggiuntaAzione");
                            addResponseMessage("I dati della tua azione sono questi: Lo switch: " + this.props.ruleBot.oggetto +
                                " cambia stato a: " + this.props.ruleBot.statoFinale);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi creare una nuova regola. ");
                            this.printButtonsOnChatBot(scelte);
                            break;
                        case "condizione":
                            Actions.updateBotMissingElement("confermaAggiuntaCondizione");
                            addResponseMessage("I dati della tua condizione sono questi: Se lo switch: " + this.props.ruleBot.oggetto +
                                " è " + this.props.ruleBot.statoIniziale);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta della condizione, oppure \"no\" se vuoi creare una nuova regola. ");
                            this.printButtonsOnChatBot(scelte);
                            break;
                        default:
                            addResponseMessage("C'è stato un errore: tipo di regola non trovata dopo aver preso tutti i dati. ");
                    }
                }
            }
        } else {
            //Se non esistono switch gli propongo di crearne uno di default
            addResponseMessage("Sembra che tu non abbia switch per interagire. Vuoi crearne uno? " +
                "Scrivi \"si\" se vuoi crearlo, oppure \"no\" se vuoi scrivere da capo la regola.  ");
            Actions.updateBotMissingElement("confermaCreazioneOggetto");
            this.printButtonsOnChatBot(scelte);
        }
    }

    /* Crea la regola per lo switch data lo switch (oggetto), il suo stato iniziale e finale. */
    createSwitchRule(switchObject, initialState, finalState) {
        let r;
        r = Rule({
            uuid: uuid.v4(),
            name: this.generateRuleName('SWITCH', switchObject.name),
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
    * Se lo trova ne restituisce uno di default in modo da sostituirlo anche nello stato di RuleBot. Infatti verranno messi ON oppure
    * OFF a seconda di cosa scrive l'utente. */
    getSwitchState(state, numNegazioni) {
        if (["on", "acceso", "attivo", "accendilo", "attivalo", "attivato", "attiva", "attivare"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 === 0) {
                return "ON"
            } else return "OFF"
        } else {
            if (["off", "spento", "disattivo", "spegnilo", "disattivalo", "disattivato", "disattiva", "disattivare"].includes(state.trim().toLowerCase())) {
                if (numNegazioni % 2 === 0) {
                    return "OFF"
                } else return "ON"
            } else return "non trovato";
        }
    }

    /* Permette di aggiungere un'azione riguardo uno switch. Il bot si aspetta dunque un "attiva lo 'switch'".
     * Questo metodo grazie all'oggetto switch corrispondente, alla regola alla quale aggiungere l'azione e allo stato finale
     * dello switch ritorna la regola con l'azione corretta. */
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
    * In realtà per il lucchetto basta controllare se ne esistono o se quello che ha inserito l'utente esiste. Questo
    * perchè non ci può essere l'azione "blocca lucchetto". */
    padlockElementsControl() {
        let lucchetti = this.returnObjectNames("LOCK");
        let scelte = ["Si", "No"];
        let statoLucchetto = ["Aperto", "Chiuso"];

        //Controllo se nella scena esistono lucchetti se no chiedo all'utente se ne vuole creare uno di default.
        if (this.returnObjectNames("LOCK").length > 0) {

            /* Controllo che il NOME del lucchetto inserito dall'utente esista tra i lucchetti esistenti nel gioco. */
            if (!this.doesObjectExists(this.props.ruleBot.oggetto, "LOCK")) {
                addResponseMessage("Hai inserito il nome di un lucchetto che non esiste. Perfavore scegli tra uno di questi: ");
                Actions.updateBotMissingElement("oggetto");
                this.printButtonsOnChatBot(lucchetti);
            } else {
                //Se l'utente sta scrivendo una condizione
                if (this.props.ruleBot.tipoRisposta === "condizione") {
                    Actions.updateBotInitialState(this.getPadlockState(this.props.ruleBot.statoIniziale, this.props.ruleBot.numNegazioni));
                }

                // Se HO TUTTO
                /* Se non ci sono più errori allora comunico che ho tutto, e chiedo conferma per la creazione della regola,
                * azione o condizione. */
                addResponseMessage("Ho tutto.");
                switch (this.props.ruleBot.tipoRisposta) {
                    case "regola":
                        Actions.updateBotMissingElement("confermaCreazioneRegola");
                        addResponseMessage("Presumo che se stai scrivendo una regola base per il lucchetto il tuo intento è quello di " +
                            "sbloccarlo quando lo clicchi. " +
                            "Dunque: I dati della tua regola sono questi: STATO FINALE: " + this.props.ruleBot.statoFinale +
                            " NOME LUCCHETTO: " + this.props.ruleBot.oggetto);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare la creazione della regola, oppure \"no\" se vuoi creare una nuova regola. ");
                        this.printButtonsOnChatBot(scelte);
                        break;
                    case "azione":
                        Actions.updateBotMissingElement("confermaAggiuntaAzione");
                        addResponseMessage("I dati della tua azione sono questi: Il giocatore sblocca il lucchetto: " + this.props.ruleBot.oggetto);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi creare una nuova regola. ");
                        this.printButtonsOnChatBot(scelte);
                        break;
                    case "condizione":
                        //Se non contiene qualcosa riconducibile ad APERTO o CHIUSO allora chiedo all'utente di specificarlo
                        //Controllo STATO INIZIALE
                        if (this.props.ruleBot.statoIniziale === "non trovato") {
                            addResponseMessage("Scrivimi qual'è lo stato che dovrà avere il lucchetto. È aperto o chiuso?");
                            //Serve per far capire quale elemento manca, senza dover mandare al bot un'altra richiesta, ma si può risolvere in locale.
                            Actions.updateBotMissingElement("statoIniziale");
                            this.printButtonsOnChatBot(statoLucchetto);
                        } else {
                            Actions.updateBotMissingElement("confermaAggiuntaCondizione");
                            addResponseMessage("I dati della tua condizione sono questi: Se il lucchetto: " + this.props.ruleBot.oggetto
                                + " è " + this.props.ruleBot.statoIniziale);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta della condizione, oppure \"no\" se vuoi creare una nuova regola. ");
                            this.printButtonsOnChatBot(scelte);
                        }
                        break;
                    default:
                        addResponseMessage("C'è stato un errore: tipo di regola non trovata dopo aver preso tutti i dati. ");
                }
            }
        } else {
            //Se non esistono lucchetti gli propongo di crearne uno di default
            addResponseMessage("Sembra che tu non abbia lucchetti per interagire. Vuoi crearne uno? " +
                "Scrivi \"si\" se vuoi crearlo, oppure \"no\" se vuoi scrivere da capo la regola.  ");
            Actions.updateBotMissingElement("confermaCreazioneOggetto");
            this.printButtonsOnChatBot(scelte);
        }
    }

    /* Crea la regola dato il lucchetto (oggetto). */
    createPadlockRule(lucchetto) {
        let r;
        r = Rule({
            uuid: uuid.v4(),
            name: this.generateRuleName('LOCK', lucchetto.name),
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

    /* Permette di aggiungere un'azione riguardo un lucchetto. Il bot si aspetta dunque un "il lucchetto viene sbloccato".
     * Questo metodo a prescindere dal bloccato/sbloccato restituisce la regola + l'azione del lucchetto che viene SBLOCCATO
     * questo perchè non si può effettuare l'azione del farlo bloccare. */
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

    /* Permette di ricavare lo stato del lucchetto dalla query analizzata dal bot. Il bot si aspetta un "se il lucchetto è aperto"
     * o simili. Viene fatto il contorollo sul numero di negazioni. */
    getPadlockState(state, numNegazioni) {
        if (["aperto", "sbloccato"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 === 0) {
                return "UNLOCKED";
            } else return "LOCKED";
        } else {
            if (["chiuso", "bloccato"].includes(state.trim().toLowerCase())) {
                if (numNegazioni % 2 === 0) {
                    return "LOCKED";
                } else {
                    return "UNLOCKED";
                }
            } else return "non trovato";
        }
    }

    /** KEYS */

    /* Metodo per controllare se tutti gli elementi della regola per la chiave che vogliamo creare siano corretti.
    * In realtà per la chiave basta controllare se ne esistono o se quella che ha inserito l'utente esista. Questo perchè
    * l'unica azione che si può fare è raccoglierla. */
    keyElementControl() {
        let chiavi = this.returnObjectNames("KEY");
        let scelte = ["Si", "No"];
        let statoChiave = ["Raccolta", "Non raccolta"];

        //Controllo se nella scena esistono chiavi se no chiedo all'utente se ne vuole creare una di default.
        if (this.returnObjectNames("KEY").length > 0) {

            /* Controllo che il NOME della chiave inserito dall'utente esista tra le chiavi esistenti nel gioco. */
            if (!this.doesObjectExists(this.props.ruleBot.oggetto, "KEY")) {
                addResponseMessage("Hai inserito il nome di una chiave che non esiste. Perfavore scegli tra una di queste: ");
                Actions.updateBotMissingElement("oggetto");
                this.printButtonsOnChatBot(chiavi);
            } else {
                //Se l'utente sta scrivendo una condizione
                if (this.props.ruleBot.tipoRisposta === "condizione") {
                    /* Setto lo stato della chiave. */
                    Actions.updateBotInitialState(this.getKeyState(this.props.ruleBot.statoIniziale, this.props.ruleBot.numNegazioni));
                }

                // Se HO TUTTO
                /* Se non ci sono più errori allora comunico che ho tutto, e chiedo conferma per la creazione della regola,
                * dell'azione o della condizione. */
                addResponseMessage("Ho tutto.");
                switch (this.props.ruleBot.tipoRisposta) {
                    case "regola":
                        Actions.updateBotMissingElement("confermaCreazioneRegola");
                        addResponseMessage("Presumo che se stai scrivendo una regola base per la chiave, il tuo intento è quello di " +
                            "raccoglierla quando la clicchi. " +
                            "Dunque: I dati della tua regola sono questi: AZIONE: raccogli" +
                            " NOME CHIAVE: " + this.props.ruleBot.oggetto);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare la creazione della regola, oppure \"no\" se vuoi creare una nuova regola. ");
                        this.printButtonsOnChatBot(scelte);
                        break;
                    case "azione":
                        Actions.updateBotMissingElement("confermaAggiuntaAzione");
                        addResponseMessage("I dati della tua azione sono questi: Il giocatore raccoglie la chiave: " + this.props.ruleBot.oggetto);
                        addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta dell'azione, oppure \"no\" se vuoi andare avanti. ");
                        this.printButtonsOnChatBot(scelte);
                        break;
                    case "condizione":
                        //Se non contiene qualcosa riconducibile ad APERTO o CHIUSO allora chiedo all'utente di specificarlo
                        //Controllo STATO INIZIALE
                        if (this.props.ruleBot.statoIniziale === "non trovato") {
                            addResponseMessage("Scrivimi qual'è lo stato che dovrà avere la chiave. Raccolta o non raccolta?");
                            Actions.updateBotMissingElement("statoIniziale");
                            this.printButtonsOnChatBot(statoChiave);
                        } else {
                            Actions.updateBotMissingElement("confermaAggiuntaCondizione");
                            addResponseMessage("I dati della tua condizione sono questi: Se la chiave: " + this.props.ruleBot.oggetto + " è " +
                                this.props.ruleBot.statoIniziale);
                            addResponseMessage("Scrivi \"si\" se vuoi confermare l'aggiunta della condizione, oppure \"no\" se vuoi andare avanti. ");
                            this.printButtonsOnChatBot(scelte);
                        }
                        break;
                    default:
                        addResponseMessage("C'è stato un errore: tipo di regola non trovata dopo aver preso tutti i dati. ");
                }
            }
        } else {
            //Se non esistono chiavi gli propongo di crearne una di default
            addResponseMessage("Sembra che tu non abbia chiavi per interagire. Vuoi crearne una? " +
                "Scrivi \"si\" se vuoi crearla, oppure \"no\" se vuoi scrivere da capo la regola.  ");
            Actions.updateBotMissingElement("confermaCreazioneOggetto");
            this.printButtonsOnChatBot(scelte);
        }
    }

    /* Crea la regoladata la chiave (oggetto). */
    createKeyRule(chiave) {
        let r;

        r = Rule({
            uuid: uuid.v4(),
            name: this.generateRuleName('KEY', chiave.name),
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

    /* Permette di aggiungere un'azione riguardo una chiave. Il bot si aspetta dunque un "la chiave viene raccolta".
     * Questo metodo a prescindere dal raccolta/non raccolta restituisce la regola + l'azione della chiave che viene raccolta visto che
     * non si può fare l'azione "non raccogliere" o "butta a terra". */
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

    /* Permette di ricavare lo stato della chiave dalla query analizzata dal bot. Il bot si aspetta un "se la chiave non è stata raccolta"
     * o simili. Viene fatto il contorollo sul numero di negazioni. Serve per la condizione. */
    getKeyState(state, numNegazioni) {
        if (["raccolta"].includes(state.trim().toLowerCase())) {
            if (numNegazioni % 2 === 0) {
                return "COLLECTED"
            } else {
                return "NOT_COLLECTED"
            }
        } else return "non trovato";
    }
}

class ButtonObjectNames extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return this.returnObjectButtons(this.props.oggetti);
    }

    /* Ritorna i bottoni degli oggetti richiesti della scena corrente. Gli oggetti richiesti è un semplice array di stringhe.
    * Quando premo un bottone, viene mandato il messaggio al bot con la stringa corrispondente. */
    returnObjectButtons(nomiOggetti) {
        return <div className={"divBottoniOggettoBot"}>
            {nomiOggetti.map(o =>
                <button className={"bottoniOggettoBot"} key={o}
                        onClick={() => this.props.clickedObject(o)}>{o}
                </button>)}
        </div>
    }
}

/* Funzione per fare la richiesta a wit.ai e restituire l'intent di risposta trovato (Luca) */
async function sendRequest(sentence, tipo) {
    let CLIENT_TOKEN = "ZURQC5XOJEARGLPUHYYUV4V6HH5IBR6K"; //Token bot Wit.ai
    /* Variabile che verrà salvata nello store RuleBot. */
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
                    if (res.intents[0] !== undefined) {
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
                    }
                } else {
                    console.log("Ricevuto intent sbagliato da Wit.AI");
                }
                return risposta;
            }
        )
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

