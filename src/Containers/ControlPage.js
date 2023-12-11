import { useState } from "react";
import LogInPage from "./LogInPage";
import MainPage from "./MainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

const ControlPage = () => {

    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [allTweets, setAllTweets] = useState([]);

    const fetchUsers = async () => {
        const response = await fetch("http://localhost:8080/users");
        const data = await response.json()
        setAllUsers(data);
    }

    const fetchTweets = async () => {
        const response = await fetch("http://localhost:8080/tweets");
        const data = await response.json()
        setAllTweets(data);
    }

    useEffect(() => {
        fetchUsers();
        fetchTweets();
    },[currentUser])

    useEffect(() => {
        fetchTweets();
        fetchUsers();
    },[])

    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LogInPage 
                    setCurrentUser={setCurrentUser} 
                    currentUser={currentUser} 
                    allUsers={allUsers}
                    />} key={1}/>
                    <Route path="/MainPage" element={<MainPage 
                    currentUser={currentUser}
                    allTweets={allTweets}
                    setAllTweets={setAllTweets}
                    setCurrentUser={setCurrentUser}
                    />} key={2}/>
                    
                </Routes>
            </BrowserRouter>
        </div>

    )
}

export default ControlPage;