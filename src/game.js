import Player from "./player.js";
import Level from "./level.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundColor = "#222222";
const playerColor = "#DDDDDD";
const blockColor = "#000000";

// Responsive canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create the player
const playerSize = Math.min(canvas.width * 0.1, canvas.height * 0.1);
const blockSize = Math.min(canvas.width * 0.15, canvas.height * 0.15);
const player = new Player(canvas.width / 2, canvas.height / 2, playerSize, playerColor);

// Create the level
const level = new Level(blockColor, blockSize, canvas.width, canvas.height);

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
};

document.addEventListener("keydown", (event) => {
  if (keys.hasOwnProperty(event.code)) {
    keys[event.code] = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (keys.hasOwnProperty(event.code)) {
    keys[event.code] = false;
  }
});

function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update player
  player.update(keys, canvas.width, canvas.height, level);

  // Draw the level
  level.draw(ctx);

  // Draw player
  player.draw(ctx);

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
