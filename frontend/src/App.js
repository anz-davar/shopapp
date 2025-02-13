import React, {useEffect, useState} from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/products-list';
import Login from './components/login';
import Signup from './components/signup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Navbar';
import ProductDataService from './services/product-services';
import Button from "react-bootstrap/Button";
import {ShoppingCart} from "./components/ShoppingCart";
import {Form} from "react-bootstrap";
import {getMouseEventProps} from "@testing-library/user-event/dist/keyboard/getEventProps";
import CustomerList from './components/Customer-list';
import ProductManagementList from "./components/product-management-list"; // Import CustomerList
import CartService from './services/cart-services';
import OrderList from "./components/OrderList";
import Home from "./components/Home";
import './App.css';
import CollectionWorker from "./components/CollectionWorker";
import UserFeedbackForm from "./components/UserFeedbackForm";
import SalesReport from "./components/SalesReport";
import FeedbackReport from "./components/FeedbackReport"; // Import the App.css file


function App() {
    const [user, setUser] = React.useState(null);
    const [token, setToken] = React.useState(null);
    const [error, setError] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false)
    const [cartItems, setCartItems] = React.useState([])
    const [cartId, setCartId] = React.useState()
    const closeCart = () => setIsOpen(false)
    const [products, setProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cart, setCart] = useState(null);
    const [isStaff, setIsStaff] = useState(localStorage.getItem('isStaff') === 'true' || false);
    const [isSuperuser, setIsSuperuser] = useState(localStorage.getItem('isSuperuser') === 'true' || false);


    useEffect(() => {
        const fetchData = async () => {
            await retrieveProducts();
            // await retrieveCartItems();
        };
        if (token)
            fetchData();
    }, [token]);

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setUser(localStorage.getItem('user'));
    }, [])


    useEffect(() => {
        const fetchCart = async () => {
            if (selectedCustomer && !cart) { // Only fetch cart if customer is selected and cart doesn't exist
                try {
                    const existingCarts = await CartService.getCart(token, selectedCustomer.id);
                    if (existingCarts.length > 0) {
                        setCart(existingCarts[0]);
                    }
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            }
        };

        if (token) {
            fetchCart();
        }
    }, [token, selectedCustomer, cart]); // Added cart as a dependency
    const cartItemCount = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    const retrieveProducts = async () => {
        try {
            const response = await ProductDataService.getAll(token);
            setProducts(response.data);
            setOriginalProducts(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setProducts(originalProducts);
        } else {
            const filteredProducts = originalProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setProducts(filteredProducts);
        }
    };

    const handleKeyPress = (e) => {
        e.preventDefault();
        // Trigger search on Enter key press
        if (e.key === 'Enter') {
            handleSearch();
        }
    };


    async function login(user = null) { // default user to null
        ProductDataService.login(user).then(response => {
            setToken(response.data.access);
            setUser(user.username);
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('user', user.username);

            const decodedToken = JSON.parse(atob(response.data.access.split('.')[1]));
            setIsStaff(decodedToken.is_staff); // Set isStaff state
            setIsSuperuser(decodedToken.is_superuser); // Set isSuperuser state
            localStorage.setItem('isStaff', decodedToken.is_staff);
            localStorage.setItem('isSuperuser', decodedToken.is_superuser);
            console.log("is_staff:", decodedToken.is_staff);
            console.log("is_superuser:", decodedToken.is_superuser);
            setError('');
        })
            .catch(e => {
                console.log('login', e);
                setError(e.toString());
            });
    }

    async function logout() {
        setToken('');
        setUser('');
        localStorage.setItem('token', '');
        localStorage.setItem('user', '');
        localStorage.removeItem('isStaff');
        localStorage.removeItem('isSuperuser');
    }

    async function signup(user = null) { // default user to null
        ProductDataService.signup(user).then(response => {
            console.log(response.data)
            console.log('register')
            console.log('token1:')
            console.log(response.data.access_token)
            console.log('token2:')
            console.log(response.data.access)
            console.log('en of tokens')

            setToken(response.data.access_token);
            setUser(user.username);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', user.username);

            const decodedToken = JSON.parse(atob(response.data.access_token.split('.')[1]));
            setIsStaff(decodedToken.is_staff); // Set isStaff state
            setIsSuperuser(decodedToken.is_superuser); // Set isSuperuser state
            localStorage.setItem('isStaff', decodedToken.is_staff);
            localStorage.setItem('isSuperuser', decodedToken.is_superuser);
            console.log("is_staff:", decodedToken.is_staff);
            console.log("is_superuser:", decodedToken.is_superuser);
        })
            .catch(e => {
                console.log(e);
                setError(e.toString());
            })
    }

    return (
        <div className="App">
            <Navbar bg="light" sticky='top' className='bg-white mb-3' data-bs-theme="light" expand="lg"
                    style={{marginLeft: "10px", marginRight: "10px"}}>
                {/*<div className="container-fluid">*/}
                {/*    <Navbar.Brand>ProductsApp</Navbar.Brand>*/}
                <Navbar.Brand as={Link} to="/">ProductsApp</Navbar.Brand>
                <Nav className="me-auto">
                    {/*<Container>*/}
                    {/*{user ? (*/}
                    {/*    <>*/}
                    {/*        <Link className="nav-link" to={"/products"}>New Order</Link>*/}
                    {/*        <Link className="nav-link" to={"/customers"}>Customers</Link>*/}
                    {/*        <Link className="nav-link" to={"/manage-products"}>Manage Products</Link>*/}
                    {/*        <Link className="nav-link" to={"/orders"}>Orders</Link>*/}
                    {/*        <Link className="nav-link" to={"/collections"}>Collections</Link>*/}
                    {/*        <Link className="nav-link" to={"/customer-feedback"}>Customer feedback</Link>*/}
                    {/*        <Link className="nav-link" to={"/sales-report"}>Sales report</Link>*/}
                    {/*        <Link className="nav-link" to={"/feedback-report"}>Feedback report</Link>*/}
                    {/*        <Link to="" className="nav-link" onClick={logout}>Logout ({user})</Link></>) : (*/}
                    {/*    <>*/}
                    {/*        <Link className="nav-link"*/}
                    {/*              to={"login"}>Login</Link>*/}
                    {/*        <Link className="nav-link" to={"/signup"}>Sign Up</Link>*/}
                    {/*        <Link className="nav-link" to={"/customer-feedback"}>Customer feedback</Link>*/}
                    {/*    </>*/}

                    {/*)}*/}
                    {user ? (
                        <>
                            {isStaff || isSuperuser ? (
                                <>
                                    <Link className="nav-link" to={"/products"}>New Order</Link>
                                    <Link className="nav-link" to={"/customers"}>Customers</Link>
                                    <Link className="nav-link" to={"/manage-products"}>Manage Products</Link>
                                    <Link className="nav-link" to={"/orders"}>Orders</Link>
                                    <Link className="nav-link" to={"/collections"}>Collections</Link>
                                    <Link className="nav-link" to={"/customer-feedback"}>Customer feedback</Link>
                                    <Link className="nav-link" to={"/sales-report"}>Sales report</Link>
                                    <Link className="nav-link" to={"/feedback-report"}>Feedback report</Link>
                                    <Link to="" className="nav-link" onClick={logout}>Logout ({user})</Link>
                                </>
                            ) : ( // User is logged in, but NOT staff/superuser
                                <>
                                    <Link className="nav-link" to={"/collections"}>Collections</Link>
                                    <Link to="" className="nav-link" onClick={logout}>Logout ({user})</Link>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to={"/login"}>Login</Link>
                            <Link className="nav-link" to={"/signup"}>Sign Up</Link>
                            <Link className="nav-link" to={"/customer-feedback"}>Customer feedback</Link>
                        </>
                    )}

                    {/*</Container>*/}
                </Nav>
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Search products"
                        className="me-2 rounded-pill"
                        style={{border: '2px solid #ccc'}}
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevent default behavior
                                handleSearch(); // Manually trigger search
                            }
                        }}

                    />
                    <Button className="rounded-pill me-3" variant="outline-primary" onClick={handleSearch}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-search" viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </Button>
                </Form>
                <Button variant='outline-primary' className='rounded-circle' onClick={() => setIsOpen(true)}
                        style={{
                            width: '3rem',
                            height: '3rem',
                            position: 'relative',
                            // color: 'yellow',
                            // backgroundColor: 'transparent', // Set background color to transparent
                            // zIndex: 1, // Set a higher z-index
                        }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        fill="currentColor"
                    >
                        <path
                            d="M96 0C107.5 0 117.4 8.19 119.6 19.51L121.1 32H541.8C562.1 32 578.3 52.25 572.6 72.66L518.6 264.7C514.7 278.5 502.1 288 487.8 288H170.7L179.9 336H488C501.3 336 512 346.7 512 360C512 373.3 501.3 384 488 384H159.1C148.5 384 138.6 375.8 136.4 364.5L76.14 48H24C10.75 48 0 37.25 0 24C0 10.75 10.75 0 24 0H96zM128 464C128 437.5 149.5 416 176 416C202.5 416 224 437.5 224 464C224 490.5 202.5 512 176 512C149.5 512 128 490.5 128 464zM512 464C512 490.5 490.5 512 464 512C437.5 512 416 490.5 416 464C416 437.5 437.5 416 464 416C490.5 416 512 437.5 512 464z"/>
                    </svg>
                    <div className='rounded-circle bg-danger d-flex justify-content-center align-items-center'
                         style={{
                             color: 'white',
                             width: '1.5rem',
                             height: '1.5rem',
                             position: 'absolute',
                             bottom: 0,
                             right: 0,
                             transform: "translate(25%,25%)"
                         }}>{cartItemCount}
                    </div>
                </Button>
                {/*</div>*/}
            </Navbar>
            <ShoppingCart
                // isOpen={isOpen} closeCart={closeCart} cartItems={cartItems} setCartItems={setCartItems}
                //           token={token} setCart={setCart}
                isOpen={isOpen}
                closeCart={closeCart}
                cartItems={cartItems}
                setCartItems={setCartItems}
                token={token}
                selectedCustomer={selectedCustomer}
                cart={cart}
                setCart={setCart}
            />
            {/*<div className="container mt-4">*/}
            <div>
                <div className="container mt-1">

                    <Switch>
                        <Route exact path="/" component={Home}/> {/* Home route */}
                        {/*<div className="container-fluid" style={{ marginLeft: '0rem', marginRight: '3rem' }}>*/}
                        <Route exact path="/products"
                               render={(props) => <ProductList {...props}
                                                               setCartItems={setCartItems}
                                                               cartItems={cartItems}
                                                               token={token}
                                                               selectedCustomer={selectedCustomer}
                                                               setSelectedCustomer={setSelectedCustomer}
                                                               cart={cart}
                                                               setCart={setCart}
                               />}/>
                        <Route exact path="/customers"
                               render={(props) => <CustomerList {...props} token={token}/>}/>
                        <Route exact path="/manage-products" render={(props) => <ProductManagementList {...props}
                                                                                                       token={token}/>}/>
                        <Route path="/orders" render={(props) => <OrderList {...props} token={token}/>}/>
                        <Route path="/collections" render={(props) => <CollectionWorker {...props} token={token}/>}/>
                        <Route path="/customer-feedback"
                               render={(props) => <UserFeedbackForm {...props} token={token}/>}/>
                        <Route path="/sales-report" render={(props) => <SalesReport {...props} token={token}/>}/>
                        <Route path="/feedback-report" render={(props) => <FeedbackReport {...props} token={token}/>}/>

                        <Route path="/login" render={(props) => <Login {...props} login={login}/>}/>
                        <Route path="/signup" render={(props) => <Signup {...props} signup={signup}/>}/>
                    </Switch>
                </div>

            </div>
        </div>

    )
        ;
}

export default App;
