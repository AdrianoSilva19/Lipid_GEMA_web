import SearchBar from '../components/SearchBar'
import { Container } from 'react-bootstrap'
import { Row, Col, ListGroup } from 'react-bootstrap'


function AboutScreen() {
  
    return (
      <div>
        <Container>
            <Row style={{ fontSize: '40px', textAlign: 'center' }}>
                    <strong> General Information</strong>
            </Row>
            
        </Container>
        <Row style={{ fontSize: '15px', textAlign: 'justify', marginTop: '50px', marginBottom: '50px', color: 'black' }}>
                <a> Lipid_GEMA is a powerful annotation tool designed to streamline lipid analysis and annotation processes. 
                    Built with a comprehensive database utilizing Lipid Maps and Swiss Lipids information, this tool combines 
                    Python algorithm with extensive lipid knowledge to provide accurate and efficient annotations. 
                    At his core lies a robust graph database meticulously constructed to store a complex collection of lipid data. 
                    Leveraging the rich resources provided by Lipid Maps and Swiss Lipids, the database emcompasses a wide range of lipid entities, 
                    and ensures comprehensive coverage across various lipid classes, subtypes, and structural variations.</a>
        </Row>
        <Container>
            <Row style={{ fontSize: '40px', textAlign: 'center' }}>
                    <strong> Availability </strong>
            </Row>
        </Container>
        <Row style={{ fontSize: '15px', textAlign: 'justify', marginTop: '50px', marginBottom: '50px', color: 'black' }}>
                <a> Source code for Lipid_GEMA tool is available <a href="https://github.com/jcapels/boimmg" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>here</a>.</a>
                <a> Local implementation of Lipid_GEMA tool is available <a href="https://github.com/AdrianoSilva19/Lipid_GEM" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>here</a>.</a>
                <a> Webb App source code available <a href="https://github.com/AdrianoSilva19/Lipid_GEMA_web" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>here</a>.</a>

        </Row>
  </div>
    );
  }
  
  export default AboutScreen