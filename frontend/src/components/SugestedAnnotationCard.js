import React, { useState } from 'react';
import { Row, Col, Card, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useChecked } from './CheckedContext'; // Import the useChecked hook


function SuggestedLipidsCards({ suggested_list, model_id }) {
  const suggestedKeys = Object.keys(suggested_list.suggested_annotation);
  const cardsPerPage = 16; // Number of cards to display per page

  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = suggestedKeys.slice(indexOfFirstCard, indexOfLastCard);

  const [checkedState, setCheckedState] = useState({}); // Maintain checked state

  const toggleSwitch = (lipidKey) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [lipidKey]: !prevState[lipidKey]
    }));
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const maxVisiblePageButtons = 5; // Maximum number of visible page buttons

  // Calculate the range of page numbers to display with ellipsis
  const leftPageBound = Math.max(1, currentPage - Math.floor(maxVisiblePageButtons / 2));
  const rightPageBound = Math.min(
    Math.ceil(suggestedKeys.length / cardsPerPage),
    leftPageBound + maxVisiblePageButtons - 1
  );

  // Create an array of page numbers within the range
  const visiblePageNumbers = Array.from(
    { length: rightPageBound - leftPageBound + 1 },
    (_, index) => leftPageBound + index
  );



  return (
    <>
      <Row className="justify-content-center">
        {currentCards.map((key) => (
          <Col key={key} sm={12} md={6} lg={4} xl={3}>
            <SuggestedLipid
              lipidKey={key}
              model_id={model_id}
              switchState={checkedState[key] || false} // Pass the checked state as prop
              onSwitchChange={() => toggleSwitch(key)} // Pass the toggle function as prop
            />
          </Col>
        ))}
      </Row>
      <Pagination style={{ textAlign: 'center' }}>
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
        {leftPageBound > 1 && (
          <>
            <Pagination.Item onClick={() => paginate(1)}>1</Pagination.Item>
            {leftPageBound > 2 && <Pagination.Ellipsis />}
          </>
        )}
        {visiblePageNumbers.map((pageNumber) => (
          <Pagination.Item
            key={pageNumber}
            active={pageNumber === currentPage}
            onClick={() => paginate(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        ))}
        {rightPageBound < Math.ceil(suggestedKeys.length / cardsPerPage) && (
          <>
            {rightPageBound < Math.ceil(suggestedKeys.length / cardsPerPage) - 1 && (
              <Pagination.Ellipsis />
            )}
            <Pagination.Item
              onClick={() => paginate(Math.ceil(suggestedKeys.length / cardsPerPage))}
            >
              {Math.ceil(suggestedKeys.length / cardsPerPage)}
            </Pagination.Item>
          </>
        )}
        <Pagination.Next
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(suggestedKeys.length / cardsPerPage)}
        />
      </Pagination>
    </>
  );
}

function SuggestedLipid({ lipidKey, model_id }) {
  const { checkedState, dispatch } = useChecked();
  const switchState = checkedState[lipidKey] || false;

  const handleSwitchChange = () => {
    if (!switchState) { // Only allow toggling if the switch is not checked
      dispatch({ type: 'TOGGLE_CHECKED', lipidKey });
    }
  };

  return (
    <Card
      className={`my-3 p-3 rounded ${switchState ? 'bg-info' : 'bg-light'}`}
      style={{ width: '15rem', borderWidth: '1px' }}
    >
      <Card.Body className="d-flex flex-column align-items-center">
        <Link to={`/model/${model_id}/${lipidKey}`}  style={{ textDecoration: 'none' }}>
          <Card.Title as="div" className="text-center mb-2">
            <strong>{lipidKey}</strong>
          </Card.Title>
        </Link>
        <div className="form-check form-switch" style={{ marginTop: '5px' }}>
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`flexSwitchCheck-${lipidKey}`}
            checked={switchState}
            onChange={handleSwitchChange}
            disabled={switchState} 
          />
          <label className="form-check-label" htmlFor={`flexSwitchCheck-${lipidKey}`}>
            Annotated
          </label>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SuggestedLipidsCards;