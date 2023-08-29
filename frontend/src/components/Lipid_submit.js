import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap'
import { SmiDrawer } from 'smiles-drawer';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate,Link  } from 'react-router-dom';

function Lipid_submit({ lipid, lipidKey, model_id }) {
  const navigate = useNavigate();
  useEffect(() => {
    SmiDrawer.apply(); // Call SmilesDrawer.apply() after rendering the component
  }, [lipid]);

  const handleAnnotateClick = async () => {
    try {
      const response = await axios.post('/api/set_model_annotations/', {
        lipidKey: lipidKey,
        lipid: lipid,
        model_id: model_id,
      });
      console.log('Annotations set:', response.data.message);
      // After successful annotation, navigate back
      navigate(-1);
    } catch (error) {
      console.error('Error setting annotations:', error);
    }
  };

  return (
    <Card className="my-3 p-3 rounded bg-light" style={{ width: '20rem', borderWidth: '1px' }}>
      <Card.Body className="d-flex flex-column align-items-center">
      <Link to={`/lipid/${lipid.boimmg_id}`} target="blank">
        <Card.Title as="div" className="text-center mb-2">
          <strong>{lipid.name}</strong>
        </Card.Title>
        </Link>
        <Card.Img
          data-smiles={lipid.smiles}
          data-smiles-options='{"width": 600, "height": 600}'
          alt="Lipid Image"
          className="align-self-center"
        />
        <Button type="button" onClick={handleAnnotateClick}>
          Annotate
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Lipid_submit;