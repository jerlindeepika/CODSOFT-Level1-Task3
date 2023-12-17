import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import * as math from 'mathjs';
import './Calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const focusedButtonRef = useRef(null);

  const handleButtonClick = (value) => {
    setInput((prevInput) => prevInput + value);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleCalculate = () => {
    try {
      const expressionResult = math.evaluate(input);
      setResult(expressionResult.toString());
    } catch (error) {
      setResult('Error');
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

      if (key === 'Backspace') {
        event.preventDefault();
        setInput((prevInput) => prevInput.slice(0, -1)); // Remove the last character
      } else if (key === 'C') {
        event.preventDefault();
        handleClear();
      } else if (allowedKeys.includes(key)) {
        event.preventDefault();

        if (key === 'Shift') {
          handleCalculate();
        } else if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
          const buttons = document.querySelectorAll('.calculator-buttons button');
          const currentIndex = Array.from(buttons).indexOf(focusedButtonRef.current);
          let nextIndex;

          if (key === 'ArrowUp') {
            nextIndex = currentIndex - 4 >= 0 ? currentIndex - 4 : currentIndex;
          } else if (key === 'ArrowDown') {
            nextIndex = currentIndex + 4 < buttons.length ? currentIndex + 4 : currentIndex;
          } else if (key === 'ArrowLeft') {
            nextIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : currentIndex;
          } else if (key === 'ArrowRight') {
            nextIndex = currentIndex + 1 < buttons.length ? currentIndex + 1 : currentIndex;
          }

          focusedButtonRef.current = buttons[nextIndex];
          focusedButtonRef.current.focus();
        } else {
          handleButtonClick(key);
          // Set focus to the next button after handling the key
          const buttons = document.querySelectorAll('.calculator-buttons button');
          const currentIndex = Array.from(buttons).indexOf(focusedButtonRef.current);
          const nextIndex = (currentIndex + 1) % buttons.length;
          focusedButtonRef.current = buttons[nextIndex];
          focusedButtonRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    focusedButtonRef.current = document.querySelector('.calculator-buttons button[data-value="C"]');
    focusedButtonRef.current.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div>
    <h1 className='heading'>CALCULATOR</h1>
    <Col xs={12} md={{ span: 3 }}>
          <div className="instruction-container">
            <h4>Instructions:</h4>
            <p>Use the calculator buttons or keyboard for input.</p>
            <p>Press 'Enter' to clear the input.</p>
            <p>Press 'Shift' to calculate the result.</p>
            <p>Use arrow keys for navigation.</p>
          </div>
        </Col>
    <Container className="calculator-container">

    
      <Row>
        
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          <InputGroup className="mb-3">
            <FormControl type="text" value={input} readOnly className="calculator-input" />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          <div className="calculator-buttons">
            {[7, 8, 9, '+', 4, 5, 6, '-', 1, 2, 3, '*', 0].map((value) => (
              <Button key={value} onClick={() => handleButtonClick(value)} data-value={value}>
                {value}
              </Button>
            ))}
            <Button variant="warning" onClick={handleClear} data-value="C">
              C
            </Button>
            <Button variant="success" onClick={handleCalculate} data-value="=">
              =
            </Button>
            <Button onClick={() => handleButtonClick('/')} data-value="/">
              /
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          <div className="calculator-result">
            <p>{result}</p>
          </div>
        </Col>
        
      </Row>
      
    </Container>
    </div>
  );
};

export default Calculator;