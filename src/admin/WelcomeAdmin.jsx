import React from 'react';
import { Link, useLocation } from 'react-router-dom';  // Import useLocation
import '../scss/welcome.scss';
import { useFormContext } from '../context/AdminFormContext';

const WelcomeAdmin = () => {

    const { formData } = useFormContext();

    return (
        <div className="welcome-page w-screen h-screen flex items-center justify-center">
            <div className="welcome-comp">
                <div className="st-1">
                    <h1 className="text-3xl w-txt"> Welcome To </h1>
                    <h4 className="w-txt2"> ELDER EASE </h4>
                    <p className="text-xl w-txt"> Association of Senior Citizens of Brgy. Pinagbuhatan Pasig City Incorporated </p>
                </div>
                <div className="st-2">
                    <h1 className="w-full text-center flex items-center justify-center text-4xl">
                        {formData.firstname && formData.middlename &&  formData.surname ? `“Mr. ${formData.firstname} ${formData.middlename} ${ formData.surname}”` : "No name available"}
                    </h1>
                    <div className="text-st flex items-center justify-center">
                        <h5>{formData.firstname && formData.middlename &&  formData.surname ? `@${formData.firstname}${formData.middlename[0]}${ formData.surname}` : "No handle"}</h5>
                        <h5>Admin {formData.oscaID}</h5>
                    </div>
                </div>

                <Link to={'/admin/dashboard'}>
                    <button className="open-button text-black p-4">
                        <h2> Go to Dashboard </h2>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default WelcomeAdmin;
