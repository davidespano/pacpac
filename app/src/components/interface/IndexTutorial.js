import React from "react";

function IndexTutorial(properties){

    let props = properties.props,
        component = properties.component;

    return (
        <div className={"indextutorialmanager"}  style={{marginLeft: 30}}>

            <h1>Non so come...</h1>
            <div className="row"  id="video_first_row">
                <div className="col-sm-5" class="grid_video">
                    <a href="https://youtu.be/MltuVdDUVW0">
                        <img src={"icons/icons8-new-game-100.png"}></img>
                        <p>Creare un gioco</p>
                    </a>
                </div>
                <div className="col-sm-5" class="grid_video" id="video_assets">
                    <a href="https://youtu.be/MltuVdDUVW0?t=13">
                        <img src={"icons/icons8-add-assets-100.png"}></img>
                        <p>Inserire un assets</p>
                    </a>
                </div>
                <div class="grid_video">
                    <a href="https://youtu.be/MltuVdDUVW0?t=35">
                        <img src={"icons/icons8-add-image-100.png"}></img>
                        <p>Creare una scena</p>
                    </a>
                </div>
            </div>
            <div className="row" >
                <div className="col-sm-3" class="grid_video">
                    <a href="https://youtu.be/WxEJI7Nf3-I">
                        <img src={"icons/icons8-one-way-transition-100.png"}></img>
                        <p>Usare le transizioni</p>
                    </a>
                </div>
                <div className="col-sm-3" class="grid_video">
                    <a href="https://youtu.be/eit0-odWe6Y">
                        <img src={"icons/icons8-toggle-on-filled-100.png"}></img>
                        <p>Usare gli switch</p>
                    </a>
                </div>
                <div className="col-sm-3" class="grid_video">
                    <a href="https://youtu.be/0iGgX-DUpHM">
                        <img src={"icons/icons8-key-100.png"}></img>
                        <p>Usare le chiavi</p>
                    </a>
                </div>
                <div class="grid_video">
                    <a href="https://youtu.be/c4f_BnTbJI0">
                        <img src={"icons/icons8-video-animation-100.png"}></img>
                        <p>Inserire un'animazione</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default IndexTutorial;