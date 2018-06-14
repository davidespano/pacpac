import React from 'react';

function Leftbar(props){

    console.log(props.leftbar);

    return(
        <div className={'leftbar'}>
            <ul id="leftBar">
                {[props.leftbar.values()].map(child => (
                        <li>
                            {child.name}
                        </li>
                    )
                )}
            </ul>
        </div>
    )
}
export default Leftbar;