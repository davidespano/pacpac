import React from 'react';
import ActionTypes from "../../actions/ActionTypes";

function Canvas(props){

    if(props.mode === ActionTypes.EDIT_MODE_ON && props.centroids){
        return(
            <canvas id={'central-canvas'}>
                {drawCentroids(props.centroids)}
            </canvas>
        );
    }

    return (<canvas id={'central-canvas'}> </canvas>);
}

function drawCentroids(centroids) {
    /*
    let canvas = document.getElementById("central-canvas");

    if (canvas) {
        let ctx = canvas.getContext("2d");
        [...centroids.values()].map( centroid => {
            ctx.moveTo(centroid[0], centroid[1]);
            ctx.arc(centroid[0], centroid[1], 5, 0, 2 * Math.PI);
        });
        ctx.fill();
    }
    */

}

export default Canvas;