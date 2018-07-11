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
        console.log('initializing nodes and edges')
        let nodes = new DataSet();
        let edges = new DataSet();
        [...props.leftbar.values()].forEach(child => {
            nodes.add(new SceneNode(child.name, child.img, child.tag, path, title(child)));
            //child.transitions.forEach(transition => {
            //    transition.rules.forEach(rule => {
            //        let target = rule.action.target;
            //        if (target !== '') {
            //            edges.add({from: child.name, to: rule.action.target});
            //        }
            //    })
            });
        //});
        console.log(nodes);
        console.log(edges);
        generateNewNetwork(nodes, edges);
    }
}


function title(child){

    return (
        "Scena: " + child.name +
        "\nEtichetta: " + child.tag.tagName
    );
}

function generateNewNetwork(nodes, edges){

    let container = document.getElementById('leftbar');

    if(container != null){
        let data = {
            nodes: nodes,
            edges: edges
        };

        let options = {
            width: container.offsetWidth + 'px',
            nodes: {
                fixed: true,
            },
            borderWidth: 1,
            borderWidthSelected: 2,
            physics: false,
            interaction: {
                dragNodes: true,
                zoomView: false,
                dragView: false
            }
        };

        let network = new Network(container, data, options);

        network.moveTo({
            position: {x:0, y:0}
        })
    }
}

function SceneNode(name, img, tag, path, title){
    this.id = name;
    this.image = path + img;
    this.label = name;
    this.shape = 'image';
    this.size = 25;
    this.color = {
        border: tag.tagColor
    };
    this.title = title;
}

export default Leftbar;