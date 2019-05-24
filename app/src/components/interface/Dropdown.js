import React from 'react';
import Select from "react-select";
import Values from "../../interactives/rules/Values";
import interface_utils from "./interface_utils";
import scene_utils from "../../scene/scene_utils";

function Dropdown(properties){
    let props = properties.props,
        component = properties.component,
        property = properties.property;
    let defaultValue = getDefaultValue(props, properties.defaultValue, component);
    let [options, onChange] = generateOptions(props, component, property);
    let styles = component === 'assets' ? assetStyle : customStyle;

    return(
        <Select
            options={options}
            value={defaultValue}
            onChange={onChange}
            className={'react-select react-select-' + component}
            styles={styles}
            isDisabled={ properties.disabled ? properties.disabled : false}
        />
    );
}

function generateOptions(props, component, property){
    switch(component){
        case 'scene-type':
            return [
                [
                    { value: Values.THREE_DIM, label: interface_utils.valueUuidToString(Values.THREE_DIM)},
                    { value: Values.TWO_DIM, label: interface_utils.valueUuidToString(Values.TWO_DIM)},
                ],
                (e) => {
                    let scene = props.scenes.get(props.currentScene);
                    scene_utils.setProperty(scene, property, e.value, props)
                }
            ];
        case 'visibility':
            return [
                [
                    { value: Values.VISIBLE, label: interface_utils.valueUuidToString(Values.VISIBLE)},
                    { value: Values.INVISIBLE, label: interface_utils.valueUuidToString(Values.INVISIBLE)},
                ],
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    interface_utils.setPropertyFromValue(obj, property, e.value, props);
                }
            ];
        case 'on-off':
            return [
                [
                    { value: Values.ON, label: interface_utils.valueUuidToString(Values.ON)},
                    { value: Values.OFF, label: interface_utils.valueUuidToString(Values.OFF)},
                ],
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    interface_utils.setPropertyFromValue(obj, property, e.value, props);
                }
            ];
        case 'scenes':
            return [
                [...props.scenes.values()].map( scene => {
                    return {value: scene.uuid, label: scene.name}
                }),
                (e) => {
                    props.selectSceneSpatialAudio(e.value);
                }
            ];
        case 'collected-not':
            return [
                [
                    { value: Values.COLLECTED, label: interface_utils.valueUuidToString(Values.COLLECTED)},
                    { value: Values.NOT_COLLECTED, label: interface_utils.valueUuidToString(Values.NOT_COLLECTED)},
                ],
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    interface_utils.setPropertyFromValue(obj, property, e.value, props);
                }
            ];
        case 'assets':
            return [
                [...props.assets.values()].map( a => {
                    return {value: a.uuid, label: a.name}
                }),
                (e) => {
                    let obj = props.interactiveObjects.get(props.currentObject);
                    interface_utils.setPropertyFromValue(obj, property, e.value, props);
                }
            ];
        case 'audios':
            return [
                [...props.audios.values()].map( a => {
                    return {value: a.uuid, label: a.name}
                }),
                (e) => {
                    console.log(e.value);
                }
            ];
    }
}

function getDefaultValue(props, defaultValue, component){
    let label = null;

    console.log(component)

    if(defaultValue){
        switch(component){
            case 'scenes':
                label = props.scenes.get(defaultValue).name; break;
            case 'assets':
                label = defaultValue; break;
            default:
                label = interface_utils.valueUuidToString(defaultValue);
            }
    }

    return  {
        value: defaultValue,
        label: label,
    }
}


const customStyle = {
    option: (provided, state) => ({
        color: state.isSelected ? '#EF562D' : 'black',
        '&:hover': { backgroundColor: '#FFD8AC'},
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

const assetStyle = {
    option: (provided, state) => ({
        color: state.isSelected ? '#EF562D' : 'black',
        '&:hover': { backgroundColor: '#FFD8AC'},
    }),
    control: (provided, state) => ({
        ...provided,
        minHeight: '25px',
        height: '25px',
        '&:hover': { border: 'none'},
        border: 'none',
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