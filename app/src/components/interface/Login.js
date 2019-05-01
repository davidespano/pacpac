import React from 'react';
import AuthenticationAPI from "../../utils/AuthenticationAPI";
import InputRegisterForm from "./InputRegisterForm";


function Login(props){

        return(
            <React.Fragment>
                <div className={'login-home'} onKeyDown={(event) => {
                    if(event.key === 'Enter'){
                        submitUser()
                    }}}>
                    <h4 className={"loginlabel"}>Login</h4>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Username</label>
                        <input type="text" className="form-control" id="InputUser" aria-describedby="emailHelp"
                               placeholder="Username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="InputPassword" placeholder="Password"/>
                    </div>
                    <button className="btn btn-primary" onClick={()=>submitUser()}>Invia</button>
                    <button className="btn btn-primary" data-toggle="modal" data-target="#register-modal">Registrati</button>
                </div>
                <InputRegisterForm/>
            </React.Fragment>
        )
}

function submitUser(){
    let username = document.getElementById("InputUser").value;
    let password = document.getElementById("InputPassword").value;
    AuthenticationAPI.login(username,password).then(function (response) {
        AuthenticationAPI.getUserDetail().catch((error)=>{console.log(error)});
    }).catch(function(err){
        alert('Nome utente o password errati');
        console.log(err);
    });
}

export default Login;