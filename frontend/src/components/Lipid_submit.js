import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap'
import { SmiDrawer } from 'smiles-drawer';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate,Link  } from 'react-router-dom';
import { useChecked } from './CheckedContext';
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT
function Lipid_submit({ lipid, lipidKey, model_id }) {
  /**
   * Renders a card component with lipid information and an annotation button.
   * When this button is pressed the annotation is settled in the model and the page goes back to the model screen.
   * 
   * @param {Object} lipid - The lipid object containing information about the lipid.
   * @param {string} lipidKey - The key of the lipid in the list.
   * @param {string} model_id - The ID of the model.
   * @returns {JSX.Element} - The rendered card component.
   */
  const { dispatch } = useChecked();
  const [isSettingAnnotation, setIsSettingAnnotation] = useState(false);
  const [annotationCompleted, setAnnotationCompleted] = useState(false);


  const handleSwitchChange = () => {
    dispatch({ type: 'TOGGLE_CHECKED', lipidKey });
  };

  const navigate = useNavigate();
  useEffect(() => {
    SmiDrawer.apply(); // Call SmilesDrawer.apply() after rendering the component
  }, [lipid]);

  const handleAnnotateClick = async () => {
    try {
      setIsSettingAnnotation(true);
      const response = await axios.post(`${API_ENDPOINT}/api/set_model_annotations`, {
        lipidKey: lipidKey,
        lipid: lipid,
        model_id: model_id,
        boimmg_id: lipid.boimmg_id
      });
      console.log('Annotations set:', response.data.message);
      // After successful annotation, navigate back
      navigate(-1);
      handleSwitchChange();
    } catch (error) {
      console.error('Error setting annotations:', error);
    }finally {
      setIsSettingAnnotation(false);
      setAnnotationCompleted(true)
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
        {!annotationCompleted && (
          <Button type="button" onClick={handleAnnotateClick} disabled={isSettingAnnotation}>
            Annotate
          </Button>
        )}
        {isSettingAnnotation && <div className="mt-3">Annotating...</div>}
      </Card.Body>
    </Card>
  );
}

export default Lipid_submit;