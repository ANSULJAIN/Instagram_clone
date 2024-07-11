import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
import { useContext } from "react";
import {UserContext} from '../../App'
const Login = () => {
    const {state,dispatch} = useContext(UserContext)
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // Check if the email is valid
    const postData = () => {
        const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailPattern.test(email)) {
            M.toast({ html: "Invalid email format", classes: "#ef5350 red lighten-1" });
            return;
        }

        setIsLoading(true);
        fetch("http://localhost:5001/singin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                email: email
               
            })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
                } else {
                    // M.toast({ html: data.message, classes: "#43a047 green lighten-1" });
                    localStorage.setItem("jwt",data.token);
                    localStorage.setItem("user",JSON.stringify(data.user));
                M.toast({ html: "signedin", classes: "#66bb6a green lighten-1" });
                console.log(data);
                    dispatch({type:"USER",payload:data.user})
                    navigate("/");
                }
                
            })
            .catch(error => {
                setIsLoading(false);
                M.toast({ html: error, classes: "#ef5350 red lighten-1" });
                console.error("Error:", error);
            });
    };

    return (
        <>
            {isLoading ? (

             <div className="loader-sign">  <div className="preloader-wrapper big active ">
                    <div className="spinner-layer spinner-blue-only">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div><div className="gap-patch">
                            <div className="circle"></div>
                        </div><div class="circle-clipper right">
                            <div className="circle"></div>
                        </div>
                    </div>
                </div>
                </div> 
            ) : (
                <div className="mycard">
                    <div className="card auth-card">
                        <h2>Instagram</h2>
                        <>
                           
                            <input
                                type="text"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={postData} className="btn waves-effect waves-light">
                                Sign Up
                            </button>
                            <h5>
                                <Link to="/login">Don't have an account?</Link>
                            </h5>
                        </>
                    </div>
                </div>
            )}
        </>

    );
}

export default Login;
