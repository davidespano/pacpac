import React from "react";
import {Entity} from 'aframe-react';
import {Curved, Sound} from './aframe_entities';
import settings from "../../utils/settings";
const {mediaURL} = settings;


export default class Bubble extends React.Component
{
    componentDidMount()
    {
        let el = this;
        this.nv.addEventListener("animationcomplete", function animationListener(evt){
            if(evt.detail.name === "animation__appear")
            {
                //Riattivo la lunghezza del raycast
                let cursor = document.querySelector("#cursor");
                cursor.setAttribute('raycaster', 'far: 10000');
                cursor.setAttribute('material', 'visible: true');
                cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                cursor.setAttribute('color', 'black');
                el.props.handler(el.props.img);
            }
            this.components[evt.detail.name].animation.reset();
        });
    }

    render() {
        const curves = this.props.transitions.map(curve => {
            return(
                <Curved key={"keyC"+ curve.uuid} object_uuid={curve.uuid} vertices={curve.vertices}/>
            );
        });
        const sound = <Sound track={this.props.track} id = {this.props.name}/>;
        return(
            <Entity _ref={elem => this.nv = elem} primitive="a-sky" id={this.props.name} src={'#' + this.props.img}
                    radius="10" material={this.props.material} muted={'active: ' + this.props.activeScene}>
                {curves}
            </Entity>
        );
    }
}