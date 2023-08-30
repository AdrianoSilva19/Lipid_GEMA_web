import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import Lipid_submit from '../components/Lipid_submit';
import { Row, Col, ListGroup } from 'react-bootstrap';

function SugestedScreen() {
  const navigate = useNavigate();  
  const { model_id, lipidKey } = useParams();
  const [annotations, setSuggested_annotations] = useState(null);
  const [lipids_list, setSuggested_lipids] = useState(null);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };


  useEffect(() => {
    async function fetchSuggested_annotations() {
      try {
        const response = await axios.get(`/api/model/${model_id}/${lipidKey}`);
        setSuggested_annotations(response.data);
      } catch (error) {
        console.error('Error fetching lipid data:', error);
      }
    }

    setSuggested_annotations(null);
    fetchSuggested_annotations();
  }, []);

  useEffect(() => {
    async function fetchSuggested_lipids() {
      if (annotations) {
        const uniqueBoimmgIds = new Set(); // Initialize the set to store unique IDs
        const fetchedLipids = [];
  
        for (const sublist of annotations) {
          const fetchedSublist = [];
  
          for (const value of sublist) {
            const endpoint = value.startsWith('LM') ? 'LM_ID' : 'SL_ID';
  
            try {
              const response = await axios.get(`/api/lipid/${endpoint}/${value}`);
              const lipidData = response.data;
  
              // Check if boimmg_id is unique before pushing
              if (!uniqueBoimmgIds.has(lipidData.boimmg_id)) {
                fetchedSublist.push(lipidData);
                uniqueBoimmgIds.add(lipidData.boimmg_id);
              }
            } catch (error) {
              console.error('Error fetching lipid data:', error);
            }
          }
  
          fetchedLipids.push(fetchedSublist);
        }
  
        setSuggested_lipids(fetchedLipids);
      }
    }
  
    setSuggested_lipids(null);
    fetchSuggested_lipids();
  }, [annotations]);

  return (
    <div>
      <Container>
        <Row>
          <ListGroup variant="flush" style={{ marginBottom: '10px' }}>
            <ListGroup.Item
              style={{ fontSize: '40px', textAlign: 'center', borderBottom: '1.3px solid #ccc' }}
            >
              <strong>{lipidKey}</strong>
            </ListGroup.Item>
          </ListGroup>
          <button onClick={handleGoBack} className="btn btn-light my-3">Go Back</button>
        </Row>
      </Container>
      <Container>
        <Row className="justify-content-center">
        {
          lipids_list ? (
            lipids_list.map((lipidSublist, sublistIndex) => (
              lipidSublist.map((lipid) => (
                lipid.boimmg_id ? (  // Check if lipid has a boimmg_id before rendering
                  <Col key={lipid.boimmg_id} sm={12} md={6} lg={4} xl={4}>
                    <Lipid_submit key={lipid.boimmg_id} lipid={lipid} lipidKey={lipidKey} model_id={model_id} />
                  </Col>
                ) : null
              ))
            ))
          ) : (
            <div>Creating Images...</div>
          )
        }
        </Row>
      </Container>
    </div>
  );
}

export default SugestedScreen;