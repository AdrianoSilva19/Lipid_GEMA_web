import React from 'react'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header(){
    return(
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className="NavBar">
      <Container>
        <Navbar.Brand href="/">Lipid_GEMA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav-bar">
            <Nav.Link href="/Lipids"><i className="fas fa-database"></i>Lipids</Nav.Link>
            <Nav.Link href="/Tool"><i className="fas fa-gears"></i>Tool</Nav.Link>
            <Nav.Link href="/About"><i className="fas fa-user"></i>About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
}

export default Header