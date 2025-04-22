const cells  = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartButton = document.querySelector("#restartButton");
let winningCombo = [];
const box = document.getElementById('hideTitle');

box.addEventListener('mouseenter', () => {
  box.classList.add('hovered');
});

// imaginaryTACTOE
// [0,1,2]
// [3,4,5]
// [6,7,8]

const winning = [
    //ROW WINS
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //COL WINS
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //DIAGIONAL WIN
    [0,4,8],
    [6,4,2]
];

let options = [ "", "", "", "", "", "", "", "", "" ]
let currentPlayer = "X"
let running = false;

/**
 * RUNS THE GAME
 */
initalizeGame();

function initalizeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartButton.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn!`;
    running = true
}
/**
 * Player clicks change based on move.
 * 
 *- If the game is running and has empty space than updates cell and checks winner.
 *-Otherwise, if player clicks on a current space than it's an invalid move, and is highlighted red.
 */
function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if (!running) return;
    if (options[cellIndex] !== "") {
        //HIGHLIGHT THE SHAME
        this.classList.add("invalid");
        statusText.innerHTML = `Invalid move!<br> ${currentPlayer} LOST!!`;
        running = false;
        revealBoard();
        return;
    }
    updateCell(this, cellIndex);
    checkWinner();
}

/**
 * Updates  game state by assigning the current player's symbol (X or O)
 * to the specified index in the board options array.
 *
 * @param {HTMLElement} cell - The DOM element representing the clicked cell.
 * @param {number} index - The index of the cell in the board (0–8).
 */
function updateCell(cell, index) {
    options[index] = currentPlayer;
    // cell.textContent = currentPlayer;
}


/**
 * Reveals the full game board at the end of the game.
 * 
 * -If a winning combination exists, it also highlights those cells green.
 */
function revealBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = options[index];

        if (winningCombo.includes(index)) {
            cell.classList.add("win");
        }
    });
}


/**
 * Switches players at end of each turn.
 */
function switchPlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn!`;
}

/**
 * Checks the current game state to determine if there is a winner or if the game is a draw.
 * 
 * - If a winning combination is found, sets the game to a "won" state, updates status text,
 *   stores the winning combo, and reveals the board.
 * - If no empty spaces remain and no winner, declares a draw.
 * - Otherwise, switches to the next player.
 */
function checkWinner() {
    let roundWin = false;

    for (let i = 0; i < winning.length; i++) {
        const [a, b, c] = winning[i];
        const cellA = options[a];
        const cellB = options[b];
        const cellC = options[c];

        if (cellA === "" || cellB === "" || cellC === "") continue;

        if (cellA === cellB && cellB === cellC) {
            roundWin = true;
            winningCombo = [a, b, c]; 
            break;
        }
    }

    if (roundWin) {
        statusText.textContent = `${currentPlayer} WON!!`;
        running = false;
        revealBoard();

    } else if (!options.includes("")) {
        statusText.textContent = `DRAW!!`;
        running = false;
        revealBoard();
    } else {
        switchPlayer();
    }
}


/**
 * Resets the game to its original start.
 * 
 * - Clears the board (options, winning combo, status).
 * - Removes any highlights from previous rounds.
 * - Sets the game back to running.
 */
function restartGame(){
    currentPlayer = "X";
    options = [ "", "", "", "", "", "", "", "", "" ];
    winningCombo = [];
    statusText.textContent = `${currentPlayer}'s turn!`;

    cells.forEach(cell => {
        cell.textContent = ""
        cell.classList.remove("win");
        cell.classList.remove("invalid");
    });

    running = true;
}