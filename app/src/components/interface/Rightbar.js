import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";

function RightBar(props){
    
    return(
        <div className={'rightbar'}>Proprietà
            {optionsView(props.rightbar.currentObject, props.rightbar.currentType)}
        </div>
    );
}

function optionsView(object,type){

    console.log(object)
    console.log(type)
    //let object = rightbar.currentObject;
    if(!object){
        return (
            <div className={'currentObjectOptions'}>
               <p>Nessun oggetto selezionato</p>
            </div>
        );
    }
    //lista visualizzazione per tipo ti oggetto

    if(type === InteractiveObjectsTypes.TRANSITION){
        console.log("dfiohs")
        return(
        <div className={'currentObjectOptions'}>
            <label>media che fa cose</label>
            <input value={"non ho ancora idea"}/>
            <label>Duration</label>
            <input value={object.duration}/>
            <label>Rotation</label>
            <input className={"rotationInput"} value={object.rotationX}/>
            <input className={"rotationInput"} value={object.rotationY}/>
            <input className={"rotationInput"} value={object.rotationZ}/>
            <label>Theta</label>
            <input value={object.theta}/>
            <label>Height</label>
            <input value={object.height}/>
        </div>
        )
    }


}


export default RightBar;