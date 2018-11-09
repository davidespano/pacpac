import 'aframe';
import React from 'react';
import {Entity} from 'aframe-react';
import './aframe_selectable'

function Curved(props)
{
    return(
        <Entity material="opacity: 0; visible: false; side: double" geometry={"primitive: polyline; vertices: " +
        props.vertices} id={"curv" + props.key} selectable={'object_uuid:' + props.object_uuid} scale="-1 1 1"/>
    );
}

function Sound(props)
{
    return(
        <Entity primitive = "a-sound" id={"audio" + props.track } src={ "http://localhost:3000/media/2k/" + props.track } autoplay="true" />
    );
}

export {Curved, Sound}