import React, { useEffect, useState } from 'react';
import { useFormContext } from '../context/AdminFormContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../scss/settings.scss';

const AccountSettings = () => {
    const { formData, setFormData, isAdminAuthenticated } = useFormContext();
    const [adminData, setAdminData] = useState(null);
    const [newUsername, setNewUsername] = useState(formData.username || '');
    const [newPassword, setNewPassword] = useState('');
    const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(false);

    useEffect(() => {
        console.log(formData)
        if (isAdminAuthenticated) {
            const storedAdminData = JSON.parse(localStorage.getItem('adminFormData'));
            console.log(storedAdminData)
            if (storedAdminData) {
                setAdminData(storedAdminData);
            }
        }
    }, [isAdminAuthenticated]);

    const getImagePath = (imagePath) => {
        return imagePath ? `${imagePath}` : './img/123.jpg';
    };

    const handleUsernameChange = (e) => setNewUsername(e.target.value);
    const handlePasswordChange = (e) => setNewPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Prepare the form data to be sent to the backend (skip empty fields)
        const updateData = {};
        if (newUsername.trim()) updateData.username = newUsername;
        if (newPassword.trim()) updateData.password = newPassword;
    
        // Get oscaID from formData to update the correct user
        const oscaID = formData.oscaID;
    
        if (!oscaID) {
            alert('OSCA ID is required to update the account');
            return;
        }
    
        // Send the data to the backend to update the account
        try {
            const response = await fetch('http://localhost/seniorpayment/update-admin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oscaID, ...updateData }),
            });
    
            // Check if the response is valid JSON
            const data = await response.json();
    
            if (data.status === 1) {
                // Update the formData context and localStorage with the new values
                setFormData((prev) => ({
                    ...prev,
                    username: newUsername,
                }));
    
                // Optionally, store updated data in localStorage
                localStorage.setItem('adminFormData', JSON.stringify({ ...formData, ...updateData }));
    
                alert('Account updated successfully!');
            } else {
                alert(data.message || 'Failed to update account');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            alert('There was an error updating the account.');
        }
    };
    

    return (
        <div className="dashboard-comp system-settings">
            <Navbar getImagePath={getImagePath} adminData={adminData} />
            <div className="dash-body flex items-start justify-between">
                <Sidebar getImagePath={getImagePath} adminData={adminData} />
                <div className="dashboard-main">
                    <div className="dash-title flex items-center justify-start gap-5 p-4">
                        <h1 className="text-2xl">Account Settings</h1>
                    </div>

                    <div className="settings-section p-6 space-y-8">
                        {/* Profile Section */}
                        <div className="profile-section flex items-center space-x-6">
                            {adminData && (
                                <img
                                    src={getImagePath(adminData.image)}
                                    alt="User Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            )}
                            <div className="profile-info">
                                <h2 className="text-xl font-semibold">{newUsername}</h2>
                                <p className="text-gray-600">Update your profile and settings</p>
                                <button className="btn-secondary mt-2">Change Profile Picture</button>
                            </div>
                        </div>

                        {/* Username Update */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Change Username</h4>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={handleUsernameChange}
                                className="input-field"
                                placeholder="Enter new username"
                            />
                        </div>

                        {/* Password Update */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Change Password</h4>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                className="input-field"
                                placeholder="Enter new password"
                            />
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Two-Factor Authentication</h4>
                            <div className="two-factor-settings">
                                <div className="flex items-center justify-between">
                                    <span>Enable Two-Factor Authentication</span>
                                    <button
                                        onClick={() => setIsTwoFAEnabled(!isTwoFAEnabled)}
                                        className={`btn-toggle ${isTwoFAEnabled ? 'enabled' : 'disabled'}`}
                                    >
                                        {isTwoFAEnabled ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
                                {isTwoFAEnabled && (
                                    <p className="text-gray-600 text-sm mt-2">
                                        Two-factor authentication is enabled. You’ll need to verify your identity.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Notification Settings</h4>
                            <div className="notification-options space-y-4">
                                <label className="notification-toggle p-2">
                                    <input type="checkbox" />
                                    <span>Email Notifications</span>
                                </label>
                                <label className="notification-toggle p-2">
                                    <input type="checkbox" />
                                    <span>SMS Notifications</span>
                                </label>
                            </div>
                        </div>

                        {/* Personal Preferences */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Personal Preferences</h4>
                            <div className="preferences-options">
                                <div className="preference-option">
                                    <label>Language</label>
                                    <select className="input-field">
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                    </select>
                                </div>
                                <div className="preference-option">
                                    <label>Time Zone</label>
                                    <select className="input-field">
                                        <option value="UTC">UTC</option>
                                        <option value="GMT">GMT</option>
                                        <option value="EST">EST</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Update Account Button */}
                        <button className="btn-primary mt-4" onClick={handleSubmit}>
                            Update Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
