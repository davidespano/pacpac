import React from 'react';
import AuthenticationAPI from "../../utils/AuthenticationAPI";

function InputRegisterForm(props){
    return(
        <div id={"register"}>
            <div className="modal fade" id="register-modal" tabIndex="-1" role="dialog" aria-labelledby="register-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="register-modal-label">Registrati</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Username</label>
                                <input type="text" className="form-control" id="RegisterUser" aria-describedby="emailHelp"
                                       placeholder="Username"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" className="form-control" id="RegisterPassword" placeholder="Password"/>
                            </div>
                            <div className="form-group">
                                <label>Conferma Password</label>
                                <input type="password" className="form-control" id="RegisterConfirmPassword" placeholder="Password"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm" onClick={() => register()} data-dismiss="modal">Conferma</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function register(){
    const username = document.getElementById("RegisterUser").value;
    const password = document.getElementById("RegisterPassword").value;
    const confirmPsw = document.getElementById("RegisterConfirmPassword").value;

    if(!username || !password || !confirmPsw){
        alert("Completa tutti i campi");
        return;
    }
    if(password !== confirmPsw){
        alert("Password differenti")
        return;
    }

    AuthenticationAPI.register(username,password).catch((err) => {
        alert("Utente già esistente")
        console.log(err);
    })
}

export default InputRegisterForm;