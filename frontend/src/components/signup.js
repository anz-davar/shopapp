import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const Signup = props => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const onChangeUsername = e => {
        const username = e.target.value;
        setUsername(username);
    }
    const onChangePassword = e => {
        const password = e.target.value;
        setPassword(password);
    }
    const onChangeFirstName = e => {
        const firstName = e.target.value;
        setFirstName(firstName);
    }
    const onChangeLastName = e => {
        const lastName = e.target.value;
        setLastName(lastName);
    }
    const onChangeEmail = e => {
        const email = e.target.value;
        setEmail(email);
    }
    const signup = () => {
        props.signup({
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName,
            email: email
        });
        props.history.push('/');

     }
    return (<Container>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label> <Form.Control
                type="text" placeholder="Enter username" value={username}
                onChange={onChangeUsername}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>firstName</Form.Label> <Form.Control
                type="text" placeholder="Enter firstName" value={firstName}
                onChange={onChangeFirstName}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label> <Form.Control
                type="text" placeholder="Enter Last Name" value={lastName}
                onChange={onChangeLastName}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>email</Form.Label> <Form.Control
                type="email" placeholder="Enter emaul" value={email}
                onChange={onChangeEmail}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label> <Form.Control
                type="password" placeholder="Enter password" value={password}
                onChange={onChangePassword}/>
            </Form.Group>
            <Button variant="primary" onClick={signup}>
                Sign Up </Button> </Form>
    </Container>)
}
export default Signup;