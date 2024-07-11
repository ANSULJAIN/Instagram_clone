import React,{useContext}from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
// import './App.css'
const NavBar = () => {
    const {state,dispatch} = useContext(UserContext);
    const navigate = useNavigate();
    const list = ()=>{
        if(state){
            return[<>
              <li><Link to="/profile"style={{fontSize:'20px'}}>Profile</Link></li>
                <li><Link to="/createpost"style={{fontSize:'20px'}}>Create Post</Link></li>
                <li><Link to="/myfollowerspost"style={{fontSize:'20px'}}>following</Link></li>

                <li className='navlog'>
                <button onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"});
                    navigate('/login')
                }} className="btn waves-effect waves-light log" >
                                Logout
                            </button>
                </li>
                </>
            ]
        }
        else{
            return[<>
                <li><Link to="/login"style={{fontSize:'20px'}}>Login</Link></li>
                <li><Link to="/signup"style={{fontSize:'20px'}}>SignUp</Link></li>
                </>
            ]
        }
    }
    return (
        <div>
            <nav>
                <div className="nav-wrapper white" style={{color:'black'}}>
                    <a href="/" className="brand-logo left">Logo</a>
                    <ul id="nav-mobile" className="right" style={{fontSize:'40px'}}>
                    {list()}
                        

                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
