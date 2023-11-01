
import Table from 'react-bootstrap/Table';
import { Row, Col, ListGroup, Card} from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LipidsChildrenList(props) {
  /**
   * Renders a table of lipid components with pagination and search functionality.
   * 
   * @param {Object} props - The component props.
   * @param {Array} props.components - The list of lipid components to be displayed.
   * @returns {JSX.Element} The rendered table of lipid components.
   */
  const { components } = props;
  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const totalItems = components.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when a new search is performed
  };

  const filteredComponents = components.filter((component) =>
    component.name.includes(searchQuery)
  );

  return (
    <div>
        <Row className="searchBar">
            <Col>
              <FloatingLabel controlId="floatingInputGrid" label="Search Lipid by pattern" style={{color:"#00005c"}}>
                <Form.Control
                  type="text"
                  placeholder="Search lipid by patter..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  
                />
              </FloatingLabel>
        </Col>
        </Row>
      <Table>
        <thead>
          <tr>
            <th>Lipid GEMA ID</th>
            <th>Name</th>
            <th>smiles</th>
          </tr>
        </thead>
        <tbody>
          {filteredComponents.slice(startIndex, endIndex).map((component, index) => (
            <tr key={index}>

              <td> <Link to={`/lipid/${component.boimmg_id}`} style={{ textDecoration: 'none' }}>{component.boimmg_id}</Link></td>
              <td>{component.name}</td>
              <td>{component.formula}</td>
            </tr>
          ))}
        </tbody>
      </Table>


      <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-light my-3"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-light my-3"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default LipidsChildrenList;