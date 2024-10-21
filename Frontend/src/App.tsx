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
import AssignProfessional from "./components/issue/AssignProfessional";
import Profile from "./components/Profile/Profile";
import ProposalList from "./components/proposal/ProposalList";
import WebSocketComponent from "./components/websocket";
import TaskDetailsModal from "./components/Task/task";

function App() {
    const dispatch = useDispatch()
    const user = useSelector((state : any) => state.user.user) || {};
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loadUser = async () => {
    
      try {
        const res = await axios.get("http://localhost:3000/user/check", { withCredentials: true });
        console.log(res.data);
        if (res.data) {
          dispatch({ type: "SET_USER", payload: res.data.data.user });
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
      path:"/issues",
      name : "Issues",
    },{
      path:"/websocket",
      name : "chat",
    },{
      path:"/task",
      name:"task",
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
        <Route path="issue/proposal/:id" element={< ProposalList/>} />
        <Route path="/assignprofessional/:id" element={<AssignProfessional />} />
        <Route path="/websocket" element={<WebSocketComponent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/task" element={<TaskDetailsModal />} />
      </Routes>

      </Router>

    </div>
  );
}

export default App;
