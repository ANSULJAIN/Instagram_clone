import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import './Profile.css'; // Importing the CSS file for styling

const Profile = () => {
    const [myPick, setPick] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    const defaultAvatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"; // Gravatar default avatar 

    useEffect(() => {
        fetch('http://localhost:5001/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            setPick(result.posts);
        })
        .catch(error => console.error('Error:', error)); // Optional: handle errors
    }, []);

    useEffect(() => {
        if (image) {
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

                fetch("http://localhost:5001/updatepic", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                })
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                    // Update the local storage and context state
                    localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }));
                    dispatch({ type: "UPDATEPIC", payload: result.pic });
                    window.location.reload()
                })
                .catch(error => console.error("Error:", error));
            })
            .catch(error => console.error("Error:", error));
        }
    }, [image, state, dispatch]);

    const updatePhoto = (file) => {
        setImage(file);
    }

    if (!state) {
        return <div>Loading...</div>; // Show a loading message or spinner while the state is being loaded
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-pic">
                    <img src={state.pic ? state.pic : defaultAvatar} alt="Profile" />
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>Profile Photos</span>
                            <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                        </div>
                    </div>
                </div>
                <div className="profile-details">
                    <h4>{state ? state.nameusers : "loading.."}</h4>
                    <h4>{state ? state.email : "loading.."}</h4>

                    <div className="profile-stats">
                        <h6>{myPick.length} Post</h6>
                        <h6>{state ? state.followers.length : 0} Followers</h6>
                        <h6>{state ? state.following.length : 0} Following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {myPick.map((item) => (
                    <img key={item._id} className="gallery-item" src={item.photo} alt={item.title} />
                ))}
            </div>
        </div>
    );
}

export default Profile;
