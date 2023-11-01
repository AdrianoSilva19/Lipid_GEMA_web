import SearchBar from '../components/SearchBar'
import { Container } from 'react-bootstrap'
import { Row, Col, ListGroup } from 'react-bootstrap'


function HomeScreen() {
  /**
   * Renders a home screen for a lipid annotation application.
   * Includes a welcome message, a description of the application, and a search bar component.
   *
   * @returns {JSX.Element} The rendered home screen.
   *
   * @example
   * import HomeScreen from './HomeScreen';
   *
   * function App() {
   *   return (
   *     <div>
   *       <HomeScreen />
   *     </div>
   *   );
   * }
   */
  
  return (
    <div>
      <Container>
        <Row style={{ fontSize: '40px', textAlign: 'center' }}>
          <strong> Welcome to <b>Lipid_GEMA</b> GUI!</strong>
        </Row>
      </Container>
      <Row style={{ fontSize: '20px', textAlign: 'center', marginTop: '50px', marginBottom: '50px', color: 'black',  fontWeight: 'bold' }}>
        <p> Uncover the mysteries of lipids with <b>Lipid_GEMA</b>: Your <b>Lipid</b> <b>GE</b>nome-scale <b>M</b>etabolic <b>A</b>notator.</p>
      </Row>
      <Container>
        <SearchBar />
      </Container>
    </div>
  );
}
  
  export default HomeScreen