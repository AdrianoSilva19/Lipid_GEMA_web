import React, {useEffect,useState} from 'react'
import { Row, Col } from 'react-bootstrap'
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
      <h1>Generic Lipids </h1>
      <Row>
        {lipids.map((lipid) => (
          <Col key={lipid.boimmg_id} sm={12} md={6} lg={4} xl={3}>
              <Lipid lipid={lipid} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default LipidsGenerics

