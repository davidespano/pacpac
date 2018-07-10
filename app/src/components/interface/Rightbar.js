import React from 'react';

function RightBar(props){
    
    return(
        <div className={'rightbar'}>Proprietà
            {optionsView(props.rightbar.currentObject, props.rightbar.currentType)}
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
    //lista visualizzazione per tipo ti oggetto
    if(type == 'TRANSITION'){
        <div className={'rightbarelement'}>
            <label>media che fa cose</label>
            <label>Duration</label>
            <input value={object.duration}/>
            <label>Rotation</label>
            <input value={}/>
        </div>
    }

}


export default RightBar;