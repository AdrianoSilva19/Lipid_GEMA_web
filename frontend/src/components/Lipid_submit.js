import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { SmiDrawer } from 'smiles-drawer';
import Button from 'react-bootstrap/Button';


function Lipid_submit({lipid}) {
    useEffect(() => {
        SmiDrawer.apply(); // Call SmilesDrawer.apply() after rendering the component
      }, [lipid]);

      return (
        <Card className="my-3 p-3 rounded bg-light"  style={{ width: '20rem', borderWidth: '1px'}}>
         
            <Card.Body className="d-flex flex-column align-items-center">
            <Link to={`/lipid/${lipid.boimmg_id}`} >
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
              <Button type="submit">
                  Annotate
            </Button>
            </Card.Body>
          
        </Card>
      );
    }
    
    export default Lipid_submit;