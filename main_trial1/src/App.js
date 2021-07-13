import {Route, Switch} from 'react-router-dom';
import User from './pages/User';
import Welcome from './pages/Welcome.js';
//import Login from './pages/Login.js';
//import Register from './pages/Register.js';
import VideoCall from './pages/VideoCall.js';
import Team2 from './components/Team2';
import SignUp from './pages/LoginSignup/components/Signup'
import Login from './pages/LoginSignup/components/Login'
import { Container } from "react-bootstrap"
import { AuthProvider } from "./pages/LoginSignup/contexts/AuthContext"
import { BrowserRouter as Router} from "react-router-dom"
//import Dashboard from "./Dashboard"
import PrivateRoute from "./pages/LoginSignup/components/PrivateRoute"



//import './App.css';
//import { useImperativeHandle } from 'react';

function App() {
  return (
    <div>
      <main>
      
      <AuthProvider>
      <Route path = "/welcome" >
        <Welcome/>
      </Route>
      <Route path = "/register">
       <SignUp/>
      </Route>
      <Route path = "/login">
        <Login></Login>
      </Route>
      <PrivateRoute path = "/user/:userID" >
        <User></User>
      </PrivateRoute>
      <PrivateRoute path = "/videoCall/:roomID">
        <VideoCall></VideoCall>
      </PrivateRoute>
      </AuthProvider>
     
    
      
      </main>
      
      
    </div>
  );
}

export default App;
