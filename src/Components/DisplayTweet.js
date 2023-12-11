import "./DisplayTweet.css"
import { useEffect, useState } from "react";
import Modal from 'react-modal';

const DisplayTweet = ({tweet, currentUser}) => {

    

    const [comments, setComments] = useState([]);
    const fetchComments = async () => {
        const response = await fetch(`http://localhost:8080/comments/tweet/${tweet.id}`);
        const data = await response.json()
        setComments(data);
    }

    // Modal Style
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };
    //   To handle regitration modal
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {setIsOpen(true); fetchComments();};
    const closeModal = () => {setIsOpen(false)};

    // To split the time stamp and show the date of tweet.
    const time = tweet.tweetDateTime.split("T");
    const [numberLikes, setNumberLikes] = useState(tweet.usersLikedTweet.length);

    // To like a tweet
    const [redLike, setRedLike] = useState(false);

    const likeTweet = async (tweet) => {
        const newResponse = await fetch(`http://localhost:8080/tweets/likeTweet/${tweet.id}/${currentUser.id}`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
        })
        const data = await newResponse.json();
        console.log(data);
        setNumberLikes(data.usersLikedTweet.length);
    }

    const handleLikeClick = (event) => {
        event.preventDefault();
        likeTweet(tweet);
        setRedLike(!redLike);
    }

    let chooseHeartColour = () => {
        for(let email in tweet.usersLikedTweet){
            if(email === currentUser.email){
                setRedLike(true);
            }
        }
        if(!redLike){
            return(
                <img src="./heart.png" onClick={handleLikeClick} className="heart_like"/>
            )
        } else {
            return(
                <img src="./heart_red.png" onClick={handleLikeClick} className="heart_like"/>
            )
        }
    }


// To show the comments for each tweet
    const showComments = (comments) => {
        if(comments.length === 0){
            return(
                <div className="no-comment">
                    <p>No Comments...</p>
                </div>
            )
        } else {
            const com = comments.map((temp) => {
                return(
                    <div className="each-comment">
                        <p>{temp.user.name}: {temp.comment}</p>
                    </div>
                )
            })
            return(<div>{com}</div>)
        }
    }

    const [newComment, setNewComment] = useState("");
    const writeComment = async (newComment) => {
        const newResponse = await fetch(`http://localhost:8080/comments/writeComment/${currentUser.id}/${tweet.id}`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(newComment)
        })
        const data = await newResponse.json();
        setComments(data);
    }
    const handleWriteComment = (event) => {
        event.preventDefault();
        if(newComment!==""){
            writeComment(newComment);
            setNewComment("");
        }
    }

    useEffect(() => {
        tweet.usersLikedTweet.filter((temp) => {
            if(temp === currentUser.email){
                setRedLike(true);
            }
        })
    },[])



    if(tweet){
        return(
            <div className="box">
                <div className="top">
                    <h4>{tweet.user.name}, {time[0]}</h4>
                    
                </div>
                <div className="middle">
                    <p>{tweet.content}</p>
                </div>
                <div className="bottom">
                    <p>{numberLikes}</p>
                    {chooseHeartColour()}
                    {/* <img src="./heart.png" onClick={handleLikeClick} className="heart_like"/> */}
                    <img src="./comment.png" onClick={openModal} className="comment_button"/>
                    <Modal
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                    >
                        <div className="modal-tweet">
                            <div className="top">
                                <h4>{tweet.user.name}, {time[0]}</h4>
                                
                            </div>
                            <div className="middle">
                                <p>{tweet.content}</p>
                            </div>
                        </div>
                        <form on onSubmit={handleWriteComment} className="write-comment">
                            <input type="text" 
                            placeholder="Write a comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button type="submit">Comment</button>
                        </form>
                        <div className="comments">
                            {showComments(comments)}
                        </div>
                    </Modal>
                </div>

            </div>
        )
    } else {
        return(
            <p>No Tweet</p>
        )
    }
    

}

export default DisplayTweet;