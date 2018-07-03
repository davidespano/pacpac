import React from 'react';

function Canvas(props){
    return(
        <div id={'canvas'} className={'canvas'}>Canvas</div>
    );
}

/*
// Called when the Visualization API is loaded.
function draw() {
    // create people.
    // value corresponds with the age of the person
    var myNodeX_1 = 400;
    var myNodeY_1 = 400;
    var myNodeX_2 = 800;
    var myNodeY_2 = 400;
    var myNodeSize = 40;

    nodes = [
        {id: 1,  shape: 'circularImage', x: myNodeX_1, y: myNodeY_1, size:myNodeSize},
        {id: 2,  shape: 'circularImage', x: myNodeX_1, y: myNodeY_1-65, size:myNodeSize/2},
        {id: 3,  shape: 'circularImage', x: myNodeX_1, y: myNodeY_1+65, size:myNodeSize/2},
        {id: 4,  shape: 'circularImage', x: myNodeX_1-65, y: myNodeY_1, size:myNodeSize/2},
        {id: 5,  shape: 'circularImage', x: myNodeX_1+65, y: myNodeY_1, size:myNodeSize/2},
        {id: 6,  shape: 'circularImage', x: myNodeX_2, y: myNodeY_2, size:myNodeSize},
        {id: 7,  shape: 'circularImage', x: myNodeX_2, y: myNodeY_2-65, size:myNodeSize/2},
        {id: 8,  shape: 'circularImage', x: myNodeX_2, y: myNodeY_2+65, size:myNodeSize/2},
        {id: 9,  shape: 'circularImage', x: myNodeX_2-65, y: myNodeY_2, size:myNodeSize/2},
        {id: 10,  shape: 'circularImage', x: myNodeX_2+65, y: myNodeY_2,size:myNodeSize/2}

    ];

    // create connections between people
    // value corresponds with the amount of contact between two people
    edges = [
        {from: 1, to: 2},
        {from: 1, to: 3},
        {from: 1, to: 4},
        {from: 1, to: 5},
        {from: 1, to: 6}
    ];

    // create a network
    var container = document.getElementById('canvas');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var width = window.innerWidth;
    var height = window.innerHeight-100;
    var options = {
        height: height + 'px',
        width: width + 'px',
        nodes: {
            borderWidth:10,
            color: {
                border: '#222222',
                background: '#666666'
            },
            font:{color:'#eeeeee'}
        },
        edges: {
            color: 'red',
            smooth: true
        },
        physics: false,
        interaction: {
            dragNodes: false,// do not allow dragging nodes
            zoomView: false, // do not allow zooming
            dragView: false // do not allow dragging
        }

    };
    network = new Vis.Network(container, data, options);

    // Set the coordinate system of Network such that it exactly
    // matches the actual pixels of the HTML canvas on screen
    // this must correspond with the width and height set for
    // the networks container element.
    network.moveTo({
        position: {x: 0, y: 0},
        offset: {x: -width/2, y: -height/2},
        scale: 1,
    })
}
*/

export default Canvas;