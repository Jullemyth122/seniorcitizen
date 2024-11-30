
import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import { useFormContext } from '../../context/AdminFormContext';
import '../../scss/dashboard.scss'
import FileUploadCitizen from '../FileUploadCitizen';
import { useSCFormContext } from '../../context/ScFormContext';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

const DSWD = () => {

    const { isAdminAuthenticated } = useFormContext();
    const { formData,setFormData, handleCreateDone, isShowID, setIsShowID, initialData } = useSCFormContext();
    const [adminData, setAdminData] = useState(null);


    const [showSpinner, setShowSpinner] = useState(true);  // Control spinner visibility
    const [showTextSpin, setShowTextPin] = useState(true);  // Control spinner visibility
    const [showSuccess, setShowSuccess] = useState(false);  // Control spinner visibility
    
    const formRef = useRef(null);
    const [isAddClicked, setIsAddClicked] = useState(false)
    const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false)
    

    const handleShowID = () => {
        setIsShowID(true)
        setIsAddClicked(false)
        setIsCreateButtonClicked(false)
        setShowSuccess(false)
        setShowTextPin(true)
        setShowSpinner(true)
    }

    const [errors, setErrors] = useState({
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
        regSupport: '',        // regSupport
    });

    useEffect(() => {
        if (isAdminAuthenticated) {
            // Get admin data from localStorage
            const storedAdminData = JSON.parse(localStorage.getItem('adminFormData'));
            if (storedAdminData) {
                setAdminData(storedAdminData);
            }
        }

        // Set the date_created to the current date (format: YYYY-MM-DD)
        setFormData(prevFormData => ({
            ...prevFormData,
            date_created: new Date().toISOString().split('T')[0] // current date in YYYY-MM-DD format
        }));
    }, [isAdminAuthenticated]);

    const getImagePath = (imagePath) => {
        // Return the path relative to the public directory
        return imagePath ? `${imagePath}` : './img/123.jpg';
    };


    const handleFileChange = (file) => {
        console.log(file); // Add this line to check the file object
        if (file && file instanceof File) {
            setFormData({
                ...formData,
                img: file,
            });
        } else {
            console.error("Invalid file");
        }
    };
    


    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);


    const validateForm = () => {
        let isValid = true;
        let errors = {};  

        const fields = [
            { name: 'oscaID', message: 'OSCA ID is required!', validator: isRequired },
            { name: 'firstName', message: 'First Name is required!', validator: isRequired },
            { name: 'middleName', message: 'Middle Name is required!', validator: isRequired },
            { name: 'lastName', message: 'Last Name is required!', validator: isRequired },
            { name: 'gender', message: 'Gender is required!', validator: isRequired },
            { name: 'age', message: 'Age should be a valid positive number!', validator: isPositiveNumber },
            { name: 'birthday', message: 'Invalid Birthday Date!', validator: isValidDate },
            { name: 'civilStat', message: 'Civil Status is required!', validator: isRequired },
            { name: 'placeOfBirth', message: 'Place of Birth is required!', validator: isRequired },
            { name: 'address', message: 'Address is required!', validator: isRequired },
            { name: 'contactNum', message: 'Invalid Contact Number!', validator: isValidPhoneNumber },
            { name: 'religion', message: 'Religion is Required !', validator: isRequired },
            { name: 'citizenship', message: 'Citizen is Required !', validator: isRequired },
            { name: 'educAttain', message: 'Educational Attainment is Required !', validator: isRequired },
            { name: 'tin', message: 'Tin is Required !', validator: isRequired },
            { name: 'philHealth', message: 'PhilHealth is Required !', validator: isRequired },
            { name: 'dswdPensioner', message: 'Pensioner is Required !', validator: isRequired },
            { name: 'livingArr', message: 'Living Arrangement is Required !', validator: isRequired },
            { name: 'psource', message: 'Source of Income is Required !', validator: isRequired },
            { name: 'psource_desc', message: 'Description of Income is Required !', validator: isRequired },
            { name: 'regSupport', message: 'Regulation Support is Required !', validator: isRequired },
        ];
    
        fields.forEach(field => {
            const value = formData[field.name];
            if (!field.validator(value)) {
                isValid = false;
                errors[field.name] = field.message;  
            } else {
                errors[field.name] = ''; 
            }
        });
    
        if (!formData.img) {
            isValid = false;
            errors.img = 'Please upload a profile image.'; 
        } else {
            errors.img = ''; 
        }
    
        setErrors(errors); 
        setStatusMessage(isValid ? '' : 'Please fill all required fields correctly.');
    
        return isValid;
    };

    
    // Helper functions for validation
    const isRequired = (value) => value && value.trim() !== '';
    const isPositiveNumber = (value) => value && !isNaN(value) && value > 0;
    const isValidDate = (value) => value && /^\d{4}-\d{2}-\d{2}$/.test(value);
    const isValidPhoneNumber = (value) => value && /^\d{10}$/.test(value);
    
    

    const handleAddClick = (e) => {
        e.preventDefault(); // Prevent form submission
        if (validateForm()) {
            setIsAddClicked(true);  // Show confirmation dialog
        } else {
            setIsAddClicked(false); // Hide confirmation dialog if form is invalid
        }
    };


    // Helper function to generate an array of days (1-31)
    const generateDays = () => {
        const days = [];
        for (let i = 1; i <= 31; i++) {
            days.push(i < 10 ? `0${i}` : i.toString()); // Format day as two digits
        }
        return days;
    };

    // Helper function to generate years from current year to 100 years ago
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 100; i--) {
            years.push(i.toString());
        }
        return years;
    };

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'birthday_month' || name === 'birthday_day' || name === 'birthday_year') {
            // Update individual birthday parts
            const updatedFormData = {
                ...formData,
                [name]: value,
            };
    
            // Only update the combined birthday if all parts are present
            const { birthday_year, birthday_month, birthday_day } = updatedFormData;
            if (birthday_year && birthday_month && birthday_day) {
                updatedFormData.birthday = `${birthday_year}-${birthday_month}-${birthday_day}`;
    
                // Calculate age based on the birthday
                const currentDate = new Date();
                const birthDate = new Date(`${birthday_year}-${birthday_month}-${birthday_day}`);
                let age = currentDate.getFullYear() - birthDate.getFullYear();
                const monthDiff = currentDate.getMonth() - birthDate.getMonth();
                
                // If the birthday hasn't occurred yet this year, subtract 1 from the age
                if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
                    age--;
                }
                updatedFormData.age = age;
            } else {
                updatedFormData.birthday = ''; // If any part is missing, set birthday to empty
                updatedFormData.age = ''; // Clear age if birthday is incomplete
            }
    
            setFormData(updatedFormData);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formDataToSend = new FormData();
    
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });
    
        if (formData.img) {
            formDataToSend.append('img', formData.img);
        }
    
        formDataToSend.append('type', 'dswd');
    
        setShowTextPin(true);  // Start the submission process and show the spinner
        setShowSpinner(true);   // Ensure spinner is visible during submission
    
        try {
            const response = await fetch('http://localhost/seniorpayment/scInfo.php', {
                method: 'POST',
                body: formDataToSend,
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();  // Parse the JSON response
    
            if (data.status === 1) {
                setStatusMessage('Data submitted successfully!');
                setIsSuccess(true);        
                // Wait 3 seconds before hiding the spinner
                setTimeout(() => {
                    setShowSpinner(false);  // Hide spinner after 3 seconds
                }, 3000);
                setTimeout(() => {
                    setShowTextPin(false);  // Hide texts after 0 seconds
                },0)
                setTimeout(() => {
                    setShowSuccess(true);
                }, 5000)
            } else {
                setStatusMessage(data.message);
                setIsSuccess(false);
            }
    
        } catch (error) {
            if (error instanceof SyntaxError) {
                setStatusMessage('Invalid response from server.');
            } else {
                setStatusMessage('Error submitting data.');
            }
            setIsSuccess(false);
            setShowSpinner(false);  // Hide spinner immediately in case of error
            console.error('Error submitting form data:', error);
        }
    };


    const [editData, setEditData] = useState(null); // State to hold data being edited

    const handleEditClick = (item) => {
        setEditData(item);
        setFormData({
            oscaID: item.oscaID,
            firstName: item.firstName,
            middleName: item.middleName,
            lastName: item.lastName,
            suffix: item.suffix,                // Added Suffix
            gender: item.gender,
            birthday: item.birthday,
            age: item.age,
            civilStat: item.civilStat,
            placeOfBirth: item.placeOfBirth,
            contactNum: item.contactNum,
            address: item.address,
            religion: item.religion,            // Added Religion
            citizenship: item.citizenship,      // Added Citizenship
            educAttain: item.educAttain,        // Added Education Attainment
            tin: item.tin,                      // Added TIN
            philHealth: item.philHealth,        // Added PhilHealth
            dswdPensioner: item.dswdPensioner,  // Added DSWD Pensioner
            livingArr: item.livingArr,          // Added Living Arrangement
            psource: item.psource,              // Added Primary Source of Income
            psource_desc: item.psource_desc,    // Added Source Description
            regSupport: item.regSupport,        // Added Regular Support
        });
    };

    
    const handleCancel = () => {
        // Reset form data to the initial values or close the edit mode
        setFormData(initialData);  // Reset form data to initial state (replace with your actual initial data)
        setEditData(false);            // Close edit mode or reset the state to indicate you're no longer editing
    };

    const [dswdData, setDswdData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // We show 10 items per page

    // Filter data based on search term
    const filterData = (data, searchTerm) => {
        if (!searchTerm) {
            return data; // If no search term, return all data
        }

        return data.filter(item => {
            // Search across all fields
            const searchableFields = [
                item.oscaID,
                item.firstName,
                item.middleName,
                item.lastName,
                item.gender,
                item.age,
                item.birthday,
                item.civilStat,
                item.placeOfBirth,
                item.address,
                item.contactNum,
                item.religion,
                item.citizenship,
                item.educAttain,
                item.tin,
                item.philHealth,
                item.dswdPensioner,
                item.livingArr,
                item.psource,
                item.psource_desc,
                item.regSupport,
            ];

            return searchableFields.some(field =>
                String(field).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    };

    // Pagination logic
    const paginateData = (data, currentPage, itemsPerPage) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return data.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Filter the data with the search term
    const filteredData = filterData(dswdData, searchTerm);

    // Paginate the filtered data
    const paginatedData = paginateData(filteredData.filter(item => item.archived !== 1), currentPage, itemsPerPage);

    // Get total pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleDeleteClick = async (oscaID) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const response = await fetch('http://localhost/seniorpayment/delete.php', {
                method: 'DELETE',
                body: JSON.stringify({ oscaID }),  // Send the oscaID to delete
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (result.status === 1) {
                alert("Data deleted successfully!");
                
                // Remove the deleted item from the state directly
                setDswdData(prevData => prevData.filter(item => item.oscaID !== oscaID));
    
            } else {
                alert(result.message || "Failed to delete data.");
            }
        }
    };
    
    const handleArchiveClick = async (oscaID) => {
        // Send archive request to the backend
        const response = await fetch('http://localhost/seniorpayment/archive.php', {
            method: 'POST',
            body: JSON.stringify({ oscaID }),  // Send the oscaID to archive
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
    
        if (result.status === 1) {
            alert("Data archived successfully!");
    
            // Update the local state to remove the archived item
            setDswdData(prevData => prevData.filter(item => item.oscaID !== oscaID));
        } else {
            alert(result.message || "Failed to archive data.");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost/seniorpayment/editDswd.php', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.status === 1) {
            alert("Record updated successfully!");
            setDswdData((prevData) =>
                prevData.map((item) =>
                    item.oscaID === formData.oscaID ? { ...item, ...formData } : item
                )
            );
            setEditData(null);
        } else {
            alert("Failed to update the record.");
        }
    };

    useEffect(() => {
        fetch('http://localhost/seniorpayment/dswd.php', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                setDswdData(data.data);
                setLoading(false);
            } else {
                setError(data.message || 'No data available');
                setLoading(false);
            }
        })
        .catch(error => {
            setError('Error fetching data: ' + error.message);
            setLoading(false);
        });
    }, []);  

    return (
        <div className='dashboard-comp'>
            <Navbar getImagePath={getImagePath} adminData={adminData} />
            <div className="dash-body flex items-start justify-between">
                <Sidebar getImagePath={getImagePath} adminData={adminData}/>
                <div className="dashboard-main">
                    <div className="dash-title flex items-center justify-start gap-5 p-4">
                        <h1 className='text-2xl'> 
                            Senior Citizen Management
                            <br/>
                            SC Chapter  
                        </h1>
                    </div>
                    <div className="option-data flex items-start justify-between gap-7">
                        <div className="search-item flex items-center justify-center gap-3">
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.125 3.00007C8.97012 3.00007 6.90349 3.8561 5.37976 5.37983C3.85602 6.90356 3 8.97019 3 11.1251C3 13.28 3.85602 15.3466 5.37976 16.8703C6.90349 18.394 8.97012 19.2501 11.125 19.2501C13.2799 19.2501 15.3465 18.394 16.8702 16.8703C18.394 15.3466 19.25 13.28 19.25 11.1251C19.25 8.97019 18.394 6.90356 16.8702 5.37983C15.3465 3.8561 13.2799 3.00007 11.125 3.00007ZM0.5 11.1251C0.500144 9.43081 0.905455 7.76115 1.68212 6.25539C2.45878 4.74963 3.58427 3.45144 4.96469 2.46912C6.34511 1.4868 7.94043 0.848835 9.61755 0.608458C11.2947 0.368081 13.005 0.532259 14.6057 1.0873C16.2065 1.64233 17.6513 2.57213 18.8197 3.79912C19.988 5.02611 20.846 6.5147 21.322 8.14071C21.798 9.76673 21.8783 11.483 21.5561 13.1463C21.234 14.8097 20.5187 16.3719 19.47 17.7026L24.035 22.2676C24.2627 22.5033 24.3887 22.8191 24.3858 23.1468C24.383 23.4746 24.2515 23.7881 24.0198 24.0198C23.788 24.2516 23.4745 24.3831 23.1468 24.3859C22.819 24.3888 22.5033 24.2628 22.2675 24.0351L17.7025 19.4701C16.1358 20.7051 14.253 21.474 12.2697 21.6889C10.2863 21.9039 8.28253 21.5561 6.48762 20.6854C4.69271 19.8146 3.1792 18.4562 2.12029 16.7654C1.06138 15.0747 0.499866 13.12 0.5 11.1251ZM9.875 6.75007C9.875 6.41855 10.0067 6.10061 10.2411 5.86619C10.4755 5.63177 10.7935 5.50007 11.125 5.50007C12.6168 5.50007 14.0476 6.09271 15.1025 7.1476C16.1574 8.20249 16.75 9.63323 16.75 11.1251C16.75 11.4566 16.6183 11.7745 16.3839 12.009C16.1495 12.2434 15.8315 12.3751 15.5 12.3751C15.1685 12.3751 14.8505 12.2434 14.6161 12.009C14.3817 11.7745 14.25 11.4566 14.25 11.1251C14.25 10.2963 13.9208 9.50142 13.3347 8.91536C12.7487 8.32931 11.9538 8.00007 11.125 8.00007C10.7935 8.00007 10.4755 7.86838 10.2411 7.63396C10.0067 7.39954 9.875 7.08159 9.875 6.75007Z" fill="black"/>
                            </svg>
                            <input 
                                type="text" 
                                name="searchCitizen" 
                                placeholder='Search Citizens Here!' id="" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}    
                            />
                        </div>
                        <div className="applicant-opt flex items-center justify-center gap-3">
                            <button onClick={() => setIsCreateButtonClicked(!isCreateButtonClicked)}> + Add New Applicant   </button>
                            <button> Print MasterList </button>
                            <button> 
                                <Link to={'/admin/bindswd'}>
                                    Bin  
                                </Link>
                            </button>
                        </div>
                    </div>
                    {editData && (
                        <div className="edit-content">
                            <h2>Edit Citizen Info</h2>
                            <form onSubmit={handleFormSubmit} className="form-container">
                                {/* First Name */}
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name:</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Middle Name */}
                                <div className="form-group">
                                    <label htmlFor="middleName">Middle Name:</label>
                                    <input
                                        id="middleName"
                                        type="text"
                                        name="middleName"
                                        value={formData.middleName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name:</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Suffix */}
                                <div className="form-group">
                                    <label htmlFor="suffix">Suffix:</label>
                                    <input
                                        id="suffix"
                                        type="text"
                                        name="suffix"
                                        value={formData.suffix}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Gender */}
                                <div className="form-group">
                                    <label htmlFor="gender">Gender:</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Birthday */}
                                <div className="form-group">
                                    <label htmlFor="birthday">Birthday:</label>
                                    <input
                                        id="birthday"
                                        type="date"
                                        name="birthday"
                                        value={formData.birthday}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Age */}
                                <div className="form-group">
                                    <label htmlFor="age">Age:</label>
                                    <input
                                        id="age"
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Civil Status */}
                                <div className="form-group">
                                    <label htmlFor="civilStat">Civil Status:</label>
                                    <select
                                        name="civilStat"
                                        value={formData.civilStat}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Civil Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                                {/* Place of Birth */}
                                <div className="form-group">
                                    <label htmlFor="placeOfBirth">Place of Birth:</label>
                                    <input
                                        id="placeOfBirth"
                                        type="text"
                                        name="placeOfBirth"
                                        value={formData.placeOfBirth}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {/* Contact Number */}
                                <div className="form-group">
                                    <label htmlFor="contactNum">Contact Number:</label>
                                    <input
                                        id="contactNum"
                                        type="text"
                                        name="contactNum"
                                        value={formData.contactNum}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {/* Address */}
                                <div className="form-group">
                                    <label htmlFor="address">Address:</label>
                                    <input
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {/* Additional Fields (DSWD specific fields) */}
                                <div className="form-group">
                                    <label htmlFor="religion">Religion:</label>
                                    <input
                                        id="religion"
                                        type="text"
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="citizenship">Citizenship:</label>
                                    <input
                                        id="citizenship"
                                        type="text"
                                        name="citizenship"
                                        value={formData.citizenship}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="educAttain">Education Attainment:</label>
                                    <input
                                        id="educAttain"
                                        type="text"
                                        name="educAttain"
                                        value={formData.educAttain}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tin">TIN:</label>
                                    <input
                                        id="tin"
                                        type="text"
                                        name="tin"
                                        value={formData.tin}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="philHealth">PhilHealth:</label>
                                    <input
                                        id="philHealth"
                                        type="text"
                                        name="philHealth"
                                        value={formData.philHealth}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dswdPensioner">DSWD Pensioner:</label>
                                    <input
                                        id="dswdPensioner"
                                        type="text"
                                        name="dswdPensioner"
                                        value={formData.dswdPensioner}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="livingArr">Living Arrangement:</label>
                                    <select
                                        name="livingArr"
                                        value={formData.livingArr}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Living Background</option>
                                        <option value="kinder"> Owned </option>
                                        <option value="highschool"> Rent </option>
                                        <option value="senior"> Living Alone </option>
                                        <option value="college"> Living with Relatives </option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="psource"> Permanent Source of Income:</label>
                                    <input
                                        id="psource"
                                        type="text"
                                        name="psource"
                                        value={formData.psource}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="psource_desc"> Source of Income Descrip:</label>
                                    <input
                                        id="psource_desc"
                                        type="text"
                                        name="psource_desc"
                                        value={formData.psource_desc}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="psource_desc"> Source of Income Descrip:</label>
                                    <select
                                        name="regSupport"
                                        value={formData.regSupport}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Regular Support </option>
                                        <option value="yes"> Yes </option>
                                        <option value="no"> No </option>
                                    </select>
                                </div>

                                {/* More fields... */}

                                {/* Submit and Cancel Buttons */}
                                <div className="button-container">
                                    <button type="submit" className="submit-btn">Update</button>
                                    <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="table-container">
                        <table className="info-table">
                            <thead>
                            <tr>
                                <th>OSCA ID</th>
                                <th>Full Name</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>Birthday</th>
                                <th>Civil Status</th>
                                <th>Place of Birth</th>
                                <th>Address</th>
                                <th>Contact</th>
                                <th>Religion</th>
                                <th>Citizenship</th>
                                <th>Educational Attainment</th>
                                <th>Tin</th>
                                <th>PhilHealth</th>
                                <th>DswdPensioner</th>
                                <th>LivingArr</th>
                                <th>PSource</th>
                                <th>PSourceDesc</th>
                                <th>Regulation Support</th>
                                <th>Archive</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map(item => (
                                        <tr key={item.oscaID}>
                                            <td>{item.oscaID}</td>
                                            <td>{`${item.firstName} ${item.middleName} ${item.lastName}`}</td>
                                            <td>{item.gender}</td>
                                            <td>{item.age}</td>
                                            <td>{item.birthday}</td>
                                            <td>{item.civilStat}</td>
                                            <td>{item.placeOfBirth}</td>
                                            <td>{item.address}</td>
                                            <td>{item.contactNum}</td>
                                            <td>{item.religion}</td> 
                                            <td>{item.citizenship}</td> 
                                            <td>{item.educAttain}</td> 
                                            <td>{item.tin}</td> 
                                            <td>{item.philHealth}</td> 
                                            <td>{item.dswdPensioner}</td> 
                                            <td>{item.livingArr}</td> 
                                            <td>{item.psource}</td> 
                                            <td>{item.psource_desc}</td> 
                                            <td>{item.regSupport}</td> 
                                            <td><button className="archive-btn" onClick={() => handleArchiveClick(item.oscaID)}>Archive</button></td>
                                            <td>
                                                <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button> 
                                                <button className="delete-btn" onClick={() => handleDeleteClick(item.oscaID)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="pagination-container">
                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {[...Array(totalPages).keys()].map(page => (
                                <button
                                    key={page}
                                    className={`pagination-btn ${currentPage === page + 1 ? 'active' : ''}`}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    {page + 1}
                                </button>
                            ))}

                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {
                isShowID && 
                <div className="create-applicant absolute flex items-center justify-center">
                    <div className="card-applicant p-4">
                        <svg className='exit' onClick={handleCreateDone} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.02 20C1.44417 20 0.96375 19.8075 0.57875 19.4225C0.19375 19.0375 0.000833333 18.5567 0 17.98V14.0875H1.25V17.9813C1.25 18.1738 1.33 18.3504 1.49 18.5112C1.65 18.6721 1.82625 18.7521 2.01875 18.7512H17.9813C18.1729 18.7512 18.3492 18.6712 18.51 18.5112C18.6708 18.3512 18.7508 18.1746 18.75 17.9813V2.02C18.75 1.8275 18.67 1.65083 18.51 1.49C18.35 1.32917 18.1733 1.24917 17.98 1.25H2.02C1.8275 1.25 1.65083 1.33 1.49 1.49C1.32917 1.65 1.24917 1.82667 1.25 2.02V5.9125H0V2.02C0 1.44417 0.192916 0.96375 0.57875 0.57875C0.964583 0.19375 1.445 0.000833333 2.02 0H17.9813C18.5563 0 19.0367 0.192916 19.4225 0.57875C19.8083 0.964583 20.0008 1.445 20 2.02V17.9813C20 18.5563 19.8075 19.0367 19.4225 19.4225C19.0375 19.8083 18.5567 20.0008 17.98 20H2.02ZM8.5575 14.9038L7.67375 14.0037L11.0525 10.625H0V9.375H11.0525L7.675 5.995L8.55875 5.09625L13.4625 10L8.5575 14.9038Z" fill="black"/>
                        </svg>
                        <div className="header-card">
                            <h1 className='text-2xl'> New Membership Application </h1>
                            <p className='text-xl'> Senior Citizen Chapter - ID Front & Back </p>
                        </div>  

                        <div className="id-card flex items-center justify-evenly">
                            <div className="front">
                                <div className="id-item">
                                    <img className='id-bg' src="/img/imgbg.jpg" alt="" />
                                    <img className='id-text' src="/img/imgtext.jpg" alt="" />
                                    
                                    <div className="head-id flex items-center justify-evenly">
                                        <img className='logo-id' src="/img/imglogo2.png" alt="" />
                                        <div className="text-ids">
                                            <h1> REPUBLIKA NG PILIPINAS </h1>
                                            <p> Republic of Philippines </p>
                                            <h5> 
                                                Kapisahan Ng Mga Senior Citizens ng Brgy. Pinagbuhatan  
                                                <br/>
                                                Pasig City Incorporated
                                            </h5>
                                            <p>
                                                Association of Senior Citizens of Brgy. Pinagbuhatan
                                                <br/>
                                                Pasig City Incorporated.
                                            </p>
                                        </div>
                                        <img className="logo-id" src="/img/imglogo.png" alt="" />
                                    </div>
                                    <div className="line"></div>

                                    <div className="id-main flex items-center justify-evenly">
                                        <div className="std-lf grid">
                                            <div className="std-lf-txt-hd flex items-center justify-evenly">
                                                <h3> CTR No: {formData.contrNum} </h3>
                                                 |   |
                                                <h3> DSWD: {formData.contrNum} </h3>
                                            </div>
                                            <img src={URL.createObjectURL(formData.img)} alt="Profile" />
                                            <h1> OSCA ID: {formData.oscaID} </h1>
                                            {/* <img src={formData.img} alt="" /> */}
                                        </div>
                                        <div className="std-rt">
                                            <div className="label-form">
                                                <label htmlFor="lastName"> Apelyido / Lastname </label>
                                                <p className="lastName"> {formData.lastName} </p>
                                            </div>
                                            <div className="label-form">
                                                <label htmlFor="firstName"> Pangalan / First Name </label>
                                                <p className="firstName"> {formData.firstName} </p>
                                            </div>
                                            <div className="label-form">
                                                <label htmlFor="middleName"> Gitnang Apelyido / Middle Name </label>
                                                <p className="middleName"> {formData.middleName} </p>
                                            </div>
                                            {formData.suffix && 
                                                <div className="label-form">
                                                    <label htmlFor="suffix"> Panlaping Pandulo / Suffix </label>
                                                    <p className="suffix"> {formData.suffix} </p>
                                                </div>
                                            }
                                            <div className="label-form">
                                                <label htmlFor="gender"> Kasarian / Sex </label>
                                                <p className="gender"> {formData.gender} </p>
                                            </div>
                                            <div className="label-form">
                                                <label htmlFor="address"> Tirahan / Address </label>
                                                <p className="address"> {formData.address} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h1 className='main-name'> Front </h1>
                            </div>

                            <div className="back">
                                <div className="id-item">
                                    <img className='id-bg' src="/img/imgtext.jpg" alt="" />
                                    <img className='id-lg-1' src="/img/imglogo.png" alt="" />
                                    <img className='id-lg-2' src="/img/imglogo2.png" alt="" />
                                    <div className="id-main flex items-center justify-evenly flex-wrap ">
                                        <div className="qr-text grid grid-cols-2 gap-3">
                                            <div className="qr">
                                                <QRCode className='qr-image' value={JSON.stringify(formData)} size={128} />
                                                {/* <img className='qr-image' src={URL.createObjectURL(formData.img)} alt="Profile" /> */}
                                            </div>
                                            <div className="txtwqr">
                                                <div className="label-form">
                                                    <label htmlFor="birthday"> Petsa ng Kapanganakan / Birthday </label>
                                                    <p className="birthday"> {formData.birthday} </p>
                                                </div>
                                                <div className="label-form">
                                                    <label htmlFor="age"> Edad / Age </label>
                                                    <p className="age"> {formData.age} yrs. old </p>
                                                </div>
                                                <div className="label-form">
                                                    <label htmlFor="contactNum"> Numbero ng Telepono / Contact No. </label>
                                                    <p className="contactNum"> {formData.contactNum} </p>
                                                </div>
                                                <div className="label-form">
                                                    <label htmlFor="contactNum"> Rules and Regulations: </label>
                                                    <li>
                                                        This ID is not for sale.
                                                    </li>
                                                    <li>
                                                        In case the Payment Booklet is lost, you can 
                                                        present this ID to have a new one.
                                                    </li>
                                                    <li>
                                                        Pay your membership annually for Php 150
                                                    </li>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="signature w-full grid grid-cols-2 gap-3">
                                            <div className="sig1">
                                                <div className="line"></div>
                                                <h1> 
                                                    Ricardo T. Huazon
                                                    <br/>
                                                    <span className="font-bold">
                                                        President    
                                                    </span>     
                                                </h1>
                                            </div>
                                            <div className="sig2">
                                                <div className="line"></div>
                                                <h1> 
                                                    Signature Over Printed Name <br/>
                                                    of Card Holder   
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h1 className='main-name'> Back </h1>
                            </div>
                        </div>

                        <div className="buttons flex items-center justify-center">
                            <button className="btn-exit" onClick={handleCreateDone}>
                                Exit
                            </button>                                
                            <button className="btn-print">
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            }

            {
            isCreateButtonClicked && 
                <div className="create-applicant absolute flex items-center justify-center">
                    {isAddClicked && 
                        <div className="submittion-status flex items-center justify-center">
                            <div className="correction flex items-center justify-center">
                                <div className="in grid gap-5">
                                    {  showSuccess ?
                                        <>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 23.25C13.4774 23.25 14.9403 22.959 16.3052 22.3936C17.6701 21.8283 18.9103 20.9996 19.955 19.955C20.9996 18.9103 21.8283 17.6701 22.3936 16.3052C22.959 14.9403 23.25 13.4774 23.25 12C23.25 10.5226 22.959 9.05972 22.3936 7.69481C21.8283 6.3299 20.9996 5.08971 19.955 4.04505C18.9103 3.00039 17.6701 2.17172 16.3052 1.60636C14.9403 1.04099 13.4774 0.75 12 0.75C9.01631 0.75 6.15483 1.93526 4.04505 4.04505C1.93526 6.15483 0.75 9.01631 0.75 12C0.75 14.9837 1.93526 17.8452 4.04505 19.955C6.15483 22.0647 9.01631 23.25 12 23.25ZM11.71 16.55L17.96 9.05L16.04 7.45L10.665 13.8988L7.88375 11.1163L6.11625 12.8837L9.86625 16.6337L10.8338 17.6013L11.71 16.55Z" fill="black"/>
                                            </svg>
                                            <h1>
                                                Congratulations applicant has been registered!
                                            </h1>
                                            <div className="show-id" onClick={e => handleShowID(e)}>
                                                <h5> Show ID </h5>
                                            </div>
                                        </>
                                    : 
                                    <div>
                                        {showSpinner && <div className="loading-spinner"></div>}
                                        <h1 className='text-2xl text-center'> 
                                            {  
                                                isSuccess ? 
                                                    "Generating Membership ID, Please wait..." 
                                                    :     
                                                    "Are you sure your information is correct?"
                                            }
                                        </h1>
                                        {showTextSpin 
                                            &&
                                            <div className="button-opt flex items-center justify-center w-full gap-5">
                                                <button 
                                                    onClick={e => setIsAddClicked(false)} 
                                                    className="submit-button w-full bg-white text-black py-3"
                                                > 
                                                    Cancel 
                                                </button>
                                                {/* Trigger form submit from outside */}
                                                <button 
                                                    onClick={handleSubmit} 
                                                    className="submit-button w-full bg-violet-600 text-white py-3"
                                                > 
                                                    Yes 
                                                </button>
                                            </div>
                                        }
                                        {showTextSpin && 
                                            (statusMessage && (
                                                <div className={`status-message ${isSuccess ? 'success' : 'error'}`}>
                                                    <p>{statusMessage}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    }

                                </div>
                            </div>
                        </div>
                    }

                    <div className="card-applicant p-4">
                        <svg className='exit' onClick={e => setIsCreateButtonClicked(false)} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.02 20C1.44417 20 0.96375 19.8075 0.57875 19.4225C0.19375 19.0375 0.000833333 18.5567 0 17.98V14.0875H1.25V17.9813C1.25 18.1738 1.33 18.3504 1.49 18.5112C1.65 18.6721 1.82625 18.7521 2.01875 18.7512H17.9813C18.1729 18.7512 18.3492 18.6712 18.51 18.5112C18.6708 18.3512 18.7508 18.1746 18.75 17.9813V2.02C18.75 1.8275 18.67 1.65083 18.51 1.49C18.35 1.32917 18.1733 1.24917 17.98 1.25H2.02C1.8275 1.25 1.65083 1.33 1.49 1.49C1.32917 1.65 1.24917 1.82667 1.25 2.02V5.9125H0V2.02C0 1.44417 0.192916 0.96375 0.57875 0.57875C0.964583 0.19375 1.445 0.000833333 2.02 0H17.9813C18.5563 0 19.0367 0.192916 19.4225 0.57875C19.8083 0.964583 20.0008 1.445 20 2.02V17.9813C20 18.5563 19.8075 19.0367 19.4225 19.4225C19.0375 19.8083 18.5567 20.0008 17.98 20H2.02ZM8.5575 14.9038L7.67375 14.0037L11.0525 10.625H0V9.375H11.0525L7.675 5.995L8.55875 5.09625L13.4625 10L8.5575 14.9038Z" fill="black"/>
                        </svg>
                        <div className="header-card">
                            <h1 className='text-2xl'> New DSWD Application </h1>
                            <p className='text-xl'> DSWD Chapter </p>
                        </div>
                        <form className="card-main flex items-center justify-between" ref={formRef} encType='multipart/form-data' onSubmit={handleSubmit}>
                            <div className="img-card grid gap-10">
                                {/* <img src="/img/" alt="Profile Picture" /> */}
                                {formData.img && formData.img instanceof File ? (
                                    <img src={URL.createObjectURL(formData.img)} alt="Profile" />
                                ) : (
                                    // Use the path stored in localStorage (which should be a relative URL like "/profile/m2.png")
                                    formData.img ? <img src={formData.img} alt="Profile" /> : 
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.25 0.75H20.5C21.4946 0.75 22.4484 1.14509 23.1517 1.84835C23.8549 2.55161 24.25 3.50544 24.25 4.5V20.75C24.25 21.7446 23.8549 22.6984 23.1517 23.4017C22.4484 24.1049 21.4946 24.5 20.5 24.5H4.25C3.25544 24.5 2.30161 24.1049 1.59835 23.4017C0.895088 22.6984 0.5 21.7446 0.5 20.75V4.5C0.5 3.50544 0.895088 2.55161 1.59835 1.84835C2.30161 1.14509 3.25544 0.75 4.25 0.75ZM4.25 2C3.58696 2 2.95107 2.26339 2.48223 2.73223C2.01339 3.20107 1.75 3.83696 1.75 4.5V18.9875L7.1125 13.6125L10.2375 16.7375L16.4875 10.4875L23 17V4.5C23 3.83696 22.7366 3.20107 22.2678 2.73223C21.7989 2.26339 21.163 2 20.5 2H4.25ZM10.2375 18.5125L7.1125 15.3875L1.75 20.75C1.75 21.413 2.01339 22.0489 2.48223 22.5178C2.95107 22.9866 3.58696 23.25 4.25 23.25H20.5C21.163 23.25 21.7989 22.9866 22.2678 22.5178C22.7366 22.0489 23 21.413 23 20.75V18.7625L16.4875 12.2625L10.2375 18.5125ZM7.375 4.5C8.2038 4.5 8.99866 4.82924 9.58471 5.41529C10.1708 6.00134 10.5 6.7962 10.5 7.625C10.5 8.4538 10.1708 9.24866 9.58471 9.83471C8.99866 10.4208 8.2038 10.75 7.375 10.75C6.5462 10.75 5.75134 10.4208 5.16529 9.83471C4.57924 9.24866 4.25 8.4538 4.25 7.625C4.25 6.7962 4.57924 6.00134 5.16529 5.41529C5.75134 4.82924 6.5462 4.5 7.375 4.5ZM7.375 5.75C6.87772 5.75 6.4008 5.94754 6.04917 6.29917C5.69754 6.6508 5.5 7.12772 5.5 7.625C5.5 8.12228 5.69754 8.5992 6.04917 8.95083C6.4008 9.30246 6.87772 9.5 7.375 9.5C7.87228 9.5 8.3492 9.30246 8.70083 8.95083C9.05246 8.5992 9.25 8.12228 9.25 7.625C9.25 7.12772 9.05246 6.6508 8.70083 6.29917C8.3492 5.94754 7.87228 5.75 7.375 5.75Z" fill="black"/>
                                    </svg>
                                )}
                                <div className="img-opt flex items-center justify-center gap-3">
                                    <button> Crop </button>
                                    <button> Capture </button>
                                </div>
                                <FileUploadCitizen onFileChange={handleFileChange}/>
                                {errors.img && <span className="text-red-500">{errors.img}</span>} {/* Error message for image */}
                            </div>
                            <div className="fill-text-card flex items-center justify-start flex-wrap gap-5">              
                                {/* Name fields */}
                                <div className="label-scinfo">
                                    <label htmlFor="">Date:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="date_created"
                                                placeholder="ex. 11-20-2024"
                                                value={formData.date_created}
                                                onChange={handleInputChange}
                                                readOnly
                                                disabled // Makes the field unclickable and non-editable

                                            />
                                            <label htmlFor=""> Date Created</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">OSCA ID No.</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="oscaID"
                                                placeholder="ex. 22321231132"
                                                value={formData.oscaID}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor=""> Osca ID Number. </label>
                                            {errors.oscaID && <label className="text-red-500">{errors.oscaID}</label>}

                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">NAME OF NEW APPLICANT:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4 flex-wrap">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="ex. Julian"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="">Firstname</label>
                                            {errors.firstName && <label className="text-red-500">{errors.firstName}</label>}

                                        </div>
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="suffix"
                                                placeholder="ex. Jr III"
                                                value={formData.suffix}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="">Suffix</label>
                                            {errors.suffix && <label className="text-red-500">{errors.suffix}</label>}

                                        </div>
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="middleName"
                                                placeholder="ex. Midman"
                                                value={formData.middleName}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="">Middle Name</label>
                                            {errors.middleName && <label className="text-red-500">{errors.middleName}</label>}

                                        </div>
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="ex. Lionel"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="">Surname</label>
                                            {errors.lastName && <label className="text-red-500">{errors.lastName}</label>}

                                        </div>
                                    </div>
                                </div>

                                {/* Birthday Fields */}
                                <div className="label-scinfo">
                                    <label htmlFor="">BIRTHDAY:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <select
                                                name="birthday_month"
                                                value={formData.birthday_month}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Month</option>
                                                {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((month, index) => (
                                                    <option key={index} value={month}>{month}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="">Month</label>
                                            {errors.birthday && <label className="text-red-500">{errors.birthday}</label>}

                                        </div>
                                        <div className="label-input">
                                            <select
                                                name="birthday_day"
                                                value={formData.birthday_day}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Day</option>
                                                {generateDays().map((day, index) => (
                                                    <option key={index} value={day}>{day}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="">Day</label>
                                            {errors.birthday && <label className="text-red-500">{errors.birthday}</label>}

                                        </div>
                                        <div className="label-input">
                                            <select
                                                name="birthday_year"
                                                value={formData.birthday_year}  // Ensure the value is properly bound to formData.birthday_year
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Year</option>
                                                {generateYears().map((year, index) => (
                                                    <option key={index} value={year}>{year}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="">Year</label>
                                            {errors.birthday && <label className="text-red-500">{errors.birthday}</label>}
                                        </div>
                                    </div>
                                </div>

                                <div className="label-scinfo">
                                    <label htmlFor="">AGE:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="age"
                                                placeholder="ex. 15"
                                                value={formData.age || ''}  // Ensure it shows the calculated age or an empty string
                                                onChange={handleInputChange}  // You can leave this in case the user tries to edit the field directly
                                                readOnly  // Make the field read-only
                                                disabled // Makes the field unclickable and non-editable

                                            />
                                            <label htmlFor=""> ------- </label>
                                            {errors.age && <label className="text-red-500">{errors.age}</label>}

                                            </div>
                                    </div>
                                </div>

                                <div className="label-scinfo">
                                    <label htmlFor="">Civil Status:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <select
                                                name="civilStat"
                                                value={formData.civilStat}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Civil Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                            </select>
                                            <label htmlFor=""> ------- </label>
                                            {errors.civilStat && <label className="text-red-500">{errors.civilStat}</label>}

                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">Place of Birth:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="placeOfBirth"
                                                placeholder="ex. Visayas Leyte City"
                                                value={formData.placeOfBirth}  // Ensure it shows the calculated age or an empty string
                                                onChange={handleInputChange}  // You can leave this in case the user tries to edit the field directly
                                            />
                                            <label htmlFor=""> Address Birth </label>
                                            {errors.placeOfBirth && <label className="text-red-500">{errors.placeOfBirth}</label>}

                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">GENDER:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <label htmlFor="">Sex</label>
                                            {errors.gender && <label className="text-red-500">{errors.gender}</label>}
                                        </div>
                                    </div>
                                </div>

                                <div className="label-scinfo">
                                    <label htmlFor="">CONTACT NUMBER:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="contactNum"
                                                placeholder="ex. +09 633 ***"
                                                value={formData.contactNum}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="">Tel / Phone No.</label>
                                            {errors.contactNum && <label className="text-red-500">{errors.contactNum}</label>}

                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">ADDRESS:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="address"
                                                placeholder="ex. PMS Caloocan City"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="">House Number, Street, and Village Name Only</label>
                                            {errors.address && <label className="text-red-500">{errors.address}</label>}

                                        </div>
                                    </div>
                                </div>

                                <div className="label-scinfo">
                                    <label htmlFor="">Religion:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="religion"
                                                placeholder="ex. Catholic"
                                                value={formData.religion}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor=""> Religious Beliefs </label>
                                            {errors.religion && <label className="text-red-500">{errors.religion}</label>}

                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">Citizenship:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="citizenship"
                                                placeholder="ex. American"
                                                value={formData.citizenship}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor=""> ------- </label>
                                            {errors.citizenship && <label className="text-red-500">{errors.citizenship}</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">Educational Attainment:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <select
                                                name="educAttain"
                                                value={formData.educAttain}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Education Background</option>
                                                <option value="kinder">Kinder </option>
                                                <option value="highschool">Highschool </option>
                                                <option value="senior"> Senior </option>
                                                <option value="college"> College </option>
                                            </select>
                                            <label htmlFor=""> ------- </label>
                                            {errors.educAttain && <label className="text-red-500">{errors.educAttain}</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">Tin:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="tin"
                                                placeholder="ex. 3123"
                                                value={formData.tin}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor=""> ------- </label>
                                            {errors.tin && <label className="text-red-500">{errors.tin}</label>}

                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">PhilHealth:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="philHealth"
                                                placeholder="ex. 1231231"
                                                value={formData.philHealth}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor=""> ------- </label>
                                            {errors.philHealth && <label className="text-red-500">{errors.philHealth}</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor=""> DSWD Pensioner:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <select
                                                name="dswdPensioner"
                                                value={formData.dswdPensioner}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Pensioner</option>
                                                <option value="gsis"> GSIS </option>
                                                <option value="sss"> SSS </option>
                                                <option value="afpslai"> AFPSLAI </option>
                                                <option value="others"> Others </option>
                                            </select>
                                            <label htmlFor=""> ------- </label>
                                            {errors.dswdPensioner && <label className="text-red-500">{errors.dswdPensioner}</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">Living Arrangement:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <select
                                                name="livingArr"
                                                value={formData.livingArr}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Living Background</option>
                                                <option value="kinder"> Owned </option>
                                                <option value="highschool"> Rent </option>
                                                <option value="senior"> Living Alone </option>
                                                <option value="college"> Living with Relatives </option>
                                            </select>
                                            <label htmlFor=""> ------- </label>
                                            {errors.livingArr && <label className="text-red-500">{errors.livingArr}</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor=""> Permanent Source of Income:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="psource"
                                                placeholder="ex. Jobs"
                                                value={formData.psource}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor=""> ------- </label>
                                            {errors.psource && <label className="text-red-500">{errors.psource}</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor=""> Source of Income Descrip:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <input
                                                type="text"
                                                name="psource_desc"
                                                placeholder="ex. I work for ~"
                                                value={formData.psource_desc}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor=""> ------- </label>
                                            {errors.psource_desc && <label className="text-red-500">{errors.psource_desc}</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="label-scinfo">
                                    <label htmlFor="">Regular Support From Family:</label>
                                    <div className="label-inputs flex items-center justify-start gap-4">
                                        <div className="label-input">
                                            <select
                                                name="regSupport"
                                                value={formData.regSupport}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Regular Support </option>
                                                <option value="yes"> Yes </option>
                                                <option value="no"> No </option>
                                            </select>
                                            <label htmlFor=""> ------- </label>
                                            {errors.regSupport && <label className="text-red-500">{errors.regSupport}</label>}
                                        </div>
                                    </div>
                                </div>

                                <div className="button-opt flex items-center justify-center w-full gap-5">
                                    <button onClick={e => setIsCreateButtonClicked(false)} className="submit-button w-full bg-white text-black py-3"> Cancel </button>
                                    {/* <button type="submit" className="submit-button w-full bg-violet-600 text-white py-3">Submit</button> */}
                                    <button 
                                        // onClick={handleAddClick}
                                        onClick={handleAddClick}
                                        className="submit-button w-full bg-violet-600 text-white py-3"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </form>
                        {statusMessage && (
                            <div className={`status-message ${isSuccess ? 'success' : 'error'}`}>
                                <p>{statusMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    )
}

export default DSWD