import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'


function Lipid({lipid}) {

    return(
        <Card className="my-3 p-3 rounded "  >
            <Link to={`/class/${lipid.boimmg_id}`} style={{ textDecoration: 'none' }}> 
            <Card.Body>
            
                <Card.Title as="div">
                    <strong >{lipid.name}</strong>
                </Card.Title>              
           
            <Card.Text as="div">
                <div className="my-3">Chemical Formula: {lipid.formula}</div>
                <div className="my-3">ChEBI ID: {lipid.chebi_id}</div>
            </Card.Text>
        </Card.Body>
        </Link>
        </Card>
        
        )



}

export default Lipid