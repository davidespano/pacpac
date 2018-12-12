import React from "react";
import {Entity} from 'aframe-react';
import {Curved, Sound} from './aframe_entities';
import settings from "../../utils/settings";


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
                el.props.handler(el.props.scene.img);
            }
            this.components[evt.detail.name].animation.reset();
        });
    }

    render() {
        //generate the interactive areas
        let scene = this.props.scene;
        const curves = Object.values(scene.objects).flat().map(curve => {
            return(
                <Curved key={"keyC"+ curve.uuid} object_uuid={this.props.isActive?curve.uuid:""} vertices={curve.vertices}/>
            );
        });
        //const sound = <Sound track={this.props.track} id = {this.props.name}/>;
        let material = "depthTest: true; ";
        let active = 'active: false;';
        let radius = 9.9;
        if (this.props.isActive) {
            material += "opacity: 1; visible: true;";
            active = 'active: true; video: ' + scene.img;
            radius = 10;
        }
        else material += "opacity: 0; visible: false";
        return(
            <Entity _ref={elem => this.nv = elem} primitive="a-videosphere" visible={this.props.isActive}
                    id={this.props.scene.name} src={'#' + this.props.scene.img} radius={radius}
                    material={material} play_video={active}>
                {curves}
            </Entity>
        );
    }

    componentWillUnmount(){
        delete document.querySelector('a-scene').systems.material.textureCache[this.props.scene.img]
    }
}