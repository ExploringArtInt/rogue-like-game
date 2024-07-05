import { MathUtils } from "./utilities.js";
import Block from "./block.js";

export default class Level {
  constructor(blockColor, blockSize, width, height) {
    this.blockColor = blockColor;
    this.blockSize = blockSize;
    this.width = width;
    this.height = height;
    this.blocks = [];
    this.generateBlocks();
  }

  generateBlocks() {
    const blockSize = this.blockSize;
    const numColumns = Math.floor(this.width / blockSize);
    const numRows = Math.floor(this.height / blockSize);
    const offsetX = Math.floor((this.width % blockSize) / 2);
    const offsetY = Math.floor((this.height % blockSize) / 2);
    const gapSize = blockSize * 0;

    for (let col = 0; col < numColumns; col++) {
      if (col == Math.floor(numColumns / 2.0)) {
        continue;
      }
      for (let row = 0; row < numRows; row++) {
        if (row == Math.floor(numRows / 2.0)) {
          continue;
        }
        const y = row * blockSize + offsetY;
        const x = col * blockSize + offsetX;

        if (MathUtils.randomInt(0, 5) > 0) {
          this.blocks.push(new Block(x, y, blockSize - gapSize, this.blockColor));
        }
      }
    }
  }

  draw(ctx) {
    for (const block of this.blocks) {
      block.draw(ctx);
    }
  }

  update(player) {
    for (const block of this.blocks) {
      block.update(this.width, this.height, player, this.blocks);
    }
  }

  checkCollisions(player) {
    for (const block of this.blocks) {
      if (block.checkCollision(player)) {
        block.resolveCollision(player);
      }
    }
  }
}
