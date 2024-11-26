import React, { useEffect, useState } from 'react';
import { useFormContext } from '../context/AdminFormContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../scss/settings.scss'

const AccountSettings = () => {
    const [adminData, setAdminData] = useState(null);
    const { isAdminAuthenticated } = useFormContext();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(false);

    useEffect(() => {
        if (isAdminAuthenticated) {
            // Fetch admin data from localStorage if authenticated
            const storedAdminData = JSON.parse(localStorage.getItem('adminFormData'));
            if (storedAdminData) {
                setAdminData(storedAdminData);
                setUsername(storedAdminData.username || '');
                setEmail(storedAdminData.email || '');
                setImagePath(storedAdminData.imagePath || '');
            }
        }
    }, [isAdminAuthenticated]);

    const getImagePath = (imagePath) => {
        return imagePath ? `${imagePath}` : './img/123.jpg';
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
                            {adminData &&
                            <img src={getImagePath(adminData.image)} alt="User Profile" className="w-24 h-24 rounded-full object-cover" />
                            }
                            <div className="profile-info">
                                <h2 className="text-xl font-semibold">{username}</h2>
                                <p className="text-gray-600">Update your profile and settings</p>
                                <button className="btn-secondary mt-2">Change Profile Picture</button>
                            </div>
                        </div>

                        {/* Username Update */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Change Username</h4>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder="Enter new username"
                            />
                        </div>

                        {/* Email Update */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Change Email</h4>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="Enter new email"
                            />
                        </div>

                        {/* Password Update */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Change Password</h4>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field"
                                placeholder="Enter new password"
                            />
                            <button className="btn-secondary mt-2">Update Password</button>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
