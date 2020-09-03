import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import settings from "../../utils/settings";
import * as d3 from "d3";
import $ from "jquery";
import Actions from "../../actions/Actions";

const {mediaURL} = settings;


function GraphViewContent(props) {

    //Dichiarazione e Inizializzazione simulazione.
    let simulation = d3.forceSimulation();
    let nodes;
    let links;
    let circle;
    let rect;

    //Recupero uuid scena iniziale.
    let scenaIniziale = SceneAPI.getHome(props.editor.gameId);

    scenaIniziale.then(result => {

        //Recupero nodi dal database
        let nodidatabase = SceneAPI.getNodes();

        nodidatabase.then(nodidatabase => {

            let arr=JSON.parse(nodidatabase);
            if(arr.length===0){
                nodes = createNodes(props, result);
            }else{
                nodes=arr;
            }


            //Recupero dei collegamenti tra le scene.
            links = createLinks(props);


            links.then(links => {

                //Dimensioni dinamiche del div contente il grafo.
                let width1 = $("#svg-graph").width();
                let height1 = $("#svg-graph").height();

                //Inizializzazione parametri per centrare il grafo all'interno del svg.
                forceProperties.center.x = width1 / 2;
                forceProperties.center.y = height1 / 2;


                //Assegnazione valori dinamici alle barre di scorrimento (input type range).
                d3.select("#x")
                    .text(width1 / 2);

                d3.select("#xi")
                    .attr("max", width1)
                    .attr("value", (width1 / 2));

                d3.select("#y")
                    .text(height1 / 2);

                d3.select("#yi")
                    .attr("max", height1)
                    .attr("value", (height1 / 2));


                let svg = d3.select(".graph")
                    .select("svg");

                //Freccia da posizionare alla fine dei links del grafo in base ai collegamenti tra le scene.
                svg.append("defs").append("marker")
                    .attr("id", 'arrowhead')
                    .attr("viewBox", "1 -5 10 10")
                    .attr("refX", 35)
                    .attr("refY", 0)
                    .attr("orient", "auto")
                    .attr("markerWidth", 5)
                    .attr("markerHeight", 5)
                    .append("path")
                    .attr("d", "M 0,-5 L 10 ,0 L 0,5");


                //Assegnamento delle forze alla simulazione.
                simulation.velocityDecay(0.5)
                    .force("center", d3.forceCenter(width1 / 2, height1 / 2)) //Posiziona il grafo al centro del svg.
                    .force("charge", d3.forceManyBody().strength(0)) // Attrazione dei nodi.
                    .force("link", d3.forceLink().id(function (d) {
                        return d.id
                    }).distance(300)) //I nodi vengono collegati in base al valore del loro id e la distanza dei collegamenti è inizialmente pari a 300.
                    .force("collide", d3.forceCollide(100).iterations(0.5));// Collisione tra i nodi . Radius è il valore che permette ai nodi di non collidere tra loro se le iterazioni sono maggiori di 0.


                //Defs e Pattern utilizzati per la memorizzazione delle immagini da inserire all'interno dei nodi.
                let defs = svg.append("defs");

                defs.selectAll(".pattern")
                    .data(nodes)
                    .enter().append("pattern")
                    .attr("id", function (d) {
                        return d.id;
                    })
                    .attr("width", 1)
                    .attr("height", 1)
                    .attr("patternContentUnits", "objectBoundingBox")
                    .attr("class", "pattern")
                    .append("image")
                    .attr("xlink:href", function (d) {
                        return d.img;
                    })
                    .attr("height", 1)
                    .attr("width", 1)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("preserveAspectRatio", "xMinYMid slice");


                //Collegamenti tra i nodi del grafo.
                let link = svg.selectAll(".link")
                    .data(links) // Valori recuperati dall'array dei collegamenti.
                    .enter()
                    .append("line")
                    .attr("class", "link")
                    .attr("marker-end", "url(#arrowhead)");//Aggiunta della freccia finale in base alla direzione del collegamento.


                //Nodi del grafo
                let node = svg.selectAll(".node")
                    .data(nodes) // Valori recuperati dall'array dei nodi.
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended)); //Funzioni che determinano il trascinamento dei nodi all'interno del svg.


                // Cerchi per le scene di tipo 3D.
                circle = node.filter(d => d.type === "3D")
                    .append("circle")
                    .attr("class", ".node")
                    .attr("r", 50)
                    .text(d => d.id)
                    .style("stroke", d => d.tag)
                    .attr("stroke-width", function (d) {
                        if (d.home) {
                            return 10; // Se è la scena iniziale.
                        } else {
                            return 4;  // Se sono le altre scene
                        }
                    })
                    .attr("stroke-opacity", function (d) {
                        if (d.home) {
                            return 0.3; // Se è la scena iniziale.
                        } else {
                            return 1;  // Se sono le altre scene
                        }
                    })
                    .style("fill", function (d) {
                        return "url(#" + d.id + ")";
                    });  // Asseganzione immagine della scena corrispondente come contenuto del nodo.

                // Rettangoli per le scene di tipo 2D
                rect = node.filter(d => d.type === "2D")
                    .append("rect")
                    .attr("class", ".node")
                    .text(d => d.id)
                    .attr("width", 100)
                    .attr("height", 100)
                    .attr("x", -50)
                    .attr("y", -50)
                    .style("stroke", d => d.tag)
                    .attr("stroke-width", function (d) {
                        if (d.home) {
                            return 10; // Se è la scena iniziale.
                        } else {
                            return 4; // Se sono le altre scene
                        }
                    })
                    .attr("stroke-opacity", function (d) {
                        if (d.home) {
                            return 0.3; // Se è la scena iniziale.
                        } else {
                            return 1; // Se sono le altre scene
                        }
                    })
                    .style("fill", function (d) {
                        return "url(#" + d.id + ")";
                    }); // Asseganzione immagine della scena corrispondente come contenuto del nodo.


                // Informazioni visualizzate sotto ogni nodo (dimensione normale).
                node.append("text")
                    .attr("class", "node-text1")
                    .attr("dy", 90)
                    .attr("dx", 0)
                    .data(nodes)
                    .text(d => d.name);

                // Informazioni visualizzate durante lo zoom sotto ogni nodo.
                node.append("text")
                    .attr("class", "node-text")
                    .attr("dy", 140)
                    .attr("dx", 0)
                    .data(nodes)
                    .text(d => d.name);


                node.append("text")
                    .attr("class", "node-text")
                    .attr("dy", 180)
                    .attr("dx", 0)
                    .data(nodes)
                    .text(d => d.type);


                // Zoom dei nodi (cerchi).
                circle
                    .on("mouseenter", function () {
                        d3.select(this)
                            .transition()
                            .attr("r", 100)

                    })
                    .on("mouseleave", function () {
                        d3.select(this)
                            .transition()
                            .attr("r", forceProperties.collide.radius)
                    })
                    .on("mousemove", function () {
                        d3.select(this)
                            .transition()
                            .attr("r", 100)
                    })
                    .on("click", function () {
                        let currentScene = d3.select(this).text();
                        Actions.updateCurrentScene(currentScene);
                        document.getElementById("nav-game-tab").click(); // Apertura dell'editor di gioco al click del nodo.
                    });


                // Zoom dei nodi (rettangoli).
                rect
                    .on("mouseenter", function () {
                        d3.select(this)
                            .transition()
                            .attr("width", 200)
                            .attr("height", 200)
                            .attr("x", -100)
                            .attr("y", -100)

                    })
                    .on("mouseleave", function () {
                        d3.select(this)
                            .transition()
                            .attr("width", forceProperties.collide.radius * 2)
                            .attr("height", forceProperties.collide.radius * 2)
                            .attr("x", -forceProperties.collide.radius)
                            .attr("y", -forceProperties.collide.radius)
                    })
                    .on("mousemove", function () {
                        d3.select(this)
                            .transition()
                            .attr("width", 200)
                            .attr("height", 200)
                            .attr("x", -100)
                            .attr("y", -100)
                    })
                    .on("click", function () {
                        let currentScene = d3.select(this).text();
                        Actions.updateCurrentScene(currentScene);
                        document.getElementById("nav-game-tab").click(); // Apertura dell'editor di gioco al click del nodo.
                    });


                // Assegnazione dei nodi e dei link alla simulazione
                simulation.nodes(nodes);
                simulation.force("link").links(links);
                simulation.on("tick", tick);


                //Aggiornare le posizioni dei nodi e links.
                function tick() {
                    link.attr("x1", d => d.source.x)
                        .attr("x2", d => d.target.x)
                        .attr("y1", d => d.source.y)
                        .attr("y2", d => d.target.y);

                    node.attr("transform", d => `translate(${d.x},${d.y})`);

                }


                //Funzioni per il trascinamento dei nodi e links.
                function dragstarted(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fy = d.y;
                    d.fx = d.x;
                }

                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }

                function dragended(d) {
                    if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }


                //Salvataggio nodi nel database
                d3.select("#saveBtn").on('click', function () {
                    let nodedata = node.data();
                    SceneAPI.setNodes(nodedata);
                    //cambio da GraphMode a EditMode altrimenti il click forzato non funzionerrebbe in quanto si si trova già in GraphMode.
                    props.switchToEditMode();
                    document.getElementById("nav-graphpview-tab").click();
                });

                //Rimozione nodi dal database
                d3.select("#saveBtn2").on('click', function () {
                    SceneAPI.delNodes();
                    //cambio da GraphMode a EditMode altrimenti il click forzato non funzionerrebbe in quanto si si trova già in GraphMode.
                    props.switchToEditMode();
                    document.getElementById("nav-graphpview-tab").click();
                });


            }).catch(result => {
                console.log(result);
                console.log("ERRORE LINK")
            })
        });
    });


    //Valori iniziali per le forze della simulazione, che verrano modificati poi dall'utente tramite il controllo dei parementri.
    let forceProperties = {
        center: {
            x: 0,
            y: 0
        },

        link: 300,

        collide: {
            radius: 50,
            iterations: 0.5
        },

        strength: 0
    };


    // Funzione per la modifica dei valori delle forze in base ai valori assegnati dall'utente tramite il cotrollo dei parametri esterno al svg.
    function updateAll() {

        links.then(links => {
            simulation.force("center", d3.forceCenter(forceProperties.center.x, forceProperties.center.y));
            simulation.force("link", d3.forceLink().id(function (d) {
                return d.id
            }).distance(forceProperties.link));
            simulation.force("collide", d3.forceCollide(100).iterations(forceProperties.collide.iterations));
            simulation.force("charge", d3.forceManyBody().strength(forceProperties.strength));

            circle.attr("r", forceProperties.collide.radius);
            rect.attr("width", forceProperties.collide.radius * 2)
                .attr("height", forceProperties.collide.radius * 2)
                .attr("x", -forceProperties.collide.radius)
                .attr("y", -forceProperties.collide.radius);


            d3.select('#arrowhead').attr("refX", ((forceProperties.collide.radius / 2) + 10));
            d3.selectAll(".node-text1").attr("dy", (forceProperties.collide.radius - (-40)));

            simulation.nodes(nodes);
            simulation.force("link").links(links);

            simulation.alpha(1).restart();

        })

    }


    //Input range per il controllo dei valori delle forze della simulazione da parte dell'utente, svg, e input range utilizzati come scroll.
    return (

        <div>
            <div className="graph">

                <div className="parameters">

                    <div className="force">
                        <p><label>Collide</label></p>
                        <label>
                            Radius:
                            <output id="radius">50</output>
                            <input type="range" min="0" max="100" defaultValue="50" step="1"
                                   onChange={(value) => {
                                       d3.select('#radius').text(value.target.value);
                                       forceProperties.collide.radius = value.target.value;
                                       updateAll();
                                   }}/>
                        </label>
                        <label>
                            Iterations:
                            <output id="iterations">0.5</output>
                            <input type="range" min="0" max="1" defaultValue="0.5" step="0.1"
                                   onChange={(value) => {
                                       d3.select('#iterations').text(value.target.value);
                                       forceProperties.collide.iterations = value.target.value;
                                       updateAll();
                                   }}/>
                        </label>
                    </div>
                    <div className="force">
                        <p><label>Link</label></p>
                        <label>
                            Distance:
                            <output id="distance">300</output>
                            <input type="range" min="0" max="600" defaultValue="300" step="1"
                                   onChange={(value) => {
                                       d3.select('#distance').text(value.target.value);
                                       forceProperties.link = value.target.value;
                                       updateAll();
                                   }}/>
                        </label>

                    </div>
                    <div className="force">
                        <p><label>Charge</label></p>
                        <label>
                            Strength:
                            <output id="strength">0</output>
                            <input type="range" min="-500" max="500" defaultValue="0" step="1"
                                   onChange={(value) => {
                                       d3.select('#strength').text(value.target.value);
                                       forceProperties.strength = value.target.value;
                                       updateAll();
                                   }}/>
                        </label>
                    </div>

                    <input type="button" value="Salva posizione" id="saveBtn"/>
                    <input type="button" value="Ripristina posizione" id="saveBtn2"/>

                </div>


                <svg id="svg-graph">
                </svg>

                <input id="yi" type="range" min="0" step="1"
                       onChange={(value) => {
                           d3.select('#y').text(value.target.value);
                           forceProperties.center.y = value.target.value;
                           updateAll();
                       }}/>

            </div>

            <div id="div-xi">
                <input id="xi" type="range" min="0" step="1"
                       onChange={(value) => {
                           d3.select('#x').text(value.target.value);
                           forceProperties.center.x = value.target.value;
                           updateAll();
                       }}/>
            </div>


        </div>

    );


}

