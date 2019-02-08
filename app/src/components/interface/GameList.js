import React from 'react';

function GameList(props) {

    console.log(props);
    let buttons = props.editor.user.games.map((g,i)=>{

       return(
           <button id={g} type="button" className="list-group-item list-group-item-action">Gioco {i+1}</button>
       );
    });

    return (
        <div class="list-group">
            {buttons}
        </div>
    );
}

export default GameList;