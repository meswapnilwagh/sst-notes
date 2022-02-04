import React, { cloneElement } from 'react';
import { useAppContext } from '../lib/contextLib';
import { Route, Redirect } from 'react-router-dom';
type Props = {
    children: JSX.Element,
    [key: string]: any,
};

const queryString = (name: string, url: string = window.location.href) => {
    const parsedName = name.replace(/[[]]/g, "\\$&");
    const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, "i");
    const results = regex.exec(url);
    if (!results || !results[2]) return false;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const UnauthenticatedRoute = (props: Props) => {
    const { children, ...rest } = props;
    const { isAuthenticated } = useAppContext();
    const redirectTo = queryString('redirect');
    return (
        <Route {...rest} >
            {!isAuthenticated ? (cloneElement(children, props)) : (<Redirect to={redirectTo ? redirectTo : "/"} />)}
        </Route>
    );
};

export default UnauthenticatedRoute;
