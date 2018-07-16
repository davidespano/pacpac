import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import Actions from "../../actions/Actions";

function RightBar(props){
    
    return(
        <div className={'rightbar'}>
            <a>Proprietà</a>
            <button onClick={()=> culoDiGallina(props.interactiveObjects)}>ObjectList</button>
            <div id={'rbContainer'}>
                <div id={'rightbarView'}>
                    {optionsView(props.rightbar.currentObject, props.rightbar.currentType)}
                </div>
            </div>
        </div>
    );
}

function optionsView(object,type){

    //let object = rightbar.currentObject;
    if(!object){
        return (
            <div className={'currentObjectOptions'}>
               <p>Nessun oggetto selezionato</p>
            </div>
        );
    }
    //lista visualizzazione per tipo di oggetto
    if(type === InteractiveObjectsTypes.TRANSITION){
    cleanRightBar('righbarView');
        return(
        <div className={'currentObjectOptions'}>
            <label>media che fa cose</label>
            <div>
                <label>Nome</label>
                <input
                    id={"transitionName"}
                    className={"transitionInput"}
                    type={"text"}
                    defaultValue={object.name}
                />
                <label>Duration</label>
                <input id={"transitionDuration"}
                       className={"transitionInput"}
                       defaultValue={object.duration}
                       type={"text"}
                       onInput={()=> { onlyNumbers("transitionDuration")} }
                />
            </div>
            <div>
                <label>Rotation</label>
                <input
                       id={"rotationX"}
                       className={"rotationInput"}
                       defaultValue={object.rotationX}
                       type={"text"}
                       onInput={()=> { onlyNumbers("rotationX")} }
                />
                <input
                    id={"rotationY"}
                    className={"rotationInput"}
                    defaultValue={object.rotationY}
                    type={"text"}
                    onInput={()=> { onlyNumbers("rotationY")} }
                />
                <input
                    id={"rotationZ"}
                    className={"rotationInput"}
                    defaultValue={object.rotationZ}
                    type={"text"}
                    onInput={()=> { onlyNumbers("rotationZ")} }
                />
            </div>
            <div>
                <label>Theta</label>
                <input
                    id={"transitionTheta"}
                    className={"transitionInput"}
                    defaultValue={object.theta}
                    type={"text"}
                    onInput={()=> { onlyNumbers("transitionTheta")} }
                />
            </div>
            <div>
                <label>Height</label>
                <input
                    id={"transitionHeight"}
                    className={"transitionInput"}
                    defaultValue={object.height}
                    type={"text"}
                    onInput={()=> { onlyNumbers("transitionHeight")} }
                />
            </div>
        </div>
        )
    }

}
//https://stackoverflow.com/questions/8808590/html5-number-input-type-that-takes-only-integers/17208628
function onlyNumbers(id) {
    let prova =document.getElementById(id);
    prova.value = prova.value.replace(/[^0-9.]/g, '');
    prova.value = prova.value.replace(/(\..*)\./g, '$1');
}

function culoDiGallina(lista) {
    var view= document.getElementById('rightbarView');

    lista.forEach(child => {
        let r = document.createElement('a');
        r.class = 'object-element';
        r.innerHTML = child.name;
        view.appendChild(r);
    })
}


function cleanRightBar(id){
    let canvas = document.getElementById(id);
    if(canvas != null) {
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }
    }
}
export default RightBar;

