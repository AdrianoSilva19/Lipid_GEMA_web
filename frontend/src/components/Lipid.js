import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { SmiDrawer } from 'smiles-drawer';


function Lipid({lipid}) {
    useEffect(() => {
        SmiDrawer.apply(); // Call SmilesDrawer.apply() after rendering the component
      }, [lipid]);

      return (
        <Card className="my-3 p-3 rounded bg-light"  style={{ width: '20rem', borderWidth: '1px', height:'20rem' }}>
          <Link to={`/lipid/${lipid.boimmg_id}`} style={{ textDecoration: 'none' }}>
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title as="div" className="text-center mb-2">
                <strong>{lipid.name}</strong>
              </Card.Title>
              <Card.Img
                data-smiles={lipid.smiles}
                data-smiles-options='{"width": 600, "height": 600}'
                alt="Lipid Image"
                className="align-self-center"
              />
            </Card.Body>
          </Link>
        </Card>
      );
    }
    
    export default Lipid;