import React, { FormEvent, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import { useAppContext } from '../lib/contextLib';
import useFormFields from '../lib/hooksLib';
import onError from "../lib/errorLib"
import "./Signup.css";
import { Auth } from 'aws-amplify';
import { ISignUpResult } from 'amazon-cognito-identity-js';

const Signup = () => {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    })
    const history = useHistory();
    const [newUser, setNewUser] = useState<ISignUpResult>();
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        )
    }

    const validConfirmationForm = () => {
        return fields.confirmationCode.length > 0;
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (error: any) {
            onError(error);
            setIsLoading(false);
        }
    }

    const handleConfirmationFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
            history.push("/")
        } catch (error) {
            onError(error);
            setIsLoading(false);
        }
    }

    const renderConfirmationForm = () => {
        return (
            <Form onSubmit={handleConfirmationFormSubmit}>
                <Form.Group controlId="confirmationCode" >
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                        size="lg"
                    />
                    <Form.Text muted> Please check your email for code</Form.Text>
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validConfirmationForm()}
                >
                    Verify
                </LoaderButton>
            </Form >
        )
    }

    const renderForm = () => {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={fields.email}
                        size="lg"
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                        size="lg"
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.confirmPassword}
                        onChange={handleFieldChange}
                        size="lg"
                    />
                </Form.Group>

                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateForm}
                >
                    Signup
                </LoaderButton>
            </Form>
        )
    }
    return (
        <div className="Signup">
            {!newUser ? renderForm() : renderConfirmationForm()}
        </div>
    );
};

export default Signup;

