// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timer; // Holds the interval for the countdown timer
let timeLeft = 30; // Initial time in seconds

const winningMessages = [
  "Great job! You're a water-saving hero!",
  "Amazing! You collected all the cans!",
  "Fantastic! You completed the challenge!"
];

const losingMessages = [
  "Good effort! Try again to save more water!",
  "Almost there! Give it another shot!",
  "Keep going! You'll get it next time!"
];

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;

  // Add click event listener to the water can
  const waterCan = randomCell.querySelector('.water-can');
  if (waterCan) {
    waterCan.addEventListener('click', () => {
      if (!gameActive) return; // Ignore clicks if the game is not active
      currentCans++; // Increment the score
      document.getElementById('current-cans').textContent = currentCans; // Update the score display
      waterCan.parentElement.remove(); // Remove the water can from the page
    });
  }
}

// Updates the timer display and ends the game when time runs out
function updateTimer() {
  if (timeLeft <= 0) {
    endGame(); // End the game when the timer reaches 0
    return; // Ensure no further code in this function runs
  }
  timeLeft--; // Decrement the time left
  document.getElementById('timer').textContent = timeLeft; // Update the timer display
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  timeLeft = 30; // Reset the timer
  document.getElementById('timer').textContent = timeLeft; // Update the timer display
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
  timer = setInterval(updateTimer, 1000); // Start the countdown timer

  // Disable the start button and update its text
  const startButton = document.getElementById('start-game');
  startButton.disabled = true;
  startButton.textContent = 'Game in Progress...';
}

function displayEndMessage() {
  const messageContainer = document.getElementById('achievements');
  messageContainer.innerHTML = ''; // Clear any existing messages

  let message;
  if (currentCans >= 20) {
    // Player wins
    message = winningMessages[Math.floor(Math.random() * winningMessages.length)];
    triggerConfetti(); // Trigger confetti effect
  } else {
    // Player loses
    message = losingMessages[Math.floor(Math.random() * losingMessages.length)];
  }

  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.style.textAlign = 'center';
  messageElement.style.fontSize = '20px';
  messageElement.style.fontWeight = 'bold';
  messageElement.style.color = currentCans >= 20 ? '#4FCB53' : '#F5402C'; // Green for win, red for lose
  messageContainer.appendChild(messageElement);
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.5 }
  });
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timer); // Stop the countdown timer

  // Clear the game grid to ensure no cans are displayed
  document.querySelector('.game-grid').innerHTML = '';

  displayEndMessage(); // Show the end game message
  alert('Time is up! Game over.'); // Display the alert after clearing the grid

  // Delay the reset to allow the player to see the end-game message
  setTimeout(resetGame, 2000); // Reset the game after 2 seconds
}

function resetGame() {
  gameActive = false; // Stop the game
  clearInterval(spawnInterval); // Clear the spawn interval
  clearInterval(timer); // Clear the timer interval
  currentCans = 0; // Reset the score
  timeLeft = 30; // Reset the timer
  document.getElementById('current-cans').textContent = currentCans; // Update the score display
  document.getElementById('timer').textContent = timeLeft; // Update the timer display
  document.querySelector('.game-grid').innerHTML = ''; // Clear the game grid
  document.getElementById('achievements').innerHTML = ''; // Clear any end-game messages

  // Enable the start button and reset its text
  const startButton = document.getElementById('start-game');
  startButton.disabled = false;
  startButton.textContent = 'Start Game';
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);

// Set up click handler for the reset button
document.getElementById('reset-game').addEventListener('click', resetGame);
