
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
  const startGameDialog = document.getElementById('start-game-dialog');

  const showStartGameDialog = function() {
    startGameDialog.showModal();
  }

  const startGameDialogEventListener = (function(){
    const userNameField1 = document.getElementById('player1');
    const userNameField2 = document.getElementById('player2');
    const startButton = document.getElementById('start-game-button');
    startButton.addEventListener('click', () => {
      GameController.initializeUsers(userNameField1.value, userNameField2.value);
      startGameDialog.close();
    });
  })();

  const updateScoreDisplay = function(){
    const scoreDisplay = document.querySelector('.score h1');
    scoreDisplay.innerHTML = GameController.getScore();
  }

  const userInfoDisplay = function(user1, user2, currentTurn){
    const user1Display = document.querySelectorAll('.user-left > *');
    user1Display[0].innerHTML = user1.getName();
    user1Display[1].innerHTML = markerToEmoji(user1.getMarker());
    const user1DisplayMain = document.querySelector('.user-left');
    if (user1.getMarker() === currentTurn) {
      user1Display[2].innerHTML = 'Player 1 Turn';
      user1DisplayMain.classList.add('active');
    } else {
      user1Display[2].innerHTML = '';
      user1DisplayMain.classList.remove('active');
    }

    const user2Display = document.querySelectorAll('.user-right > *');
    user2Display[0].innerHTML = user2.getName();
    user2Display[1].innerHTML = markerToEmoji(user2.getMarker());
    const user2DisplayMain = document.querySelector('.user-right');
    if (user2.getMarker() === currentTurn) {
      user2Display[2].innerHTML = 'Player 2 Turn';
      user2DisplayMain.classList.add('active');
    } else {
      user2Display[2].innerHTML = '';
      user2DisplayMain.classList.remove('active');
    }
  }

  const gameboardEventListener = (function() {
    const gameboard = document.querySelector('.game-board');
    gameboard.addEventListener('click', (e) => {
      const row = e.target.dataset.row;
      const column = e.target.dataset.column;
      if (!GameController.takeTurn(row, column)) {
        e.target.animate(
          [
            { backgroundColor: 'red', easing: "ease-out" },
            { backgroundColor: 'white', easing: "ease-in" },
            { backgroundColor: 'white' },
          ],
          2000,
        );
      };
    });
  })();

  const restartGameEventListener = (function(){
    const restartButton = document.getElementById('restart-game-button');
    restartButton.addEventListener('click', () => GameController.restartGame());
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
    clearGameBoardDisplay,
    showStartGameDialog
  }
})();

const GameController = (function() {
  const user1 = new User();
  const user2 = new User();
  let scoreUser1 = 0;
  let scoreUser2 = 0;
  let currentTurn = 'X';
  let newGame = true;

  const restartGame = function() {
    scoreUser1 = 0;
    scoreUser2 = 0;
    DisplayController.showStartGameDialog();
  }

  if (newGame) {
    newGame = false;
    restartGame();
  }

  const initializeUsers = (userName1, userName2) => {
    user1.setName(userName1);
    user2.setName(userName2);
    user1.setMarker('X');
    user2.setMarker('O');
    scoreUser1 = 0;
    scoreUser2 = 0;
    DisplayController.userInfoDisplay(user1, user2, currentTurn);
    DisplayController.updateScoreDisplay();
  };

  const takeTurn = (row, column) => {
    if (Gameboard.addMarker(row, column, currentTurn)) {
      DisplayController.gameboardDisplay(Gameboard.getGameBoard());
      checkGameboardConditions();
    } else {
      console.log('Cell is already occupied!');
      return false;
    }
    DisplayController.userInfoDisplay(user1, user2, currentTurn);
    return true;
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
    currentTurn = 'X';
    DisplayController.userInfoDisplay(user1, user2, currentTurn);
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
    getScore,
    initializeUsers,
    restartGame
  };
})();

