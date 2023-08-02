import React from 'react'

import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'


function Lipid({lipid}) {
    return(
        <Card className="my-3 p-3 rounded" >
            <Card.Body>
            <Link to={`/product/${lipid.boimmg_id}`}> 
                <Card.Title as="div">
                    <strong>{lipid.name}</strong>
                </Card.Title>              
            </Link>
            <Card.Text as="div">
                <div className="my-3">
                     {`${lipid.swiss_lipids_id} swiss lipids identificator`}
                </div>
            </Card.Text>
        </Card.Body>
        </Card>
        
        )



}

export default Lipid