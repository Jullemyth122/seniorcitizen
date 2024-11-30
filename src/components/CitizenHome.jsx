import React, { useEffect, useState } from 'react';

const CitizenHome = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve the user from localStorage and parse it
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
                {user ? (
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold text-indigo-600 mb-4">Welcome, {user.username}!</h1>
                        <div className="bg-indigo-100 p-4 rounded-lg shadow-lg">
                            <p className="text-lg text-gray-700">Your Osca ID: <span className="font-bold text-indigo-600">{user.oscaID}</span></p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-xl font-semibold text-white animate-pulse">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CitizenHome;