//Funzione per il recupero delle informazioni della scene utilizzate per la creazione dell'array dei nodi per la simulazione.
function createNodes(props, result) {
    let nodes = [];
    let regex = RegExp('.*\.mp4$');
    let src;
    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    //Per ogni scena
    [...props.scenes.values()].map(child => {
        //Recupero uuid, immagine, etichetta, nome, tipo, e se corrisponde o no alla scena iniziale.
        if(child.uuid !== "ghostScene") {
            src = path + '_thumbnails_/' + child.img + (regex.test(child.img) ? ".png" : "");
            nodes.push({
                "id": child.uuid,
                "img": src,
                "tag": props.tags.get(child.tag).color,
                "name": child.name,
                "type": child.type,
                "home": result === child.uuid
            })
        }
    });


    return nodes;
}


//Funzione asincrona per il recupero dei collegamenti tra le scene utilizzati per la creazione dell'array dei links per la simulazione.
async function createLinks(props) {

    let links = [];
    let gameGraph = {};

    await SceneAPI.getAllDetailedScenes(gameGraph, props.editor.gameId);

    //Per ogni scena
    [...props.scenes.values()].map(child => {
        //Per ogni vicino della scena
        gameGraph.neighbours[child.uuid].map(element => {
            //Recupero la scena e il suo vicino
            if(child.uuid!== "ghostScene" || element!== "ghostScene") {
                links.push({
                    "source": child.uuid,
                    "target": element
                })
            }
        })
    });


    return links;

}

export default GraphViewContent;