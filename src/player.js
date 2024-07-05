import { MathUtils, Vector, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Player {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.prevX = this.x;
    this.prevY = this.y;
    this.size = size;
    this.color = color;
    this.velocityX = 0;
    this.velocityY = 0;
    this.acceleration = 0.1;
    this.maxSpeed = size * 0.4;
    this.friction = 0.85;
    this.mass = size * size; // Mass proportional to size
    this.svgImage = null;
    this.loadPlayerSVG();
  }

  getRect() {
    return {
      x: this.x - this.size / 2,
      y: this.y - this.size / 2,
      width: this.size,
      height: this.size,
    };
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

    // store location for late update
    this.prevX = this.x;
    this.prevY = this.y;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Keep player within canvas bounds
    this.x = MathUtils.clamp(this.x, this.size / 2, canvasWidth - this.size / 2);
    this.y = MathUtils.clamp(this.y, this.size / 2, canvasHeight - this.size / 2);
  }

  lateUpdate(keys, canvasWidth, canvasHeight, level) {
    // Check collisions with blocks
    this.handleBlockCollisions(level.blocks, this.prevX, this.prevY);
  }

  handleBlockCollisions(blocks, prevX, prevY) {
    const playerRect = this.getRect();
    let collided = false;

    for (const block of blocks) {
      const blockRect = block.getRect();
      if (Collision.rectIntersect(playerRect, blockRect)) {
        collided = true;
        this.resolveThisCollision(block, prevX, prevY);
      }
    }

    if (collided) {
      // Update velocity after collision resolution
      this.velocityX = this.x - prevX;
      this.velocityY = this.y - prevY;
    }
  }

  resolveThisCollision(block, prevX, prevY) {
    const playerRect = this.getRect();
    const blockRect = block.getRect();

    // Calculate overlap on each axis
    const overlapX = Math.min(Math.abs(playerRect.x + playerRect.width - blockRect.x), Math.abs(blockRect.x + blockRect.width - playerRect.x));
    const overlapY = Math.min(Math.abs(playerRect.y + playerRect.height - blockRect.y), Math.abs(blockRect.y + blockRect.height - playerRect.y));

    // Determine which axis has the smaller overlap
    if (overlapX < overlapY) {
      // Collision on X-axis
      if (this.x < block.x) {
        this.x = block.x - this.size / 2;
      } else {
        this.x = block.x + block.size + this.size / 2;
      }
    } else {
      // Collision on Y-axis
      if (this.y < block.y) {
        this.y = block.y - this.size / 2;
      } else {
        this.y = block.y + block.size + this.size / 2;
      }
    }
  }

  draw(ctx) {
    if (this.svgImage && this.svgImage.complete) {
      ctx.drawImage(this.svgImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
  }
}
