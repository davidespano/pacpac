import React from 'react';

function RightBar(props){
    
    return(
        <div className={'rightbar'}>Proprietà
            {optionsView(props.rightbar.currentObject)}
        </div>
    );
}

function optionsView(object){
    //let object = rightbar.currentObject;
    console.log(object);
    if(object){
        return(
            <div className={'currentObjectOptions'}>
                <p>{object.name}</p>
            </div>
        );
    }else{
        return (
            <div className={'currentObjectOptions'}>
               <p>Nessun oggetto selezionato</p>
            </div>
        );
    }
}


export default RightBar;