import React, { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap'; // Assuming you're using Bootstrap
import { Link } from 'react-router-dom';


function SuggestedLipidsCards({ suggested_list, model_id }) {
    const suggestedKeys = Object.keys(suggested_list.suggested_annotation);
  
    return (
      <Row className="justify-content-center">
        {suggestedKeys.map((key) => (
          <Col key={key} sm={12} md={6} lg={4} xl={3}>
            <SuggestedLipid lipidKey={key} sugested_list={suggested_list.suggested_annotation[key]} model_id={model_id} />
          </Col>
        ))}
      </Row>
    );
  }
  
  function SuggestedLipid({ lipidKey,sugested_list,model_id}) {
    const [switchState, setSwitchState] = useState(false);
  
    const handleSwitchChange = () => {
      setSwitchState(!switchState);
    };
  
    return (
      <Card
        className={`my-3 p-3 rounded ${switchState ? 'bg-info' : 'bg-light'}`}
        style={{ width: '15rem', borderWidth: '1px' }}
      >
        <Card.Body className="d-flex flex-column align-items-center">
        <Link to={`/model/${model_id}/sugested/${lipidKey}`} annotated_list={sugested_list} target="_blank" style={{ textDecoration: 'none' }}>
          <Card.Title as="div" className="text-center mb-2">
            <strong>{lipidKey}</strong>
          </Card.Title>

          </Link>
          <div className="form-check form-switch" style={{ marginTop: '5px' }}>
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id={`flexSwitchCheck-${lipidKey}`}
              checked={switchState}
              onChange={handleSwitchChange}
            />
            <label className="form-check-label" htmlFor={`flexSwitchCheck-${lipidKey}`}>
              Checked
            </label>
          </div>
        </Card.Body>
      </Card>
    );
  }
  
  export default SuggestedLipidsCards;