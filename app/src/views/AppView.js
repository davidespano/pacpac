import React from 'react';

/* La cosa migliore è gestire lo stato solo all'interno dello Store, e lasciare nella view solo funzioni*/
function AppView(props) {
    return (
        <div class="grid-container">
            <TopBar {...props} />
            <LeftBar {...props} />
            <RightBar {...props} />
            <Scene {...props} />
            <Canvas {...props} />
        </div>
    );
}

function TopBar(props){
    return (
        <div class="topbar">
            Header - <a href={"/play.html"}>Play</a>
        </div>
    );
}

function LeftBar(props){
    return(
        <div class="leftbar">Leftbar</div>
    );
}

function RightBar(props){
    return(
        <div class="rightbar">Rightbar</div>
    );
}

function Scene(props){
    return(
        <div class="scene">
            <img src="./Image360/sample1.jpg"/>
        </div>
    );
}

function Canvas(props){
    return(
        <div class="canvas">Canvas</div>
    );
}


export default AppView;