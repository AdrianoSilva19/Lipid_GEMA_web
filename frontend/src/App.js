import { Container } from 'react-bootstrap'
import Header from './Components/Header'
import Footer from './Components/Footer';


function App() {
  return (
    <div className="App">
      <Header />
      <main className="py-3">
        <Container>
          <h1> Welcome </h1>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
