// game.js
import Player from "./player.js";
import Level from "./level.js";
import GUI from "./gui.js";
import GameState from "./gameState.js";

class Game {
  constructor() {
    this.gameState = new GameState(); // Initialize the game state

    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    // blows up here       ^
    this.backgroundColor = "#222222";
    this.playerColor = "#DDDDDD";
    this.blockColor = "#000000";

    this.setupCanvas();
    this.setupEventListeners();
    this.initializeGameObjects();

    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
    };

    this.isPaused = false;
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 80; // Subtract menu height
  }

  setupEventListeners() {
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("keyup", (event) => this.handleKeyUp(event));
  }

  handleKeyDown(event) {
    if (this.keys.hasOwnProperty(event.code) && !this.isPaused) {
      this.keys[event.code] = true;
    }
  }

  handleKeyUp(event) {
    if (this.keys.hasOwnProperty(event.code) && !this.isPaused) {
      this.keys[event.code] = false;
    }
  }

  initializeGameObjects() {
    const playerSize = Math.min(this.canvas.width * 0.1, this.canvas.height * 0.1);
    const blockSize = Math.min(this.canvas.width * 0.15, this.canvas.height * 0.15);

    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, playerSize, this.playerColor);

    this.level = new Level(this.blockColor, blockSize, this.canvas.width, this.canvas.height, this.gameState.currentSeed);

    this.gui = new GUI(this);
    this.gui.updateGameStateDisplay(this.gameState.currentLevel);
  }

  reinitializeGameObjects() {
    const playerSize = Math.min(this.canvas.width * 0.1, this.canvas.height * 0.1);
    const blockSize = Math.min(this.canvas.width * 0.15, this.canvas.height * 0.15);

    // Reinitialize player
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, playerSize, this.playerColor);

    // Reinitialize level
    this.level = new Level(this.blockColor, blockSize, this.canvas.width, this.canvas.height, this.gameState.currentSeed);

    // Update GUI
    this.gui.updateGameStateDisplay(this.gameState.currentLevel);
  }

  update() {
    if (!this.isPaused) {
      this.player.update(this.keys, this.canvas.width, this.canvas.height, this.level);
      this.level.update(this.player, this.gui);
      this.player.lateUpdate(this.keys, this.canvas.width, this.canvas.height, this.level);
    }
  }

  draw() {
    this.clearCanvas();
    this.level.draw(this.ctx);
    this.player.draw(this.ctx);
  }

  clearCanvas() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  gameLoop() {
    this.update();
    this.draw();

    // Check for victory or defeat
    if (this.gameState.isGameWon()) {
      this.gui.showMessage("Congratulations! You've won the game!");
      this.restartGame();
    } else if (this.gameState.isGameLost()) {
      this.gui.showMessage("Game Over! You've lost the game.");
      this.restartGame();
    } else {
      requestAnimationFrame(() => this.gameLoop()); // this is the loop
    }
  }

  start() {
    this.gameLoop();
  }

  restartGame() {
    this.gameState.reset();
    this.reinitializeGameObjects();
    this.gameLoop(); // Restart the game loop
  }

  setPaused(isPaused) {
    this.isPaused = isPaused;
    // Reset all key states when pausing/unpausing
    if (isPaused) {
      for (let key in this.keys) {
        this.keys[key] = false;
      }
    }
  }

  goToNextLevel() {
    this.gameState.incrementLevel();

    // Reset player position
    this.player.position.x = this.canvas.width / 2;
    this.player.position.y = this.canvas.height / 2;
    this.player.velocity = { x: 0, y: 0 };

    // Generate new level
    const blockSize = Math.min(this.canvas.width * 0.15, this.canvas.height * 0.15);
    this.level = new Level(this.blockColor, blockSize, this.canvas.width, this.canvas.height, this.gameState.currentSeed);

    // Update GUI to show new level number
    this.gui.updateGameStateDisplay(this.gameState.currentLevel);

    console.log(`Entered level ${this.gameState.currentLevel}`);
  }
}

// Create and start the game
const game = new Game();
game.start();
