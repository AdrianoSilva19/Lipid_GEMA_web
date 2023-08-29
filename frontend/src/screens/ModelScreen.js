import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Container } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import AnnotatedTable from '../components/AnnotatedCard'; 
import SugestedAnnotationCard from '../components/SugestedAnnotationCard'; 
import { useLipidData } from'../components/LipidDataContext'


function ModelScreen() {
  const { model_id } = useParams();
  const { lipidData, setLipidData } = useLipidData(); // Get context data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLipidData() {
      try {
        if (lipidData[model_id]) {
          // If data is already fetched and stored in context, use it
          setIsLoading(false);
        } else {
          const response = await axios.get(`/api/model/${model_id}`);
          setLipidData(prevData => ({ ...prevData, [model_id]: response.data }));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching lipid data:', error);
      }
    }

    fetchLipidData();
  }, [model_id, lipidData, setLipidData]);

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
          {lipidData[model_id] && (
            <div>
              <h3>Annotated</h3>
              <AnnotatedTable lipid={lipidData[model_id]} />
              <h3>Suggested</h3>
              <h6>Please select the right conformation on the <b>Suggested</b> annotations to annotate your <b>{model_id}</b> GSM model!</h6>
              <ul>
              <SugestedAnnotationCard suggested_list={lipidData[model_id]} model_id={model_id} />
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ModelScreen;