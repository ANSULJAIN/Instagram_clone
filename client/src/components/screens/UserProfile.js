import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
import './Profile.css'; // Importing the CSS file for styling

const Profile = () => {
    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showFollow, setShowFollow] = useState(() => {
        if (state) {
            return !state.following.includes(userid);
        } else {
            return true;
        }
    });
    const defaultAvatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"; // Gravatar default avatar 
    useEffect(() => {
        fetch(`http://localhost:5001/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
          .then(result => {
              console.log(result);
              setProfile(result);
          })
          .catch(error => console.error('Error:', error));
    }, [userid]);

    const followUser = () => {
        fetch('http://localhost:5001/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
          .then(data => {
              console.log(data);
              dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
              localStorage.setItem("user", JSON.stringify(data));
              setProfile((prevState) => ({
                  ...prevState,
                  user: {
                      ...prevState.user,
                      followers: [...prevState.user.followers, state._id]
                  }
              }));
              setShowFollow(false);
          })
          .catch(error => console.error('Error:', error));
    };

    const unfollowUser = () => {
        fetch('http://localhost:5001/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
          .then(data => {
              dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
              localStorage.setItem("user", JSON.stringify(data));
              setProfile((prevState) => {
                  const newFollowers = prevState.user.followers.filter(item => item !== state._id);
                  return {
                      ...prevState,
                      user: {
                          ...prevState.user,
                          followers: newFollowers
                      }
                  };
              });
              setShowFollow(true);
          })
          .catch(error => console.error('Error:', error));
    };

    if (!userProfile) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-pic">
                    <img src={(userProfile.user.pic)?userProfile.user.pic:defaultAvatar} />
                </div>
                <div className="profile-details">
                    <h4>{userProfile.user ? userProfile.user.nameusers : "Loading..."}</h4>
                    <h5>{userProfile.user ? userProfile.user.email : "Loading..."}</h5>
                    <div className="profile-stats">
                        <h6>{userProfile.posts ? userProfile.posts.length : 0} posts</h6>
                        <h6>{userProfile.user && userProfile.user.followers ? userProfile.user.followers.length : 0} followers</h6>
                        <h6>{userProfile.user && userProfile.user.following ? userProfile.user.following.length : 0} following</h6>
                    </div>
                    {showFollow ? (
                        <button className="follow-btn" onClick={followUser}>Follow</button>
                    ) : (
                        <button className="unfollow-btn" onClick={unfollowUser}>Unfollow</button>
                    )}
                </div>
            </div>
            <div className="gallery">
                {userProfile.posts && userProfile.posts.map((item) => (
                    <img key={item._id} className="gallery-item" src={item.photo} alt={item.title} />
                ))}
            </div>
        </div>
    );
}

export default Profile;
