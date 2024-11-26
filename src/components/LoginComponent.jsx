// src/components/LoginComponent.js
import React, { useState } from 'react';
import * as CitizenService from '../services/CitizenService';
import '../scss/auth.scss';
import { Link, useNavigate } from 'react-router-dom';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await CitizenService.loginCitizen({ username, password });
            if (response.status === 1) {
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/citizenhome');  
            } else {
                setErrorMessage(response.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while logging in.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className='auth-comp flex items-center justify-center'>
            <div className="form-authentication">
                <form onSubmit={handleLogin} className="login-form w-full">
                    <h1 className='w-full text-center text-8xl'> Elder Ease </h1>
                    <h4 className='w-full text-center text-3xl'> Association of Senior Citizens of Brgy. Pinagbuhatan Pasig City Incorporated </h4>
                    <div className="line w-full bg-black"></div>
                    <h4 className='w-full text-center text-5xl'> Login </h4>

                    <div className="div-form">
                        <div className="label-input">
                            <label htmlFor="username" className='text-2xl'> Username </label>
                            <input
                                type="text"
                                id="username"
                                className="inp-text"
                                placeholder="ex. JohnnySins"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="password" className='text-2xl'> Password </label>
                            <input
                                type="password"
                                id="password"
                                className="inp-text"
                                placeholder="ex. John****"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="button-output">
                            <input type="checkbox" className="oup-button" />
                            <h5 className='text-2xl'> REMEMBER ME </h5>
                        </div>
                        <button type="submit" className="login-button px-5 py-3 text-3xl">
                            Login
                        </button>
                        {errorMessage && <p className="error-message text-red-500">{errorMessage}</p>}
                    </div>
                </form>
                <div className="auth-options flex items-center justify-evenly gap-5">
                    <Link to={'/signup'} className='s1-btn'>
                        <button className='s1-btn-press border-2'> Sign Up </button>
                    </Link>
                    <Link to={'/forgot'} className='s1-btn'>
                        <button className='s1-btn-press border-2'> Forgot Password </button>
                    </Link>
                </div>
            </div>
            <div className="banner">
                <img className='imglogo' src="./img/imglogo.png" alt="" />
                <img className='imglogo2' src="./img/imglogo2.png" alt="" />
                <img className='imgtext' src="./img/imgtext.jpg" alt="" />
                <img className='imgbg' src="./img/imgbg.jpg" alt="" />
            </div>
        </div>
    );
};

export default LoginComponent;
