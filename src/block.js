import { MathUtils, Vector, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Block {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.svgImage = null;
    this.loadBlockSVG();

    // New attributes
    this.velocityX = 0;
    this.velocityY = 0;
    this.acceleration = 0.1;
    this.maxSpeed = size * 0.4;
    this.friction = 0.85;
  }

  loadBlockSVG() {
    loadSVG("./assets/svg/block.svg", this.color)
      .then((image) => {
        this.svgImage = image;
      })
      .catch((error) => console.error("Error loading SVG:", error));
  }

  draw(ctx) {
    if (this.svgImage && this.svgImage.complete) {
      ctx.drawImage(this.svgImage, this.x, this.y, this.size, this.size);
    }
  }

  checkCollision(player) {
    return (
      player.x - player.size / 2 < this.x + this.size &&
      player.x + player.size / 2 > this.x &&
      player.y - player.size / 2 < this.y + this.size &&
      player.y + player.size / 2 > this.y
    );
  }

  resolveCollision(player) {
    // Adjust the player's position to resolve the collision
    // divide by 1.9 instead of 2 to avoid getting stuck on corners
    if (player.x < this.x) {
      player.x = this.x - player.size / 1.9;
    } else if (player.x > this.x + this.size) {
      player.x = this.x + this.size + player.size / 1.9;
      player.velocityX = 0;
      player.velocityY = 0;
    }
    if (player.y < this.y) {
      player.y = this.y - player.size / 1.9;
    } else if (player.y > this.y + this.size) {
      player.y = this.y + this.size + player.size / 1.9;
      player.velocityX = 0;
      player.velocityY = 0;
    }
  }

  update(canvasWidth, canvasHeight, player, blocks) {
    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Apply friction
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;

    // Keep block within canvas bounds
    this.x = MathUtils.clamp(this.x, 0, canvasWidth - this.size);
    this.y = MathUtils.clamp(this.y, 0, canvasHeight - this.size);

    // Check collision with player
    if (this.checkCollision(player)) {
      this.resolveCollision(player);
    }

    // Check collision with other blocks
    for (const block of blocks) {
      if (block !== this) {
        if (Collision.rectIntersect({ x: this.x, y: this.y, width: this.size, height: this.size }, { x: block.x, y: block.y, width: block.size, height: block.size })) {
          // Simple collision response: move blocks apart
          const overlap = Math.min(Math.abs(this.x - block.x), Math.abs(this.y - block.y));
          if (this.x < block.x) {
            this.x -= overlap / 2;
            block.x += overlap / 2;
          } else {
            this.x += overlap / 2;
            block.x -= overlap / 2;
          }
          if (this.y < block.y) {
            this.y -= overlap / 2;
            block.y += overlap / 2;
          } else {
            this.y += overlap / 2;
            block.y -= overlap / 2;
          }

          // Stop the blocks' movement
          this.velocityX = 0;
          this.velocityY = 0;
          block.velocityX = 0;
          block.velocityY = 0;
        }
      }
    }
  }
}
