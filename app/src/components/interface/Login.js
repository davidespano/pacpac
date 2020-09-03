import React from 'react';
import AuthenticationAPI from "../../utils/AuthenticationAPI";
import InputRegisterForm from "./InputRegisterForm";
import SetGameId from "./SetGameId";
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";
import AudioAPI from "../../utils/AudioAPI";
import Actions from "../../actions/Actions";

function Login(props){

        return(
            <React.Fragment>
                {submitGame()}
                <div className={"loginBackground"}>
                    <InputRegisterForm {...props}/>
                    <SetGameId {...props}/>
                    <div className={'login-home'} onKeyDown={(event) => {
                        if(event.key === 'Enter'){
                            submitUser()
                        }}}>
                        <h4 className={"loginlabel"}>Login</h4>
                        <div className="form-group">
                            <label className={'box-titles'} htmlFor="exampleInputEmail1">Username</label>
                            <input type="text" className="form-control" id="InputUser" aria-describedby="emailHelp"
                                   placeholder="Username"/>
                        </div>
                        <div className="form-group">
                            <label className={'box-titles'} htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="InputPassword" placeholder="Password"/>
                        </div>
                        <div className={'form-group'}>
                            <button className="btn login-btn" onClick={()=>submitUser()}>Accedi</button>
                        </div>
                        <div className={'form-group'}>
                            <a id={'gameId-link'} data-toggle="modal" data-target="#gameId-modal">Inserisci un codice</a>
                        </div>
                        <div className={'form-group'}>
                            <a id={'register-link'} data-toggle="modal" data-target="#register-modal">Registrati</a>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
}

function submitGame(){
    const gameValues = new URLSearchParams(window.location.search);
    const gameId = gameValues.get('gameId');

    console.log(gameId);
    if(gameId != null){
        if(gameId.length === 32) {
            SceneAPI.getHomeScene(gameId);
            SceneAPI.getAllScenesAndTags(gameId);
            MediaAPI.getAllAssets(gameId);
            AudioAPI.getAllAudios(gameId);
            setTimeout(function(){
                Actions.playModeOn(gameId)
            }, 3000);
        } else {
            alert('Codice non valido!');
        }
    }

}

function submitUser(){
    let username = document.getElementById("InputUser").value;
    let password = document.getElementById("InputPassword").value;
    AuthenticationAPI.login(username,password).then(
        function (response) { //success
        AuthenticationAPI.getUserDetail().catch((error)=>{console.log(error)});
    },
        function(error){ //failure
        if(error.toString().includes("Internal Server Error")){
            alert('Connessione al server non riuscita');
        } else {
            alert('Nome utente o password errati');
        }
    });
}

export default Login;