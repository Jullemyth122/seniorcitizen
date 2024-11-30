
import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import { useFormContext } from '../../context/AdminFormContext';
import '../../scss/dashboard.scss'
import { useSCFormContext } from '../../context/ScFormContext';

const BinDSWD = () => {

    const { isAdminAuthenticated } = useFormContext();
    const { setFormData } = useSCFormContext();
    const [adminData, setAdminData] = useState(null);


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
    const paginatedData = paginateData(filteredData.filter(item => item.archived !== 0), currentPage, itemsPerPage);

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
    
    const handleUnArchiveClick = async (oscaID) => {
        // Send unarchive request to the backend
        const response = await fetch('http://localhost/seniorpayment/unarchive.php', {
            method: 'POST',
            body: JSON.stringify({ oscaID }),  // Send the oscaID to unarchive
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        const result = await response.json();
    
        if (result.status === 1) {
            alert("Data unarchived successfully!");
    
            // Update the local state to reflect the unarchived item
            setDswdData(prevData => {
                // Find the item you are unarchiving
                const updatedData = prevData.map(item => 
                    item.oscaID === oscaID ? { ...item, archived: 0 } : item
                );
    
                // Return the updated data with the unarchived item
                return updatedData;
            });
        } else {
            alert(result.message || "Failed to unarchive data.");
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
                            Bin SC Chapter  
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
                                placeholder='Search Archive Citizens Here!' id="" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}    
                            />
                        </div>
                    </div>

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
                                <th>UnArchive</th>
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
                                            <td><button className="archive-btn" onClick={() => handleUnArchiveClick(item.oscaID)}>Unarchive</button></td>
                                            <td>
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

        </div>
    )
}

export default BinDSWD