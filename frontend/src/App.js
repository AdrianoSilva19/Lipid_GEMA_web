import { Container } from 'react-bootstrap'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from './components/Header'
import Footer from './components/Footer'
import LipidsGenerics from './screens/LipidsGenerics'
import LipidScreen from './screens/LipidScreen'



function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            {" "}
            <Route path="/class" element={<LipidsGenerics />} />
            <Route path="/class/:id" element={<LipidScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
