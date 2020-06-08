const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class Board {
  constructor() {
    this.init();
  }

  /* 
  * Initalizes game
  */
  init() {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.clearBoard();
    this.drawGrid();
  }

  /* 
  * Clears board
  */
  clearBoard() {
    this.red = true; 
    this.numTiles = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* 
  * Draws circle at (xPos, yPos) on canvas. If redTrue is true the color of the circle is red.
  * If redTrue is false the circle will be black, 
  */
  drawBall(xPos, yPos, redTrue) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, canvas.height / 8, 0, Math.PI*2, false);
    if (redTrue) {
        ctx.fillStyle = "red";
    } else {
        ctx.fillStyle = "black";
    }
    ctx.fill();
    ctx.closePath();
  }

  /* 
  * Draws lines that make up grid of tic tac toe board. 
  */  
  drawGrid() {
    // draws vertical lines in tic tac toe board
    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, 0);
    ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(2 * canvas.width / 3, 0);
    ctx.lineTo(2 * canvas.width / 3, canvas.height);
    ctx.stroke();

    // draws horizontal lines in tic tac toe board
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 3);
    ctx.lineTo(canvas.width, canvas.height / 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 2 * canvas.height / 3);
    ctx.lineTo(canvas.width, 2 * canvas.height / 3);
    ctx.stroke();
  }

  /*
  * Updates game every time user clicks. Updates game states - checks if game is over
  * and redraws board. 
  */
  updateFrame(xPos, yPos) {
    // clear old frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.updateGameArray(xPos, yPos);
    this.drawGrid();
    this.drawBoard();
    this.checkBoardFull(); 
  }

  /*
  * Uses xPos and yPos to check what element in array should be updated. And fills board array with 1 or
  * 2 depending on color - 1 = red 2 = black
  */
  updateGameArray(xPos, yPos) {
    let col = 0;
    let row = 0; 

    // finds col clicked
    if (xPos < canvas.width / 3) {
      col = 0;
    } else if (xPos < 2 * canvas.width / 3) {
      col = 1;
    } else {
      col = 2;
    }

    // finds row clicked
    if (yPos < canvas.height / 3) {
      row = 0;
    } else if (yPos < 2 * canvas.height / 3) {
      row = 1;
    } else {
      row = 2;
    }

    // can't place a tile over existing tile
    if (this.board[row][col] == 0) {
      if (this.redTrue) {
        this.board[row][col] = 1;
      } else {
        this.board[row][col] = 2;
      }
      this.numTiles++;
      this.checkGameState();
      this.redTrue = !this.redTrue;
    } else {
        alert("Cannot place tile there. Try again.");
    }
  }
  
  /*
  * Shows win message
  */ 
  showWinMessage() {
    if (this.redTrue) {
      if (confirm("Win for red! Play again?")) {
            this.init();
      }
    } else {
      if (confirm("Win for black! Play again?")) {
            this.init();
      }
    }  
  }

  /* 
  * Checks if there is a win from rows
  */
  checkRowWin(player) {
    for (let i = 0; i < this.board.length; i++) {
      let rowWin = true;
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== player) {
          rowWin = false;
          break;
        }
      }
      if (rowWin) {
        return true;
      }
    } 
    return false; 
  }

  /* 
  * Checks if there is a win from col
  */
  checkColWin(player) {
    // check cols 
    for (let j = 0; j < this.board[0].length; j++) {
      let colWin = true;
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i][j] !== player) {
          colWin = false;
          break;
        }   
      }
      if (colWin) {
        return true;
      }
    }
    return false;
  }

  /* 
  * Checks if there is a win from down diaganol
  */
  checkDiagDownWin(player) {
    for (let i = 0; i < this.board.length; i++) {
        if (this.board[i].length !== this.board.length) {
            console.log("Error board not square");
            return false;
        }
        if (this.board[i][i] !== player) {
            return false;
        }
    }
    return true; 
  }

  /* 
  * Checks if there is a win from up diaganol
  */
  checkDiagUpWin(player) {
    let j = 0;
    for (let i = this.board.length - 1; i > -1; i--) {
        if (this.board[i].length !== this.board.length) {
            console.log("Error board not square");
            return false;
        }
        if (this.board[i][j] !== player) {
            return false;
        }
        j++;
    }
    return true;
  }

  /*
  * Checks whether move made by redTrue player resulted in win or if game board is full.
  * Sends alert with win message or gameOver message if board is full and allows user to
  * restart game.  
  */
  checkGameState() {
    let player = 0;
    if (this.redTrue) {
      player = 1; 
    } else {
        player = 2;
    }

    // check for win and display win message if true 
    if (this.checkRowWin(player) || this.checkColWin(player) || this.checkDiagDownWin(player) || this.checkDiagUpWin(player)) {
      this.showWinMessage();
    }
  }


  /*
  * Checks if game board is full and sents gameOver message
  */
  checkBoardFull() {
    if (this.numTiles == this.board.length * this.board[0].length) {
        if (confirm("Game over! Play again?")) {
            this.init();
        }
    }
  }

  /* 
  * Iterates through game board and draws checker if element is not 0.
  * Multiplier vars used to place checkers at 1/6, 3/6, or 5/6 of the width
  * or height of the canvas
  */ 
  drawBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] != 0) { 
          let xMultiplier = 0;
          let yMultiplier = 0;
          if (i == 0) {
            xMultiplier = 1;
          } else if (i == 1) {
            xMultiplier = 3;
          } else {
            xMultiplier = 5;
          }
          if (j == 0) {
            yMultiplier = 1;
          } else if (j == 1) {
            yMultiplier = 3;
          } else {
            yMultiplier = 5;
          }
          
          // draw checker
          if (this.board[i][j] == 1) { 
            this.drawBall(yMultiplier * canvas.width / 6, xMultiplier * canvas.height / 6, true);
          } else {
            this.drawBall(yMultiplier * canvas.width / 6, xMultiplier * canvas.height / 6, false);
          }
        }
      }
    }
  }
}

// create board object for game
const gameBoard = new Board();

/*
* Updates the x and y vars to reflect curr mouse position on the canvas
*/
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const xPos = (e.clientX - rect.left) * (canvas.width / rect.width);
  const yPos = (e.clientY - rect.top) * (canvas.height / rect.height);
  gameBoard.updateFrame(xPos, yPos);
});

