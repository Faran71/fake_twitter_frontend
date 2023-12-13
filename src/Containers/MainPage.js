import "./MainPage.css"
import { useNavigate } from "react-router-dom"

import DisplayTweet from "../Components/DisplayTweet"
import { useEffect, useState } from "react"

const MainPage = ({currentUser, allTweets, setAllTweets, setCurrentUser}) => {
    const navigate = useNavigate();

    const [newTweet, setNewTweet] = useState("");

    const displayTweets = allTweets.map((tweet) => {
        return(
            <div>
                <DisplayTweet tweet={tweet} currentUser={currentUser}/>
            </div>
        )
    })

    const postTweet = async (newTweet) => {
        const newResponse = await fetch(`https://spring-render-85i2.onrender.com/tweets/postTweet/${currentUser.id}`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(newTweet)
        })
        const data = await newResponse.json();
        setAllTweets(data);
    }

    const handleTweetFormSubmit = (event) => {
        event.preventDefault();
        if(currentUser && newTweet!=""){
            postTweet(newTweet);
            setNewTweet("");
        }
    }

    const handleLogOutClick = (event) => {
        event.preventDefault();
        setCurrentUser(null);
        navigate("/");
    }


    if(currentUser){
        return(
            <div className="main">
                <div className="left">
                <img src="./profile.jpg" className="profile_img"/><img ></img>
                    <p>Hi {currentUser.name}</p>
                    <button onClick={handleLogOutClick}>Log Out</button>
                </div>
                <div className="middle">
                    <h3>Home</h3>
                    <div className="all-tweets">
                        {displayTweets}
                    </div>
                </div>
                <form className="form" onSubmit={handleTweetFormSubmit}>
                    <h2>Wanna write a tweet</h2>
                    <input type="text"  
                    name="name"
                    placeholder="Tweet...."
                    value={newTweet}
                    onChange={(e) => setNewTweet(e.target.value)}
                    />
                    <button type="submit">Post</button>
                </form>   
            </div>
        )
    } else {
        return(
            <div>
                <p>loading...</p>
            </div>
        )
    }
}

export default MainPage;