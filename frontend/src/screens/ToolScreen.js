import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


class ToolScreen extends Component {
  state = {
    resultsData: '',
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('gsmModel', file);

      try {
        const response = await axios.post('/api/upload/', formData);
        const resultsData = response.data; // Assuming response is the results path
        this.setState({ resultsData }); // Store results path in the component state
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  render() {
    const { resultsData } = this.state;

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <p>
            <input type="file" id="image" accept="application/xml, text/xml" />
          </p>
          <input type="submit" value="Upload" />
        </form>

        {resultsData && (
          <div>
            <h2>Results Data:</h2>
            <ul>
              {Object.entries(resultsData).map(([key, values]) => (
                <li key={key}>
                  {key}: {values.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default ToolScreen;