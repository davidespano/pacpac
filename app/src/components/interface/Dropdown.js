import React from 'react';
import Select from "react-select";
import Values from "../../interactives/rules/Values";
import scene_utils from "../../scene/scene_utils";
import EditorState from "../../data/EditorState";
import ActionTypes from "../../actions/ActionTypes";
import Actions from "../../actions/Actions"
import toString from "../../interactives/rules/toString";
import interface_utils from "./interface_utils";

function Dropdown(properties){
    let props = properties.props,
        component = properties.component,
        property = properties.property;
    let defaultValue = getDefaultValue(props, properties.defaultValue, component);
    let [options, onChange, style] = generateOptions(props, component, property);

    console.log(defaultValue);

    return(
        <Select
            options={options}
            value={defaultValue}
            onChange={onChange}
            className={'react-select react-select-' + component}
            styles={style}
            isDisabled={ properties.disabled ? properties.disabled : false}
        />
    );
}

function generateOptions(props, component, property){
    switch(component){
        case 'scene-type':
            return [
                [
                    { value: Values.THREE_DIM, label: toString.valueUuidToString(Values.THREE_DIM)},
                    { value: Values.TWO_DIM, label: toString.valueUuidToString(Values.TWO_DIM)},
                ],
                (e) => {
                    let scene = props.scenes.get(props.currentScene);
                    scene_utils.setProperty(scene, property, e.value, props)
                },
                customStyle,
            ];
        case 'visibility':
            return [
                [
                    { value: Values.VISIBLE, label: toString.valueUuidToString(Values.VISIBLE)},
                    { value: Values.INVISIBLE, label: toString.valueUuidToString(Values.INVISIBLE)},
                ],
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    interface_utils.setPropertyFromValue(obj, property, e.value, props);
                },
                customStyle,
            ];
        case 'on-off':
            return [
                [
                    { value: Values.ON, label: toString.valueUuidToString(Values.ON)},
                    { value: Values.OFF, label: toString.valueUuidToString(Values.OFF)},
                ],
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    if(props.editor.mode === ActionTypes.DEBUG_MODE_ON) {
                        EditorState.debugRunState[obj.uuid.toString()].state = e.value;
                        Actions.updateObject(obj);
                    }
                    else
                        interface_utils.setPropertyFromValue(obj, property, e.value, props);
                },
                customStyle,
            ];
        case 'scenes':
            return [
                [...props.scenes.values()].map( scene => {
                    return {value: scene.uuid, label: scene.name}
                }),
                (e) => {
                    props.selectSceneSpatialAudio(e.value);
                },
                customStyle,
            ];
        case 'collected-not':
            return [
                [
                    { value: Values.COLLECTED, label: toString.valueUuidToString(Values.COLLECTED)},
                    { value: Values.NOT_COLLECTED, label: toString.valueUuidToString(Values.NOT_COLLECTED)},
                ],
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    if(props.editor.mode === ActionTypes.DEBUG_MODE_ON) {
                        EditorState.debugRunState[obj.uuid.toString()].state = e.value;
                        Actions.updateObject(obj);
                    }
                    else
                        interface_utils.setPropertyFromValue(obj, property, e.value, props);
                },
                customStyle,
            ];
        case 'assets':
            return [
                [{uuid: null, name: 'nessuno'},...props.assets.values()].map( a => {
                    return {value: a.uuid, label: a.name}
                }),
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    interface_utils.setPropertyFromValue(obj, property, e.value, props);
                },
                audioMediaOptionsStyle,
            ];
        case 'audios':
            return [
                [{uuid:null, name:'nessuno'},...props.audios.values()].map( a => {
                    return {value: a.uuid, label: a.name}
                }),
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    interface_utils.setPropertyFromValue(obj, property, e.value, props);
                },
                audioMediaOptionsStyle,
            ];
        case 'music':
            return [
                [{uuid:null, name:'nessuna'},...props.audios.values()].map( a => {
                    return {value: a.uuid, label: a.name}
                }),
                (e) => {
                    let scene = props.scenes.get(props.currentScene);
                    scene_utils.setProperty(scene, property, e.value, props);
                },
                customStyle,
            ];
        case 'direction':
            return [
                [
                    { value: Values.NO_DIR, label: toString.valueUuidToString(Values.NO_DIR) },
                    { value: Values.UP, label: toString.valueUuidToString(Values.UP)},
                    { value: Values.DOWN, label: toString.valueUuidToString(Values.DOWN)},
                    { value: Values.RIGHT, label: toString.valueUuidToString(Values.RIGHT)},
                    { value: Values.LEFT, label: toString.valueUuidToString(Values.LEFT)},
                ],
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    interface_utils.setPropertyFromValue(obj, property, e.value, props);
                },
                customStyle,
            ];
    }
}

function getDefaultValue(props, defaultValue, component){
    let label = null;

    if(defaultValue){
        switch(component){
            case 'scenes':
                label = props.scenes.get(defaultValue).name; break;
            case 'assets':
                label = defaultValue; break;
            case 'audios':
            case 'music':
                if(props.audios.has(defaultValue))
                    label = props.audios.get(defaultValue).name; break;
            default:
                label = toString.valueUuidToString(defaultValue);
            }
    }

    return  {
        value: defaultValue,
        label: label,
    }
}


const customStyle = {
    option: (provided, state) => ({
        color: state.value === null ? 'darkgrey': state.isSelected ? '#EF562D' : 'black',
        '&:hover': { backgroundColor: '#FFD8AC'},
        borderBottom: state.value === null ? 'dotted 1px darkgrey' : 'none',
    }),
    control: (provided, state) => ({
        ...provided,
        minHeight: '30px',
        height: '30px',
        '&:hover': { border: '1px solid darkgrey'},
        border: '1px solid darkgrey',
        borderRadius: 0,
        boxShadow: 'none',
    }),
    menu: (provided, state) => ({
        ...provided,
        margin: 0,
    }),
};

const audioMediaOptionsStyle = {
    option: (provided, state) => ({
        color: state.value === null ? 'darkgrey': state.isSelected ? '#EF562D' : 'black',
        '&:hover': { backgroundColor: '#FFD8AC'},
        borderBottom: state.value === null ? 'dotted 1px darkgrey' : 'none',
    }),
    control: (provided, state) => ({
        ...provided,
        minHeight: '25px',
        height: '25px',
        '&:hover': { borderBottom: 'solid 1px darkgrey'},
        border: 'none',
        borderBottom: 'solid 1px darkgrey',
        borderRadius: 0,
        boxShadow: 'none',
    }),
    menu: (provided, state) => ({
        ...provided,
        margin: 0,
    }),
    singleValue: (provided, state) => ({
        ...provided,
        height: '25px',
        minHeight: '25px',
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        height: '25px',
        minHeight: '25px',
    }),
};

export default Dropdown;