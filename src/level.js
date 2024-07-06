// level.js
import { MathUtils } from "./utilities.js";
import Block from "./block.js";

export default class Level {
  constructor(blockColor, blockSize, width, height, seed = Date.now()) {
    this.blockColor = blockColor;
    this.blockSize = blockSize;
    this.width = width;
    this.height = height;
    this.blocks = [];
    this.seed = seed;
    this.doorPlaced = false;
    this.generateBlocks(this.seed);
  }

  generateBlocks(seed) {
    this.blocks = []; // Clear existing blocks
    this.doorPlaced = false;
    const rng = this.createSeededRandom(seed);
    const { numColumns, numRows, offsetX, offsetY } = this.calculateGridDimensions();
    const gapSize = 0;

    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < numRows; row++) {
        if (this.shouldSkipBlock(col, row, numColumns, numRows)) continue;

        const position = this.calculateBlockPosition(col, row, offsetX, offsetY);
        this.tryCreateBlock(position.x, position.y, gapSize, rng);
      }
    }

    // If no door was placed, force place it in a random position
    if (!this.doorPlaced) {
      const randomIndex = Math.floor(rng() * this.blocks.length);
      const randomBlock = this.blocks[randomIndex];
      this.blocks[randomIndex] = new Block(randomBlock.position.x, randomBlock.position.y, this.blockSize - gapSize, this.blockColor, "door");
    }
  }

  createSeededRandom(seed) {
    let x = seed;
    return function () {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
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

  tryCreateBlock(x, y, gapSize, rng) {
    if (rng() > 0.2) {
      // 80% chance of creating a block
      if (!this.doorPlaced && rng() < 0.1) {
        // 10% chance of creating a door if not already placed
        this.createDoor(x, y, gapSize);
      } else {
        this.createBlock(x, y, gapSize);
      }
    }
  }

  createBlock(x, y, gapSize) {
    const block = new Block(x, y, this.blockSize - gapSize, this.blockColor, "normal");
    this.blocks.push(block);
  }

  createDoor(x, y, gapSize) {
    const door = new Block(x, y, this.blockSize - gapSize, this.blockColor, "door");
    this.blocks.push(door);
    this.doorPlaced = true;
  }

  draw(ctx) {
    this.blocks.forEach((block) => block.draw(ctx));
  }

  update(player) {
    this.blocks.forEach((block) => {
      block.update(this.width, this.height, player, this.blocks);
      if (block.type === "door") {
        block.checkDoorUse(player);
      }
    });
  }

  // Method to regenerate the level with a new seed
  regenerate(newSeed = Date.now()) {
    this.seed = newSeed;
    this.generateBlocks(this.seed);
  }
}
