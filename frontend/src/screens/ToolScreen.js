import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReactLoading from 'react-loading';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT
/**
 * Represents a React component called ToolScreen that allows users to upload and annotate XML files.
 *
 * Example Usage:
 * import ToolScreen from './ToolScreen';
 * ReactDOM.render(<ToolScreen />, document.getElementById('root'));
 *
 * Main functionalities:
 * - Allows users to select an XML file and upload it to the server.
 * - Checks the file size limit (100 MB) before uploading.
 * - Displays a loading spinner while the file is being uploaded.
 * - Handles the server response and updates the state with the annotated lipids.
 * - Provides a link to view the annotations.
 *
 * Methods:
 * - handleFileChange: Updates the state with the selected file name when the file input changes.
 * - handleSubmit: Handles the form submission event, uploads the file to the server using Axios, and updates the state with the server response.
 * - render: Renders the component UI, including the file input, loading spinner, and link to view the annotations.
 *
 * Fields:
 * - resultsData: Stores the server response data, which contains the annotated lipids.
 * - selectedFileName: Stores the name of the selected file.
 * - isLoading: Tracks the loading state of the file upload process.
 */
class ToolScreen extends Component {
  
  state = {
    resultsData: '',
    selectedFileName: '',
    isLoading: false, // Add a new state to track loading state
  };

  handleFileChange = (event) => {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      this.setState({ selectedFileName: fileInput.files[0].name });
    } else {
      this.setState({ selectedFileName: '' });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
  
    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];
  
    if (file) {
      if (file.size <= 100 * 1024 * 1024) { // Check file size limit (100 MB)
        this.setState({ isLoading: true });
  
        const formData = new FormData();
        formData.append('gsmModel', file);
  
        try {
          const response = await axios.post(`${API_ENDPOINT}/api/upload`, formData);
          const resultsData = response.data;
          this.setState({ resultsData, isLoading: false });
        } catch (error) {
          console.error('Error uploading file:', error);
          this.setState({ isLoading: false });
        }
      } else {
        alert('File size exceeds the limit of 100 MB.');
      }
    }
  };

  render() {
    const { resultsData, selectedFileName, isLoading } = this.state;

    return (
      <div>
        <Container>
          <Row style={{ fontSize: '40px', textAlign: 'center' }}>
            <strong> Welcome to <b>Lipid_GEMA</b> Tool!</strong>
          </Row>
        </Container>
        <Row style={{ fontSize: '20px', textAlign: 'center', marginTop: '50px', marginBottom: '50px', color: 'black', fontWeight: 'bold' }}>
          <p> Here you can insert your model to be annotated. Choose an xml file format and upload it to our app. <br />
            In the end a list with the caught lipidis will be shown and you will be able to confirm the proposal annotations. <br />
            <b>Happy Annotations</b>
          </p>
        </Row>
        <Container>
          <form onSubmit={this.handleSubmit}>
            <Row style={{ fontSize: '20px', textAlign: 'center', width: '100%' }}>
              <Col>
                <input
                  type="file"
                  id="image"
                  accept="application/xml, text/xml"
                  style={{ display: 'none' }}
                  onChange={this.handleFileChange}
                />
                <label htmlFor="image" className="btn btn-primary mb-0">
                  Choose File
                </label>
              </Col>
              <Col>
                {selectedFileName && <span style={{ marginLeft: '30px' }}>{selectedFileName}</span>}
              </Col>
              <Col>
                <Button type="submit" value="Upload">
                  Upload
                </Button>
              </Col>
            </Row>
          </form>
        </Container>
        {isLoading && (
          <Row className="justify-content-center mt-4">
            <ReactLoading type="spinningBubbles" color="#61a290" height={150} width={75} />
          </Row>
        )}
        <Row>
          <Col style={{ fontSize: '20px', textAlign: 'center', width: '100%', marginTop:"20px" }}>
            {resultsData && <Link to={`/model/${selectedFileName.replace('.xml', '')}`} style={{ textDecoration: 'none', marginTop: "20px" }} className="btn btn-primary mb-0">
              See Annotations
            </Link>}
          </Col>
        </Row>
      </div>
    );
  }
}

export default ToolScreen;