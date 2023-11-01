import React, {useEffect} from 'react'
import Container from 'react-bootstrap/Container';
import { Row, Col, ListGroup } from 'react-bootstrap'
import Lipid from '../components/Lipid'
import { useDispatch,useSelector } from 'react-redux'
import { listGenerics } from '../actions/genericsActions'

function LipidsGenerics() {
  /**
   * Renders a list of lipid components based on the data fetched from the server.
   * Uses the useDispatch and useSelector hooks from the react-redux library to manage state and dispatch actions.
   *
   * @returns {JSX.Element} The LipidsGenerics component.
   */
  const dispatch = useDispatch();
  const genericsList = useSelector((state) => state.genericsList);

  const { error, loading, generics } = genericsList;
  useEffect(() => {
    dispatch(listGenerics());
  }, [dispatch]);

  return (
    <div>
      <Container>
        <Row>
          <ListGroup variant="flush" style={{ marginBottom: '10px' }}>
            <ListGroup.Item
              style={{
                fontSize: '40px',
                textAlign: 'center',
                borderBottom: '1.3px solid #ccc',
              }}
            >
              <strong>Lipid Class</strong>
            </ListGroup.Item>
          </ListGroup>
        </Row>
      </Container>
      <Container>
        <Row className="justify-content-center">
          {generics.map((lipid) => (
            <Col key={lipid.boimmg_id} sm={12} md={6} lg={4} xl={4}>
              <Lipid lipid={lipid} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default LipidsGenerics

