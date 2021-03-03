import React from "react";

function IndexTutorial(properties){

    let props = properties.props,
        component = properties.component;

    return (
        <div className={"indextutorialmanager"} style={{marginLeft: 30}}>
            <h1>Non so come...</h1>
            <div className="row"  id="video_first_row">
                <div className="col-sm-5" class="grid_video">
                    <a href="https://youtu.be/pG56YWP3Pu8">
                        <img src={"icons/icons8-new-game-100.png"}></img>
                        <p>Creare un gioco</p>
                    </a>
                </div>
                <div className="col-sm-5" class="grid_video" id="video_assets">
                    <a href="https://youtu.be/pG56YWP3Pu8&t=0m16s">
                        <img src={"icons/icons8-add-assets-100.png"}></img>
                        <p>Inserire un assets</p>
                    </a>
                </div>
                <div class="grid_video">
                    <a href="https://youtu.be/pG56YWP3Pu8&t=0m41s">
                        <img src={"icons/icons8-add-image-100.png"}></img>
                        <p>Creare una scena</p>
                    </a>
                </div>
            </div>
            <div className="row" >
                <div className="col-sm-3" class="grid_video">
                    <a href="https://youtu.be/YS0c1T26lfs">
                        <img src={"icons/icons8-one-way-transition-100.png"}></img>
                        <p>Usare le transizioni</p>
                    </a>
                </div>
                <div className="col-sm-3" class="grid_video">
                    <a href="https://youtu.be/sYnl1uRecO0">
                        <img src={"icons/icons8-toggle-on-filled-100.png"}></img>
                        <p>Usare gli switch</p>
                    </a>
                </div>
                <div className="col-sm-3" class="grid_video">
                    <a href="https://youtu.be/6_EnyWGu2kU">
                        <img src={"icons/icons8-key-100.png"}></img>
                        <p>Usare le chiavi</p>
                    </a>
                </div>
                <div class="grid_video">
                    <a href="https://youtu.be/yvBDNV8mFTI">
                        <img src={"icons/icons8-video-animation-100.png"}></img>
                        <p>Inserire un'animazione</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default IndexTutorial;