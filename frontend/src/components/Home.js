// Home.js (Minor change for class name)
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { Button } from 'react-bootstrap';

const Home = () => {
    return (
        <div className="home-page-container"> {/* Changed class name */}
            <div className="background-animation">
                <div className="gradient-background"></div>
            </div>
            <div className="content">
                <h1>Welcome to ShopBack</h1>
                <p>Your one-stop shop for all your tech needs.</p>
                <div className="button-container">
                    <Link to="/login">
                        <Button variant="primary">Login</Button>
                    </Link>
                    <Link to="/signup">
                        <Button variant="secondary">Sign Up</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;