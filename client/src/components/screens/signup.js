import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min';

const Signup = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url]);

    const uploadPic = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "Ansul-project");
        data.append("cloud_name", "ded9tc23y");

        fetch("https://api.cloudinary.com/v1_1/ded9tc23y/image/upload", {
            method: "POST",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url);
                console.log(data);
            })
            .catch(error => console.error("Error:", error));
    };

    const uploadFields = () => {
        const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailPattern.test(email)) {
            M.toast({ html: "Invalid email format", classes: "#ef5350 red lighten-1" });
            return;
        }

        setIsLoading(true);
        fetch("http://localhost:5001/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nameusers: name,
                email: email,
                password: password,
                pic: url
            })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
                } else {
                    M.toast({ html: data.message, classes: "#43a047 green lighten-1" });
                }
            })
            .catch(error => {
                setIsLoading(false);
                M.toast({ html: error, classes: "#ef5350 red lighten-1" });
                console.error("Error:", error);
            });
    };

    const postData = () => {
        if (image) {
            uploadPic();
        } else {
            uploadFields();
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="loader-sign">
                    <div className="preloader-wrapper big active">
                        <div className="spinner-layer spinner-blue-only">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"></div>
                            </div>
                            <div className="circle-clipper right">
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
                                placeholder="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
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
                            <div className="file-field input-field">
                                <div className="btn">
                                    <span>Profile Photos</span>
                                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                                </div>
                            </div>
                            <button onClick={postData} className="btn waves-effect waves-light">
                                Sign Up
                            </button>
                            <h5>
                                <Link to="/login">Already have an account?</Link>
                            </h5>
                        </>
                    </div>
                </div>
            )}
        </>
    );
};

export default Signup;
