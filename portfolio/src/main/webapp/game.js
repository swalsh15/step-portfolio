var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var xPos = canvas.width / 2;
var yPos = canvas.height / 2; 

/* 2D array that stores current board state
* 0 = empty, 1 = red, 2 = black
*/
var board = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

function drawBall() {
  ctx.beginPath();
  ctx.arc(xPos, yPos, canvas.height / 8, 0, Math.PI*2, false);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function drawGrid() {
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

function updateFrame() {
    // clear old frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawGrid();
}


/*
* Updates the x and y vars to reflect curr mouse position on the canvas
*/
canvas.addEventListener('mousedown', e => {
  var rect = canvas.getBoundingClientRect();
  xPos = (e.clientX - rect.left) * (canvas.width / rect.width);
  yPos = (e.clientY - rect.top) * (canvas.height / rect.height);
});

// update frame every 10 ms
setInterval(updateFrame, 10);