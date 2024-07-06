// gui.js
import { loadSVG } from "./svg.js";

export default class GUI {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.ctx = game.ctx;
    this.menuOptions = [
      { icon: "gui-hamburger.svg", screen: "Game" },
      { icon: "gui-battery-100.svg", screen: "Battery" },
      { icon: "gui-plain-circle.svg", screen: "Shield" },
      { icon: "gui-auto-repair.svg", screen: "Repair" },
    ];
    this.menuHeight = 80;
    this.iconSize = 40;
    this.menuBackgroundColor = "rgba(0, 0, 0, 0.5)";
    this.menuHighlightColor = "rgba(255, 255, 255, 0.2)";
    this.lineColor = "rgba(128, 128, 128, 0.5)";
    this.textColor = "white";
    this.activeScreen = null;
    this.hoveredOption = null;
    this.icons = {};

    this.loadIcons();
    this.setupEventListeners();
  }

  loadIcons() {
    this.menuOptions.forEach((option) => {
      loadSVG(`./assets/svg/gui/${option.icon}`, "white")
        .then((image) => {
          this.icons[option.icon] = image;
        })
        .catch((error) => console.error(`Error loading icon ${option.icon}:`, error));
    });

    loadSVG("./assets/svg/gui/gui-cancel.svg", "white")
      .then((image) => {
        this.icons["gui-cancel.svg"] = image;
      })
      .catch((error) => console.error("Error loading cancel icon:", error));
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (event) => this.handleMouseMove(event));
    this.canvas.addEventListener("click", (event) => this.handleClick(event));
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (y > this.canvas.height - this.menuHeight) {
      const optionWidth = this.canvas.width / this.menuOptions.length;
      this.hoveredOption = Math.floor(x / optionWidth);
    } else {
      this.hoveredOption = null;
    }
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (y > this.canvas.height - this.menuHeight) {
      const optionWidth = this.canvas.width / this.menuOptions.length;
      const clickedOption = Math.floor(x / optionWidth);
      this.activeScreen = this.menuOptions[clickedOption].screen;
    } else if (this.activeScreen) {
      const cancelIconSize = 30;
      const padding = 10;
      if (x > this.canvas.width - cancelIconSize - padding && y < cancelIconSize + padding) {
        this.activeScreen = null;
      }
    }
  }

  draw() {
    this.drawMenu();
    if (this.activeScreen) {
      this.drawScreen();
    }
  }

  drawMenu() {
    const ctx = this.ctx;
    const optionWidth = this.canvas.width / this.menuOptions.length;

    // Draw menu background
    ctx.fillStyle = this.menuBackgroundColor;
    ctx.fillRect(0, this.canvas.height - this.menuHeight, this.canvas.width, this.menuHeight);

    // Draw options
    this.menuOptions.forEach((option, index) => {
      const x = index * optionWidth;
      const y = this.canvas.height - this.menuHeight;

      // Draw highlight if hovered
      if (index === this.hoveredOption) {
        ctx.fillStyle = this.menuHighlightColor;
        ctx.fillRect(x, y, optionWidth, this.menuHeight);
      }

      // Draw icon
      if (this.icons[option.icon]) {
        const iconX = x + (optionWidth - this.iconSize) / 2;
        const iconY = y + (this.menuHeight - this.iconSize) / 2;
        ctx.drawImage(this.icons[option.icon], iconX, iconY, this.iconSize, this.iconSize);
      }

      // Draw separator lines
      ctx.strokeStyle = this.lineColor;
      ctx.beginPath();
      if (index > 0) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, this.canvas.height);
      }
      ctx.stroke();
    });

    // Draw top line
    ctx.beginPath();
    ctx.moveTo(0, this.canvas.height - this.menuHeight);
    ctx.lineTo(this.canvas.width, this.canvas.height - this.menuHeight);
    ctx.stroke();
  }

  drawScreen() {
    const ctx = this.ctx;
    const padding = 20;
    const screenWidth = this.canvas.width - padding * 2;
    const screenHeight = this.canvas.height - this.menuHeight - padding * 2;

    // Draw screen background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(padding, padding, screenWidth, screenHeight);

    // Draw screen title
    ctx.font = "24px Arial";
    ctx.fillStyle = this.textColor;
    ctx.textAlign = "center";
    ctx.fillText(`${this.activeScreen} Screen`, this.canvas.width / 2, padding * 2);

    // Draw cancel icon
    if (this.icons["gui-cancel.svg"]) {
      const cancelIconSize = 30;
      ctx.drawImage(this.icons["gui-cancel.svg"], this.canvas.width - cancelIconSize - padding, padding, cancelIconSize, cancelIconSize);
    }
  }
}
