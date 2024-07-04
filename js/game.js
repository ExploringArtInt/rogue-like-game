// Get the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let gameState = {
  player: {
    x: 400,
    y: 300,
    size: 20,
    color: "#0077FF",
  },
};

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  ctx.fillStyle = gameState.player.color;
  ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.size, gameState.player.size);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  const key = event.key;
  const speed = 5;

  switch (key) {
    case "ArrowUp":
      gameState.player.y -= speed;
      break;
    case "ArrowDown":
      gameState.player.y += speed;
      break;
    case "ArrowLeft":
      gameState.player.x -= speed;
      break;
    case "ArrowRight":
      gameState.player.x += speed;
      break;
  }
});
