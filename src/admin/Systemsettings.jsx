import React, { useEffect, useState } from 'react';
import { useFormContext } from '../context/AdminFormContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../scss/settings.scss'

const SystemSettings = () => {

    const [adminData, setAdminData] = useState(null);
    const { isAdminAuthenticated } = useFormContext();

    const [theme, setTheme] = useState('light');
    const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(false);
    const [apiKey, setApiKey] = useState('your-api-key');

    useEffect(() => {
        if (isAdminAuthenticated) {
            // Get admin data from localStorage
            const storedAdminData = JSON.parse(localStorage.getItem('adminFormData'));
            if (storedAdminData) {
                setAdminData(storedAdminData);
            }
        }
    }, [isAdminAuthenticated]);

    const getImagePath = (imagePath) => {
        // Return the path relative to the public directory
        return imagePath ? `${imagePath}` : './img/123.jpg';
    };

    return (
        <div className="dashboard-comp system-settings">
            <Navbar getImagePath={getImagePath} adminData={adminData} />
            <div className="dash-body flex items-start justify-between">
                <Sidebar getImagePath={getImagePath} adminData={adminData}/>
                <div className="dashboard-main">
                    <div className="dash-title flex items-center justify-start gap-5 p-4">
                        <h1 className="text-2xl">System Settings</h1>
                    </div>

                    <div className="settings-section p-6 space-y-8">
                        {/* Theme Settings */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Theme Settings</h4>
                            <div className="theme-options space-x-4">
                                <button 
                                    onClick={() => setTheme('light')}
                                    className={`btn-option ${theme === 'light' ? 'btn-selected' : ''}`}
                                >
                                    Light Mode
                                </button>
                                <button 
                                    onClick={() => setTheme('dark')}
                                    className={`btn-option ${theme === 'dark' ? 'btn-selected' : ''}`}
                                >
                                    Dark Mode
                                </button>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Security Settings</h4>
                            <div className="security-options">
                                <div className="flex items-center justify-between">
                                    <span>Enable Two-Factor Authentication</span>
                                    <button 
                                        onClick={() => setIsTwoFAEnabled(!isTwoFAEnabled)}
                                        className={`btn-toggle ${isTwoFAEnabled ? 'enabled' : 'disabled'}`}
                                    >
                                        {isTwoFAEnabled ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
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

                        {/* API Key Settings */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">API Key Settings</h4>
                            <div className="api-key-section">
                                <div className="flex justify-between items-center">
                                    <input
                                        type="text"
                                        value={apiKey}
                                        className="input-field"
                                        readOnly
                                    />
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setApiKey('new-generated-api-key')}
                                    >
                                        Regenerate Key
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Integration Settings */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Integrations</h4>
                            <div className="integration-options">
                                <button className="btn-secondary">Manage Integrations</button>
                            </div>
                        </div>

                        {/* Role Management */}
                        <div className="setting-item">
                            <h4 className="text-lg font-semibold">Role Management</h4>
                            <div className="role-management-options">
                                <button className="btn-secondary">Manage Roles</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemSettings;
