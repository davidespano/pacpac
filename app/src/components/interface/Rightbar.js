import React from 'react';

function RightBar(props){
    return(
        <div className={'rightbar'}>Proprietà
            <div className={'currentObjectOptions'}>
                {[...props.rightbar].map( value => (
                    <p>{value.currentObject}</p>
                ))}
            </div>
        </div>
    );
}

export default RightBar;