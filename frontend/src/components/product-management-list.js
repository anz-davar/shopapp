import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import ProductService from '../services/product-management-services';
import ProductForm from './product-management-form';

const ProductManagementList = ({ token }) => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedProducts = await ProductService.getAll(token);
                setProducts(fetchedProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message || 'Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };
        if (token)
            fetchProducts();
    }, [token]);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async (data) => {
        try {
            if (editingProduct) {
                await ProductService.update(editingProduct.id, data, token);
                setProducts(
                    products.map((p) => (p.id === editingProduct.id ? data : p))
                );
            } else {
                const newProduct = await ProductService.create(data, token);
                setProducts([...products, newProduct]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Error saving product:', err);
            setError(err.message || 'Failed to save product.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await ProductService.remove(id, token);
            setProducts(products.filter(product => product.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
            setError(err.message || 'Failed to delete product.');
        }
    };

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Manage Products</h2>
            <Button onClick={() => setShowModal(true)} className="mb-3">Add Product</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
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
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.product_code}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(product)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductForm product={editingProduct} onSubmit={handleSaveProduct} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProductManagementList;