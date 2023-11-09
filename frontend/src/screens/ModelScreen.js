import React, { useState, useEffect } from 'react';
import { useParams, Link  } from 'react-router-dom';
import axios from 'axios';
import { Row, Container } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import AnnotatedTable from '../components/AnnotatedCard'; 
import SugestedAnnotationCard from '../components/SugestedAnnotationCard'; 
import { useLipidData } from'../components/LipidDataContext'
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT


/**
 * React component that displays annotated and suggested lipid data for a specific model.
 * Allows the user to download the annotated model and annotations in XML and XLSX formats, respectively.
 *
 * @returns {JSX.Element} JSX code representing the UI of the ModelScreen component.
 */
function ModelScreen() {
  const { model_id } = useParams();
  const { lipidData, setLipidData } = useLipidData(); // Get context data
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isAnnotationsDownloaded, setIsAnnotationsDownloaded] = useState(false);

  useEffect(() => {
    async function fetchLipidData() {
      try {
        if (lipidData[model_id]) {
          // If data is already fetched and stored in context, use it
          setIsLoading(false);
        } else {
          const response = await axios.get(`${API_ENDPOINT}/api/model/${model_id}`);
          setLipidData(prevData => ({ ...prevData, [model_id]: response.data }));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching lipid data:', error);
      }
    }

    fetchLipidData();
  }, [model_id, lipidData, setLipidData]);



  const handleDownloadClick = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/api/download/model/${model_id}`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${model_id}_annotated.xml`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setIsDownloaded(true); // Set the state to show the download message
    } catch (error) {
      console.error('Error downloading model:', error);
    }
  };
  const handleDownloadAnnotationsClick = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/api/download/model/annotations/${model_id}`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${model_id}_annotations.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setIsAnnotationsDownloaded(true); 
    } catch (error) {
      console.error('Error downloading annotations:', error);
    }
  };

  return (
    <div>
      {isLoading ? ( // Render loading animation if still loading
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Container style={{  marginBottom: '150px' }}>
            <Row style={{ fontSize: '40px', textAlign: 'center' }}>
              <strong>Organizing The Annotations</strong>
            </Row>
          </Container>
          <ReactLoading
            type="spinningBubbles"
            color="#61a290"
            height={150}
            width={75}
          />
        </div>
      ) : (
        <div>
          {lipidData[model_id] && (
            <div style={{ borderBottom: '1.3px solid #ccc'  }}> 
              <Container>
                  <Row style={{ fontSize: '40px', textAlign: 'center',marginBottom: '15px',marginTop: "15px",}}>
                    <strong>Annotated</strong>
                  </Row>
              </Container>
              <AnnotatedTable lipid={lipidData[model_id]} />
              <Container>
                  <Row style={{ fontSize: '40px', textAlign: 'center',marginBottom: '15px',marginTop: "15px"}}>
                    <strong>Suggested</strong>
                  </Row>
              </Container>
              <h6 style={{ fontSize: '20px', textAlign: 'center',padding: '30px 0', marginBottom: '10px',borderBottom: '1.3px solid #ccc' }}>Please select the right conformation on the <b>Suggested</b> annotations to annotate your <b>{model_id}</b> GSM model!</h6>
              <ul>
              <SugestedAnnotationCard suggested_list={lipidData[model_id]} model_id={model_id} />
              </ul>
            </div >
          )}
          {isDownloaded && (
            <div style={{ textAlign: 'center', marginTop: '25px', marginBottom: '20px', color: 'green' }}>
              <p>Your annotated model has been downloaded.
                Check the downloads folder.
              </p>
              <div style={{ textAlign: 'center', marginTop: '25px', marginBottom: '20px' }}>
              {isAnnotationsDownloaded && (
                <div style={{ textAlign: 'center', marginTop: '10px', color: 'green' }}>
                  Download xlsx annotations successfully!
                </div>
              )}
              {!isAnnotationsDownloaded && (
                <div style={{ textAlign: 'center', marginTop: '25px', marginBottom: '20px' }}>
                  <button onClick={handleDownloadAnnotationsClick} className="btn btn-primary">
                    Download Annotations
                  </button>
                </div>
              )}
              </div>
              <Link to="/tool" className="btn btn-primary">
                Go to Tool Page
              </Link>
            </div>
          )}
          {!isDownloaded && ( // Display the download button if not downloaded
            <div style={{ textAlign: 'center', marginTop: '25px', marginBottom: '20px' }}>
              <button onClick={handleDownloadClick} className="btn btn-primary">
                Download Annotated Model
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ModelScreen;