import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Row, Col, ListGroup, Card} from 'react-bootstrap';

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
        Tab content for Profile
      </Tab>
      <Tab eventKey="longer-tab" title="Parents">
        Tab content for Loooonger Tab
      </Tab>
      <Tab eventKey="contact" title="Components">
        Tab content for Contact
      </Tab>
    </Tabs>
  );
}

export default TabList;