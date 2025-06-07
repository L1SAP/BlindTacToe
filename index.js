/**
 * Blind Tac Toe Game Logic
 * 
 * Handles:
 * - Board state and updates
 * - Countdown timer per turn
 * - Player switching and win conditions
 * - UI animation and status updates
 * - Start and restart functionality
 */

/**
 * represent cell
 */
const cells  = document.querySelectorAll(".cell");

const gameBoard = document.getElementById("gameBoard");

/**
 * Game status message display
 * -Moves
 * -Invalid
 */
const statusText = document.querySelector("#statusText");
/**
 * restart button
 */
const restartButton = document.querySelector("#restartButton");
/**
 * Winning combo tracker
 */
let winningCombo = [];
/**
 * variable for animation for BLIND TAC TOE title
 */
const box = document.getElementById('hideTitle');
/**
 * Grab start button 
 */
const startButton = document.getElementById("startButton");

/**
 * Grab timer content
 */
const timerContent = document.getElementById("timerContent");

let timerId = null;
let countdown = 3; 

/**
 * Valid spaces in game board
 */
let options = [ "", "", "", "", "", "", "", "", "" ];

/**
 * Ensure first player is X
 */
let currentPlayer = "X";

/**
 * Boolean determine game is running or ended.
 */
let running = false;

/**
 * Starts a 3-second countdown
 */
function startCountdown() {
    clearInterval(timerId);
    countdown = 3;

    document.getElementById("timer").style.color = "white";
    document.getElementById("timer").textContent = countdown;

    timerId = setInterval(() => {
        countdown--;
        document.getElementById("timer").textContent = countdown;

        if(countdown ==1){
            document.getElementById("timer").style.color = "red";
        }

        if (countdown <= 0) {
            clearInterval(timerId);
            timerId = null;
            timerContent.style.display = "none";
            statusText.textContent = `Time's up! ${currentPlayer} LOST!!`;
          
            running = false;
            revealBoard();
        }
    }, 1000);
}

/**
 * Starts the game when Start button is clicked
 */
function startGame() {
    startButton.style.display = "none";
    timerContent.style.display = "block";
    gameBoard.style.display = "grid";
    startCountdown();
    initalizeGame(); 
}

/**
 * Initialize game event listeners
 */
window.onload = () => {
    document.querySelector("#startButton button").addEventListener("click", startGame);
    cells.forEach(cell => {
        cell.addEventListener("click", cellClicked);
        cell.addEventListener("click", animateClick);
        cell.addEventListener("animationend", removeClickAnimation);
    });
};

function animateClick(e){
    if(!running) return;
    e.currentTarget.classList.add('clicked');
}

function removeClickAnimation(e){
    e.currentTarget.classList.remove('clicked');
}

box.addEventListener("mouseenter", () => {
    box.classList.add("hovered");
});

/**
 * Winning combinations
 */
const winning = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [6, 4, 2]
];

/**
 * Run the game
 */
function initalizeGame() {
    restartButton.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn!`;
    running = true;
}

initalizeGame();

/**
 * Player clicks change based on move.
 * 
 *- If the game is running and has empty space than updates cell and checks winner.
 *-Otherwise, if player clicks on a current space than it's an invalid move, and is highlighted red.
 */
function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (!running) return;

    if (options[cellIndex] !== "") {
        this.classList.add("invalid");
        statusText.innerHTML = `Invalid move!<br> ${currentPlayer} LOST!!`;
        running = false;
        revealBoard();
        clearInterval(timerId);
        timerContent.style.display = "none";
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    if (running) {
        startCountdown(); 
    }
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

// /**
//  * Switches players at end of each turn.
//  */
function switchPlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
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
        if (options[a] && options[a] === options[b] && options[a] === options[c]) {
            roundWin = true;
            winningCombo = [a, b, c];
            break;
        }
    }

    if (roundWin) {
        statusText.textContent = `${currentPlayer} WON!!`;
        running = false;
        clearInterval(timerId);
        revealBoard();

    } else if (!options.includes("")) {
        statusText.textContent = `DRAW!!`;
        running = false;
        clearInterval(timerId);
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
function restartGame() {
    currentPlayer = "X";
    options = [ "", "", "", "", "", "", "", "", "" ];
    winningCombo = [];
    statusText.textContent = "";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("win", "invalid");
    });

    clearInterval(timerId);
    timerId = null;
    countdown = 3;
    document.getElementById("timer").textContent = countdown;
    gameBoard.style.display = "none";
    timerContent.style.display = "none";
    startButton.style.display = "block";
    running = false;
}