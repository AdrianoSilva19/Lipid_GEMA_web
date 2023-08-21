import React, { Component } from 'react';
import axios from 'axios';

class ViewResultsScreen extends Component {
  state = {
    resultsContent: '',
  };

  async componentDidMount() {
    const resultsPath = this.props.match.params.resultsPath;
    try {
      const response = await axios.get(`/api/results/${resultsPath}/`);
      const resultsContent = response.data;
      this.setState({ resultsContent });
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  }

  render() {
    const { resultsContent } = this.state;

    return (
      <div>
        <h2>Results</h2>
        <pre>{resultsContent}</pre>
      </div>
    );
  }
}

export default ViewResultsScreen;