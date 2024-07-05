import { MathUtils, Vector, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Player {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocityX = 0;
    this.velocityY = 0;
    this.acceleration = 0.1;
    this.maxSpeed = size * 0.4;
    this.friction = 0.85;
    this.svgImage = null;
    this.loadPlayerSVG();
  }

  loadPlayerSVG() {
    loadSVG("./assets/svg/player.svg", this.color)
      .then((image) => {
        this.svgImage = image;
      })
      .catch((error) => console.error("Error loading SVG:", error));
  }

  update(keys, canvasWidth, canvasHeight, level) {
    let desiredVelocity = { x: 0, y: 0 };

    // Check for both arrow keys and WASD
    if (keys.ArrowLeft || keys.KeyA) desiredVelocity.x -= 1;
    if (keys.ArrowRight || keys.KeyD) desiredVelocity.x += 1;
    if (keys.ArrowUp || keys.KeyW) desiredVelocity.y -= 1;
    if (keys.ArrowDown || keys.KeyS) desiredVelocity.y += 1;

    if (desiredVelocity.x !== 0 || desiredVelocity.y !== 0) {
      desiredVelocity = Vector.normalize(desiredVelocity);
      desiredVelocity = Vector.multiply(desiredVelocity, this.maxSpeed);

      let deltaVelocity = Vector.subtract(desiredVelocity, { x: this.velocityX, y: this.velocityY });

      let t = MathUtils.bezierBlend(this.acceleration);
      this.velocityX += deltaVelocity.x * t;
      this.velocityY += deltaVelocity.y * t;
    } else {
      // Apply friction when no keys are pressed
      this.velocityX *= this.friction;
      this.velocityY *= this.friction;
    }

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Keep player within canvas bounds and avoid colliding with blocks
    this.x = MathUtils.clamp(this.x, this.size / 2, canvasWidth - this.size / 2);
    this.y = MathUtils.clamp(this.y, this.size / 2, canvasHeight - this.size / 2);

    level.checkCollisions(this);
  }

  draw(ctx) {
    if (this.svgImage && this.svgImage.complete) {
      ctx.drawImage(this.svgImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
  }
}
