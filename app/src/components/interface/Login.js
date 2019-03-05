import React from 'react';
import AuthenticationAPI from "../../utils/AuthenticationAPI";


function Login(props){

        return(
            <div className={'login-home'} onKeyDown={(event) => {
                if(event.key === 'Enter'){
                    submitUser()
                }}}>
                <h4 className={"loginlabel"}>Login</h4>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Username</label>
                    <input type="text" className="form-control" id="InputUser" aria-describedby="emailHelp"
                           placeholder="Enter username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="InputPassword" placeholder="Password"/>
                </div>
                <button className="btn btn-primary" onClick={()=>submitUser()}>Submit</button>
            </div>
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