import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useFormContext } from '../context/AdminFormContext';

const PaymentManagement = () => {
    const { isAdminAuthenticated } = useFormContext();
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        // Get admin data from localStorage
        const storedAdminData = JSON.parse(localStorage.getItem('adminFormData'));
        if (storedAdminData && isAdminAuthenticated) {
            setAdminData(storedAdminData);
        }

    }, [isAdminAuthenticated]);



    const getImagePath = (imagePath) => {
        return imagePath ? `${imagePath}` : './img/123.jpg';
    };
    
    return (
        <div className='dashboard-comp'>
            <Navbar getImagePath={getImagePath} adminData={adminData} />
            <div className="dash-body flex items-start justify-between">
                <Sidebar getImagePath={getImagePath} adminData={adminData}/>
                <div className="dashboard-main">
                    <div className="dash-title flex items-center justify-start gap-5 p-4">
                        <h1 className='text-2xl'> Payment Management  </h1>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PaymentManagement