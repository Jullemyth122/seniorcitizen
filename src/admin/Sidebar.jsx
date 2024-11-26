import React from 'react'
import '../scss/navbaradmin.scss'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ getImagePath, adminData }) => {
    return (
        <div className='sidebar-comp'>

            <div className="profile-name flex items-center justify-around gap-2">
                {adminData ? (
                    <>
                        <img
                            src={getImagePath(adminData.image)}  // Get the cleaned image path
                            alt="Admin Profile"
                            className="admin-profile-image"
                        />
                        <h1>
                            {`${adminData.firstname} ${adminData.surname}`}
                            <br/>
                            <p>  
                                ( {"Admin" + adminData.oscaID} )
                            </p>
                        </h1>
                    </>
                ) : (
                    <h1>Loading...</h1>
                )}
            </div>

            <div className="sidebar-body">
                <NavLink activeclassname="active" to={'/admin/dashboard'}>
                    <h1> Dashboard </h1>
                    <svg width="28" height="25" viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.9997 0.642578C14.1323 0.642578 14.2595 0.695257 14.3533 0.789025L27.2104 13.6462C27.4057 13.8414 27.4057 14.158 27.2104 14.3533C27.0152 14.5485 26.6986 14.5485 26.5033 14.3533L13.9997 1.84968L1.49613 14.3533C1.30087 14.5485 0.984287 14.5485 0.789025 14.3533C0.593763 14.158 0.593763 13.8414 0.789025 13.6462L13.6462 0.789025C13.7399 0.695257 13.8671 0.642578 13.9997 0.642578ZM3.99972 14.9283C4.27586 14.9283 4.49972 15.1522 4.49972 15.4283V21.1426C4.49972 21.7677 4.74806 22.3673 5.19011 22.8093C5.63216 23.2514 6.23171 23.4997 6.85686 23.4997H21.1426C21.7677 23.4997 22.3673 23.2514 22.8093 22.8093C23.2514 22.3673 23.4997 21.7677 23.4997 21.1426V15.4283C23.4997 15.1522 23.7236 14.9283 23.9997 14.9283C24.2759 14.9283 24.4997 15.1522 24.4997 15.4283V21.1426C24.4997 22.0329 24.146 22.8869 23.5164 23.5164C22.8868 24.146 22.0329 24.4997 21.1426 24.4997H6.85686C5.96649 24.4997 5.11259 24.146 4.48301 23.5164C3.85342 22.8869 3.49972 22.0329 3.49972 21.1426V15.4283C3.49972 15.1522 3.72358 14.9283 3.99972 14.9283Z"/>
                    </svg>
                </NavLink>
                <div className="sidebar-nav">
                    <h1> Senior Citizen Management </h1>
                    <div className="sidebar-ul">
                        <NavLink activeclassname="active" to={'/admin/scchapter'}>
                            <h3> SC Chapter </h3>
                        </NavLink>
                        <NavLink activeclassname="active" to={'/admin/dswd'}>
                            <h3> DSWD </h3>
                        </NavLink>
                    </div>
                </div>
                <NavLink activeclassname="active" to={'/admin/paymentmanagement'}>
                    <h1> Payment Management </h1>
                </NavLink>
                <div className="sidebar-nav">
                    <h1> System Utilities </h1>
                    <div className="sidebar-ul">
                        <NavLink activeclassname="active" to={'/admin/access'}>
                            <h3> Change User Access Level </h3>
                        </NavLink>
                        <NavLink activeclassname="active" to={'/admin/officers'}>
                            <h3> Change Officers </h3>
                        </NavLink>
                    </div>
                </div>
            </div>            
            
        </div>
    )
}

export default Sidebar