import { MathUtils } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Block {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.svgImage = null;
    this.loadBlockSVG();
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
}
