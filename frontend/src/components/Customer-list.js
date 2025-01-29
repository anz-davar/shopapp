import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import CustomerService from '../services/customer-services';
import CustomerForm from './Customer-form';

const CustomerList = ({ token }) => {
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null);       // Add error state

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true); // Set loading to true before fetching
            setError(null);    // Clear any previous errors
            try {
                const fetchedCustomers = await CustomerService.getAll(token);
                setCustomers(fetchedCustomers);
            } catch (err) {
                console.error('Error fetching customers:', err);
                setError(err.message || 'Failed to fetch customers.'); // Set error message
            } finally {
                setLoading(false); // Set loading to false after fetching (success or error)
            }
        };
        if(token)
        fetchCustomers();
    }, [token]);

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCustomer(null);
    };

    const handleSaveCustomer = async (data) => {
        try {
            if (editingCustomer) {
                await CustomerService.update(editingCustomer.id, data, token);
                setCustomers(
                    customers.map((c) => (c.id === editingCustomer.id ? data : c))
                );
            } else {
                const newCustomer = await CustomerService.create(data, token);
                setCustomers([...customers, newCustomer]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Error saving customer:', err);
            setError(err.message || 'Failed to save customer.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await CustomerService.remove(id, token);
            setCustomers(customers.filter(customer => customer.id !== id));
        } catch (err) {
            console.error('Error deleting customer:', err);
            setError(err.message || 'Failed to delete customer.');
        }
    };

    if (loading) {
        return <div>Loading customers...</div>; // Display loading message
    }

    if (error) {
        return <div>Error: {error}</div>; // Display error message
    }

    return (
        <div>
            <h2>Customers</h2>
            <Button onClick={() => setShowModal(true)} className="mb-3">Add Customer</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>National ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.national_id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone_number}</td>
                            <td>{customer.address}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(customer)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(customer.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomerForm customer={editingCustomer} onSubmit={handleSaveCustomer} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CustomerList;