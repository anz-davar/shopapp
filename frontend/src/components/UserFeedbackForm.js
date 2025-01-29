// UserFeedbackForm.js
import React, {useState} from 'react';
import {Form, Button, Container, Row, Col, Table, Alert, Spinner} from 'react-bootstrap';
import CartServices from "../services/cart-services";
import FeedbackService from '../services/feedback-services';
import Rating from '@mui/material/Rating';
import {formatCurrency} from "../utilities/formatCurrency";

const UserFeedbackForm = () => {
    const [orderId, setOrderId] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [order, setOrder] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [feedbackImage, setFeedbackImage] = useState(null); // Define feedbackImage here

    const handleOrderLookup = async () => {
        setLoading(true);
        setError(null);
        try {
            const orderData = await CartServices.getOrderByOrderIdAndNationalIdPublic(orderId, nationalId); // Use public method
            setOrder(orderData);
            setCartItems(orderData.items);
        } catch (err) {
            console.error("Error fetching order:", err);
            setError("Order not found. Please check your Order ID and National ID.");
            setOrder(null);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

  const handleFeedbackImageChange = (e) => {
        setFeedbackImage(e.target.files[0]); // Now feedbackImage is defined
    };

    const handleChange = (event, newValue) => {
        setRating(newValue); // Update rating state
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);
        setSubmitError(null);

        if (!order) {
            setSubmitError("Please lookup the order first.");
            setSubmitLoading(false);
            return;
        }

        const feedbackData = new FormData();
        feedbackData.append('cart', order.id);
        feedbackData.append('score', rating);
        feedbackData.append('feedback_text', feedbackText);
        if (feedbackImage) {
            feedbackData.append('feedback_image', feedbackImage);
        }

        try {
            await FeedbackService.createFeedback(feedbackData);
            setOrderId('');
            setNationalId('');
            setOrder(null);
            setCartItems([]);
            setRating(0);
            setFeedbackText('');
            setImage(null);
            alert("Feedback submitted successfully!");
        } catch (err) {
            console.error("Error submitting feedback:", err);
            setSubmitError("Error submitting feedback. Please try again.");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <Container>
            <Row>
                <Col md={{span: 6, offset: 3}}>
                    <h2>User Feedback</h2>

                    <Form>
                        <Form.Group controlId="orderId">
                            <Form.Label>Order ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="nationalId">
                            <Form.Label>National ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={nationalId}
                                onChange={(e) => setNationalId(e.target.value)}
                            />
                        </Form.Group>

                        <Button onClick={handleOrderLookup} className="mt-2" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm"/> : "Lookup Order"}
                        </Button>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {order && (
                            <div>
                                <h3>Order Details</h3>
                                <Row>
                                    <Col md={6}>
                                        <p>Order ID: {order.id}</p>
                                        <p>Customer Name: {order.customer.name}</p>
                                        <p>Customer Email: {order.customer.email}</p> {/* Add customer email */}
                                        {/* Add other relevant customer details */}
                                    </Col>
                                    <Col md={6}>
                                        <p>Customer Phone: {order.customer.phone_number}</p>
                                        <p>Order Total: {formatCurrency(order.total_price)}</p>
                                        <p>Order Date: {new Date(order.create_date).toLocaleString()}</p>

                                    </Col>
                                </Row>


                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                        {/* Add total column per item */}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.product.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatCurrency(item.product.price)}</td>
                                            <td>{formatCurrency(item.product.price * item.quantity)}</td>
                                            {/* Calculate and display total per item */}
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                                <Form.Group controlId="rating">
                                    <Form.Label>Rating (1-10)</Form.Label>
                                    <Rating
                                        name="rating"
                                        value={rating}
                                        onChange={handleChange}
                                        max={10} // Set the maximum value to 10
                                        precision={1} // Set precision to 1 for whole star ratings (optional)
                                        // Add other styling props as needed (e.g., size, color)
                                    />
                                </Form.Group>

                                <Form.Group controlId="feedbackText">
                                    <Form.Label>Feedback</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={7}
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="image">
                                    <Form.Label>Image Upload</Form.Label>
                                    <Form.Control type="file" onChange={handleFeedbackImageChange}/>
                                </Form.Group>

                                {submitError && <Alert variant="danger">{submitError}</Alert>}

                                <Button onClick={handleSubmit} className="mt-2" disabled={submitLoading}>
                                    {submitLoading ? <Spinner animation="border" size="sm"/> : "Submit Feedback"}
                                </Button>
                            </div>
                        )}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default UserFeedbackForm;