
import React from 'react';
import { useLocation, Route, Redirect } from 'react-router-dom';
import { useAppContext } from '../lib/contextLib';
type Props = {
    children: JSX.Element,
    [key: string]: any,
};
const AuthenticatedRoute = (props: Props) => {
    const { children, ...rest } = props;
    const { pathname, search } = useLocation();
    const { isAuthenticated } = useAppContext();

    return (
        <Route {...rest} >
            {isAuthenticated ? (children) : (<Redirect to={`/login?redirect=${pathname}${search}`} />)}
        </Route>
    );
};

export default AuthenticatedRoute;
