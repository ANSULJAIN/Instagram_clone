import react from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    useEffect(() => {
        if (url) {
            fetch("http://localhost:5001/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title: title,
                    body: body,
                    pic: url

                })
            })
                .then(res => res.json())
                .then(data => {

                    if (data.error) {
                        M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
                    } else {
                        // M.toast({ html: data.message, classes: "#43a047 green lighten-1" });
                        M.toast({ html: "Posted", classes: "#66bb6a green lighten-1" });
                        console.log(data);

                        navigate("/");
                    }

                })
                .catch(error => {

                    M.toast({ html: error, classes: "#ef5350 red lighten-1" });
                    console.error("Error:", error);
                });
        }

    }, [url])
    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "Ansul-project")
        data.append("cloud_name", "ded9tc23y")
       

        fetch("https://api.cloudinary.com/v1_1/ded9tc23y/image/upload", {
            method: "POST",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
                console.log(data)
            })

    }

    return (
        <div className="card input-field" style={{
            margin: "40px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <input type="text" placeholder="title" value={title} onChange={(e) => {
                setTitle(e.target.value);
            }} />
            <input type="text" placeholder="body" value={body} onChange={(e) => {
                setBody(e.target.value);
            }} />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload</span>
                    <input type="file" onChange={(e) => { setImage(e.target.files[0]) }} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />


                </div>
            </div>
            <button className="btn waves-effect waves-light" onClick={postDetails}>Post</button>
        </div>
    )


}

export default CreatePost;