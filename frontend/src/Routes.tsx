import react from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Login from './containers/Login';
import NewNote from './containers/NewNote';
import NotFound from './containers/NotFound';
import Signup from './containers/Signup';
import Notes from './containers/Notes';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

const Routes = () => {
    return (
        <Switch>
            <Route exact path={'/'}>
                <Home />
            </Route>
            <UnauthenticatedRoute exact path={'/login'}>
                <Login />
            </UnauthenticatedRoute>
            <UnauthenticatedRoute exact path={'/signup'}>
                <Signup />
            </UnauthenticatedRoute>
            <AuthenticatedRoute exact path={'/notes/new'}>
                <NewNote />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/notes/:id">
                <Notes />
            </AuthenticatedRoute>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}

export default Routes;