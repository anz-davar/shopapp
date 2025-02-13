// import React, {useState, useEffect} from 'react';
// import {Table, Button, Modal, Alert, Spinner, Card, Image, Row, Col} from 'react-bootstrap';
// import Rating from '@mui/material/Rating';
// import CartService from '../services/cart-services';
// import {formatCurrency} from "../utilities/formatCurrency";
//
// const OrderList = ({token}) => {
//     const [orders, setOrders] = useState([]);
//     const [selectedOrderItems, setSelectedOrderItems] = useState([]);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//     const [selectedFeedback, setSelectedFeedback] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         const fetchOrders = async () => {
//             if (!token) {
//                 console.log("Token not available yet");
//                 return;
//             }
//
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await CartService.getAllCarts(token);
//                 setOrders(response.data);
//             } catch (err) {
//                 console.error("Error fetching orders:", err);
//                 setError("Failed to fetch orders.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchOrders();
//     }, [token]);
//
//     const handleViewDetails = (order) => {
//         setSelectedOrder(order);
//         setSelectedOrderItems(order.items);
//         setShowModal(true);
//     };
//
//     const handleViewFeedback = (order) => {
//         if (order.feedback) {
//             setSelectedFeedback(order.feedback);
//             setSelectedOrder(order); // Set the selected order for the feedback modal
//             setShowFeedbackModal(true);
//         } else {
//             alert("No feedback available for this order.");
//         }
//     };
//
//     if (loading) {
//         return <Spinner animation="border"/>;
//     }
//
//     if (error) {
//         return <Alert variant="danger">{error}</Alert>;
//     }
//
//     return (
//         <div>
//             <h2>Orders</h2>
//             <Table striped bordered hover>
//                 <thead>
//                 <tr>
//                     <th>Order ID</th>
//                     <th>Customer</th>
//                     <th>Date</th>
//                     <th>Sent</th>
//                     <th>Actions</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {orders.map((order) => (
//                     <tr key={order.id}>
//                         <td>{order.id}</td>
//                         <td>{order.customer.name}</td>
//                         <td>{new Date(order.create_date).toLocaleString()}</td>
//                         <td>{order.collection ? "Yes" : "No"}</td>
//                         <td>
//                             <Button onClick={() => handleViewDetails(order)}>View Details</Button>{' '}
//                             <Button
//                                 onClick={() => handleViewFeedback(order)}
//                                 variant="info"
//                                 disabled={!order.feedback}
//                             >
//                                 View Feedback
//                             </Button>
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </Table>
//
//             <Modal
//                 show={showModal}
//                 onHide={() => setShowModal(false)}
//                 size="xl"
//                 aria-labelledby="contained-modal-title-vcenter"
//                 centered
//             >
//                 <Modal.Header closeButton>
//                     <Modal.Title id="contained-modal-title-vcenter">
//                         Order Details
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedOrder && (
//                         <div>
//                             <Row>
//                                 <Col md={6}>
//                                     <p>Order ID: {selectedOrder.id}</p>
//                                     <p>Order Date: {new Date(selectedOrder.create_date).toLocaleString()}</p>
//                                     <p>Order Sent: {selectedOrder.collection ? "Yes" : "No"}</p>
//                                     {selectedOrder.collection && (
//                                         <div>
//                                             <p>Collected By: {selectedOrder.collection.collector.username}</p>
//                                             <p>Collected
//                                                 At: {new Date(selectedOrder.collection.created_at).toLocaleString()}</p>
//                                         </div>
//                                     )}
//                                 </Col>
//                                 <Col md={6}>
//                                     <p>Customer Name: {selectedOrder.customer.name}</p>
//                                     <p>Customer Email: {selectedOrder.customer.email}</p>
//                                     <p>Customer Phone: {selectedOrder.customer.phone_number}</p>
//                                     <p>Customer Address: {selectedOrder.customer.address}</p>
//                                     <p>Customer National ID: {selectedOrder.customer.national_id}</p>
//                                 </Col>
//                             </Row>
//                             <Table striped bordered hover>
//                                 <thead>
//                                 <tr>
//                                     <th>Product</th>
//                                     <th>Quantity</th>
//                                     <th>Price</th>
//                                     <th>Total</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {selectedOrderItems.map((item) => (
//                                     <tr key={item.id}>
//                                         <td>{item.product.name}</td>
//                                         <td>{item.quantity}</td>
//                                         <td>{formatCurrency(item.product.price)}</td>
//                                         <td>{formatCurrency(item.product.price * item.quantity)}</td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </Table>
//                             <p className="text-right font-weight-bold h5">
//                                 Total order: {formatCurrency(selectedOrder.total_price)}
//                             </p></div>
//                     )}
//                 </Modal.Body>
//             </Modal>
//
//             <Modal
//                 show={showFeedbackModal}
//                 onHide={() => setShowFeedbackModal(false)}
//                 size="lg"
//                 centered
//             >
//                 <Modal.Header closeButton>
//                     <Modal.Title>Feedback Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedFeedback && selectedOrder && ( // Check for both feedback and order
//                         <div>
//                             {/* Order Details in Feedback Modal */}
//                             <Card className="mb-3"> {/* Add margin bottom */}
//                                 <Card.Body>
//                                     <Card.Title>Order Details</Card.Title>
//                                     <Row>
//                                         <Col md={6}>
//                                             <p>Order ID: {selectedOrder.id}</p>
//                                             <p>Order Date: {new Date(selectedOrder.create_date).toLocaleString()}</p>
//                                         </Col>
//                                         <Col md={6}>
//                                             <p>Customer Name: {selectedOrder.customer.name}</p>
//                                             <p>Customer Email: {selectedOrder.customer.email}</p>
//                                         </Col>
//                                     </Row>
//                                     <Table striped bordered size="sm"> {/* Add size for compactness */}
//                                         <thead>
//                                         <tr>
//                                             <th>Product</th>
//                                             <th>Quantity</th>
//                                             <th>Price</th>
//                                         </tr>
//                                         </thead>
//                                         <tbody>
//                                         {selectedOrder.items.map((item) => (
//                                             <tr key={item.id}>
//                                                 <td>{item.product.name}</td>
//                                                 <td>{item.quantity}</td>
//                                                 <td>{formatCurrency(item.product.price)}</td>
//                                             </tr>
//                                         ))}
//                                         </tbody>
//                                     </Table>
//                                 </Card.Body>
//                             </Card>
//                             <Card className="mt-3"> {/* Add margin top to separate from order details */}
//                                 <Card.Body>
//                                     <Row className="justify-content-center"> {/* Center the rating title */}
//                                         <Col xs={12} md={6} className="text-center">
//                                             <Card.Title>Rating</Card.Title>
//                                         </Col>
//                                     </Row>
//                                     <Row className="justify-content-center"> {/* Center the rating stars */}
//                                         <Col xs={12} md={6} className="text-center">
//                                             <Rating
//                                                 name="read-only"
//                                                 value={selectedFeedback.score}
//                                                 max={10}
//                                                 readOnly
//                                                 precision={1}
//                                             />
//                                         </Col>
//                                     </Row>
//
//                                     <Row className="justify-content-center mt-2">
//                                         <Col xs={12} md={6} className="text-center">
//                                             <Card.Title>Feedback Text</Card.Title>
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col xs={12}>
//                                             <Card.Text className="mt-2">
//                                                 {selectedFeedback.feedback_text}
//                                             </Card.Text>
//                                         </Col>
//                                     </Row>
//
//                                     {selectedFeedback.feedback_image && (
//                                         <div className="mt-2">
//                                             <Row className="justify-content-center">
//                                                 <Col xs={12} md={6} className="text-center">
//                                                     <Card.Title>Feedback Image</Card.Title>
//                                                 </Col>
//                                             </Row>
//                                             <Row> {/* Use Row for image centering */}
//                                                 <Col xs={12} className="text-center"> {/* Center the image */}
//                                                     <Image src={selectedFeedback.feedback_image} fluid
//                                                            style={{maxWidth: '400px'}}/> {/* Limit image width */}
//                                                 </Col>
//                                             </Row>
//                                         </div>
//                                     )}
//                                 </Card.Body>
//                             </Card>
//                         </div>
//                     )}
//                 </Modal.Body>
//             </Modal>
//         </div>
//     );
// };
//
// export default OrderList;

import React, {useState, useEffect} from 'react';
import {Table, Button, Modal, Alert, Spinner, Card, Image, Row, Col, Form, InputGroup} from 'react-bootstrap';
import Rating from '@mui/material/Rating';
import CartService from '../services/cart-services';
import {formatCurrency} from "../utilities/formatCurrency";

const OrderList = ({token}) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                console.log("Token not available yet");
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await CartService.getAllCarts(token);
                setOrders(response.data);
                setFilteredOrders(response.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    useEffect(() => {
        const searchOrders = () => {
            const searchTermLower = searchTerm.toLowerCase();
            const filtered = orders.filter(order =>
                order.id.toString().includes(searchTermLower) ||
                order.customer.name.toLowerCase().includes(searchTermLower) ||
                order.customer.email.toLowerCase().includes(searchTermLower) ||
                new Date(order.create_date).toLocaleString().toLowerCase().includes(searchTermLower) ||
                order.customer.phone_number.includes(searchTermLower)
            );
            setFilteredOrders(filtered);
        };

        searchOrders();
    }, [searchTerm, orders]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setSelectedOrderItems(order.items);
        setShowModal(true);
    };

    const handleViewFeedback = (order) => {
        if (order.feedback) {
            setSelectedFeedback(order.feedback);
            setSelectedOrder(order);
            setShowFeedbackModal(true);
        } else {
            alert("No feedback available for this order.");
        }
    };

    if (loading) {
        return <Spinner animation="border"/>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Orders</h2>
            <Form className="mb-3">
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Search by order ID, customer name, email, date, or phone..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {searchTerm && (
                        <Button
                            variant="outline-secondary"
                            onClick={() => setSearchTerm('')}
                        >
                            Clear
                        </Button>
                    )}
                </InputGroup>
            </Form>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Sent</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredOrders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer.name}</td>
                        <td>{new Date(order.create_date).toLocaleString()}</td>
                        <td>{order.collection ? "Yes" : "No"}</td>
                        <td>
                            <Button onClick={() => handleViewDetails(order)}>View Details</Button>{' '}
                            <Button
                                onClick={() => handleViewFeedback(order)}
                                variant="info"
                                disabled={!order.feedback}
                            >
                                View Feedback
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Modal code remains the same... */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Order Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div>
                            <Row>
                                <Col md={6}>
                                    <p>Order ID: {selectedOrder.id}</p>
                                    <p>Order Date: {new Date(selectedOrder.create_date).toLocaleString()}</p>
                                    <p>Order Sent: {selectedOrder.collection ? "Yes" : "No"}</p>
                                    {selectedOrder.collection && (
                                        <div>
                                            <p>Collected By: {selectedOrder.collection.collector.username}</p>
                                            <p>Collected
                                                At: {new Date(selectedOrder.collection.created_at).toLocaleString()}</p>
                                        </div>
                                    )}
                                </Col>
                                <Col md={6}>
                                    <p>Customer Name: {selectedOrder.customer.name}</p>
                                    <p>Customer Email: {selectedOrder.customer.email}</p>
                                    <p>Customer Phone: {selectedOrder.customer.phone_number}</p>
                                    <p>Customer Address: {selectedOrder.customer.address}</p>
                                    <p>Customer National ID: {selectedOrder.customer.national_id}</p>
                                </Col>
                            </Row>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedOrderItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.product.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatCurrency(item.product.price)}</td>
                                        <td>{formatCurrency(item.product.price * item.quantity)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <p className="text-right font-weight-bold h5">
                                Total order: {formatCurrency(selectedOrder.total_price)}
                            </p></div>
                    )}
                </Modal.Body>
            </Modal>

            <Modal
                show={showFeedbackModal}
                onHide={() => setShowFeedbackModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Feedback Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFeedback && selectedOrder && (
                        <div>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Order Details</Card.Title>
                                    <Row>
                                        <Col md={6}>
                                            <p>Order ID: {selectedOrder.id}</p>
                                            <p>Order Date: {new Date(selectedOrder.create_date).toLocaleString()}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p>Customer Name: {selectedOrder.customer.name}</p>
                                            <p>Customer Email: {selectedOrder.customer.email}</p>
                                        </Col>
                                    </Row>
                                    <Table striped bordered size="sm">
                                        <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedOrder.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.product.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{formatCurrency(item.product.price)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                            <Card className="mt-3">
                                <Card.Body>
                                    <Row className="justify-content-center">
                                        <Col xs={12} md={6} className="text-center">
                                            <Card.Title>Rating</Card.Title>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col xs={12} md={6} className="text-center">
                                            <Rating
                                                name="read-only"
                                                value={selectedFeedback.score}
                                                max={10}
                                                readOnly
                                                precision={1}
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-center mt-2">
                                        <Col xs={12} md={6} className="text-center">
                                            <Card.Title>Feedback Text</Card.Title>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <Card.Text className="mt-2">
                                                {selectedFeedback.feedback_text}
                                            </Card.Text>
                                        </Col>
                                    </Row>

                                    {selectedFeedback.feedback_image && (
                                        <div className="mt-2">
                                            <Row className="justify-content-center">
                                                <Col xs={12} md={6} className="text-center">
                                                    <Card.Title>Feedback Image</Card.Title>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} className="text-center">
                                                    <Image src={selectedFeedback.feedback_image} fluid
                                                           style={{maxWidth: '400px'}}/>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default OrderList;