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
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Update the position of the accessible menu
    if (this.gui && this.gui.menuContainer) {
      this.gui.menuContainer.style.bottom = "0";
      this.gui.menuContainer.style.width = `${this.canvas.width}px`;
    }
  }

  setupEventListeners() {
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("keyup", (event) => this.handleKeyUp(event));
  }

  handleKeyDown(event) {
    if (this.keys.hasOwnProperty(event.code)) {
      this.keys[event.code] = true;
    }
  }

  handleKeyUp(event) {
    if (this.keys.hasOwnProperty(event.code)) {
      this.keys[event.code] = false;
    }
  }

  initializeGameObjects() {
    const playerSize = Math.min(this.canvas.width * 0.1, this.canvas.height * 0.1);
    const blockSize = Math.min(this.canvas.width * 0.15, this.canvas.height * 0.15);

    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, playerSize, this.playerColor);
    this.level = new Level(this.blockColor, blockSize, this.canvas.width, this.canvas.height);
    this.gui = new GUI(this);
  }

  update() {
    this.player.update(this.keys, this.canvas.width, this.canvas.height, this.level);
    this.level.update(this.player);
    this.player.lateUpdate(this.keys, this.canvas.width, this.canvas.height, this.level);
  }

  draw() {
    this.clearCanvas();
    this.player.draw(this.ctx);
    this.level.draw(this.ctx);
    this.gui.draw();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
}

// Create and start the game
const game = new Game();
game.start();
