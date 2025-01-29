//
// import React, { useState, useEffect } from 'react';
// import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';
// import Rating from '@mui/material/Rating'; // For star ratings
// import FeedbackService from '../services/feedback-services'; // **YOU MUST IMPLEMENT THIS**
//
// const FeedbackReport = ({ token }) => {
//     const getPastDate = (days) => {
//         const pastDate = new Date();
//         pastDate.setDate(pastDate.getDate() - days);
//         return pastDate;
//     };
//
//     const [startDate, setStartDate] = useState(getPastDate(7));
//     const [endDate, setEndDate] = useState(new Date());
//     const [feedbackData, setFeedbackData] = useState([]); // Initialize as empty array
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isTokenReady, setIsTokenReady] = useState(false);
//
//     const pieChartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: { display: true, position: 'bottom' },
//             title: { display: true, text: 'Feedback Distribution', font: { size: 16 } }
//         }
//     };
//
//     useEffect(() => {
//         if (token) {
//             setIsTokenReady(true);
//             fetchFeedbackData();
//         }
//     }, [token, startDate, endDate]); // Important: Add startDate, endDate
//
//     const fetchFeedbackData = async () => {
//         if (!token) {
//             console.log("Token not available yet");
//             return;
//         }
//
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await FeedbackService.getFeedbackReport(token, startDate, endDate);
//             console.log("API Response:", response.data); // Check API Response
//
//             if (Array.isArray(response.data)) {
//                 setFeedbackData(response.data);
//             } else {
//                 console.error("API response is not an array:", response.data);
//                 setError("Invalid data format from API.");
//             }
//         } catch (err) {
//             console.error("Error fetching feedback report:", err);
//             setError("Failed to fetch feedback report.");
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
//         fetchFeedbackData();
//     };
//
//     const pieChartData = feedbackData && feedbackData.length > 0 ? {
//         labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
//         datasets: [{
//             label: 'Number of Feedbacks',
//             data: [
//                 feedbackData.filter(item => Math.round(item.score / 2) === 1).length,
//                 feedbackData.filter(item => Math.round(item.score / 2) === 2).length,
//                 feedbackData.filter(item => Math.round(item.score / 2) === 3).length,
//                 feedbackData.filter(item => Math.round(item.score / 2) === 4).length,
//                 feedbackData.filter(item => Math.round(item.score / 2) === 5).length,
//             ],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.5)',
//                 'rgba(54, 162, 235, 0.5)',
//                 'rgba(255, 206, 86, 0.5)',
//                 'rgba(75, 192, 192, 0.5)',
//                 'rgba(153, 102, 255, 0.5)',
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//             ],
//             borderWidth: 1,
//         }],
//     } : null;
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
//             <h2 className="text-center mb-4">Feedback Report</h2>
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
//             ) : feedbackData && feedbackData.length > 0 ? (
//                 <Row>
//                     <Col md={6}>
//                         <div style={{ height: '300px', width: '300px' }}> {/* Add a container with dimensions */}
//                             <Pie data={pieChartData} options={pieChartOptions} />
//                         </div>
//                     </Col>
//                     <Col md={6}>
//                         {feedbackData.map((feedback) => (
//                             <div key={feedback.id} className="mb-3 p-2 border rounded"> {/* Important: Add a key prop */}
//                                 <Rating name="read-only" value={Math.round(feedback.score / 2)} readOnly /> {/* Correct star rating value */}
//                                 <p>{feedback.feedback_text}</p>
//                             </div>
//                         ))}
//                     </Col>
//                 </Row>
//             ) : (
//                 <p className="text-center">No feedback data available for the selected date range.</p>
//             )}
//         </Container>
//     );
// };
//
// export default FeedbackReport;

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';
// import Rating from '@mui/material/Rating';
// import FeedbackService from '../services/feedback-services';
//
// const FeedbackReport = ({ token }) => {
//     const getPastDate = (days) => {
//         const pastDate = new Date();
//         pastDate.setDate(pastDate.getDate() - days);
//         return pastDate;
//     };
//
//     const [startDate, setStartDate] = useState(getPastDate(7));
//     const [endDate, setEndDate] = useState(new Date());
//     const [feedbackData, setFeedbackData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isTokenReady, setIsTokenReady] = useState(false);
//
//     const pieChartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: true,
//                 position: 'bottom',
//                 labels: {
//                     font: { size: 12 }
//                 }
//             },
//             title: {
//                 display: true,
//                 text: 'Feedback Score Distribution (1-10)',
//                 font: { size: 16 }
//             }
//         }
//     };
//
//     useEffect(() => {
//         if (token) {
//             setIsTokenReady(true);
//             fetchFeedbackData();
//         }
//     }, [token, startDate, endDate]);
//
//     const fetchFeedbackData = async () => {
//         if (!token) {
//             console.log("Token not available yet");
//             return;
//         }
//
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await FeedbackService.getFeedbackReport(token, startDate, endDate);
//             console.log("API Response:", response.data);
//
//             if (Array.isArray(response.data)) {
//                 setFeedbackData(response.data);
//             } else {
//                 console.error("API response is not an array:", response.data);
//                 setError("Invalid data format from API.");
//             }
//         } catch (err) {
//             console.error("Error fetching feedback report:", err);
//             setError("Failed to fetch feedback report.");
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
//         fetchFeedbackData();
//     };
//
//     const getScoreRangeLabel = (score) => {
//         if (score <= 2) return 'Very Poor (1-2)';
//         if (score <= 4) return 'Poor (3-4)';
//         if (score <= 6) return 'Average (5-6)';
//         if (score <= 8) return 'Good (7-8)';
//         return 'Excellent (9-10)';
//     };
//
//     const pieChartData = feedbackData && feedbackData.length > 0 ? {
//         labels: [
//             'Very Poor (1-2)',
//             'Poor (3-4)',
//             'Average (5-6)',
//             'Good (7-8)',
//             'Excellent (9-10)'
//         ],
//         datasets: [{
//             label: 'Number of Feedbacks',
//             data: [
//                 feedbackData.filter(item => item.score <= 2).length,
//                 feedbackData.filter(item => item.score > 2 && item.score <= 4).length,
//                 feedbackData.filter(item => item.score > 4 && item.score <= 6).length,
//                 feedbackData.filter(item => item.score > 6 && item.score <= 8).length,
//                 feedbackData.filter(item => item.score > 8 && item.score <= 10).length,
//             ],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.5)',
//                 'rgba(255, 159, 64, 0.5)',
//                 'rgba(255, 206, 86, 0.5)',
//                 'rgba(75, 192, 192, 0.5)',
//                 'rgba(153, 102, 255, 0.5)',
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(255, 159, 64, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//             ],
//             borderWidth: 1,
//         }],
//     } : null;
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
//             <h2 className="text-center mb-4">Feedback Report</h2>
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
//             ) : feedbackData && feedbackData.length > 0 ? (
//                 <Row>
//                     <Col md={6}>
//                         <div style={{ height: '300px', width: '300px' }}>
//                             <Pie data={pieChartData} options={pieChartOptions} />
//                         </div>
//                     </Col>
//                     <Col md={6}>
//                         {feedbackData.map((feedback) => (
//                             <div key={feedback.id} className="mb-3 p-2 border rounded">
//                                 <div className="d-flex align-items-center gap-2">
//                                     <Rating
//                                         name="read-only"
//                                         value={feedback.score / 2}
//                                         readOnly
//                                         precision={0.5}
//                                         max={5}
//                                     />
//                                     <span className="ms-2 text-muted">
//                                         ({feedback.score}/10) - {getScoreRangeLabel(feedback.score)}
//                                     </span>
//                                 </div>
//                                 <p className="mt-2 mb-0">{feedback.feedback_text}</p>
//                             </div>
//                         ))}
//                     </Col>
//                 </Row>
//             ) : (
//                 <p className="text-center">No feedback data available for the selected date range.</p>
//             )}
//         </Container>
//     );
// };
//
// export default FeedbackReport;

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import Rating from '@mui/material/Rating';
import FeedbackService from '../services/feedback-services';

const FeedbackReport = ({ token }) => {
    const getPastDate = (days) => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);
        return pastDate;
    };

    const [startDate, setStartDate] = useState(getPastDate(7));
    const [endDate, setEndDate] = useState(new Date());
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTokenReady, setIsTokenReady] = useState(false);

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: 'Feedback Score Distribution (1-10)',
                font: { size: 16 }
            }
        }
    };

    useEffect(() => {
        if (token) {
            setIsTokenReady(true);
            fetchFeedbackData();
        }
    }, [token, startDate, endDate]);

    const fetchFeedbackData = async () => {
        if (!token) {
            console.log("Token not available yet");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await FeedbackService.getFeedbackReport(token, startDate, endDate);
            console.log("API Response:", response.data);

            if (Array.isArray(response.data)) {
                setFeedbackData(response.data);
            } else {
                console.error("API response is not an array:", response.data);
                setError("Invalid data format from API.");
            }
        } catch (err) {
            console.error("Error fetching feedback report:", err);
            setError("Failed to fetch feedback report.");
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
        fetchFeedbackData();
    };

    const getScoreRangeLabel = (score) => {
        if (score <= 2) return 'Very Poor (1-2)';
        if (score <= 4) return 'Poor (3-4)';
        if (score <= 6) return 'Average (5-6)';
        if (score <= 8) return 'Good (7-8)';
        return 'Excellent (9-10)';
    };

    const pieChartData = feedbackData && feedbackData.length > 0 ? {
        labels: [
            'Very Poor (1-2)',
            'Poor (3-4)',
            'Average (5-6)',
            'Good (7-8)',
            'Excellent (9-10)'
        ],
        datasets: [{
            label: 'Number of Feedbacks',
            data: [
                feedbackData.filter(item => item.score <= 2).length,
                feedbackData.filter(item => item.score > 2 && item.score <= 4).length,
                feedbackData.filter(item => item.score > 4 && item.score <= 6).length,
                feedbackData.filter(item => item.score > 6 && item.score <= 8).length,
                feedbackData.filter(item => item.score > 8 && item.score <= 10).length,
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(255, 159, 64, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
        }],
    } : null;

    if (!isTokenReady) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="text-center mb-4">Feedback Report</h2>
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

            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            ) : feedbackData && feedbackData.length > 0 ? (
                <Row>
                    <Col md={6}>
                        <div style={{ height: '300px', width: '300px' }}>
                            <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                    </Col>
                    <Col md={6}>
                        {feedbackData.map((feedback) => (
                            <div key={feedback.id} className="mb-3 p-2 border rounded">
                                <div className="d-flex align-items-center gap-2">
                                    <Rating
                                        name={`rating-${feedback.id}`}
                                        value={feedback.score}
                                        readOnly
                                        max={10}
                                        size="medium"
                                    />
                                    <span className="ms-2 text-muted">
                                        ({feedback.score}/10) - {getScoreRangeLabel(feedback.score)}
                                    </span>
                                </div>
                                <p className="mt-2 mb-0">{feedback.feedback_text}</p>
                            </div>
                        ))}
                    </Col>
                </Row>
            ) : (
                <p className="text-center">No feedback data available for the selected date range.</p>
            )}
        </Container>
    );
};

export default FeedbackReport;