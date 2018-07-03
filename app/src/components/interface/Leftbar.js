import React from 'react';

function Leftbar(props){

    return(
        <div className={'leftbar'}>
            {[...props.leftbar.values()].map(child => (
                <div key={child.name}>
                    <label>{child.name}</label>
                    <img
                        src={"http://localhost:3000/media/" + child.img}
                        className={'list-img'}
                        alt={child.name}
                        title={title(child)}
                    />
                </div>
            ))}
        </div>
    )
}

function title(child){
    let label = "---"
    return (
        "Scena: " + child.name +
        "\nEtichetta: " + label
    );
}


export default Leftbar;