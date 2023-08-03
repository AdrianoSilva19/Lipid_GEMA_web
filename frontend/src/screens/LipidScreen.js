import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Button, Card, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';
import { SmiDrawer } from 'smiles-drawer';


function LipidScreen({match}) {
    
    const lipidId = useParams();
    const [lipid,setProduct] = useState([]);

  useEffect(() => {
    async function fetchProduct(){
      const {data} = await axios.get(`/api/generics/${lipidId.id}`)
      setProduct(data)
    }  

    fetchProduct()
  },[])

  useEffect(() => {
    SmiDrawer.apply(); // Call SmilesDrawer.apply() after rendering the component
  }, [lipid]);


  return (
    <div className="LipidScreen">
        <Row className="align-content-start">
            <Col md={6}>
               <Card className="my-3 p-3 rounded" border="secondary" style={{ width: '30rem',borderWidth: '2px' }} >
              {/* Display lipid image */}
              <img
                data-smiles = {lipid.smiles}
                data-smiles-options='{"width": 500, "height": 500}'
                alt="Lipid Image"
              />
              </Card>
              </Col>              
            
              <Col md={6}>
                      <ListGroup variant="secondary">
                          <ListGroup.Item variant="secondary">
                              <h3><strong>{lipid.name}</strong></h3>
                          </ListGroup.Item>

                          <ListGroup.Item variant="secondary" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left' }}>
                            <b>FORMULA:</b> {lipid.formula}
                          </ListGroup.Item>
                          
                          <ListGroup.Item variant="secondary" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b>FORMULA:</b> {lipid.smiles}
                          </ListGroup.Item>

                          <ListGroup.Item variant="secondary" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b>FORMULA:</b> {lipid.swiss_lipids_id}
                          </ListGroup.Item>
                          

                      </ListGroup>
                  </Col>
  
    
      <Link to="/generics/" className="btn btn-light my-3">
        Go Back
      </Link>
       
      </Row>
    </div>
  );
}

export default LipidScreen;