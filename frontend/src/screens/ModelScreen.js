import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row } from 'react-bootstrap';
import AnnotatedTable from '../components/AnnotatedCard'; 

function ModelScreen() {
  const { model_id } = useParams();
  const [lipid, setLipid] = useState(null);

  useEffect(() => {
    async function fetchLipidData() {
      try {
        const response = await axios.get(`/api/model/${model_id}`);
        setLipid(response.data);
      } catch (error) {
        console.error('Error fetching lipid data:', error);
      }
    }

    fetchLipidData();
  }, [model_id]);

  return (
    <div>
      <Row style={{ fontSize: '20px', textAlign: 'center', marginTop: '20px', marginBottom: '25px', color: 'black' }}>
        


      </Row>
      {lipid && (
        <div>
          <h3>Annotated</h3>
          <AnnotatedTable lipid={lipid} /> {/* Use the new component */}
          <h3>Suggested</h3>
          <h6>Please select the right conformation on the <b>Suggested</b> annotations to annotate your <b>{model_id}</b> GSM model!</h6>
          <ul>
            {Object.keys(lipid.suggested).map((key) => (
              <li key={key}>
                {key}: {lipid.suggested[key]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ModelScreen;