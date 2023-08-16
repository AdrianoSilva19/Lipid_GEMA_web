import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Card} from 'react-bootstrap';
import axios from 'axios';
import { SmiDrawer } from 'smiles-drawer';
import TabList from '../components/TabList'


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
      <Row style={{ fontSize: '40px', textAlign: 'center',marginTop: '20px', marginBottom: '25px' }}>
      <h3><strong>{lipid.name}</strong></h3>
      </Row>
      <Row className="align-content-start">
        <Col>
          <Card className="my-3 p-3 rounded" border="Light" style={{ width: '100%', borderWidth: '1px', height: '22rem' }}>
            {/* Display lipid image */}
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Card.Img
                data-smiles={lipid.smiles}
                alt="Lipid Image"
                style={{ maxWidth: '100%', maxHeight: '120%', objectFit: 'contain' }}
              />
            </div>
          </Card>
        </Col>
      </Row>
              
      <Row>
        <TabList lipid={lipid} />
        <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      </Row>
    </div>
  );
}

export default LipidScreen;