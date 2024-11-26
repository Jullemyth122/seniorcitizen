import React, { useState } from 'react';
import '../scss/applicantreg.scss';
import FileUpload from '../components/FileUpload';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/AdminFormContext';
const RegisterAdmin = () => {

    const navigate = useNavigate()

    const { formData, setFormData, setIsAdminAuthenticated } = useFormContext();


    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);


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
    
   

    // Handle file selection change from FileUpload component
    const handleFileChange = (file) => {
        // Ensure that file is a valid File object
        if (file && file instanceof File) {
            setFormData({
                ...formData,
                image: file,
            });
        } else {
            console.error("Invalid file");
        }
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

            // Log formData before submission
        console.log("Form Data Submitted:", formData);
        // Prepare the form data for sending to backend
        const data = new FormData();
        data.append('firstname', formData.firstname);
        data.append('middlename', formData.middlename);
        data.append('surname', formData.surname);
        data.append('birthday', formData.birthday);
        data.append('age', formData.age);
        data.append('gender', formData.gender);
        data.append('contact_number', formData.contact_number);
        data.append('role', formData.role);
        data.append('address', formData.address);
        data.append('username', formData.username);
        data.append('password', formData.password);
        data.append('confpassword', formData.confpassword);

        // Append the image file if present
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            console.log('Sending request to backend...');  // Debugging step

            const response = await fetch('http://localhost/seniorpayment/admin.php', {
                method: 'POST',
                body: data,
            });

            const textResponse = await response.text();
            const result = JSON.parse(textResponse);
    
            if (result.status === 1) {
                // Store the admin's data and authentication status in localStorage
                const adminData = result;  // The response from the API will contain this
                console.log(adminData);

                localStorage.setItem('adminFormData', JSON.stringify(adminData.data));
                localStorage.setItem('isAdminAuthenticated', JSON.stringify(true));
    
                // Set the context directly
                setFormData(adminData.data);  // Update the context state with the admin data
                setIsAdminAuthenticated(true);  // Update the authentication status immediately
    
                setStatusMessage('Login successful');
                setIsSuccess(true);
                // navigate('/admin/welcome');
            } else {
                setStatusMessage(result.message || 'Invalid username or password');
                setIsSuccess(false);
            }
            
        } catch (error) {
            console.error('Error:', error);
            setStatusMessage('An error occurred while registering the admin.');
            setIsSuccess(false);
        }
    };

    return (
        <div className="applicant-reg-comp w-full flex items-center justify-center">
            <div className="register-card">
                <h1 className="text-4xl">REGISTRATION</h1>
                    <form
                        className="form-register flex items-center justify-start flex-wrap gap-5"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"  // Add this to ensure the file gets sent in the POST request
                    >

                    <div className="label-register">
                        <label htmlFor="">Account Identification</label>
                        <div className="label-inputs flex items-center justify-start gap-4">
                            <div className="label-input">
                                <input
                                    type="text"
                                    name="username"  // Set the correct name attribute
                                    placeholder="ex. Julian103"
                                    value={formData.username}  // Bind to formData.username
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="">Username</label>
                            </div>
                            <div className="label-input">
                                <input
                                    type="password"  // Password field should be type="password"
                                    name="password"
                                    placeholder="*****"
                                    value={formData.password}  // Bind to formData.password
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="">Password</label>
                            </div>
                            <div className="label-input">
                                <input
                                    type="password"  // Confirm password should also be type="password"
                                    name="confpassword"
                                    placeholder="*****"
                                    value={formData.confpassword}  // Bind to formData.confpassword
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="">Confirm Password</label>
                            </div>
                        </div>
                    </div>
                        
                    {/* Name fields */}
                    <div className="label-register">
                        <label htmlFor="">NAME OF NEW ADMIN:</label>
                        <div className="label-inputs flex items-center justify-start gap-4">
                            <div className="label-input">
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="ex. Julian"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="">Firstname</label>
                            </div>
                            <div className="label-input">
                                <input
                                    type="text"
                                    name="middlename"
                                    placeholder="ex. Julian"
                                    value={formData.middlename}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="">Middle Name</label>
                            </div>
                            <div className="label-input">
                                <input
                                    type="text"
                                    name="surname"
                                    placeholder="ex. Julian"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="">Surname</label>
                            </div>
                        </div>
                    </div>

                    {/* Birthday Fields */}
                    <div className="label-register">
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
                            </div>
                        </div>
                    </div>

                    <div className="label-register">
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
                                />
                                <p>Years Old.</p>
                            </div>
                        </div>
                    </div>


                    <div className="label-register">
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
                            </div>
                        </div>
                    </div>

                    <div className="label-register">
                        <label htmlFor="">CONTACT NUMBER:</label>
                        <div className="label-inputs flex items-center justify-start gap-4">
                            <div className="label-input">
                                <input
                                    type="text"
                                    name="contact_number"
                                    placeholder="ex. +09 633 ***"
                                    value={formData.contact_number}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="">Tel / Phone No.</label>
                            </div>
                        </div>
                    </div>

                    <div className="label-register">
                        <label htmlFor="">ROLE:</label>
                        <div className="label-inputs flex items-center justify-start gap-4">
                            <div className="label-input">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="User">User</option>
                                </select>
                                <label htmlFor="">Authority Level.</label>
                            </div>
                        </div>
                    </div>

                    <div className="label-register">
                        <label htmlFor="">ADDRESS:</label>
                        <div className="label-inputs flex items-center justify-start gap-4">
                            <div className="label-input">
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="ex. Julian"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="">House Number, Street, and Village Name Only</label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="label-image">
                        {formData.image && formData.image instanceof File ? (
                            <img src={URL.createObjectURL(formData.image)} alt="Profile" />
                        ) : (
                            // Use the path stored in localStorage (which should be a relative URL like "/profile/m2.png")
                            <img src={formData.image ? formData.image : "./img/123.jpg"} alt="Profile" />
                        )}

                       <div className="img-fill-card">
                            <h2 className="text-3xl">PICTURE</h2>
                            <div className="img-adjust flex items-center justify-between gap-5">
                                <button type="button" className="capture">Capture</button>
                                <button type="button" className="crop">Crop</button>
                            </div>
                            {/* Use the FileUpload component */}
                            <FileUpload onFileChange={handleFileChange} />
                        </div>
                    </div>
                    {/* Submit button */}
                    <div className="button-opt flex items-center justify-center w-full gap-5">
                        <button type="submit" className="submit-button w-full bg-violet-600 text-white py-3">Submit</button>
                        <Link to={'/admin/login'} className="submit-button w-full bg-violet-600 text-white py-3 text-center"> Go To Login </Link>
                    </div>

                </form>
                {/* Create A Successful Text here and Also open the link to the Welcome Board. */}
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
        </div>
    );
};

export default RegisterAdmin;
