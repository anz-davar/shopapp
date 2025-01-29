// import React, { useState, useEffect } from 'react';
// import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';
// import SalesService from '../services/sales-services';
//
// const SalesReport = ({ token }) => {
//     const getPastDate = (days) => {
//         const pastDate = new Date();
//         pastDate.setDate(pastDate.getDate() - days);
//         return pastDate;
//     };
//
//     const [startDate, setStartDate] = useState(getPastDate(7));
//     const [endDate, setEndDate] = useState(new Date());
//     const [salesData, setSalesData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [isTokenReady, setIsTokenReady] = useState(false);
//
//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//             x: {
//                 title: { display: true, text: 'Date' },
//                 grid: { color: 'rgba(0, 0, 0, 0.1)' }
//             },
//             y: {
//                 title: { display: true, text: 'Total Income' },
//                 beginAtZero: true,
//                 grid: { color: 'rgba(0, 0, 0, 0.1)' }
//             },
//         },
//         plugins: {
//             legend: { display: true, position: 'top', align: 'center' },
//             title: { display: true, text: 'Sales Report', font: { size: 16 } }
//         }
//     };
//
//     useEffect(() => {
//         // Check if token is available
//         if (token) {
//             setIsTokenReady(true);
//             // Only fetch initial data when token is ready
//             fetchSalesData();
//         }
//     }, [token]);
//
//     const fetchSalesData = async () => {
//         if (!token) {
//             console.log("Token not available yet");
//             return;
//         }
//
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await SalesService.getSalesReport(token, startDate, endDate);
//             setSalesData(response.data);
//         } catch (err) {
//             console.error("Error fetching sales report:", err);
//             setError("Failed to fetch sales report.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleStartDateChange = (e) => {
//         setStartDate(new Date(e.target.value));
//     };
//
//     const handleEndDateChange = (e) => {
//         setEndDate(new Date(e.target.value));
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         fetchSalesData();
//     };
//
//     const chartData = salesData && {
//         labels: salesData.map((item) => item.cart__create_date__date),
//         datasets: [
//             {
//                 label: 'Total Sales Income',
//                 data: salesData.map((item) => item.daily_income),
//                 backgroundColor: 'rgba(54, 162, 235, 0.5)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };
//
//     // Show loading spinner while waiting for token
//     if (!isTokenReady) {
//         return (
//             <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
//                 <Spinner animation="border" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </Spinner>
//             </Container>
//         );
//     }
//
//     return (
//         <Container>
//             <h2 className="text-center mb-4">Sales Report</h2>
//             <Form onSubmit={handleSubmit}>
//                 <Row className="mb-3">
//                     <Col md={6}>
//                         <Form.Group controlId="startDate">
//                             <Form.Label>Start Date</Form.Label>
//                             <Form.Control
//                                 type="date"
//                                 value={startDate.toISOString().split('T')[0]}
//                                 onChange={handleStartDateChange}
//                             />
//                         </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                         <Form.Group controlId="endDate">
//                             <Form.Label>End Date</Form.Label>
//                             <Form.Control
//                                 type="date"
//                                 value={endDate.toISOString().split('T')[0]}
//                                 onChange={handleEndDateChange}
//                             />
//                         </Form.Group>
//                     </Col>
//                 </Row>
//                 <div className="d-flex justify-content-center mb-3">
//                     <Button type="submit" disabled={loading}>
//                         {loading ? <Spinner animation="border" size="sm" /> : "Generate Report"}
//                     </Button>
//                 </div>
//             </Form>
//
//             {error && <Alert variant="danger">{error}</Alert>}
//
//             {loading ? (
//                 <div className="d-flex justify-content-center">
//                     <Spinner animation="border" />
//                 </div>
//             ) : salesData && salesData.length > 0 ? (
//                 <Bar data={chartData} options={chartOptions} height={400} />
//             ) : (
//                 <p className="text-center">No sales data available for the selected date range.</p>
//             )}
//         </Container>
//     );
// };
//
// export default SalesReport;

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';
// import SalesService from '../services/sales-services'; // **YOU MUST IMPLEMENT THIS**
//
// const SalesReport = ({ token }) => {
//     const getPastDate = (days) => {
//         const pastDate = new Date();
//         pastDate.setDate(pastDate.getDate() - days);
//         return pastDate;
//     };
//
//     const [startDate, setStartDate] = useState(getPastDate(7));
//     const [endDate, setEndDate] = useState(new Date());
//     const [salesData, setSalesData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isTokenReady, setIsTokenReady] = useState(false);
//
//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//             x: {
//                 title: { display: true, text: 'Date' },
//                 grid: { color: 'rgba(0, 0, 0, 0.1)' }
//             },
//             y: {
//                 title: { display: true, text: 'Total Income' },
//                 beginAtZero: true,
//                 grid: { color: 'rgba(0, 0, 0, 0.1)' }
//             },
//         },
//         plugins: {
//             legend: { display: true, position: 'top', align: 'center' },
//             title: { display: true, text: 'Sales Report', font: { size: 16 } }
//         }
//     };
//
//     useEffect(() => {
//         if (token) {
//             setIsTokenReady(true);
//             fetchSalesData();
//         }
//     }, [token, startDate, endDate]);
//
//     const fetchSalesData = async () => {
//         if (!token) {
//             console.log("Token not available yet");
//             return;
//         }
//
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await SalesService.getSalesReport(token, startDate, endDate); // API CALL
//             setSalesData(response.data);
//         } catch (err) {
//             console.error("Error fetching sales report:", err);
//             setError("Failed to fetch sales report.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleStartDateChange = (e) => {
//         setStartDate(new Date(e.target.value));
//     };
//
//     const handleEndDateChange = (e) => {
//         setEndDate(new Date(e.target.value));
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         fetchSalesData();
//     };
//
//     const chartData = salesData && {
//         labels: salesData.map((item) => item.cart__create_date__date),
//         datasets: [
//             {
//                 label: 'Total Sales Income',
//                 data: salesData.map((item) => item.daily_income),
//                 backgroundColor: 'rgba(54, 162, 235, 0.5)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };
//
//     if (!isTokenReady) {
//         return (
//             <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
//                 <Spinner animation="border" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </Spinner>
//             </Container>
//         );
//     }
//
//     return (
//         <Container>
//             <h2 className="text-center mb-4">Sales Report</h2>
//             <Form onSubmit={handleSubmit}>
//                 <Row className="mb-3">
//                     <Col md={6}>
//                         <Form.Group controlId="startDate">
//                             <Form.Label>Start Date</Form.Label>
//                             <Form.Control
//                                 type="date"
//                                 value={startDate.toISOString().split('T')[0]}
//                                 onChange={handleStartDateChange}
//                             />
//                         </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                         <Form.Group controlId="endDate">
//                             <Form.Label>End Date</Form.Label>
//                             <Form.Control
//                                 type="date"
//                                 value={endDate.toISOString().split('T')[0]}
//                                 onChange={handleEndDateChange}
//                             />
//                         </Form.Group>
//                     </Col>
//                 </Row>
//                 <div className="d-flex justify-content-center mb-3">
//                     <Button type="submit" disabled={loading}>
//                         {loading ? <Spinner animation="border" size="sm" /> : "Generate Report"}
//                     </Button>
//                 </div>
//             </Form>
//
//             {error && <Alert variant="danger">{error}</Alert>}
//
//             {loading ? (
//                 <div className="d-flex justify-content-center">
//                     <Spinner animation="border" />
//                 </div>
//             ) : salesData && salesData.length > 0 ? (
//                 <Bar data={chartData} options={chartOptions} height={400} />
//             ) : (
//                 <p className="text-center">No sales data available for the selected date range.</p>
//             )}
//         </Container>
//     );
// };
//
// export default SalesReport;


