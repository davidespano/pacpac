import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";
import {Network} from "vis";
import {DataSet} from "vis";


const {mediaURL} = settings;

function Leftbar(props){

    let path =`${mediaURL}${window.sessionStorage.getItem("gameID")}/`;

    return(
        <div className={'leftbar'} id={'leftbar'}>
            {graph(props, path)}
        </div>
    )
}

/**
 *
 [...props.leftbar.values()].map(child => (
 <div key={child.name}>
 <label className={"list-title"}>{child.name}</label>
 <img
 src={`${mediaURL}${window.sessionStorage.getItem("gameID")}/` + child.img}
 className={'list-img'}
 alt={child.name}
 title={title(child)}
 onClick={()=> SceneAPI.getByName(child.img)}
 />
 </div>
 ))**/

function graph(props, path) {

    if(props.leftbar) {
        //console.log('initializing nodes and edges')
        let nodes = new DataSet();
        let edges = new DataSet();
        let container = document.getElementById('leftbar');

        if(container != null){
            let x = container.offsetWidth / 2;
            let i = 0;
            [...props.leftbar.values()].forEach(child => {
                nodes.add(new SceneNode(child.name, child.img, child.tag, path, title(child), x, i));
                //child.transitions.forEach(transition => {
                //    transition.rules.forEach(rule => {
                //        let target = rule.action.target;
                //        if (target !== '') {
                //            edges.add({from: child.name, to: rule.action.target});
                //        }
                //    })
                i++;
            });
            //});
            //console.log(nodes);
            //console.log(edges);
            generateNewNetwork(container, nodes, edges);
        }
    }
}


function title(child){

    return (
        "Scena: " + child.name +
        "\nEtichetta: " + child.tag.tagName
    );
}

function generateNewNetwork(container, nodes, edges){

    let data = {
        nodes: nodes,
        edges: edges
    };

    let options = {
        width: container.offsetWidth + 'px',
        //height: (nodes.length * 100) + 'px',
        nodes: {
            fixed: true,
            borderWidth: 1,
            borderWidthSelected: 2,
            scaling: {
                min: 50,
                max: 50,
            },
        },
        physics: false,
        interaction: {
            zoomView: false,
            dragView: false,
        },
        autoResize: false,
    };

    let network = new Network(container, data, options);

    network.on('selectNode', (object) =>{
        let node = nodes.get(object.nodes)[0]; //get selected node
        console.log(node);
        SceneAPI.getByName(node.img);
    })

}

function SceneNode(name, img, tag, path, title, x, i){
    this.id = name;
    this.img = img;
    this.image = path + img;
    this.label = name;
    this.shape = 'image';
    this.size = 30;
    this.color = {
        border: tag.tagColor
    };
    this.hover = title,
    this.x = x;
    this.y = 100 * i;
}

export default Leftbar;