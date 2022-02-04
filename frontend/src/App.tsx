import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Nav, Navbar } from 'react-bootstrap';
import Routes from './Routes';
import { LinkContainer } from 'react-router-bootstrap';
import { AppContext } from './lib/contextLib';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import onError from './lib/errorLib';

const App = () => {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, [])

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (error: any) {
      if (error != 'No current user') {
        onError(error)
      }
    }
    setIsAuthenticating(false);
  }

  const handleLogout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push("/login")
  }

  return (
    !isAuthenticating ? (<div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className='mb-3'>
        <LinkContainer to="/">
          <Navbar.Brand className='font-weight-bold text-muted'>
            Notus
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          <Nav activeKey={window.location.pathname}>

            {isAuthenticated ? (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <>
                <LinkContainer to="/signup">
                  <Nav.Link>Signup</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </>
            )
            }
          </Nav>
        </Navbar.Collapse >
      </Navbar >
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Routes />
      </AppContext.Provider>
    </div >) : (<></>)
  );
}

export default App;
