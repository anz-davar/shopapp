import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import ProductDataService from '../services/product-services';
import CustomerService from "../services/customer-services";
import {formatCurrency} from "../utilities/formatCurrency";
import CartService from '../services/cart-services';

const ProductList = ({ token, cartItems, setCartItems, selectedCustomer, setSelectedCustomer }) => {
   const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [originalProducts, setOriginalProducts] = useState([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [customerSearchTerm, setCustomerSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerLoading, setCustomerLoading] = useState(true);
    const [customerError, setCustomerError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const productData = await ProductDataService.getAll(token);
                setProducts(productData.data);
                setOriginalProducts(productData.data);
                console.log(productData.data);
            } catch (err) {
                console.error('Error fetching Products:', err);
                setError(err.message || 'Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };

        if (token)
            fetchData();
    }, [token]);

    useEffect(() => {
        const fetchCustomers = async () => {
            setCustomerLoading(true);
            setCustomerError(null);
            try {
                const customerData = await CustomerService.getAll(token);
                setCustomers(customerData);
                setFilteredCustomers(customerData)
            } catch (err) {
                console.error('Error fetching Products:', err);
                setCustomerError(err.message || 'Failed to fetch customers.');
            } finally {
                setCustomerLoading(false);
            }
        };

        if (token)
            fetchCustomers();
    }, [token]);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setProducts(originalProducts);
        } else {
            const filteredProducts = originalProducts.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setProducts(filteredProducts);
        }
    };

    const handleCustomerSearch = (e) => {
        setCustomerSearchTerm(e.target.value);
        const filteredCustomers = customers.filter((customer) =>
            customer.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            customer.national_id.toLowerCase().includes(e.target.value.toLowerCase()) ||
            customer.phone_number.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredCustomers(filteredCustomers);
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setShowCustomerModal(false);
    };


    const addToCart = (product) => {
        console.log('clicked add to cart');
        if (!selectedCustomer) {
            alert('Please select a customer first!');
            return;
        }

        const existingProductIndex = cartItems.findIndex(item => item.product.id === product.id);
        const updatedCartItems = [...cartItems];

        if (existingProductIndex !== -1) {
            updatedCartItems[existingProductIndex].quantity++;
        } else {
            updatedCartItems.push({ product, quantity: 1 });
        }

        setCartItems(updatedCartItems);
    };
    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (customerLoading) {
        return <div>Loading customers...</div>;
    }

    if (customerError) {
        return <div>Error: {customerError}</div>;
    }


    return (
        <div>
            <h2>Add new order</h2>
            {!selectedCustomer && (
                <Button onClick={() => setShowCustomerModal(true)} className="mb-3">
                    Select Customer
                </Button>
            )}
            {selectedCustomer && (
                <div className="mb-3">
                    Selected Customer: {selectedCustomer.name} (ID: {selectedCustomer.id})
                    <Button onClick={() => setSelectedCustomer(null)} className="ms-2">Change</Button>
                </div>
            )}

            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Search products"
                    className="me-2 rounded-pill"
                    style={{ border: '2px solid #ccc' }}
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                />
                <Button className="rounded-pill me-3" variant="outline-primary" onClick={handleSearch}>
                    Search
                </Button>
            </Form>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Product Code</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>{product.stock}</td>
                            <td>{product.product_code}</td>
                            <td>
                                <Button onClick={() => addToCart(product)} disabled={!selectedCustomer}>Add to Cart</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            type="search"
                            placeholder="Search customers"
                            value={customerSearchTerm}
                            onChange={handleCustomerSearch}
                            className="mb-3"
                        />
                    </Form>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>National ID</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.national_id}</td>
                                    <td>{customer.phone_number}</td>
                                    <td>
                                        <Button onClick={() => handleSelectCustomer(customer)}>
                                            Choose
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProductList;