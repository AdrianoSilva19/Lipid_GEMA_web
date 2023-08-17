import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { SmiDrawer } from 'smiles-drawer';
import { Link } from 'react-router-dom';


function LipidsComponentsList(props) {
    const { component } = props;
    useEffect(() => {
        SmiDrawer.apply(); // Call SmilesDrawer.apply() after rendering the component
      }, [component]);

      return (
        <Card className="my-3 p-3 rounded" border="Light" style={{ width: '20rem', borderWidth: '1px', height:'20rem' }}>
          
            <Card.Body className="d-flex flex-column align-items-center">
            <Link to={`/lipid/${component.boimmg_id}`} style={{ textDecoration: 'none' }}>
              <Card.Title as="div" className="text-center mb-0 ">
                <strong>{component.name}</strong>
              </Card.Title>
              </Link>
              <div style={{ width: '90%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',flex: 1 }}>
              <Card.Img
                data-smiles={component.smiles}
                alt="Lipid Image"
                style={{ maxWidth: '100%', maxHeight: '100%'}}
              />
            </div>
            </Card.Body>
       
        </Card>
      );
    }
  
  export default LipidsComponentsList;