// gui.js
import { loadSVG } from "./svg.js";

export default class GUI {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.ctx = game.ctx;
    this.menuOptions = [
      { icon: "gui-hamburger.svg", screen: "Game", label: "Open Game Menu" },
      { icon: "gui-battery-100.svg", screen: "Battery", label: "Open Battery Menu" },
      { icon: "gui-plain-circle.svg", screen: "Shield", label: "Open Shield Menu" },
      { icon: "gui-auto-repair.svg", screen: "Repair", label: "Open Repair Menu" },
    ];
    this.menuHeight = 80;
    this.iconSize = 40;
    this.menuBackgroundColor = "rgba(0, 0, 0, 0.5)";
    this.menuHighlightColor = "rgba(255, 255, 255, 0.3)";
    this.lineColor = "rgba(255, 255, 255, 0.8)";
    this.textColor = "white";
    this.activeScreen = null;
    this.hoveredOption = null;
    this.focusedOption = null;
    this.icons = {};

    this.loadIcons();
    this.setupEventListeners();
    this.createAccessibleMenu();
  }

  loadIcons() {
    this.menuOptions.forEach((option) => {
      loadSVG(`./assets/svg/gui/${option.icon}`, "#FFFFFF")
        .then((image) => {
          this.icons[option.icon] = image;
        })
        .catch((error) => console.error(`Error loading icon ${option.icon}:`, error));
    });

    loadSVG("./assets/svg/gui/gui-cancel.svg", "#FFFFFF")
      .then((image) => {
        this.icons["gui-cancel.svg"] = image;
      })
      .catch((error) => console.error("Error loading cancel icon:", error));
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (event) => this.handleMouseMove(event));
    this.canvas.addEventListener("click", (event) => this.handleClick(event));
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
  }

  createAccessibleMenu() {
    const menuContainer = document.createElement("div");
    menuContainer.setAttribute("role", "menu");
    menuContainer.setAttribute("aria-label", "Game menu");
    menuContainer.style.position = "absolute";
    menuContainer.style.bottom = "0";
    menuContainer.style.left = "0";
    menuContainer.style.width = "100%";
    menuContainer.style.height = `${this.menuHeight}px`;
    menuContainer.style.display = "flex";
    menuContainer.style.backgroundColor = "transparent";

    this.menuOptions.forEach((option, index) => {
      const button = document.createElement("button");
      button.setAttribute("role", "menuitem");
      button.setAttribute("aria-label", option.label);
      button.style.flex = "1";
      button.style.border = "none";
      button.style.background = "none";
      button.style.cursor = "pointer";
      button.style.outline = "none";

      button.addEventListener("focus", () => {
        this.focusedOption = index;
        this.draw();
      });

      button.addEventListener("blur", () => {
        this.focusedOption = null;
        this.draw();
      });

      button.addEventListener("click", () => {
        this.activeScreen = option.screen;
        this.draw();
      });

      menuContainer.appendChild(button);
    });

    document.body.appendChild(menuContainer);
    this.menuContainer = menuContainer;
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
    this.draw();
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
    this.draw();
  }

  handleKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      if (event.shiftKey) {
        this.focusedOption = (this.focusedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
      } else {
        this.focusedOption = (this.focusedOption + 1) % this.menuOptions.length;
      }
      this.menuContainer.children[this.focusedOption].focus();
    } else if (event.key === "Enter" || event.key === " ") {
      if (this.focusedOption !== null) {
        this.activeScreen = this.menuOptions[this.focusedOption].screen;
      } else if (this.activeScreen) {
        this.activeScreen = null;
      }
      this.draw();
    } else if (event.key === "Escape" && this.activeScreen) {
      this.activeScreen = null;
      this.draw();
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

    // Clear the menu area
    ctx.clearRect(0, this.canvas.height - this.menuHeight, this.canvas.width, this.menuHeight);

    // Draw menu background
    ctx.fillStyle = this.menuBackgroundColor;
    ctx.fillRect(0, this.canvas.height - this.menuHeight, this.canvas.width, this.menuHeight);

    // Draw options
    this.menuOptions.forEach((option, index) => {
      const x = index * optionWidth;
      const y = this.canvas.height - this.menuHeight;

      // Draw highlight if hovered or focused
      if (index === this.hoveredOption || index === this.focusedOption) {
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
      ctx.lineWidth = 2;
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
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
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

    // Draw cancel button label
    ctx.font = "14px Arial";
    ctx.fillStyle = this.textColor;
    ctx.textAlign = "right";
    ctx.fillText("Close (Esc)", this.canvas.width - padding, padding * 2 + 15);
  }
}
