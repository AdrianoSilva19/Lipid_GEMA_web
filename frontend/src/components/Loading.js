import React from "react";
import ReactLoading from "react-loading";
import { Container } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
 
function Loading() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Container style={{  marginBottom: '150px' }}>
            <Row style={{ fontSize: '40px', textAlign: 'center' }}>
                    <strong> Fetching Data From Lipid GEMA!</strong>
            </Row>
            
             </Container>
             
            <ReactLoading
                type="spinningBubbles"
                color="#61a290"
                height={150}
                width={75}
            
            />

        </div>
    );
}

export default Loading;