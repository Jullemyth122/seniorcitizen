import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useFormContext } from '../context/AdminFormContext';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,  // Add PointElement
    LineElement,   // Add LineElement (needed for Line chart)
} from 'chart.js';

// Register chart.js components including PointElement and LineElement
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,  // Register PointElement for Line chart
    LineElement    // Register LineElement for Line chart
);

const Dashboard = () => {
    const { isAdminAuthenticated } = useFormContext();
    const [adminData, setAdminData] = useState(null);

    // State for storing counts of applicants
    const [scChapterCount, setScChapterCount] = useState(0);
    const [dswdCount, setDswdCount] = useState(0);

    // For the Line chart
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Get admin data from localStorage
        const storedAdminData = JSON.parse(localStorage.getItem('adminFormData'));
        if (storedAdminData && isAdminAuthenticated) {
            setAdminData(storedAdminData);
        }

        // Fetch counts for SC Chapter and DSWD applicants
        const fetchCounts = async () => {
            try {
                // Fetch SC Chapter count
                const scChapterRes = await fetch('http://localhost/seniorpayment/scChapter.php');
                const scChapterData = await scChapterRes.json();
                if (scChapterData.status === 1) {
                    setScChapterCount(scChapterData.data.length);
                }

                // Fetch DSWD count
                const dswdRes = await fetch('http://localhost/seniorpayment/dswd.php');
                const dswdData = await dswdRes.json();
                if (dswdData.status === 1) {
                    setDswdCount(dswdData.data.length);
                }

                // Fetch combined Line Chart Data from backend (monthly data for both types)
                const lineChartRes = await fetch('http://localhost/seniorpayment/getApplicantsOvertime.php');
                const lineChartData = await lineChartRes.json();
                console.log(lineChartData)
                if (lineChartData.status === 1) {
                    // Process the data to separate scChapter and dswd data for the line chart
                    const processedData = processChartData(lineChartData.data);
                    setChartData(processedData);
                }
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, [isAdminAuthenticated]);

    const processChartData = (data) => {
        const scChapterData = [];
        const dswdData = [];
        const months = [];
    
        data.forEach(item => {
            const monthLabel = item.month_year;  // YYYY-MM format
            if (!months.includes(monthLabel)) {
                months.push(monthLabel);
            }
    
            if (item.type === 'scChapter') {
                scChapterData.push({ month: monthLabel, count: item.count });
            } else if (item.type === 'dswd') {
                dswdData.push({ month: monthLabel, count: item.count });
            }
        });
    
        // Align both datasets by month
        const alignedData = months.map(month => ({
            month,
            scChapterCount: scChapterData.find(item => item.month === month)?.count || 0,
            dswdCount: dswdData.find(item => item.month === month)?.count || 0,
        }));
    
        return alignedData;
    };
    

    // Pie Chart Data
    const pieData = {
        labels: ['SC Chapter', 'DSWD'],
        datasets: [
            {
                data: [scChapterCount, dswdCount],
                backgroundColor: ['#b482ff', '#d478ff'],
                hoverBackgroundColor: ['#FF4384', '#8f44ff'],
            },
        ],
    };

    // Line Chart Data
    const lineData = {
        labels: chartData.map(data => data.month),  // Format as YYYY-MM
        datasets: [
            {
                label: 'SC Chapter Applicants',
                data: chartData.map(data => data.scChapterCount),  // Monthly counts for SC Chapter
                fill: false,
                borderColor: '#b482ff',
                tension: 0.1,
            },
            {
                label: 'DSWD Applicants',
                data: chartData.map(data => data.dswdCount),  // Monthly counts for DSWD
                fill: false,
                borderColor: '#d478ff',
                tension: 0.1,
            },
        ],
    };


    const getImagePath = (imagePath) => {
        return imagePath ? `${imagePath}` : './img/123.jpg';
    };
    
    return (
        <div className='dashboard-comp'>
            <Navbar getImagePath={getImagePath} adminData={adminData} />
            <div className="dash-body flex items-start justify-between">
                <Sidebar getImagePath={getImagePath} adminData={adminData}/>
                <div className="dashboard-main">
                    <div className="dash-title flex items-center justify-start gap-5 p-4">
                        <h1 className='text-2xl'> DASHBOARD  </h1>
                        <svg width="28" height="25" viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" fill='black' d="M13.9997 0.642578C14.1323 0.642578 14.2595 0.695257 14.3533 0.789025L27.2104 13.6462C27.4057 13.8414 27.4057 14.158 27.2104 14.3533C27.0152 14.5485 26.6986 14.5485 26.5033 14.3533L13.9997 1.84968L1.49613 14.3533C1.30087 14.5485 0.984287 14.5485 0.789025 14.3533C0.593763 14.158 0.593763 13.8414 0.789025 13.6462L13.6462 0.789025C13.7399 0.695257 13.8671 0.642578 13.9997 0.642578ZM3.99972 14.9283C4.27586 14.9283 4.49972 15.1522 4.49972 15.4283V21.1426C4.49972 21.7677 4.74806 22.3673 5.19011 22.8093C5.63216 23.2514 6.23171 23.4997 6.85686 23.4997H21.1426C21.7677 23.4997 22.3673 23.2514 22.8093 22.8093C23.2514 22.3673 23.4997 21.7677 23.4997 21.1426V15.4283C23.4997 15.1522 23.7236 14.9283 23.9997 14.9283C24.2759 14.9283 24.4997 15.1522 24.4997 15.4283V21.1426C24.4997 22.0329 24.146 22.8869 23.5164 23.5164C22.8868 24.146 22.0329 24.4997 21.1426 24.4997H6.85686C5.96649 24.4997 5.11259 24.146 4.48301 23.5164C3.85342 22.8869 3.49972 22.0329 3.49972 21.1426V15.4283C3.49972 15.1522 3.72358 14.9283 3.99972 14.9283Z"/>
                        </svg>
                    </div>
                    <div className="list-data flex items-start justify-start gap-7">
                        <div className="new-applicants">
                            <div className="text-side">
                                <h3>New Applicants</h3>
                                <p className='text-2xl font-bold text-white'>{scChapterCount}</p>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.146 12.1127 0.438 11.638C0.73 11.1633 1.11733 10.8007 1.6 10.55C2.63333 10.0333 3.68333 9.646 4.75 9.388C5.81667 9.13 6.9 9.00067 8 9C9.1 8.99933 10.1833 9.12867 11.25 9.388C12.3167 9.64733 13.3667 10.0347 14.4 10.55C14.8833 10.8 15.271 11.1627 15.563 11.638C15.855 12.1133 16.0007 12.634 16 13.2V16H0Z" fill="black"/>
                            </svg>
                        </div>
                        <div className="all-data">
                            <div className="text-side">
                                <h3>All Applicants</h3>
                                <p className='text-2xl font-bold text-white'>{scChapterCount + dswdCount}</p>
                            </div>
                            <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 5C6.83696 5 6.20107 4.73661 5.73223 4.26777C5.26339 3.79893 5 3.16304 5 2.5C5 1.83696 5.26339 1.20107 5.73223 0.732233C6.20107 0.263392 6.83696 0 7.5 0C8.16304 0 8.79893 0.263392 9.26777 0.732233C9.73661 1.20107 10 1.83696 10 2.5C10 3.16304 9.73661 3.79893 9.26777 4.26777C8.79893 4.73661 8.16304 5 7.5 5ZM7.5 1C6.67 1 6 1.67 6 2.5C6 3.33 6.67 4 7.5 4C8.33 4 9 3.33 9 2.5C9 1.67 8.33 1 7.5 1Z" fill="black"/>
                            <path d="M13.5 9C13.22 9 13 8.78 13 8.5C13 8.22 13.22 8 13.5 8C13.78 8 14 7.78 14 7.5C14 6.83696 13.7366 6.20107 13.2678 5.73223C12.7989 5.26339 12.163 5 11.5 5H10.5C10.22 5 10 4.78 10 4.5C10 4.22 10.22 4 10.5 4C11.33 4 12 3.33 12 2.5C12 1.67 11.33 1 10.5 1C10.22 1 10 0.78 10 0.5C10 0.22 10.22 0 10.5 0C11.163 0 11.7989 0.263392 12.2678 0.732233C12.7366 1.20107 13 1.83696 13 2.5C13 3.12 12.78 3.68 12.4 4.12C13.89 4.52 15 5.88 15 7.5C15 8.33 14.33 9 13.5 9ZM1.5 9C0.67 9 0 8.33 0 7.5C0 5.88 1.1 4.52 2.6 4.12C2.23 3.68 2 3.12 2 2.5C2 1.83696 2.26339 1.20107 2.73223 0.732233C3.20107 0.263392 3.83696 0 4.5 0C4.78 0 5 0.22 5 0.5C5 0.78 4.78 1 4.5 1C3.67 1 3 1.67 3 2.5C3 3.33 3.67 4 4.5 4C4.78 4 5 4.22 5 4.5C5 4.78 4.78 5 4.5 5H3.5C2.83696 5 2.20107 5.26339 1.73223 5.73223C1.26339 6.20107 1 6.83696 1 7.5C1 7.78 1.22 8 1.5 8C1.78 8 2 8.22 2 8.5C2 8.78 1.78 9 1.5 9ZM10.5 12H4.5C3.67 12 3 11.33 3 10.5V9.5C3 7.57 4.57 6 6.5 6H8.5C10.43 6 12 7.57 12 9.5V10.5C12 11.33 11.33 12 10.5 12ZM6.5 7C5.83696 7 5.20107 7.26339 4.73223 7.73223C4.26339 8.20107 4 8.83696 4 9.5V10.5C4 10.78 4.22 11 4.5 11H10.5C10.78 11 11 10.78 11 10.5V9.5C11 8.83696 10.7366 8.20107 10.2678 7.73223C9.79893 7.26339 9.16304 7 8.5 7H6.5Z" fill="black"/>
                            </svg>
                        </div>
                        <div className="dswd-applicant">
                            <div className="text-side">
                                <h3>DSWD Applicants</h3>
                                <p className='text-2xl font-bold text-white'>{dswdCount}</p>
                            </div>
                            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4.5C6.59674 4.5 7.16903 4.26295 7.59099 3.84099C8.01295 3.41903 8.25 2.84674 8.25 2.25C8.25 1.65326 8.01295 1.08097 7.59099 0.65901C7.16903 0.237053 6.59674 0 6 0C5.40326 0 4.83097 0.237053 4.40901 0.65901C3.98705 1.08097 3.75 1.65326 3.75 2.25C3.75 2.84674 3.98705 3.41903 4.40901 3.84099C4.83097 4.26295 5.40326 4.5 6 4.5ZM12.5 10.5C12.1022 10.5 11.7206 10.658 11.4393 10.9393C11.158 11.2206 11 11.6022 11 12V12.1715C11 12.3041 11.0527 12.4313 11.1464 12.5251C11.2402 12.6188 11.3674 12.6715 11.5 12.6715C11.6326 12.6715 11.7598 12.6188 11.8536 12.5251C11.9473 12.4313 12 12.3041 12 12.1715V12C12 11.8674 12.0527 11.7402 12.1464 11.6464C12.2402 11.5527 12.3674 11.5 12.5 11.5C12.6326 11.5 12.7598 11.5527 12.8536 11.6464C12.9473 11.7402 13 11.8674 13 12V19.473C13 19.6056 13.0527 19.7328 13.1464 19.8266C13.2402 19.9203 13.3674 19.973 13.5 19.973C13.6326 19.973 13.7598 19.9203 13.8536 19.8266C13.9473 19.7328 14 19.6056 14 19.473V12C14 11.6022 13.842 11.2206 13.5607 10.9393C13.2794 10.658 12.8978 10.5 12.5 10.5ZM9.8545 8.0895L9 7.7165L9.7975 8.055L9.8545 8.0895ZM10.4675 8.6205C10.2934 8.41132 10.0864 8.23196 9.8545 8.0895L13 9.464V9.416V9.417C13.0475 9.967 12.6225 10.4505 12.0505 10.497C11.4835 10.542 10.9845 10.14 10.93 9.5965V9.5955L10.9225 9.5525C10.9074 9.47915 10.8882 9.4067 10.865 9.3355C10.7773 9.07488 10.6426 8.83254 10.4675 8.6205Z" fill="black"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13 9.4155L9.79752 8.0555C9.54678 7.90973 9.27889 7.79569 9.00002 7.716V19C8.99992 19.2565 8.90125 19.5032 8.7244 19.689C8.54754 19.8749 8.30604 19.9856 8.04983 19.9984C7.79362 20.0112 7.5423 19.925 7.34784 19.7577C7.15337 19.5904 7.03064 19.3547 7.00502 19.0995L6.50502 14.0995C6.5017 14.0664 6.50003 14.0332 6.50002 14H5.50002C5.50002 14.0333 5.49835 14.0665 5.49502 14.0995L4.99502 19.0995C4.9694 19.3547 4.84667 19.5904 4.6522 19.7577C4.45774 19.925 4.20642 20.0112 3.95021 19.9984C3.694 19.9856 3.4525 19.8749 3.27564 19.689C3.09879 19.5032 3.00012 19.2565 3.00002 19V11.9595C2.16052 11.848 1.45502 11.5105 0.93202 10.997C0.632024 10.7035 0.394735 10.3522 0.234531 9.96436C0.0743273 9.57649 -0.0054549 9.16012 1.96722e-05 8.7405C0.00427963 8.32217 0.0913001 7.90883 0.256065 7.52429C0.420829 7.13975 0.660078 6.79163 0.96002 6.5C1.60502 5.8705 2.52452 5.5 3.62752 5.5H7.28752C9.77402 5.5 11.2595 6.361 12.0975 7.3795C12.4275 7.77876 12.6807 8.23561 12.8445 8.727C12.9175 8.947 12.9745 9.1735 12.999 9.4035V9.411L13 9.414V9.4155ZM2.41552 9.5965C2.54402 9.7225 2.73102 9.8445 3.00002 9.9205V7.585C2.75002 7.661 2.56802 7.7795 2.43852 7.9055C2.32489 8.01687 2.23455 8.14973 2.17275 8.29634C2.11095 8.44296 2.07891 8.60039 2.07852 8.7595C2.07552 9.0795 2.19452 9.3795 2.41552 9.5965Z" fill="black"/>
                            </svg>
                        </div>
                    </div>
                    
                    <div className="charts flex gap-8 p-5">
                        {/* Pie Chart */}
                        <div className="pie-chart">
                            <h3>Applicants Distribution</h3>
                            <Pie data={pieData} width={400} height={400} />
                        </div>

                        {/* Line Chart */}
                        <div className="line-chart">
                            <h3>Applicants Over Time</h3>
                            <Line data={lineData} width={800} height={400} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Dashboard