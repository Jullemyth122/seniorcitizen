import React from 'react';
import '../scss/auth.scss'


const ForgotComponent = () => {
    return (
        <div className='auth-comp flex items-center justify-center'>
            <div className="form-authentication">
                <form action="" className="login-form w-full">
                    <h1 className='w-full text-center text-8xl'> Elder Ease </h1>
                    <h4 className='w-full text-center text-3xl'> Association of Senior Citizens of Brgy. Pinagbuhatan Pasig City Incorporated </h4>
                    <div className="line w-full bg-black"></div>
                    <h4 className='w-full text-center text-5xl'> FORGOT PASSWORD </h4>

                    <div className="div-form">
                        <div className="label-input">
                            <label htmlFor="" className='text-2xl'> Username </label>
                            <input type="text" className="inp-text" placeholder='ex. JohnnySins' />
                        </div>
                        <div className="label-input">
                            <label htmlFor="" className='text-2xl'> CHOOSE SECURITY QUESTION </label>
                            <input type="text" className="inp-text" placeholder='ex. Pet' />
                        </div>

                        <div className="label-input">
                            <label htmlFor="" className='text-2xl'> YOUR ANSWER </label>
                            <input type="text" className="inp-text" placeholder='ex. Johnny' />
                        </div>

                        <button className="login-button px-5 py-3 text-3xl">
                            SUBMIT
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

export default ForgotComponent;
