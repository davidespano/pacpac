import React from 'react';
import Select from "react-select";
import Values from "../../interactives/rules/Values";
import interface_utils from "./interface_utils";
import scene_utils from "../../scene/scene_utils";

function Dropdown(properties){
    let props = properties.props,
        component = properties.component;
    let defaultValue = getDefaultValue(props, properties.defaultValue);
    let [options, onChange] = generateOptions(props, component);

    return(
        <Select
            options={options}
            value={defaultValue}
            onChange={onChange}
            className={'react-select react-select-' + component}
            styles={customStyle}
            disabled={ properties.disabled ? properties.disabled : false}
        />
    );
}

function generateOptions(props, component){
    switch(component){
        case 'scene-type':
            return [
                [
                    { value: Values.THREE_DIM, label: interface_utils.valueUuidToString(Values.THREE_DIM)},
                    { value: Values.TWO_DIM, label: interface_utils.valueUuidToString(Values.TWO_DIM)},
                ],
                (e) => {
                    let scene = props.scenes.get(props.currentScene);
                    scene_utils.setProperty(scene, 'type', e.value, props)
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
                    interface_utils.setPropertyFromValue(obj, 'visible', e.value, props);
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
                    interface_utils.setPropertyFromValue(obj, 'state', e.value, props);
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
                    interface_utils.setPropertyFromValue(obj, 'state', e.value, props);
                }
            ];
    }
}

function getDefaultValue(props, defaultValue){
    if(props.scenes.has(defaultValue)){
        return {
            value: defaultValue,
            label: props.scenes.get(defaultValue).name,
        };
    } else {
        return {
            value: defaultValue,
            label: interface_utils.valueUuidToString(defaultValue)
        };
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

export default Dropdown;