import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Sign Up");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        } else {
            new_url += "/api/user/register";
        }
        const response = await axios.post(new_url, data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            loadCartData({ token: response.data.token });
            setShowLogin(false);
        } else {
            toast.error(response.data.message);
        }
    };

    const responseGoogle = async (response) => {
        const token = response.credential;

        // You may need to handle this data differently based on your backend API
        const new_url = url + "/api/user/google-login";
        const googleResponse = await axios.post(new_url, { token });

        if (googleResponse.data.success) {
            setToken(googleResponse.data.token);
            localStorage.setItem("token", googleResponse.data.token);
            loadCartData({ token: googleResponse.data.token });
            setShowLogin(false);
        } else {
            toast.error(googleResponse.data.message);
        }
    };

    return (
        <GoogleOAuthProvider clientId="http://719629915014-p8e8mavj88cs9o8ugb3n6426s2hbibmv.apps.googleusercontent.com">
            <div className='login-popup'>
                <form onSubmit={onLogin} className="login-popup-container">
                    <div className="login-popup-title">
                        <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                    </div>
                    <div className="login-popup-inputs">
                        {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required /> : null}
                        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' />
                        <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                    </div>
                    <button>{currState === "Login" ? "Login" : "Create account"}</button>
                    <div className="login-popup-condition">
                        <input type="checkbox" name="" id="" required />
                        <p>By continuing, I agree to the terms of use & privacy policy.</p>
                    </div>
                    {currState === "Login"
                        ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                        : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                    }
                    <div className="google-login">
                        <GoogleLogin
                            onSuccess={responseGoogle}
                            onError={() => {
                                toast.error("Google Login Failed");
                            }}
                        />
                    </div>
                </form>
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginPopup;
