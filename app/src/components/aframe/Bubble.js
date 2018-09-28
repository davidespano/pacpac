import React from "react";
import {Entity} from 'aframe-react';
import {Curved} from './aframe-entities';

export default class Bubble extends React.Component
{
    componentDidMount()
    {
        let el = this;
        this.nv.addEventListener("animationcomplete", function animationListener(evt){
            if(evt.detail.name == "animation__appear")
            {
                //Riattivo la lunghezza del raycast
                let cursor = document.querySelector("#cursor");
                cursor.setAttribute('raycaster', 'far: 10000');
                cursor.setAttribute('material', 'opacity: 0.80');
                cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                cursor.setAttribute('color', 'black');

                el.props.handler(el.props.name);
            }

            this.components[evt.detail.name].animation.reset();
        });
    }

    render()
    {
        const curves = this.props.transitions.map(curve =>
        {
            return(
                <Curved key={"keyC"+ curve.rules[0].actions[0].target} target={curve.rules[0].actions[0].target} vertices={curve.vertices}/>
            );
        });

        return(
            <Entity _ref={elem => this.nv = elem}  primitive="a-sky" id={this.props.name} src={"http://localhost:3000/media/" + this.props.img} radius="10" material={this.props.material}>
                {curves}
            </Entity>
        );
    }
}