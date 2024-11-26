// src/components/RegisterComponent.js
import React, { useState } from 'react';
import * as CitizenService from '../services/CitizenService';
import '../scss/auth.scss';
import { Link } from 'react-router-dom';

const RegisterComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const data = await CitizenService.registerCitizen({
                username,
                hashpassword: password,
            });

            if (data.status === 1) {
                setSuccess('Registration successful!');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            } else {
                setError(data.message || 'Failed to register. Please try again.');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className='auth-comp flex items-center justify-center'>
            <div className="form-authentication">
                <form onSubmit={handleSubmit} className="login-form w-full">
                    <h1 className='w-full text-center text-7xl'> Elder Ease </h1>
                    <h4 className='w-full text-center text-2xl'>
                        Association of Senior Citizens of Brgy. Pinagbuhatan Pasig City Incorporated
                    </h4>
                    <div className="line w-full bg-black"></div>
                    <h4 className='w-full text-center text-4xl'> Sign Up </h4>

                    {error && <p className="error">{error}</p>}
                    {success && 
                    <div className="success">
                        <p>{success}</p>
                        <Link to={'/login'}> Login </Link>
                    </div>
                    }

                    <div className="div-form">
                        <div className="label-input">
                            <label> Username </label>
                            <input
                                type="text"
                                className="inp-text"
                                placeholder='ex. JohnnySins'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="label-input">
                            <label> Password </label>
                            <input
                                type="password"
                                className="inp-text"
                                placeholder='ex. John****'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="label-input">
                            <label> Confirm Password </label>
                            <input
                                type="password"
                                className="inp-text"
                                placeholder='ex. John****'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="button-output">
                            <input type="checkbox" className="oup-button" required />
                            <h5> I AGREE TO THE TERMS OF USE </h5>
                        </div>
                        <button type="submit" className="login-button px-5 py-3 text-3xl">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
            <div className="banner">
                <img className='imglogo' src="./img/imglogo.png" alt="Logo" />
                <img className='imglogo2' src="./img/imglogo2.png" alt="Logo 2" />
                <img className='imgtext' src="./img/imgtext.jpg" alt="Text" />
                <img className='imgbg' src="./img/imgbg.jpg" alt="Background" />
            </div>
        </div>
    );
};

export default RegisterComponent;
