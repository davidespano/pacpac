import React from "react";

function IndexTutorial(properties){

    let props = properties.props,
        component = properties.component;


    return (
        <div className={"indextutorialmanager"}>

            <h1>Non so come...</h1>
            <ul className="list-group">
                <a href="https://youtu.be/pG56YWP3Pu8"
                   class="list-group-item list-group-item-action" target="_blank">Creare un gioco</a>

                <a href="https://youtu.be/pG56YWP3Pu8&t=0m16s"
                   class="list-group-item list-group-item-action" target="_blank">Inserire un asset</a>

                <a href="https://youtu.be/pG56YWP3Pu8&t=0m41s"
                   class="list-group-item list-group-item-action" target="_blank">Creare una scena</a>

                <a href="https://youtu.be/YS0c1T26lfs"
                   class="list-group-item list-group-item-action" target="_blank">Usare le transizioni</a>

                <a href="https://youtu.be/sYnl1uRecO0"
                   class="list-group-item list-group-item-action" target="_blank">Usare gli switch</a>

                <a href="https://youtu.be/6_EnyWGu2kU"
                   class="list-group-item list-group-item-action" target="_blank">Usare le chiavi</a>

                <a href="https://youtu.be/yvBDNV8mFTI"
                   class="list-group-item list-group-item-action" target="_blank">Inserire un'animazione</a>

            </ul>

        </div>
    );
}





export default IndexTutorial;