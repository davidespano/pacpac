import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";
import {Network} from "vis";
import {DataSet} from "vis";


const {mediaURL} = settings;

function Leftbar(props) {

    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    return (
        <div className={'leftbar'} id={'leftbar'}>
            {
                //graph(props, path)
                list(props, path)
            }
        </div>
    )
}


//generate simple list
function list(props, path) {
    let regex = RegExp('.*\.mp4$');

    return ([...props.scenes.values()].map(child => {
        console.log(!regex.test(child.img));

        if (!(regex.test(child.img))) {
            return (
                <div key={child.name} className={'node_element'}>
                    <label className={"list-title"}>{child.name}</label>
                    <img
                        src={path + child.img}
                        className={'list-img'}
                        alt={child.name}
                        title={title(child)}
                        onClick={() => {
                            let scene = props.scenes.get(child.name);
                            SceneAPI.getByName(child.img, scene);
                            props.updateCurrentScene(scene);
                            console.log(props.scenes);
                        }}

                    />
                </div>)
        } else {
            return (
                <div key={child.name} className={'node_element'}>
                    <label className={"list-title"}>{child.name}</label>
                    <video muted preload={"auto"} className={'video_element'} onClick={() => {
                        let scene = props.scenes.get(child.name);
                        SceneAPI.getByName(child.img, scene);
                        props.updateCurrentScene(scene);
                    }}>
                        <source src={path + child.img} type="video/mp4"/>
                    </video>
                </div>
            )
        }
    }));

}

//generate graph
function graph(props, path) {

    if (props.scenes) {
        //console.log('initializing nodes and edges')
        let nodes = new DataSet();
        let edges = new DataSet();
        let container = document.getElementById('leftbar');

        if (container != null) {
            let x = container.offsetWidth / 2;
            let i = 0;
            [...props.scenes.values()].forEach(child => {
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


function title(child) {

    return (
        "Scena: " + child.name +
        "\nEtichetta: " + child.tag.tagName
    );
}

function generateNewNetwork(container, nodes, edges) {

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

    setNetworkProperties(network, nodes, edges);

}

function SceneNode(name, img, tag, path, title, x, i) {
    this.id = name;
    this.img = img;
    this.image = path + img;
    this.label = name;
    this.shape = 'image';
    this.size = 50;
    this.color = {
        border: tag.tagColor
    };
    this.hover = title;
    this.x = x;
    this.y = 100 * i;
}

function setNetworkProperties(network, nodes, edges) {

    //scene selection
    network.on('selectNode', (object) => {
        let node = nodes.get(object.nodes)[0]; //get selected node
        console.log(node);
        SceneAPI.getByName(node.img);
    })
}

export default Leftbar;