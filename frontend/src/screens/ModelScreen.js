import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Container } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import AnnotatedTable from '../components/AnnotatedCard'; 
import SugestedAnnotationCard from '../components/SugestedAnnotationCard'; 

function ModelScreen() {
  const { model_id } = useParams();
  const [lipid, setLipid] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function fetchLipidData() {
      try {
        const response = await axios.get(`/api/model/${model_id}`);
        setLipid(response.data);
        setIsLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error fetching lipid data:', error);
      }
    }

    fetchLipidData();
  }, [model_id]);

  return (
    <div>
      {isLoading ? ( // Render loading animation if still loading
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Container style={{  marginBottom: '150px' }}>
            <Row style={{ fontSize: '40px', textAlign: 'center' }}>
              <strong>Organizing The Annotations</strong>
            </Row>
          </Container>
          <ReactLoading
            type="spinningBubbles"
            color="#61a290"
            height={150}
            width={75}
          />
        </div>
      ) : (
        <div>
          {lipid && (
            <div>
              <h3>Annotated</h3>
              <AnnotatedTable lipid={lipid} />
              <h3>Suggested</h3>
              <h6>Please select the right conformation on the <b>Suggested</b> annotations to annotate your <b>{model_id}</b> GSM model!</h6>
              <ul>
              <SugestedAnnotationCard suggested_list={lipid} model_id={model_id} />
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ModelScreen;