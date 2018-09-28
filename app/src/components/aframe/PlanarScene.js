import React from "react";
import {Entity} from 'aframe-react';

export default class PlanarScene extends React.Component{
    render() {

        return(
            <Entity primitive="a-video" id={this.props.name}
                    src={"http://localhost:3000/media/2k/" + "provaPlane.mp4"} position={"0 0 -43"} geometry={"height: 9; width: 16"}>
            </Entity>
        );
    }
}