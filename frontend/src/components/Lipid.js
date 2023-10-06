import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { SmiDrawer } from 'smiles-drawer';


function Lipid({lipid}) {
    /**
     * Renders a card with information about a lipid molecule.
     * 
     * @param {Object} lipid - An object containing information about a lipid molecule.
     * @param {string} lipid.boimmg_id - The ID of the lipid.
     * @param {string} lipid.name - The name of the lipid.
     * @param {string} lipid.smiles - The SMILES representation of the lipid molecule.
     * 
     * @returns {JSX.Element} - A card component with the lipid molecule's name and image, wrapped in a link to a specific lipid page.
     */
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