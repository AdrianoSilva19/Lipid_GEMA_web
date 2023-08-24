import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AnnotatedTable({ lipid }) {
  return (
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
        {Object.entries(lipid.annotated).map(([key, [lmValues, slValues,lipid_gema_id]]) => (
          lmValues.map((lmValue, index) => (
            <tr key={index}>
              <td>{key}</td>
              <td>
                <Link to={`https://www.lipidmaps.org/databases/lmsd/${lmValue}/`} target="_blank" style={{ textDecoration: 'none' }} >{lmValue}</Link>
              </td>
              <td>
                <Link to={`https://www.swisslipids.org/#/entity/${slValues[index]}/`} target="_blank" style={{ textDecoration: 'none' }}>{slValues[index]}</Link>
              </td>
              <td>
                <Link to={`/lipid/${lipid_gema_id}`} target="_blank" style={{ textDecoration: 'none' }}>{lipid_gema_id}</Link>
              </td>
            </tr>
          ))
        ))}
      </tbody>
    </Table>
  );
}

export default AnnotatedTable;
