import React from 'react';

function Leftbar(props){

    console.log(props.leftbar);
    //props.leftbar.forEach(function(a) {console.log(a)});
    //Array.prototype.forEach.call(props.leftbar, a=> {console.log(a); console.log("che bella la vita")});

    return(
        <div className={'leftbar'}>
            {[...props.leftbar].forEach(child => (
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