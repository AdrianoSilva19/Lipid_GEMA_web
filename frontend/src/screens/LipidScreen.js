import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Card} from 'react-bootstrap';
import axios from 'axios';
import { SmiDrawer } from 'smiles-drawer';


function LipidScreen() {
    
    const lipidId = useParams();
    const [lipid,setProduct] = useState([]);

  useEffect(() => {
    async function fetchProduct(){
      const {data} = await axios.get(`/api/lipid/L_ID/${lipidId.id}`)
      setProduct(data)
    }  

    fetchProduct()
  },[])
  useEffect(() => {
    SmiDrawer.apply(); // Call SmilesDrawer.apply() after rendering the component
  }, [lipid]);



  return (
    <div className="LipidScreen">
      <Row style={{ fontSize: '40px', textAlign: 'center',marginTop: '20px', marginBottom: '20px' }}>
      <h3><strong>{lipid.name}</strong></h3>
      </Row>
        <Row className="align-content-start">
            <Col>
            <Card className="my-3 p-3 rounded" border="Light" style={{ width: '100%', borderWidth: '1px', height: '17rem' }}>
                {/* Display lipid image */}
                <div style={{ width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Card.Img
                    data-smiles={lipid.smiles}
                    data-smiles-options='{"maxWidth": "90%", "maxHeight": "90%","width": 1200, "height": 1200}'
                    alt="Lipid Image"
                  />
                </div>
              </Card>
              </Col>              
              </Row>
              <Row className="align-content-start">
              <Col style={{marginTop: '15px'}}>
                      <ListGroup variant="secondary">
                         <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>Lipid_GEMA ID:</b> {lipid.boimmg_id}
                          </ListGroup.Item>

                         <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>SL ID:</b> {lipid.swiss_lipids_id}
                          </ListGroup.Item>
                                                    
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>LM ID:</b> {lipid.lipidmaps_id}
                          </ListGroup.Item>
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>MS ID:</b> {lipid.model_seed_id}
                          </ListGroup.Item>

                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left' }}>
                            <b style={{ marginRight: '10px' }}>FORMULA:</b> {lipid.formula}
                          </ListGroup.Item>
                          
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>SMILES:</b> {lipid.smiles}
                          </ListGroup.Item>

                          

                      </ListGroup>
                  </Col>
  
    
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
       
      </Row>
    </div>
  );
}

export default LipidScreen;