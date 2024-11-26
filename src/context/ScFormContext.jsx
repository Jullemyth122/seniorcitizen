import React, { createContext, useState, useContext } from 'react';

const SCFormContext = createContext();

export const useSCFormContext = () => {
    return useContext(SCFormContext);
};

export const SCFormProvider = ({ children }) => {
    // Initialize formData with default values directly
    const initialData = {
        img: null,              // Image field
        oscaID: '',            // For storing the primary key (Int, not necessary to initialize, can be empty string)
        lastName: '',          // Corresponds to lastName column in SQL
        firstName: '',         // firstName
        middleName: '',        // middleName
        suffix: '',            // suffix (optional)
        gender: '',            // gender
        birthday: '',          // birthday (could be a Date string or an object with { year, month, day })
        age: '',               // age (integer)
        placeOfBirth: '',      // placeOfBirth
        civilStat: '',         // civilStat
        contactNum: '',        // contactNum (can be string or number)
        address: '',           // address
        religion: '',          // religion
        citizenship: '',       // citizenship
        educAttain: '',        // educAttain
        tin: '',               // tin (may need special formatting for large numbers)
        philHealth: '',        // philHealth
        dswdPensioner: '',     // dswdPensioner (boolean or string)
        livingArr: '',         // livingArr
        psource: '',           // psource
        psource_desc: '',      // psource_desc
        contrNum: '',          // contrNum (could be a number or string)
        regSupport: '',        // regSupport
        date_created: '',      // regSupport
    };

    const [formData, setFormData] = useState(initialData);
    const [isShowID, setIsShowID] = useState(false);

    // Handle when "Done" button is clicked
    const handleCreateDone = () => {
        setIsShowID(false); // Close the form
        setFormData(initialData); // Reset form data to default
    };

    return (
        <SCFormContext.Provider value={{ formData, setFormData, isShowID, setIsShowID,initialData, handleCreateDone }}>
            {children}
        </SCFormContext.Provider>
    );
};
