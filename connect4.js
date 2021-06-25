/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH;
let HEIGHT;
let currPlayer = 1; // active player: 1 or 2
let board = [];
let gameIsOn;

const startBtn = document.getElementById("new-game");

// makeBoard: create in-JS board structure:
// board = array of rows, each row is array of cells  (board[y][x])

function makeBoard() {
  gameIsOn = true;
  WIDTH = +(document.getElementById("width").value);
  HEIGHT = +(document.getElementById("height").value);
  const boardArr = [];
  for (let y = 0; y < HEIGHT; y++) {
      const newRow = [];
      newRow.length = WIDTH;
      newRow.fill(null);
      boardArr[y] = newRow; 
    }
  return boardArr;
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {  

  const htmlBoard = document.querySelector('#board'); // create htmlBoard node
  htmlBoard.innerHTML = ''; // clear "an old" game HTML table
  const top = document.createElement("tr"); // create a node for top-row 

  top.setAttribute("id", "column-top"); // add attribute "id" with a value "column-top" to the top-row
  top.addEventListener("click", handleClick); // add event listener to the top-row

  for (let x = 0; x < WIDTH; x++) { // for each cell in the top-row: 
    const headCell = document.createElement("td"); // create a node for a table-cell  in the top-row
    headCell.setAttribute("id", x); // each cell receives an "id" with an index of this cell in a "top-row-array"
    headCell.innerHTML = "&DoubleDownArrow;";
    top.append(headCell); // each cell added as a "child" to a top-row 
  }
  htmlBoard.append(top); // top-row added as a child to the htmlBoard node

  for (let y = 0; y < HEIGHT; y++) { //for each cell in a column ...
    const row = document.createElement("tr"); // create a node for a next row in the game-table
    for (let x = 0; x < WIDTH; x++) { // for each cell in the row ...
      const cell = document.createElement("td"); // create a node for a table-cell  in the current row
      cell.setAttribute("id", `${y}-${x}`); // each cell in the row receives an "id" with a string value that contains x and y values: "y-x"  
      row.append(cell); // add each cell as a child to the current row 
    }
    htmlBoard.append(row); // after creating a row add a full row to the htmlBoard (game table) as a "child", and go to creating of the next row
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT-1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const pieceDiv = document.createElement('div'); 
  pieceDiv.classList.add('piece'); // add to a created div class "piece"
  pieceDiv.classList.add(`player${currPlayer}`); // add a class "player1" or player2"
  const cellYX = document.getElementById(`${y}-${x}`); // get a table-cell by id = 'y-x'
  cellYX.append(pieceDiv); // add a "piece" to the table-cell 
}

/** endGame: announce game end */

function endGame(msg) {
  gameIsOn = false;
  const endMessage = document.getElementById("end-of-game");
  endMessage.innerHTML = msg;
  endMessage.style.visibility = "visible";
  endMessage.style.zIndex = "2";
  endMessage.addEventListener("click", function() {
    endMessage.style.visibility = "hidden";
    endMessage.style.zIndex = "-1";
    endMessage.innerHTML = '';
  });
}

//function to check for tie
const checkForTie = () => board[0].every((x) => x!==null);

//function to switch players
function switchPlayers() {
  currPlayer = currPlayer === 1 ? 2 : 1; 
}

function handleClick(evt) {
  if (!gameIsOn) return;
      const x = +(evt.target.id); // get x from ID of clicked cell and convert into a number
      const y = findSpotForCol(x); // get next spot in column (if none, ignore click):
      if (y === null) {
        return;
      }

      placeInTable(y, x); // add the piece to HTML table
      board[y][x] = currPlayer; // place the piece in the board 

      if (checkForWin()) { // check for win
        return endGame(`&#128515;	Player ${currPlayer} won! &#128515;`);}

      if (checkForTie()) { // check if all cells in board are filled; if so call endGame
          return endGame("THE GAME IS OVER! <br> NO WINNERS THIS TIME 	&#128521;");
      } else {
        switchPlayers();
        } 

        
    }

function checkForWin() {
 
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(  //check if there are 4 cell in an array are within our board and with the same value (player)
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) { // for each row from top to  bottom:
    for (let x = 0; x < WIDTH; x++) {  // for each column from left to right: 
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];  // create an array with 4 cells in the same row from a current cell to the right 
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // create an array with 4 cells in the same column from a current cell to the bottom 
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];// create an array with 4 cells from a current cell diagonally to the right/bottom 
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];// create an array with 4 cells from a current cell diagonally to the left/bottom 

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { 
        return true;// return true if any 4 cells within the board by any direction have the same value
      }
    }
  }
}

function startNewGame(){
  // check UI input values for width and height
  const widthUI = document.getElementById("width");
  if (widthUI.value === "") {WIDTH = 7;} //if input incorrect, width = 7 by default
    else {WIDTH = widthUI.value;}
  const heightUI = document.getElementById("height");
  if (heightUI.value === "") {HEIGHT = 6;} //if input incorrect, height = 6 by default
    else {HEIGHT = heightUI.value;}
  board = makeBoard();
  makeHtmlBoard();
}

 
startBtn.addEventListener("click", function(e){
  startNewGame();
});



