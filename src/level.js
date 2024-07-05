// level.js
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
    const { numColumns, numRows, offsetX, offsetY } = this.calculateGridDimensions();
    const gapSize = 0;

    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < numRows; row++) {
        if (this.shouldSkipBlock(col, row, numColumns, numRows)) continue;

        const position = this.calculateBlockPosition(col, row, offsetX, offsetY);
        if (this.shouldCreateBlock()) {
          this.createBlock(position.x, position.y, gapSize);
        }
      }
    }
  }

  calculateGridDimensions() {
    const numColumns = Math.floor(this.width / this.blockSize);
    const numRows = Math.floor(this.height / this.blockSize);
    const offsetX = Math.floor((this.width % this.blockSize) / 2);
    const offsetY = Math.floor((this.height % this.blockSize) / 2);
    return { numColumns, numRows, offsetX, offsetY };
  }

  shouldSkipBlock(col, row, numColumns, numRows) {
    return col === Math.floor(numColumns / 2) || row === Math.floor(numRows / 2);
  }

  calculateBlockPosition(col, row, offsetX, offsetY) {
    const x = col * this.blockSize + offsetX;
    const y = row * this.blockSize + offsetY;
    return { x, y };
  }

  shouldCreateBlock() {
    return MathUtils.randomInt(0, 5) > 0;
  }

  createBlock(x, y, gapSize) {
    const block = new Block(x, y, this.blockSize - gapSize, this.blockColor);
    this.blocks.push(block);
  }

  draw(ctx) {
    this.blocks.forEach((block) => block.draw(ctx));
  }

  update(player) {
    this.blocks.forEach((block) => block.update(this.width, this.height, player, this.blocks));
  }
}
