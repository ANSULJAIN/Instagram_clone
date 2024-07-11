import React, { useEffect, createContext, useReducer ,useContext} from 'react';
import './App.css';
import NavBar from './components/Navbar';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import Home from './components/screens/Home';
import Login from './components/screens/login';
import Signup from './components/screens/signup';
import Profile from './components/screens/profile';
import CreatePost from './components/screens/CreatePost';
import { reducer, initialState } from './reducer/userReducer';
import Userprofile from './components/screens/UserProfile';
import Post from './components/screens/subscribedUserPost';
export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
//  const {a,b}= useContext(UserContext);

  useEffect(() => {

    if (user) {
      dispatch({type:"USER",payload:user});
     
    }
    else{
    
      navigate("/login")
    }
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:userid" element={<Userprofile />} />
          <Route path="/myfollowerspost" element={<Post/>} />
        



        </Routes>
      </div>
    </UserContext.Provider>
  );
}

function AppWrapper() {
 
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
