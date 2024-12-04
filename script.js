const Gameboard = (function(){
  let gameboardArray = [[,,,],[,,,],[,,,]];
  const clearGameBoard = () => {
    gameboardArray = [[,,,],[,,,],[,,,]];
  }
  const addMarker = (row, column, marker) => {
    if (!gameboardArray[row][column]) {
      gameboardArray[row][column] = marker;
    } else {
      return false;
    }
    return true;
  }
  const getGameBoard = () => gameboardArray;
  return {
    clearGameBoard,
    addMarker,
    getGameBoard
  };
})();

const User = function(newName, newMarker) {
  let name = newName;
  let marker = newMarker;
  const getName = () => name;
  const setName = (newName) => name = newName;
  const getMarker = () => marker;
  const setMarker = (newMarker) => marker = newMarker;
  return {
    getName,
    setName,
    getMarker,
    setMarker
  };
}

const GameController = (function() {
  const user1 = new User();
  const user2 = new User();
  let scoreUser1 = 0;
  let scoreUser2 = 0;
  let currentTurn = 'X';

  const initializeUsers = (function(){
    user1.setName('Jack');
    user2.setName('Jill');
    user1.setMarker('X');
    user2.setMarker('O');
  })();

  const takeTurn = (row, column) => {
    if (Gameboard.addMarker(row, column, currentTurn)) {
      console.log(`${currentTurn} on row: ${row} / column: ${column}`);
      checkGameboardConditions();
    } else {
      console.log('Cell is already occupied!');
    }
  };

  const checkGameboardConditions = () => {
    const currentGameboard = Gameboard.getGameBoard();
    for (let i = 0; i < currentGameboard.length; i++) {
      if ((currentGameboard[i][0] === currentGameboard[i][1]) && (currentGameboard[i][1] === currentGameboard[i][2]) && (currentGameboard[i][2] !== undefined)) {
        console.log('checkGameboardConditions #1');
        win(currentGameboard[i][0]);
        break;
      } else if ((currentGameboard[0][i] === currentGameboard[1][i]) && (currentGameboard[1][i] === currentGameboard[2][i]) && (currentGameboard[2][i] !== undefined)) {
        console.log('checkGameboardConditions #2');
        win(currentGameboard[0][i]);
        break;
      }
    }
    if ((currentGameboard[0][0] === currentGameboard[1][1]) && (currentGameboard[1][1] === currentGameboard[2][2])  && (currentGameboard[2][2] !== undefined)) {
      console.log('checkGameboardConditions #3');
      win(currentGameboard[0][0]);
    } else if ((currentGameboard[2][0] === currentGameboard[1][1]) && (currentGameboard[1][1] === currentGameboard[0][2]) && (currentGameboard[0][2] !== undefined)) {
      console.log('checkGameboardConditions #4');
      win(currentGameboard[2][0]);
    }
    switchTurns();
  };

  const switchTurns = () => {
    currentTurn = currentTurn === 'X' ? 'O' : 'X';
  };

  const switchMarkers = () => {
    if (user1.getMarker() === 'X') {
      user1.setMarker('O');
      user2.setMarker('X');
    } else {
      user1.setMarker('X');
      user2.setMarker('O');
    }
  };

  const win = (marker) => {
    console.log('win!');
    if (marker === user1.getMarker()) {
      console.log(`Winner is ${user1.getName()}`);
      scoreUser1++;
    } else {
      console.log(`Winner is ${user2.getName()}`);
      scoreUser2++;
    }
    Gameboard.clearGameBoard();
    switchMarkers();
  };

  const getScore = () => {
    console.log(`${user1.getName()}: ${scoreUser1} - ${user2.getName()}: ${scoreUser2}`);
    return [scoreUser1, scoreUser2];
  };

  return {
    takeTurn,
    getScore
  };
})();