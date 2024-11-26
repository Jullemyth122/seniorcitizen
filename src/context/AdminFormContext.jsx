// AdminFormContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminFormContext = createContext();

export const useFormContext = () => {
    return useContext(AdminFormContext);
};

export const AdminFormProvider = ({ children }) => {
    const initialData = JSON.parse(localStorage.getItem('adminFormData')) || {
        firstname: '',
        middlename: '',
        surname: '',
        birthday: '',
        age: '',
        gender: '',
        contact_number: '',
        role: '',
        address: '',
        image: null,
        username: '', // Added username
        password: '', // Added password
        confpassword: '', // Added confirm password
        birthday_year:'',
        birthday_month:'',
        birthday_day:''
    };

    const [formData, setFormData] = useState(initialData);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
        JSON.parse(localStorage.getItem('isAdminAuthenticated')) || false
    );

    // Update localStorage when formData or authentication status changes
    useEffect(() => {
        localStorage.setItem('adminFormData', JSON.stringify(formData));
    }, [formData]);
    

    useEffect(() => {
        localStorage.setItem('isAdminAuthenticated', JSON.stringify(isAdminAuthenticated));
    }, [isAdminAuthenticated]);

    return (
        <AdminFormContext.Provider value={{ formData, setFormData, isAdminAuthenticated, setIsAdminAuthenticated }}>
            {children}
        </AdminFormContext.Provider>
    );
};
