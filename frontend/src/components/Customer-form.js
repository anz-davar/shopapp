import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const CustomerForm = ({ customer, onSubmit }) => {
    const [customerData, setCustomerData] = useState(customer || { name: '', email: '', phone_number: '', address: '', national_id: ''});

    useEffect(() => {
        setCustomerData(customer || { name: '', email: '', phone_number: '', address: '', national_id: ''});
    }, [customer]);

    const handleChange = (e) => {
        setCustomerData({ ...customerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(customerData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Name:</Form.Label>
                <Form.Control type="text" name="name" value={customerData.name} onChange={handleChange} required />
            </Form.Group>
              <Form.Group className="mb-3"> {/* Added nationalId Form Group */}
                <Form.Label>National ID:</Form.Label>
                <Form.Control type="text" name="national_id" value={customerData.national_id} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" name="email" value={customerData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control type="text" name="phone_number" value={customerData.phone_number} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Address:</Form.Label>
                <Form.Control as="textarea" name="address" value={customerData.address} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    );
};

export default CustomerForm;