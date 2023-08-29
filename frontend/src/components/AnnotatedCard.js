import { Table } from 'react-bootstrap';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AnnotatedTable({ lipid }) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const data = Object.entries(lipid.annotated).map(([key, [lmValues, slValues, lipid_gema_id]]) => (
    {
      id: key,
      lmValue: lmValues.length > 0 ? lmValues[0] : 'No Value',
      slValue:  slValues.length > 0 ? slValues[0] : 'No Value',
      lipidGemaID: lipid_gema_id
    }
  )).flat();

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

  return (
    <div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Lipid Maps ID</th>
            <th>Swiss Lipids ID</th>
            <th>Lipid Gema ID</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map(({ id, lmValue, slValue, lipidGemaID }, index) => (
            <tr key={index}>
              <td>{id}</td>
              <td>
              {lmValue !== 'No Value' ? (
                  <Link to={`https://www.lipidmaps.org/databases/lmsd/${lmValue}/`} target="_blank" style={{ textDecoration: 'none' }}>
                    {lmValue}
                  </Link>
                ) : (
                  lmValue
                )}
              </td>
              <td>
              {slValue !== 'No Value' ? (
                  <Link to={`https://www.swisslipids.org/#/entity/${slValue}/`} target="_blank" style={{ textDecoration: 'none' }}>
                    {slValue}
                  </Link>
                ) : (
                  slValue
                )}
              </td>
              <td>
                <Link to={`/lipid/${lipidGemaID}`} target="_blank" style={{ textDecoration: 'none' }}>{lipidGemaID}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div  style={{ textAlign: 'center' }}>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
              &laquo;
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
              &raquo;
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AnnotatedTable;