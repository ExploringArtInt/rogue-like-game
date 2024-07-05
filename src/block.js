// block.js
import Bulk from "./bulk.js";

export default class Block extends Bulk {
  constructor(x, y, size, color) {
    // Highlight: Changed to set isOriginCenter to false
    super(x, y, size, color, "./assets/svg/block.svg", false);
  }

  update(canvasWidth, canvasHeight, player, blocks) {
    super.update(canvasWidth, canvasHeight);

    if (this.checkCollision(player)) {
      this.resolveCollision(player);
    }

    for (const block of blocks) {
      if (block !== this && this.checkCollision(block)) {
        this.resolveCollision(block);
      }
    }
  }
}
