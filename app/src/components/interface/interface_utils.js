import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import scene_utils from "../../scene/scene_utils";
import Values from "../../interactives/rules/Values";
import CentralSceneStore from "../../data/CentralSceneStore";
import ScenesStore from "../../data/ScenesStore";
import AssetsStore from "../../data/AssetsStore";


/**
 * Updates object property with the given value, returns new object
 * @param object
 * @param property
 * @param value
 * @param props
 */
function setPropertyFromValue(object, property, value, props){
    let newObject, subProperty;
    let media = object.get('media');
    let audio = object.get('audio');

    if(property.includes('media')){
        subProperty = property;
        property = 'media';
    }

    if(property.includes('audio')){
        subProperty = property;
        property = 'audio';
    }

    switch (property) {
        // generic properties belonging to any interactive object
        case "name":
        case "mask":
        case "vertices":
        case 'visible':
            newObject = object.set(property, value);
            break;
        // specific properties
        case "media":
            media[subProperty] = value;
            newObject = object.setIn(['media'], media);
            break;
        case "audio":
            audio[subProperty] = value;
            newObject = object.setIn(['audio'], audio);
            break;
        default:
            let properties = object.get('properties');
            properties[property] = value;
            newObject = object.setIn(['properties'], properties);
    }

    props.updateObject(newObject);

    let scene = props.scenes.get(props.objectToScene.get(newObject.uuid));

    InteractiveObjectAPI.saveObject(scene, newObject);

    if(property === "vertices"){
        props.editVertices(newObject, scene.type);
    }
}

function updateAudioVertices(audio, vertices, props) {
    audio=audio.set('vertices', vertices)
    props.updateAudio(audio)
}

/**
 * Updates object property retrieving new value from the given field
 * @param object to update
 * @param property to update
 * @param id of the html field containing the new value
 * @param props
 */
function setPropertyFromId(object, property, id, props){
    let value = document.getElementById(id).textContent;
    setPropertyFromValue(object, property, value, props);
}

/**
 * Generates approximative 2d centroid for the interaction area starting from the given vertices.
 * @param vertices is a string that contains all of the vertices values
 * @param scene_type
 * @param props
 * @param radius of the sphere
 * @returns [float, float]
 * This function returns latitude and longitude because they are fixed values that can be easily stored in
 * CentroidsStore. x and y must be calculated later, since the size of central image is variable.
 */
function calculateCentroid(vertices, scene_type = Values.THREE_DIM, props, radius = 9.5) {

    vertices = vertices.split(',').join(" "); //replace commas with whitespaces
    let coordinates = vertices.split(" ").map(x => parseFloat(x));
    let medianPoint = [0.0, 0.0, 0.0];
    let x = 0, y = 0;

    for (let i = 0; i < coordinates.length; i += 3) {
        medianPoint[0] += coordinates[i];
        medianPoint[1] += coordinates[i + 1];
        medianPoint[2] += coordinates[i + 2];
    }

    medianPoint = medianPoint.map(x => {
        return x / (coordinates.length / 3)
    });

    if(scene_type === Values.THREE_DIM){
        //project median onto sphere to obtain approximate 3d centroid
        /*https://stackoverflow.com/questions/9604132/how-to-project-a-point-on-to-a-sphere*/

        let length = Math.sqrt(Math.pow(medianPoint[0], 2) + Math.pow(medianPoint[1], 2) + Math.pow(medianPoint[2], 2));

        let centroid = medianPoint.map(x => {
            return radius / length * x
        });

        // calculate latitude and longitude to obtain approximate 2d centroid

        let lat = 90 - (Math.acos(medianPoint[1] / radius)) * 180 / Math.PI;
        let lon = ((270 + (Math.atan2(medianPoint[0] , medianPoint[2])) * 180 / Math.PI) % 360) -180;


        // adjust latitude and longitude to obtain values in percentage

        x = (180 - lon) * 100 / 360;
        y = (180 - lat) * 100 / 360;
    } else {
        if(CentralSceneStore.getState() != null){
            let scene = ScenesStore.getState().get(CentralSceneStore.getState());
            let asset = AssetsStore.getState().get(scene.img)
            console.log(asset)
            x = (asset.width /2 + x) * 100 / asset.width;
            y = (asset.height /2 + y) * 100 / asset.height;
        }
        /*
        if(document.getElementById('central-scene')){
            let width = document.getElementById('central-scene').offsetWidth;
            let height = document.getElementById('central-scene').offsetHeight;
            console.log(width, height);
        }
        */
    }

    console.log(x, y)

    return [x, y];
}

