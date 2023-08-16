import React from 'react'
import { Container,Row, Col } from 'react-bootstrap'

function Footer() {
  return (
        <footer>
            <Container>
              <Row>
                <Col className='text-center py-3'>Copyright &copy; Lipid_GEMA</Col>
              </Row>
            </Container>
            <Container>
                <Col className='text-center py-3'> 
                    <a href="https://github.com/jcapels/boimmg" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-github"></i>
                    </a>  
                    
                </Col>
            </Container>
        </footer>
  )
}

export default Footer