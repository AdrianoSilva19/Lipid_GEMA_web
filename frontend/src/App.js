import { Container } from 'react-bootstrap'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from './components/Header'
import Footer from './components/Footer'
import {CheckedProvider} from './components/CheckedContext'
import LipidsGenerics from './screens/LipidsGenerics'
import LipidScreen from './screens/LipidScreen'
import HomeScreen from './screens/HomeScreen'
import AboutScreen from './screens/AboutScreen'
import ToolScreen from './screens/ToolScreen';
import ModelScreen from './screens/ModelScreen';
import SugestedScreen from './screens/SugestedScreen';
import { LipidDataProvider } from'./components/LipidDataContext'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="py-3">
        <Container>
        <LipidDataProvider>
        <CheckedProvider>
          <Routes>
            {" "}
            <Route path="/class" element={<LipidsGenerics />} />
            <Route path="/lipid/:id" element={<LipidScreen />} />
            <Route path="/" element={<HomeScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/tool" element={<ToolScreen />} />
            <Route path="/model/:model_id" element={<ModelScreen />} />
            <Route path="/model/:model_id/:lipidKey" element={<SugestedScreen />} /> 
          </Routes>
          </CheckedProvider>
          </LipidDataProvider>
        </Container>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