import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import SalesService from '../services/sales-services';

const SalesReport = ({ token }) => {
    const getPastDate = (days) => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);
        return pastDate;
    };

    const [startDate, setStartDate] = useState(getPastDate(7));
    const [endDate, setEndDate] = useState(new Date());
    const [salesData, setSalesData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Chart configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: { display: true, text: 'Date' },
                grid: { color: 'rgba(0, 0, 0, 0.1)' }
            },
            y: {
                title: { display: true, text: 'Total Income' },
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.1)' }
            },
        },
        plugins: {
            legend: { display: true, position: 'top', align: 'center' },
            title: { display: true, text: 'Sales Report', font: { size: 16 } }
        }
    };

    useEffect(() => {
        if (token) {
            fetchSalesData();
        }
    }, [token]);

    const fetchSalesData = async () => {
        if (!token) {
            setError("Authentication token not available");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await SalesService.getSalesReport(token, startDate, endDate);
                // console.log(response.data);
                // console.log(response.data);
                // console.log(response.data);

            if (Array.isArray(response)) {
                setSalesData(response);
            } else {
                throw new Error("Invalid data format received from API");
            }
        } catch (err) {
            console.error("Error fetching sales report:", err);
            setError(err.message || "Failed to fetch sales report");
        } finally {
            setLoading(false);
        }
    };

    const handleStartDateChange = (e) => {
        setStartDate(new Date(e.target.value));
    };

    const handleEndDateChange = (e) => {
        setEndDate(new Date(e.target.value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchSalesData();
    };

    const chartData = salesData ? {
        labels: salesData.map((item) => item.cart__create_date__date),
        datasets: [{
            label: 'Total Sales Income',
            data: salesData.map((item) => item.daily_income),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    } : null;

    if (!token) {
        return <Alert variant="warning">Please log in to view the sales report.</Alert>;
    }

    return (
        <Container>
            <h2 className="text-center mb-4">Sales Report</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate.toISOString().split('T')[0]}
                                onChange={handleStartDateChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="endDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate.toISOString().split('T')[0]}
                                onChange={handleEndDateChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex justify-content-center mb-3">
                    <Button type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Generate Report"}
                    </Button>
                </div>
            </Form>

            {error && <Alert variant="danger">{error}</Alert>}

            <div style={{ minHeight: '400px' }}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <Spinner animation="border" />
                    </div>
                ) : salesData && salesData.length > 0 ? (
                    <Bar data={chartData} options={chartOptions} height={400} />
                ) : (
                    <Alert variant="info">
                        No sales data available for the selected date range.
                    </Alert>
                )}
            </div>
        </Container>
    );
};

export default SalesReport;