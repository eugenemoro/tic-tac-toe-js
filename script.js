const Gameboard = (function(){
  let gameboardArray = [[,,,],[,,,],[,,,]];
  let elementCount = 0;
  
  const clearGameBoard = () => {
    gameboardArray = [[,,,],[,,,],[,,,]];
    elementCount = 0;
  }
  
  const addMarker = (row, column, marker) => {
    if (!gameboardArray[row][column]) {
      gameboardArray[row][column] = marker;
      elementCount++;
    } else {
      return false;
    }
    return true;
  }

  const isFull = () => elementCount === 9;
  
  const getGameBoard = () => gameboardArray;
  
  return {
    clearGameBoard,
    addMarker,
    getGameBoard,
    isFull
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

const DisplayController = (function(){
  const updateScoreDisplay = function(){
    const scoreDisplay = document.querySelector('.score h1');
    scoreDisplay.innerHTML = GameController.getScore();
  }

  const userInfoDisplay = function(user1, user2){
    const user1Display = document.querySelectorAll('.user-left > *');
    user1Display[0].innerHTML = user1.getName();
    user1Display[1].innerHTML = markerToEmoji(user1.getMarker());

    const user2Display = document.querySelectorAll('.user-right > *');
    user2Display[0].innerHTML = user2.getName();
    user2Display[1].innerHTML = markerToEmoji(user2.getMarker());
  }

  const gameboardEventListener = (function() {
    const gameboard = document.querySelector('.game-board');
    gameboard.addEventListener('click', (e) => {
      const row = e.target.dataset.row;
      const column = e.target.dataset.column;
      GameController.takeTurn(row, column);
    });
  })();

  const gameboardDisplay = function(gameboard) {
    for (i = 0; i < gameboard.length; i++) {
      for (j = 0; j < gameboard[i].length; j++) {
        if (gameboard[i][j]) document.querySelector(`[data-row='${i}'][data-column='${j}']`).innerHTML = markerToEmoji(gameboard[i][j]);
      }
    }
  }

  const clearGameBoardDisplay = function() {
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        document.querySelector(`[data-row='${i}'][data-column='${j}']`).innerHTML = '';
      }
    }
  }

  const markerToEmoji = (marker) => marker === 'X' ? '❌' : '⭕️';

  return {
    updateScoreDisplay,
    userInfoDisplay,
    gameboardDisplay,
    clearGameBoardDisplay
  }
})();

const GameController = (function() {
  const user1 = new User();
  const user2 = new User();
  let scoreUser1 = 0;
  let scoreUser2 = 0;
  let currentTurn = 'X';

  const initializeUsers = (function(){
    user1.setName('John');
    user2.setName('Jane');
    user1.setMarker('X');
    user2.setMarker('O');
    DisplayController.userInfoDisplay(user1, user2);
  })();

  const takeTurn = (row, column) => {
    if (Gameboard.addMarker(row, column, currentTurn)) {
      DisplayController.gameboardDisplay(Gameboard.getGameBoard());
      checkGameboardConditions();
      console.log(`${currentTurn} - row: ${row} / column: ${column}`);
    } else {
      console.log('Cell is already occupied!');
    }
  };

  const checkGameboardConditions = () => {
    const currentGameboard = Gameboard.getGameBoard();
    switchTurns();
    for (let i = 0; i < currentGameboard.length; i++) {
      if ((currentGameboard[i][0] === currentGameboard[i][1]) && (currentGameboard[i][1] === currentGameboard[i][2]) && (currentGameboard[i][2] !== undefined)) {
        win(currentGameboard[i][0]);
        break;
      } else if ((currentGameboard[0][i] === currentGameboard[1][i]) && (currentGameboard[1][i] === currentGameboard[2][i]) && (currentGameboard[2][i] !== undefined)) {
        win(currentGameboard[0][i]);
        break;
      }
    }
    if ((currentGameboard[0][0] === currentGameboard[1][1]) && (currentGameboard[1][1] === currentGameboard[2][2])  && (currentGameboard[2][2] !== undefined)) {
      win(currentGameboard[0][0]);
    } else if ((currentGameboard[2][0] === currentGameboard[1][1]) && (currentGameboard[1][1] === currentGameboard[0][2]) && (currentGameboard[0][2] !== undefined)) {
      win(currentGameboard[2][0]);
    } else if (Gameboard.isFull()) {
      console.log('Deuce!');
      nextGame();
    }
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
    DisplayController.userInfoDisplay(user1, user2);
    currentTurn = 'X';
  };

  const win = (marker) => {
    if (marker === user1.getMarker()) {
      scoreUser1++;
    } else {
      scoreUser2++;
    }
    nextGame();
  };

  const nextGame = function() {
    Gameboard.clearGameBoard();
    switchMarkers();
    DisplayController.updateScoreDisplay();
    DisplayController.clearGameBoardDisplay();
  }

  const getScore = () => {
    return `${scoreUser1} - ${scoreUser2}`;
  };

  return {
    takeTurn,
    getScore
  };
})();

