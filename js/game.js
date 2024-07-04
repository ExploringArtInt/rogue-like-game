// game.js

import Player from "./player.js";
import {} from /* any utility functions you need */ "./utilities.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = {
  player: new Player(400, 300, 20, "blue"),
  keys: {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  },
};

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gameState.player.update(gameState.keys, canvas.width, canvas.height);
  gameState.player.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener("keydown", (event) => {
  if (gameState.keys.hasOwnProperty(event.key)) {
    gameState.keys[event.key] = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (gameState.keys.hasOwnProperty(event.key)) {
    gameState.keys[event.key] = false;
  }
});
