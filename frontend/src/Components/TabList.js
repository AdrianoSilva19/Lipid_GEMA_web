import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Row, Col, ListGroup, Card} from 'react-bootstrap';
import LipidsComponentsList from '../components/LipidComponentsList';

function TabList(props) {
    const { lipid } = props;
  return (
    <Tabs
      defaultActiveKey="profile"
      id="fill-tab-example"
      className="mb-3"
      fill
    >
      <Tab eventKey="home" title="Chemical Information">
      <Row className="align-content-start">
              <Col style={{marginTop: '15px'}}>
                      <ListGroup variant="secondary">
                         <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>FORMULA:</b> {lipid.formula}
                          </ListGroup.Item>

                         <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>CHARGE:</b> {lipid.charge}
                          </ListGroup.Item>
                                                    
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>SMILES:</b> {lipid.smiles}
                          </ListGroup.Item>
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>INCHI:</b> {lipid.Inchi}
                          </ListGroup.Item>

                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left' }}>
                            <b style={{ marginRight: '10px' }}>INCHIKEY:</b> {lipid.inchikey}
                          </ListGroup.Item>
                          
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>MASS:</b> {lipid.mass}
                          </ListGroup.Item>

                          

                      </ListGroup>
                  </Col>
      </Row>
      </Tab>
      <Tab eventKey="profile" title="Cross Links">
      <Row className="align-content-start">
              <Col style={{marginTop: '15px'}}>
                      <ListGroup variant="secondary">
                         <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>LIPID GEMA ID:</b> {lipid.boimmg_id}
                          </ListGroup.Item>

                         <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>SWISS LIPIDS ID:</b> {lipid.swiss_lipids_id}
                          </ListGroup.Item>
                                                    
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>LIPID MAPS ID:</b> {lipid.lipidmaps_id}
                          </ListGroup.Item>
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>MODEL SEED ID:</b> {lipid.model_seed_id}
                          </ListGroup.Item>
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>CHEBI ID:</b> {lipid.chebi_id}
                          </ListGroup.Item>
                      </ListGroup>
                  </Col>
      </Row>
      </Tab>
      <Tab eventKey="longer-tab" title="Parents">
        <Row className="justify-content-center">
        {lipid.parents?.map((component, index) => (
          <Col key={index} sm={12} md={6} lg={4} xl={4}>
            <LipidsComponentsList component={component} />
          </Col>
        ))}
        </Row>
      </Tab>
      <Tab eventKey="Components" title="Components">
      <Row className="justify-content-center">
      {lipid.components?.map((component, index) => (
        <Col key={index} sm={12} md={6} lg={4} xl={4}>
          <LipidsComponentsList component={component} />
        </Col>
      ))}
      </Row>
    </Tab>
    </Tabs>
  );
}

export default TabList;