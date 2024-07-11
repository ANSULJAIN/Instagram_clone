import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import 'materialize-css/dist/css/materialize.min.css';

const Home = () => {
    const [allpost, setPost] = useState([])
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:5001/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setPost(result.posts);
            })
            .catch(error => console.error('Error:', error)); // Optional: handle errors
    }, []);
    const likePost = (id) => {
        fetch('http://localhost:5001/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //   console.log(result)
                const newData = allpost.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setPost(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikepost = (Id) => {
        fetch("http://localhost:5001/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: Id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)

                const newData = allpost.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setPost(newData)
            }
            )
            .catch(err => console.log(err))
    }
    // const makeComment = (text, postId) => {
    //     fetch("http://localhost:5001/comment", {
    //         method: "put",
    //         headers: {
    //             "Content-type": "application/json",
    //             "Authorization": "Bearer " + localStorage.getItem("jwt")
    //         },
    //         body: JSON.stringify({
    //             postId: postId,
    //             text: text
    //         })
    //     }).then(res => res.json())
    //         .then(result => {
    //             console.log(result)
    //             const newData = allpost.map(item => {
    //                 if (item._id === result._id) {
    //                     return result
    //                 } else {
    //                     return item
    //                 }
    //             })
    //             setPost(newData)
    //         })
    //         .catch(err => console.log(err))
    // }
    const makeComment = (text, postId) => {
        fetch('http://localhost:5001/comment', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = allpost.map(item => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setPost(newData);
            })
            .catch(err => console.log(err));
    };

    const deletePost = (postId) => {
        fetch(`http://localhost:5001/deletepost/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = allpost.filter(item => {
                    return item._id !== postId;
                });
                setPost(newData);
            }).catch(err => {
                console.error('Error deleting post:', err);
            });
    };


    return (
        <div className="home">
            {
                allpost.map(post => {
                    return (
                        <div className="card home-card" key={post._id}>
                            <h5><Link to={post.postedBy._id !== state._id?"/profile/"+ post.postedBy._id:"/profile"}>{post.postedBy.nameusers}</Link>{post.postedBy._id == state._id && <i className="material-icons" style={{ float: "right", cursor: "pointer" }} onClick={() => deletePost(post._id)}>delete</i>}</h5>
                            <div className="card-image">
                                <img src={post.photo} alt="Signboard on beach" />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite_border</i>
                                <i onClick={() => { likePost(post._id) }} className="material-icons" >thumb_down</i>
                                <i onClick={() => { unlikepost(post._id) }} className="material-icons" >thumb_up</i>




                                <h6>{post.likes.length}</h6>
                                <h6>{post.title}</h6>

                                <p>{post.body}</p>
                              
                                {
                                    post.comments.map((item) => (
                                        <div key={item._id} className="comment">
                                            {item.postedBy ? (
                                                <h6><span>{item.postedBy.nameusers}</span> {item.text}</h6>
                                            ) : (
                                                <h6>{item.text}</h6>
                                            )}
                                        </div>
                                    ))
                                }

                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, post._id)
                                }}>
                                    <input type="text" placeholder="Add a comment" />
                                </form>

                            </div>
                        </div>
                    )
                })
            }

        </div>
    );
};

export default Home;
