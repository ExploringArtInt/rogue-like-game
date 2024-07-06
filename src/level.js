// level.js
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
    this.playerNearDoor = false;
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
    if (!this.doorPlaced && this.blocks.length > 0) {
      const randomIndex = Math.floor(rng() * this.blocks.length);
      const randomBlock = this.blocks[randomIndex];
      this.blocks[randomIndex] = this.createDoor(randomBlock.position.x, randomBlock.position.y, gapSize);
    } else if (!this.doorPlaced) {
      // If there are no blocks at all, place a door in the center
      const centerX = this.width / 2 - this.blockSize / 2;
      const centerY = this.height / 2 - this.blockSize / 2;
      this.blocks.push(this.createDoor(centerX, centerY, gapSize));
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
        this.blocks.push(this.createDoor(x, y, gapSize));
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
    const doorSize = this.blockSize - gapSize;
    const doorMass = doorSize * doorSize + 1000; // The mass doesn't affect movement now, but we'll keep it for consistency
    const door = new Block(x, y, doorSize, this.blockColor, "door", doorMass);
    this.doorPlaced = true;
    return door;
  }

  draw(ctx) {
    this.blocks.forEach((block) => block.draw(ctx));
  }

  update(player, gui) {
    let playerNearDoor = false;
    this.blocks.forEach((block) => {
      block.update(this.width, this.height, player, this.blocks);
      if (block.type === "door") {
        block.checkPlayerProximity(player);
        if (block.playerNearby) {
          playerNearDoor = true;
        }
      }
    });

    if (playerNearDoor !== this.playerNearDoor) {
      this.playerNearDoor = playerNearDoor;
      if (playerNearDoor) {
        gui.setFocusedElement("Use Something");
      } else {
        gui.clearFocusedElement("Use Something");
      }
    }
  }

  checkPlayerProximity(player, door) {
    const proximityThreshold = this.blockSize * 0.8; // Adjust this value as needed
    const distance = Math.sqrt(Math.pow(door.position.x - player.position.x, 2) + Math.pow(door.position.y - player.position.y, 2));
    return distance <= proximityThreshold;
  }

  // Method to regenerate the level with a new seed
  regenerate(newSeed = Date.now()) {
    this.seed = newSeed;
    this.generateBlocks(this.seed);
  }

  isPlayerNearDoor() {
    return this.playerNearDoor;
  }
}
