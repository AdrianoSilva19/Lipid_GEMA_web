import React, {useEffect,useState} from 'react'
import Container from 'react-bootstrap/Container';
import { Row, Col, ListGroup } from 'react-bootstrap'
import Lipid from '../components/Lipid'
import axios from 'axios'

function LipidsGenerics() {
  const [lipids,setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts(){
      const {data} = await axios.get('/api/generics/')
      setProducts(data)
    }  

    fetchProducts()
  },[])

  return (
    <div>
  <Container>
    <Row>
      <ListGroup variant="flush" style={{ marginBottom: '10px' }}>
        <ListGroup.Item style={{ fontSize: '40px', textAlign: 'center', borderBottom: '1.3px solid #ccc' }}>
          <strong>Lipid Class</strong>
        </ListGroup.Item>
      </ListGroup>
    </Row>
  </Container>
  <Container>
    <Row className="justify-content-center">
      {lipids.map((lipid) => (
        <Col key={lipid.boimmg_id} sm={12} md={6} lg={4} xl={4}>
          <Lipid lipid={lipid} />
        </Col>
      ))}
    </Row>
  </Container>
</div>
  );
}

export default LipidsGenerics

