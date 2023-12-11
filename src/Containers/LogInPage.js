import "./LogInPage.css"
import Modal from 'react-modal';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { red } from "@mui/material/colors";


const LogInPage = ({setCurrentUser, currentUser, allUsers}) => {
    const navigate = useNavigate();
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
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const openModal = () => {setIsOpen(true)};
    const closeModal = () => {setIsOpen(false)};


    const [hideWrongLogInMessage, setHideWrongLogInMessage] = useState(true);
    const [hideEmailAlreadyInUse, setHideEmailAlreadyInUse] = useState(true);

    const postRegisterUser = async (registerName, registerEmail, registerPassword) => {
        let temp = {
            name: registerName,
            email: registerEmail,
            password: registerPassword
        }
        const newResponse = await fetch(`http://localhost:8080/users`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(temp)
        })
        if(newResponse.status === 202){
            const newR = await newResponse.json();
            setCurrentUser(newR);
            setHideEmailAlreadyInUse(true);
            setRegisterName("");
            setRegisterPassword("");
            setLogInEmail("");
        } else {
            setHideEmailAlreadyInUse(false);
        }
    }

    const handleRegistrationFormSubmit = (event) => {
        event.preventDefault();
        postRegisterUser(registerName,registerEmail,registerPassword);
    }

// to handle log in regitration modal
    const [logInModalOpen, setLogInModalOpen] = useState(false);
    const [logInEmail, setLogInEmail] = useState("");
    const [logInPassword, setLogInPassword] = useState("");

    const openLogInModal = () => {setLogInModalOpen(true)};
    const closeLogInModal = () => {setLogInModalOpen(false)};

    const postLogInCustomer = async (logInEmail, logInPassword) => {
        let temp = {
            email: logInEmail,
            password: logInPassword
        }
        const newResponse = await fetch(`http://localhost:8080/users/authenticate`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(temp)
        })
        console.log(newResponse.status);
        if(newResponse.status === 202){
            const newC = await newResponse.json();
            setCurrentUser(newC);
            navigate("/MainPage");
            setLogInEmail("");
            setLogInPassword("");
            setHideWrongLogInMessage(true);
        } else {
            setHideWrongLogInMessage(false);
        }
    }

    const handleLogInFormSubmit = (event) => {
        event.preventDefault();
        postLogInCustomer(logInEmail,logInPassword);
    }

    // const [selectedImage, setSelectedImage] = useState(null);

    // // Handle file selection
    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setSelectedImage(file);
    // };

    useEffect(() => {
        if(currentUser){
            navigate("/MainPage");
        }
    },[currentUser])


    return(
        <div className="main">
            <div className="left">
                <img src="./bird.jpeg" className="img"/>
            </div>
            <div className="right">
                <h2>Happening Now</h2>
                <h4>Join Today</h4>

                <button className="btn1" onClick={openModal}>Create Account</button>
                <Modal
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                >
                    <h1>Create your Account</h1>
                    <p hidden={hideEmailAlreadyInUse} style={{color:"red"}}>Email already in use</p>
                    {/* <div>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {selectedImage && (
                            <div>
                            <p>Selected Image:</p>
                            {console.log(URL.createObjectURL(selectedImage))}
                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                            </div>
                        )}
                    </div> */}
                    <form onSubmit={handleRegistrationFormSubmit} className="registration">
                        <input type="text" 
                        name="name"
                        placeholder="Name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        />
                        <input type="text" 
                        name="email"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        />
                        <input type="text" 
                        name="password"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                        <button type="submit">Register</button>
                    </form>
                </Modal>
                
                <h4>Already Have an Account?</h4>
                <button className="btn2" onClick={openLogInModal}>Log In</button>
                <Modal
                    isOpen={logInModalOpen}
                    onRequestClose={closeLogInModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                >
                    <h1>Enter Your Details</h1>
                    <form onSubmit={handleLogInFormSubmit} className="log-in">
                        <input type="text" 
                        name="email"
                        placeholder="Email"
                        value={logInEmail}
                        onChange={(e) => setLogInEmail(e.target.value)}
                        />
                        <input type="password" 
                        name="password"
                        placeholder="Password"
                        value={logInPassword}
                        onChange={(e) => setLogInPassword(e.target.value)}
                        />
                        <button type="submit">Log In</button>
                        <p hidden={hideWrongLogInMessage} style={{color:"red"}}>Wrong Credentials</p>
                    </form>
                </Modal>
            </div>

        </div>
    )

}



export default LogInPage;