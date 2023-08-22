import { Table } from 'react-bootstrap';
import React from 'react';
import { useTable, useExpanded } from 'react-table';


function ResultsList(props) {
  const { resultsData } = props;

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'LM',
        accessor: 'lm',
      },
      {
        Header: 'SL',
        accessor: 'sl',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return Object.entries(resultsData).map(([key, values]) => ({
      id: key,
      lm: values[0].length > 0 ? values[0][0] : 'No LM Values',
      sl: values[1].length > 0 ? values[1][0] : 'No SL Values',
      allLm: values[0],
      allSl: values[1],
    }));
  }, [resultsData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable(
    {
      columns,
      data,
    },
    useExpanded
  );

  return (
    <div>
      <h2>Results Data:</h2>
      <Table striped bordered hover responsive {...getTableProps()} class="table table-hover">
      <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <React.Fragment key={row.id} >
                <tr onClick={() => row.toggleRowExpanded()} className={row.isExpanded ? 'clickable-row active' : 'clickable-row'}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
                {row.isExpanded && (
                  <React.Fragment>
                    {row.original.allLm.slice(1).map((lmValue, index) => (
                      <tr key={`${row.id}-lm-${index}`} class="table-dark">
                        <td></td>
                        <td>{index === 0 ? lmValue || 'No LM Values' : ''}</td>
                        <td>{index === 0 ? row.original.allSl.slice(1)[index] || 'No SL Values' : ''}</td>
                      </tr>
                    ))}
                    {row.original.allSl.slice(1).map((slValue, index) => (
                      <tr key={`${row.id}-sl-${index}`} class="table-dark">
                        <td></td>
                        <td>{index === 0 ? row.original.allLm.slice(1)[index] || 'No LM Values' : ''}</td>
                        <td>{index === 0 ? slValue || 'No SL Values' : ''}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default ResultsList;