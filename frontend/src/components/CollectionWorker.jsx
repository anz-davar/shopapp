// import React, {useState, useEffect} from 'react';
// import {Form, Button, Table, Alert, Spinner} from 'react-bootstrap';
// import {useHistory} from 'react-router-dom';
// import CartServices from "../services/cart-services";
// import CollectionServices from "../services/collection-services";
// import EmailService from "../services/email-service"; // Import the new email service
//
// const CollectionWorker = ({token}) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [order, setOrder] = useState(null);
//     const [cartItems, setCartItems] = useState([]);
//     const [collectedProducts, setCollectedProducts] = useState({});
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const history = useHistory();
//
//     const handleSearch = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await CartServices.getCartByOrderId(token, searchTerm);
//             setOrder(response);
//             setCartItems(response.items);
//             setCollectedProducts({});
//         } catch (err) {
//             console.error("Error fetching order:", err);
//             setError("Order not found.");
//             setOrder(null);
//             setCartItems([]);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleProductCodeChange = (itemId, code) => {
//         setCollectedProducts({...collectedProducts, [itemId]: code});
//         setError(null);
//     };
//
//     const handleSubmit = async () => {
//         const allCodesValid = cartItems.every(item => {
//             const enteredCode = collectedProducts[item.id];
//             return enteredCode && enteredCode.trim() === item.product.product_code.trim(); // Trim for comparison
//         });
//
//         if (!allCodesValid) {
//             setError("Incorrect product codes. Please check all entries.");
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const collectionData = {
//                 order: order.id,
//                 // collector: /* Get the current user's ID */ 1,
//             };
//
//             const response = await CollectionServices.createCollection(token, collectionData);
//
//                const emailData = {
//                 order_id: order.id,
//                 email: order.customer.email
//             };
//
//             const emailResult = await EmailService.sendEmail(token, emailData);
//
//             if (emailResult.success) {
//                 alert(emailResult.message);  // Or a nicer UI message
//                 history.push('/orders');
//             } else {
//                 setError(emailResult.message);
//             }
//             console.log("Collection created:", response.data);
//             history.push('/orders'); // Or redirect as needed
//         } catch (err) {
//             console.error("Error creating collection:", err);
//             setError("Error creating collection. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div>
//             <h2>Order Collection</h2>
//
//             <Form.Control
//                 type="text"
//                 placeholder="Search by Order ID"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                         handleSearch();
//                     }
//                 }}
//             />
//             <Button onClick={handleSearch} className="mt-2" disabled={loading}>
//                 {loading ? <Spinner animation="border" size="sm"/> : "Search"}
//             </Button>
//
//             {order && (
//                 <div>
//                     <h3>Order Details</h3>
//                     <p>Order ID: {order.id}</p>
//                     {/* ... other order details */}
//
//                     <Table striped bordered hover>
//                         <thead>
//                         <tr>
//                             <th>Product Name</th>
//                             <th>Code</th>
//                             <th>Price</th>
//                             <th>Quantity</th>
//                             <th>Collected Code</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {cartItems.map(item => (
//                             <tr key={item.id}>
//                                 <td>{item.product.name}</td>
//                                 <td>{item.product.product_code}</td>
//                                 <td>{item.product.price}</td>
//                                 <td>{item.quantity}</td>
//                                 <td>
//                                     <Form.Control
//                                         type="text"
//                                         value={collectedProducts[item.id] || ''}
//                                         onChange={(e) => handleProductCodeChange(item.id, e.target.value)}
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </Table>
//
//                     {error && <Alert variant="danger">{error}</Alert>}
//
//                     <Button onClick={handleSubmit} disabled={cartItems.length === 0 || loading}>
//                         {loading ? <Spinner animation="border" size="sm"/> : "Send Collection"}
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default CollectionWorker;

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Table, Alert, Spinner, Modal } from 'react-bootstrap';
// import { useHistory } from 'react-router-dom';
// import CartServices from "../services/cart-services";
// import CollectionServices from "../services/collection-services";
// import EmailService from "../services/email-service";
//
// const CollectionWorker = ({ token }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [orders, setOrders] = useState([]);
//     const [filteredOrders, setFilteredOrders] = useState([]);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [cartItems, setCartItems] = useState([]);
//     const [collectedProducts, setCollectedProducts] = useState({});
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const history = useHistory();
//
//     // Fetch all orders when token is available
//     useEffect(() => {
//         if (token) {
//             fetchOrders();
//         }
//     }, [token]); // Add token as dependency
//
//     // Filter orders when search term changes
//     useEffect(() => {
//         const filtered = orders.filter(order =>
//             order.id.toString().includes(searchTerm.toLowerCase())
//         );
//         setFilteredOrders(filtered);
//     }, [searchTerm, orders]);
//
//     const fetchOrders = async () => {
//         if (!token) return; // Extra safety check
//
//         setLoading(true);
//         try {
//             const response = await CartServices.getAllCarts(token);
//             // Sort by creation date, newest first
//             console.log(response)
//             const sortedOrders = response.data.sort((a, b) =>
//                 new Date(b.create_date) - new Date(a.create_date)
//             );
//             setOrders(sortedOrders);
//             setFilteredOrders(sortedOrders);
//         } catch (err) {
//             console.error("Error fetching orders:", err);
//             setError("Failed to load orders.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleCollect = async (order) => {
//         if (!token) return; // Extra safety check
//
//         try {
//             const response = await CartServices.getCartByOrderId(token, order.id);
//             setSelectedOrder(response);
//             setCartItems(response.items);
//             setCollectedProducts({});
//             setShowModal(true);
//             setError(null);
//         } catch (err) {
//             console.error("Error fetching order details:", err);
//             setError("Failed to load order details.");
//         }
//     };
//
//     const handleProductCodeChange = (itemId, code) => {
//         setCollectedProducts({ ...collectedProducts, [itemId]: code });
//         setError(null);
//     };
//
//     const handleSubmit = async () => {
//         if (!token) return; // Extra safety check
//
//         const allCodesValid = cartItems.every(item => {
//             const enteredCode = collectedProducts[item.id];
//             return enteredCode && enteredCode.trim() === item.product.product_code.trim();
//         });
//
//         if (!allCodesValid) {
//             setError("Incorrect product codes. Please check all entries.");
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const collectionData = {
//                 order: selectedOrder.id,
//             };
//
//             const response = await CollectionServices.createCollection(token, collectionData);
//
//             const emailData = {
//                 order_id: selectedOrder.id,
//                 email: selectedOrder.customer.email
//             };
//
//             const emailResult = await EmailService.sendEmail(token, emailData);
//             console.log(emailResult)
//             console.log(emailResult)
//             if (emailResult.status == 200) {
//                 // Refresh orders list
//                 await fetchOrders();
//                 setShowModal(false);
//                 alert("Order collected and email sent successfully!");
//             } else {
//                 setError(emailResult.statusText);
//             }
//         } catch (err) {
//             console.error("Error creating collection:", err);
//             setError("Error creating collection. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Show loading state while waiting for token
//     if (!token) {
//         return (
//             <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
//                 <Spinner animation="border" />
//             </div>
//         );
//     }
//     const formatDateTime = (dateString) => {
//         if (!dateString) return '-';
//         return new Date(dateString).toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true
//         });
//     };
//
//     return (
//         <div className="p-4">
//             <h2 className="mb-4">Order Collections</h2>
//
//             <Form.Control
//                 type="text"
//                 placeholder="Search by Order ID"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="mb-4"
//             />
//
//             {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
//
//             <Table striped bordered hover responsive>
//                 <thead>
//                     <tr>
//                         <th>Order ID</th>
//                         <th>Customer</th>
//                         <th>Date Created</th>
//                         <th>Status</th>
//                         <th>Sent Date</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {loading ? (
//                         <tr>
//                             <td colSpan="6" className="text-center">
//                                 <Spinner animation="border" />
//                             </td>
//                         </tr>
//                     ) : (
//                         filteredOrders.map(order => (
//                             <tr key={order.id}>
//                                 <td>{order.id}</td>
//                                 <td>{order.customer.name}</td>
//                                 <td>{formatDateTime(order.create_date)}</td>
//                                 <td>
//                                     <span className={`badge ${order.collection ? 'bg-success' : 'bg-warning'}`}>
//                                         {order.collection ? 'Sent' : 'Pending'}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     {order.collection ?
//                                         formatDateTime(order.collection.created_at) :
//                                         '-'
//                                     }
//                                 </td>
//                                 <td>
//                                     <Button
//                                         variant="primary"
//                                         size="sm"
//                                         disabled={order.collection}
//                                         onClick={() => handleCollect(order)}
//                                     >
//                                         Collect
//                                     </Button>
//                                 </td>
//                             </tr>
//                         ))
//                     )}
//                 </tbody>
//             </Table>
//
//             {/* Collection Modal */}
//             <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Collect Order #{selectedOrder?.id}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedOrder && (
//                         <>
//                             <Table striped bordered hover>
//                                 <thead>
//                                     <tr>
//                                         <th>Product Name</th>
//                                         <th>Code</th>
//                                         <th>Price</th>
//                                         <th>Quantity</th>
//                                         <th>Collected Code</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cartItems.map(item => (
//                                         <tr key={item.id}>
//                                             <td>{item.product.name}</td>
//                                             <td>{item.product.product_code}</td>
//                                             <td>{item.product.price}</td>
//                                             <td>{item.quantity}</td>
//                                             <td>
//                                                 <Form.Control
//                                                     type="text"
//                                                     value={collectedProducts[item.id] || ''}
//                                                     onChange={(e) => handleProductCodeChange(item.id, e.target.value)}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </Table>
//
//                             {error && <Alert variant="danger">{error}</Alert>}
//                         </>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="primary"
//                         onClick={handleSubmit}
//                         disabled={cartItems.length === 0 || loading}
//                     >
//                         {loading ? <Spinner animation="border" size="sm" /> : "Send Collection"}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };
//
// export default CollectionWorker;

import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Spinner, Modal, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import CartServices from "../services/cart-services";
import CollectionServices from "../services/collection-services";
import EmailService from "../services/email-service";

const CollectionWorker = ({ token }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [collectedProducts, setCollectedProducts] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    useEffect(() => {
        const filtered = orders.filter(order =>
            order.id.toString().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
    }, [searchTerm, orders]);

    const fetchOrders = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await CartServices.getAllCarts(token);
            const sortedOrders = response.data.sort((a, b) =>
                new Date(b.create_date) - new Date(a.create_date)
            );
            setOrders(sortedOrders);
            setFilteredOrders(sortedOrders);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    const handleCollect = async (order) => {
        if (!token) return;

        try {
            const response = await CartServices.getCartByOrderId(token, order.id);
            setSelectedOrder(response);
            setCartItems(response.items);
            setCollectedProducts({});
            setShowModal(true);
            setError(null);
        } catch (err) {
            console.error("Error fetching order details:", err);
            setError("Failed to load order details.");
        }
    };

    const handleProductCodeChange = (itemId, code) => {
        setCollectedProducts({ ...collectedProducts, [itemId]: code });
        setError(null);
    };

    const handleSubmit = async () => {
        if (!token) return;

        const allCodesValid = cartItems.every(item => {
            const enteredCode = collectedProducts[item.id];
            return enteredCode && enteredCode.trim() === item.product.product_code.trim();
        });

        if (!allCodesValid) {
            setError("Incorrect product codes. Please check all entries.");
            return;
        }

        setLoading(true);
        try {
            const collectionData = {
                order: selectedOrder.id,
            };

            const response = await CollectionServices.createCollection(token, collectionData);

            const emailData = {
                order_id: selectedOrder.id,
                email: selectedOrder.customer.email
            };

            const emailResult = await EmailService.sendEmail(token, emailData);
            if (emailResult.status === 200) {
                await fetchOrders();
                setShowModal(false);
                alert("Order collected and email sent successfully!");
            } else {
                setError(emailResult.statusText);
            }
        } catch (err) {
            console.error("Error creating collection:", err);
            setError("Error creating collection. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (!token) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="mb-4">Order Collections</h2>

            <Form.Control
                type="text"
                placeholder="Search by Order ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date Created</th>
                        <th>Status</th>
                        <th>Sent Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                <Spinner animation="border" />
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer.name}</td>
                                <td>{formatDateTime(order.create_date)}</td>
                                <td>
                                    <span className={`badge ${order.collection ? 'bg-success' : 'bg-warning'}`}>
                                        {order.collection ? 'Sent' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    {order.collection ?
                                        formatDateTime(order.collection.created_at) :
                                        '-'
                                    }
                                </td>
                                <td>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        disabled={order.collection}
                                        onClick={() => handleCollect(order)}
                                    >
                                        Collect
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Order Details #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div>
                            <Row>
                                <Col md={6}>
                                    <p>Order ID: {selectedOrder.id}</p>
                                    <p>Order Date: {formatDateTime(selectedOrder.create_date)}</p>
                                    <p>Order Sent: {selectedOrder.collection ? "Yes" : "No"}</p>
                                    {selectedOrder.collection && (
                                        <div>
                                            <p>Collected By: {selectedOrder.collection.collector.username}</p>
                                            <p>Collected At: {formatDateTime(selectedOrder.collection.created_at)}</p>
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

                            <Table striped bordered hover className="mt-4">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Code</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Collected Code</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.product.name}</td>
                                            <td>{item.product.product_code}</td>
                                            <td>{formatCurrency(item.product.price)}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatCurrency(item.product.price * item.quantity)}</td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={collectedProducts[item.id] || ''}
                                                    onChange={(e) => handleProductCodeChange(item.id, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <p className="text-end fw-bold h5 mt-3">
                                Total Order: {formatCurrency(selectedOrder.total_price)}
                            </p>

                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={cartItems.length === 0 || loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : "Send Collection"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CollectionWorker;