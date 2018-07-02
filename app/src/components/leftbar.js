import React from 'react';

function Leftbar(props){

    //console.log("RENDERING LEFTBAR...");
    //console.log(props.leftbar.values());
    //console.log(props.leftbar);

    return(
        <div className={'leftbar'}>
            {[...props.leftbar.values()].map(child => (
                <div key={child.name}>
                    <img
                        src={"http://localhost:3000/media/" + child.img}
                        className={'list-img'}
                        alt={child.name}
                    />
                </div>
            ))}
        </div>
    )
}
export default Leftbar;