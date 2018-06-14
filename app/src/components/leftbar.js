import React from 'react';

function Leftbar(props){

    console.log(props.leftbar.values());

    return(
        <div className={'leftbar'}>
            {[...props.leftbar.values()].reverse().map(child => (
                <div>
                <img
                    src={child.img}
                    className={'list-img'}
                    alt={child.name}
                    onMouseOver={() => console.log(child.name)}
                />
                </div>
            ))}
        </div>
    )
}
export default Leftbar;