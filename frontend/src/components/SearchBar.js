import { Container} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    /**
     * Renders a search bar and select input. Allows the user to enter a search pattern and choose an input option,
     * and triggers a search when the user clicks the "Search" button. The search is performed by making an HTTP GET
     * request to an API endpoint using the axios library. The fetched lipid data is stored in the component's state
     * and can be accessed by other components.
     *
     * @returns {JSX.Element} The rendered search bar and select input components.
     */

    const [selectedOption, setSelectedOption] = useState('LM_ID'); // Default option
    const [searchText, setSearchText] = useState('');

    const history = useNavigate(); // Get the history object
  
    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };
  
    const handleSearchInputChange = (event) => {
      setSearchText(event.target.value);
    };

    const [lipid, setLipid] = useState(null); // State to hold the fetched lipid data

    const handleSearchSubmit = async (event) => {
    event.preventDefault();

    // Fetch the lipid data based on the selected option and search text
    const { data } = await axios.get(`/api/lipid/${selectedOption}/${searchText}`);
    setLipid(data);
    // Navigate to the LipidScreen with the fetched lipid data
    history(`/lipid/${data.boimmg_id}`, { lipidData: data });
  };
  
    const isSearchValid = selectedOption && searchText.trim() !== '';

  
    return (
      <div>
        <Container>
          <Row className="searchBar">
            <Col xs={12} md={6}>
              <FloatingLabel controlId="floatingInputGrid" label="Enter your pattern">
                <Form.Control
                  type="text"
                  placeholder="Type to search..."
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
              </FloatingLabel>
            </Col>
            <Col xs={12} md={6}>
              <FloatingLabel controlId="floatingSelectGrid" label="Choose your input">
                <Form.Select
                  aria-label="Floating label select example"
                  onChange={handleOptionChange}
                  value={selectedOption}
                >
                  <option value="LM_ID">Lipid Maps ID</option>
                  <option value="SL_ID">Swiss Lipids ID</option>
                  <option value="L_ID">Lipid_GEMA ID</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
        </Container>
  
        <Container>
          <Row style={ {marginTop: '50px'}} > 
            <Col className="text-center">
              {isSearchValid ? (
                  <Button type="submit" onClick={handleSearchSubmit}>Search</Button>
              ) : (
                <Button type="submit" disabled>
                  Search
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
  
  export default SearchBar;