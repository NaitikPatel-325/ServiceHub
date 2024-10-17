import { useState , useEffect } from "react";
import "./App.css";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from 'react-hot-toast';
import IssueTracker from "./components/issue/issue";
import axios from "axios";
import IssueDetails from "./components/issue/IssueDetails";
import Profile from "./components/Profile/Profile";

function App() {
    const dispatch = useDispatch()
    const user = useSelector((state : any) => state.user.user) || {};
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loadUser = async () => {
    
      try {
        const res = await axios.get("http://localhost:3000/user/check", { withCredentials: true });
        if (res.data) {
          dispatch({ type: "SET_USER", payload: res.data.user });
          toggleLogin();
        }
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
    loadUser();
  }, [])

  const routes = [
    {
      path: "/",
      name : "Home",
    },
    {
      path: "/about",
      name : "About",
    },
    {
      path:"/issues",
      name : "Issues",
    }
  ]

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Router>
      <Toaster />
      <div className="mb-24 ">
      <Nav toggleLogin={toggleLogin} isLoggedIn={isLoggedIn} routes={routes} user={user} />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/issues" element={<IssueTracker />} />
        <Route path="/issue/:id" element={< IssueDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      </Router>

    </div>
  );
}

export default App;
