var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

class Board {
  constructor() {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.drawGrid();
    var red = true; 
  }

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

  updateFrame(xPos, yPos) {
    // clear old frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.determineSquare(xPos, yPos);
    this.drawBoard();
    this.drawGrid();
  }

  determineSquare(xPos, yPos) {
    var col = 0;
    var row = 0; 

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
      this.redTrue = !this.redTrue;
    }
  }

  drawBoard() {
    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] != 0) { 
          var xMultiplier = 0;
          var yMultiplier = 0;
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
var gameBoard = new Board();

/*
* Updates the x and y vars to reflect curr mouse position on the canvas
*/
canvas.addEventListener('mousedown', e => {
  var rect = canvas.getBoundingClientRect();
  var xPos = (e.clientX - rect.left) * (canvas.width / rect.width);
  var yPos = (e.clientY - rect.top) * (canvas.height / rect.height);
  gameBoard.updateFrame(xPos, yPos);
});

