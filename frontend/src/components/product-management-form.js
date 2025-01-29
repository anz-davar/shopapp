import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const ProductForm = ({ product, onSubmit }) => {
    const [productData, setProductData] = useState(product || {
        name: '',
        description: '',
        price: '',
        stock: '',
        product_code: '',
        image: null,
    });

    useEffect(() => {
        setProductData(product || {
            name: '',
            description: '',
            price: '',
            stock: '',
            product_code: '',
            image: null
        });
    }, [product]);

    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(productData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Name:</Form.Label>
                <Form.Control type="text" name="name" value={productData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Description:</Form.Label>
                <Form.Control as="textarea" name="description" value={productData.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Price:</Form.Label>
                <Form.Control type="number" name="price" value={productData.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Stock:</Form.Label>
                <Form.Control type="number" name="stock" value={productData.stock} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Product Code:</Form.Label>
                <Form.Control type="text" name="product_code" value={productData.product_code} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    );
};

export default ProductForm;