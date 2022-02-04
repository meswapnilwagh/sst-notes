import { Auth } from 'aws-amplify';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import LoaderButton from '../components/LoaderButton';
import { useAppContext } from '../lib/contextLib';
import onError from '../lib/errorLib';
import useFormFields from '../lib/hooksLib';
import "./Login.css";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { userHasAuthenticated } = useAppContext();
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    })
    const validateForm = () => {
        return fields.email.length > 0 && fields.password.length > 0
    }
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
        } catch (error: any) {
            onError(error);
            setIsLoading(false);
        }
    }

    return (
        <div className='Login'>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        size="lg"
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        size="lg"
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    disabled={!validateForm}
                    isLoading={isLoading}
                >
                    Login
                </LoaderButton>

            </Form>
        </div>
    )
};

export default Login