import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Row, Col, ListGroup} from 'react-bootstrap';
import LipidsComponentsList from '../components/LipidComponentsList';
import LipidsChildrenList from '../components/LipidChildrenList';



/**
 * Renders a set of tabs displaying information about a lipid object.
 * 
 * @param {Object} props - The props object containing the lipid object.
 * @param {Object} props.lipid - The lipid object containing various properties such as formula, charge, smiles, inchi, inchikey, mass, boimmg_id, swiss_lipids_id, lipidmaps_id, model_seed_id, chebi_id, parents, generic, children_species, and components.
 * 
 * @returns {JSX.Element} - The rendered set of tabs displaying information about the lipid object.
 */
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
                          
                            <b style={{ marginRight: '10px' }}>FORMULA:</b> 
                            
                            {lipid.formula !== undefined ?( 
                              <a>{lipid.formula}</a> ): "absent"}

                          </ListGroup.Item>

                         <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>CHARGE:</b>  {lipid.charge !== undefined ?( 
                              <a>{lipid.charge}</a>): "absent"}
                          </ListGroup.Item>
                                                    
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>SMILES:</b>  {lipid.smiles !== undefined ?( 
                              <a>{lipid.smiles} </a>): "absent"}
                          </ListGroup.Item>
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>INCHI:</b> {lipid.inchi !== undefined ?( 
                              <a>{lipid.inchi} </a>): "absent"}
                          </ListGroup.Item>

                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left' }}>
                            <b style={{ marginRight: '10px' }}>INCHIKEY:</b>  {lipid.inchikey !== undefined ?( 
                              <a>{lipid.inchikey}</a> ): "absent"}
                          </ListGroup.Item>
                          
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>MASS:</b> {lipid.mass !== undefined ?( 
                              <a>{lipid.mass}</a> ): "absent"}
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
                            <b style={{ marginRight: '10px' }}>SWISS LIPIDS ID:</b>
                            {lipid.swiss_lipids_id !== undefined ?(
                            <a href={`https://www.swisslipids.org/#/entity/${lipid.swiss_lipids_id}/`}  target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            {lipid.swiss_lipids_id}
                              </a>  
                               ): "absent"}
                          </ListGroup.Item>
                                                    
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>LIPID MAPS ID:</b> 
                            {lipid.lipidmaps_id !== undefined ?(
                            <a href={`https://www.lipidmaps.org/databases/lmsd/${lipid.lipidmaps_id}/`}  target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            {lipid.lipidmaps_id}
                              </a>  
                               ): "absent"}
                          </ListGroup.Item>
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>MODEL SEED ID:</b> 
                            {lipid.model_seed_id !== undefined ? (
                                <a href={`https://modelseed.org/biochem/compounds/${lipid.model_seed_id}/`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                    {lipid.model_seed_id}
                                </a>
                            ) : "absent"} 
                          </ListGroup.Item>
                          <ListGroup.Item variant="Light" style={{ fontSize: '17px', padding: '10px',  textAlign: 'left'}}>
                            <b style={{ marginRight: '10px' }}>CHEBI ID:</b>
                            {lipid.chebi_id !== undefined ?(
                            <a href={`https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${lipid.chebi_id}/`}  target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            {lipid.chebi_id}
                              </a>  
                              ): "absent"}
                          </ListGroup.Item>
                      </ListGroup>
                  </Col>
      </Row>
      </Tab>
      <Tab eventKey="parents" title="Structural Parents">
        <Row className="justify-content-center">
        {lipid.parents?.map((component, index) => (
          <Col key={index} sm={12} md={6} lg={4} xl={4}>
            <LipidsComponentsList component={component} />
          </Col>
        ))}
        </Row>
      </Tab>
      {lipid.generic ? (
        <Tab eventKey="children_subclasses" title="Children Subclasses">
          <Row className="justify-content-center">
            {lipid.children_species?.map((component, index) => (
              <Col key={index} sm={12} md={6} lg={4} xl={4}>
                <LipidsComponentsList component={component} />
              </Col>
            ))}
          </Row>
        </Tab>
      ) : (
        <Tab eventKey="components" title="Components">
          <Row className="justify-content-center">
            {lipid.components?.map((component, index) => (
              <Col key={index} sm={12} md={6} lg={4} xl={4}>
                <LipidsComponentsList component={component} />
              </Col>
            ))}
          </Row>
        </Tab>
        )}
        {lipid.generic && (
          <Tab eventKey="children" title="Children">
            <Row className="justify-content-center">
              <Col>
                <LipidsChildrenList components={lipid.children} />
              </Col>
            </Row>
          </Tab>
        )}
    </Tabs>
  );
}

export default TabList;