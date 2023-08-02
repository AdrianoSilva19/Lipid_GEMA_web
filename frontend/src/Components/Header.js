import React from 'react'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'

function Header(){
    return(
    <Navbar expand="lg" collapseOnSelect  className="NavBar">
      <Container>
        <LinkContainer to='/'>
        <Navbar.Brand style={{ fontSize: '24px'}}>Lipid_GEMA</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav-bar-icons">
            <LinkContainer to='/generics'>
            <Nav.Link><i className="fas fa-database"></i>Lipids</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/tool'>
            <Nav.Link href="/tool"><i className="fas fa-gears"></i>Tool</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/about'>
            <Nav.Link href="/about"><i className="fas fa-user"></i>About</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
}

export default Header