/**
 * Allows only numbers in input
 * @param id of input field
 */
//https://stackoverflow.com/questions/8808590/html5-number-input-type-that-takes-only-integers/17208628
function onlyNumbers(id) {
    let text = document.getElementById(id);
    text.textContent = text.textContent.replace(/[^0-9.]/g, '');
    text.textContent = text.textContent.replace(/(\..*)\./g, '$1');
}

/**
 * Generates title for a scene
 * @param name
 * @param tagName
 * @returns {string}
 */
function title(name, tagName) {
    return (
        "Scena: " + name +
        "\nEtichetta: " + tagName
    );
}

/**
 * Check if the given option element is selected according to the editor state
 * @param element (such as rightbar)
 * @param option value
 * @param editor is the object containing all the editor variables representing its state
 */
function checkSelection(element, option, editor){
    switch(element){
        case 'rightbar':
            return ((editor.rightbarSelection === option) ? '' : 'inactive');
        case 'leftbar':
            return ((editor.leftbarSelection === option) ? '' : 'inactive');
        default:
            return 'inactive';
    }
}


/**
 * dispatch file updating when closing audio, edit media and input scene form
 * @param props
 */
function handleFileUpdate(props){
    switch(props.editor.selectedMediaToEdit){
        case 'mask':
        case 'media0':
        case 'media1':
            let obj = props.interactiveObjects.get(props.currentObject);
            setPropertyFromValue(obj, props.editor.selectedMediaToEdit, props.editor.selectedFile, props);
            break;
        case 'rightbar':
            let scene = props.scenes.get(props.currentScene);
            scene_utils.setProperty(scene, 'img', props.editor.selectedFile, props);
            break;
    }
}

/**
 * reset form fields
 * @id form id
 */
function resetFields(id){
    document.getElementById(id).reset();
}


/**
 * checks and sets audio selection
 * @param props
 * @param audio
 */
function audioSelection(props, audio){
    props.editor.selectedAudioToEdit === audio.uuid ? props.selectAudioToEdit(null) :
        props.selectAudioToEdit(audio.uuid, audio.file, audio.isSpatial, audio.loop);
}


function changeKeypadSize(keypad, size){
    size = size < 3 ? 3 : size;
    let properties = keypad.get('properties');

    if( size > properties.inputSize){

    }

}


/**
 * Generate keypad property specified by parameter "name" according to the given input size
 * @param length
 * @param name
 * @returns {{}}
 */
function keypadProperties(length, name){
    let property = {};
    for(let i = 0; i < length; i++){
        property[name+i] = null;
    }
    return property;
}

function setClassStyle(classHighlight, style) {
    //console.log("CLASS " + classHighlight + "STYLE " + style);
    [...document.querySelectorAll(classHighlight)].forEach(function (item) {
        item.style = style;
    })
}

function setIdStyle(classHighlight, idHighlight, style) {
    setClassStyle(".".concat(classHighlight), style.substring(0, style.indexOf(" ")).concat(" ;"));
    let el = document.getElementById(classHighlight+idHighlight);
    if (el != null)
        el.style = style;
}

function highlightRule(props, obj) {
    let scene = props.scenes.get(props.currentScene);
    setClassStyle(".eudRule", "background: ");
    setClassStyle(".btnNext", "visibility: hidden");

    return scene.get('rules').map(
        rule => {
            let item = props.rules.get(rule).uuid;
            let next = document.getElementById('btnNext' + item);

            props.rules.get(rule).actions._tail.array.forEach(function (sub) {
                if (sub.subj_uuid === obj.uuid) {
                    setIdStyle("eudRule", item, "background: rgba(239, 86, 55, .3)");

                    if(next !== null && props.currentObject === null)
                        next.style = "visibility: visible";
                }
            });

            if (props.rules.get(rule).event.obj_uuid === obj.uuid) {
                setIdStyle("eudRule", item, "background: rgba(239, 86, 55, .3)");

                if(next !== null && props.currentObject === null)
                    next.style = "visibility: visible";
            }

        });
}



export default {
    onlyNumbers : onlyNumbers,
    setPropertyFromId : setPropertyFromId,
    setPropertyFromValue : setPropertyFromValue,
    title : title,
    centroid: calculateCentroid,
    checkSelection: checkSelection,
    handleFileUpdate: handleFileUpdate,
    resetFields: resetFields,
    audioSelection: audioSelection,
    changeKeypadSize: changeKeypadSize,
    setClassStyle: setClassStyle,
    setIdStyle: setIdStyle,
    highlightRule: highlightRule,
    updateAudioVertices: updateAudioVertices
}