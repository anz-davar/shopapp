import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import CartServices from "../services/cart-services";
import CollectionServices from "../services/collection-services";
const CollectionWorker = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState('');
    const [order, setOrder] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [collectedProducts, setCollectedProducts] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await CartServices.getCartByOrderId(token, searchTerm);
            setOrder(response);
            setCartItems(response.items);
            setCollectedProducts({});
        } catch (err) {
            console.error("Error fetching order:", err);
            setError("Order not found.");
            setOrder(null);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProductCodeChange = (itemId, code) => {
        setCollectedProducts({ ...collectedProducts, [itemId]: code });
        setError(null);
    };

    const handleSubmit = async () => {
        const allCodesValid = cartItems.every(item => {
            const enteredCode = collectedProducts[item.id];
            return enteredCode && enteredCode.trim() === item.product.product_code.trim(); // Trim for comparison
        });

        if (!allCodesValid) {
            setError("Incorrect product codes. Please check all entries.");
            return;
        }

        setLoading(true);
        try {
            const collectionData = {
                order: order.id,
                collector: /* Get the current user's ID */ 1, // Replace with actual user ID
            };

            const response = await CollectionServices.createCollection(token, collectionData);

            console.log("Collection created:", response.data);
            history.push('/orders'); // Or redirect as needed
        } catch (err) {
            console.error("Error creating collection:", err);
            setError("Error creating collection. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Order Collection</h2>

            <Form.Control
                type="text"
                placeholder="Search by Order ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <Button onClick={handleSearch} className="mt-2" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Search"}
            </Button>

            {order && (
                <div>
                    <h3>Order Details</h3>
                    <p>Order ID: {order.id}</p>
                    {/* ... other order details */}

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Code</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Collected Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.product.name}</td>
                                    <td>{item.product.product_code}</td>
                                    <td>{item.product.price}</td>
                                    <td>{item.quantity}</td>
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

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Button onClick={handleSubmit} disabled={cartItems.length === 0 || loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Send Collection"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CollectionWorker;