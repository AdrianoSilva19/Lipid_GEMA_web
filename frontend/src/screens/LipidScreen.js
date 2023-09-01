import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Card} from 'react-bootstrap';
import { SmiDrawer } from 'smiles-drawer';
import TabList from '../components/TabList'
import Loading from '../components/Loading';
import Message from '../components/Message';
import { useDispatch,useSelector } from 'react-redux'
import { dictLipid } from '../actions/lipidActions'


function LipidScreen() {
  const { id } = useParams();
  const dispatch = useDispatch()
  const lipidDict = useSelector((state) => state.lipidDict);

  const { error, loading, lipid } = lipidDict;



  useEffect(() => {
    console.log('LipidScreen useEffect triggered');
    dispatch(dictLipid(id))
  },[dispatch, id])


  useEffect(() => {
    SmiDrawer.apply(); 
  }, [lipid]);

  console.log('loading:', loading);



  return (
    
    <div className="LipidScreen">
       
      {loading ? <Loading />
        : error ? <Message variant="danger" >{error}</Message>
        :
        <div>
      <Row style={{ fontSize: '40px', textAlign: 'center', marginTop: '20px', marginBottom: '25px' }}>
        <h3>
          <strong>{lipid.name}</strong>
        </h3>
      </Row>
      <Row className="align-content-start">
        <Col>
          <Card className="my-3 p-3 rounded" border="Light" style={{ width: '100%', borderWidth: '1px', height: '22rem' }}>
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
      }
    </div>
  );
}

export default LipidScreen;