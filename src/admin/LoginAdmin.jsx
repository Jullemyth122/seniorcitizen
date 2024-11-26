import React, { useState } from 'react';
import '../scss/auth.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/AdminFormContext';

const LoginAdmin = () => {
    const { setIsAdminAuthenticated } = useFormContext();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost/seniorpayment/admin-login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const textResponse = await response.text();
            const result = JSON.parse(textResponse);
    
            if (result.status === 1) {
                // Store the admin's data and authentication status in localStorage
                const adminData = result.admin_data;  // The response from the API will contain this
                localStorage.setItem('adminFormData', JSON.stringify(adminData));
                localStorage.setItem('isAdminAuthenticated', JSON.stringify(true));
    
                setStatusMessage('Login successful');
                setIsSuccess(true);
                setIsAdminAuthenticated(true);
                navigate('/admin/welcome');
                window.location.reload();  // Force page reload

            } else {
                setStatusMessage(result.message || 'Invalid username or password');
                setIsSuccess(false);
            }
        } catch (error) {
            setStatusMessage('An error occurred while logging in.');
            setIsSuccess(false);
        }
    };
    
    

    return (
        <div className='auth-comp flex items-center justify-center'>
            <div className="form-authentication">
                <form onSubmit={handleSubmit} className="login-form w-full">
                    <h1 className='w-full text-center text-8xl'> Elder Ease </h1>
                    <h4 className='w-full text-center text-3xl'> Association of Senior Citizens of Brgy. Pinagbuhatan Pasig City Incorporated </h4>
                    <div className="line w-full bg-black"></div>
                    <h4 className='w-full text-center text-5xl'> Admin Login </h4>

                    <div className="div-form">
                        <div className="label-input">
                            <label htmlFor="username" className='text-2xl'> Username </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="inp-text"
                                value={formData.username}
                                onChange={handleInputChange}

                                placeholder="ex. JohnnySins"
                                required
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="password" className='text-2xl'> Password </label>
                            <input
                                id="password"
                                className="inp-text"
                                placeholder="ex. John****"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
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
                        {/* {errorMessage && <p className="error-message text-red-500">{errorMessage}</p>} */}
                    </div>
                </form>
                 {statusMessage && (
                     <div className={`status-message ${isSuccess ? 'success' : 'error'}`}>
                         <p>{statusMessage}</p>
                         {isSuccess && (
                             <Link 
                                 to={{pathname: '/admin/welcome'}}
                             >
                                 <button className="btn-success">Go to Welcome Board</button>
                             </Link>
                         )}
                     </div>
                 )}
            </div>
            <div className="banner">
                <img className='imglogo' src="/img/imglogo.png" alt="" />
                <img className='imglogo2' src="/img/imglogo2.png" alt="" />
                <img className='imgtext' src="/img/imgtext.jpg" alt="" />
                <img className='imgbg' src="/img/imgbg.jpg" alt="" />
            </div>
        </div>

    );
};

export default LoginAdmin;
