import 'aframe';
import React from 'react';
import {Entity} from 'aframe-react';


function Curved(props)
{
    return(
        <Entity primitive="a-curvedimage"  id={"curv" + props.target} material="opacity: 0; visible: false" rotation={props.rotation} radius = "9.5" theta-length={props.theta}
                height={props.height} selectable={'target:' + props.target}/>
    );
}

function Sound(props)
{
    return(
        <Entity sound={"src: http://localhost:3000/media/2k/" + props.track + "; autoplay: true"} />
    );
}



export {Curved, Sound}