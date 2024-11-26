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
        <div className="w-screen h-screen bg-violet-500 flex items-center justify-center">
            {user ? (
                <div>
                    <h1>Welcome, {user.username}!</h1>
                    <p>Your ID: {user.oscaID}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CitizenHome;
