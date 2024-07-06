// game.js
import Player from "./player.js";
import Level from "./level.js";
import GUI from "./gui.js";

class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.backgroundColor = "#222222";
    this.playerColor = "#DDDDDD";
    this.blockColor = "#000000";

    this.currentLevelNumber = 1; // Initialize the level number

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

    const levelSeed = this.currentLevelNumber * 1000 + Date.now();
    this.level = new Level(this.blockColor, blockSize, this.canvas.width, this.canvas.height, levelSeed);

    this.gui = new GUI(this);
    this.gui.updateLevelDisplay(this.currentLevelNumber); // Update the level display
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
    requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    this.gameLoop();
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
    this.currentLevelNumber++;
    const levelSeed = this.currentLevelNumber * 1000 + Date.now();

    // Reset player position
    this.player.position.x = this.canvas.width / 2;
    this.player.position.y = this.canvas.height / 2;
    this.player.velocity = { x: 0, y: 0 };

    // Generate new level
    const blockSize = Math.min(this.canvas.width * 0.15, this.canvas.height * 0.15);
    this.level = new Level(this.blockColor, blockSize, this.canvas.width, this.canvas.height, levelSeed);

    // Update GUI to show new level number
    this.gui.updateLevelDisplay(this.currentLevelNumber);

    console.log(`Entered level ${this.currentLevelNumber}`);
  }
}

// Create and start the game
const game = new Game();
game.start();
