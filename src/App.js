import React, { useState, useEffect } from 'react';
import './App.css';
import Keyboard from './components/Keyboard';
import { equationList } from './constants/data';

const App = () => {
  const [boardData, setBoardData] = useState(null);
  const [message, setMessage] = useState(null);
  const [charArray, setCharArray] = useState([]);
  const [col, setCol] = useState(5);
  const [colArr, setColArr] = useState([1, 2, 3, 4, 5]);

  const setupgame = (colNo) => {
    const boardCol = colNo || col;

    var eqIndex = Math.floor(Math.random() * equationList[boardCol].length);
    let newBoardData = {
      ...boardData,
      solution: equationList[boardCol][eqIndex],
      rowIndex: 0,
      boardWords: [],
      boardRowStatus: [],
      presentCharArray: [],
      absentCharArray: [],
      correctCharArray: [],
      status: 'IN_PROGRESS',
    };
    setBoardData(newBoardData);
  };
  useEffect(() => {
    setupgame();
  }, []);

  const handleMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleChange = (event) => {
    const colNo = event.target.value;
    setCol(colNo);
    var arr = [];
    for (let i = 0; i < colNo; i++) arr.push(i);

    setColArr(arr);
    setupgame(colNo);
  };
  const enterBoardWord = (word) => {
    let boardWords = boardData.boardWords;
    let boardRowStatus = boardData.boardRowStatus;
    let solution = boardData.solution;
    let presentCharArray = boardData.presentCharArray;
    let absentCharArray = boardData.absentCharArray;
    let correctCharArray = boardData.correctCharArray;
    let rowIndex = boardData.rowIndex;
    let rowStatus = [];
    let matchCount = 0;
    let status = boardData.status;

    for (var index = 0; index < word.length; index++) {
      if (solution.charAt(index) === word.charAt(index)) {
        matchCount++;
        rowStatus.push('correct');
        if (!correctCharArray.includes(word.charAt(index)))
          correctCharArray.push(word.charAt(index));
        if (presentCharArray.indexOf(word.charAt(index)) !== -1)
          presentCharArray.splice(
            presentCharArray.indexOf(word.charAt(index)),
            1
          );
      } else if (solution.includes(word.charAt(index))) {
        rowStatus.push('present');
        if (
          !correctCharArray.includes(word.charAt(index)) &&
          !presentCharArray.includes(word.charAt(index))
        )
          presentCharArray.push(word.charAt(index));
      } else {
        rowStatus.push('absent');
        if (!absentCharArray.includes(word.charAt(index)))
          absentCharArray.push(word.charAt(index));
      }
    }
    if (matchCount === 5) {
      status = 'WIN';
      handleMessage('🎉YOU WON');
    } else if (rowIndex + 1 === 6) {
      status = 'LOST';
      handleMessage(boardData.solution);
    }
    boardRowStatus.push(rowStatus);
    boardWords[rowIndex] = word;
    let newBoardData = {
      ...boardData,
      boardWords: boardWords,
      boardRowStatus: boardRowStatus,
      rowIndex: rowIndex + 1,
      status: status,
      presentCharArray: presentCharArray,
      absentCharArray: absentCharArray,
      correctCharArray: correctCharArray,
    };
    setBoardData(newBoardData);
  };

  const enterCurrentText = (word) => {
    let boardWords = boardData.boardWords;
    let rowIndex = boardData.rowIndex;
    boardWords[rowIndex] = word;
    let newBoardData = { ...boardData, boardWords: boardWords };
    setBoardData(newBoardData);
  };

  const handleKeyPress = (key) => {
    if (boardData.rowIndex > 5 || boardData.status === 'WIN') return;
    if (key === 'ENTER') {
      if (charArray.length == col) {
        let word = charArray.join('').toLowerCase();
        // todo

        enterBoardWord(word);
        setCharArray([]);
      } else {
        handleMessage('Incomplete row');
      }
      return;
    }
    if (key === '⌫') {
      charArray.splice(charArray.length - 1, 1);
      setCharArray([...charArray]);
    } else if (charArray.length < col) {
      charArray.push(key);
      setCharArray([...charArray]);
    }
    enterCurrentText(charArray.join('').toLowerCase());
  };

  return (
    <div className="container">
      <div className="top">
        <div className="title">NERDLE</div>
        <div className="setting">
          <select value={col} onChange={handleChange} placeholder="Select rows">
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
          </select>
          <button className="reset-board" onClick={() => setupgame()}>
            Play again
          </button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
      {col && (
        <>
          <div className="cube">
            {[0, 1, 2, 3, 4, 5].map((row, rowIndex) => (
              <div className={'cube-row '} key={rowIndex}>
                {colArr.map((column, letterIndex) => (
                  <div
                    key={letterIndex}
                    className={`letter ${
                      boardData && boardData.boardRowStatus[row]
                        ? boardData.boardRowStatus[row][column]
                        : ''
                    }`}
                  >
                    {boardData &&
                      boardData.boardWords[row] &&
                      boardData.boardWords[row][column]}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="bottom">
            <Keyboard boardData={boardData} handleKeyPress={handleKeyPress} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
