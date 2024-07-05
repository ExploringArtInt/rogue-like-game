import { MathUtils, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Level {
  constructor(blockSize, width, height) {
    this.blockSize = blockSize;
    this.width = width;
    this.height = height;
    this.blocks = [];
    this.generateBlocks();
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

  generateBlocks() {
    const blockSize = this.blockSize;
    const numColumns = Math.floor(this.width / blockSize);
    const numRows = Math.floor(this.height / blockSize);
    const offsetX = Math.floor((this.width % blockSize) / 2);
    const offsetY = Math.floor((this.height % blockSize) / 2);
    const gapSize = blockSize * 0.1;

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
          this.blocks.push({ x, y, width: blockSize, height: blockSize });
        }

        /* console.debug("(col, row) = (", col, ",", row, ")", x, y); */
      }
    }

    /*
    while (this.blocks.length < numColumns * numRows && attemptCount < maxAttempts) {
      /*
      const x = MathUtils.randomInt(0, this.width - blockSize);
      const y = MathUtils.randomInt(0, this.height - blockSize);

      // Check if the new block overlaps with any existing blocks
      let overlaps = false;
      for (const block of this.blocks) {
        if (Collision.rectIntersect({ x, y, width: blockSize, height: blockSize }, block)) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps && x % (blockSize + gapSize) >= gapSize && y % (blockSize + gapSize) >= gapSize) {
        this.blocks.push({ x, y, width: blockSize, height: blockSize });
      }


      attemptCount++;
    }

    if (this.blocks.length !== numColumns * numRows) {
      console.log(`Warning: Could not generate all blocks without overlap. Generated ${this.blocks.length} out of ${numColumns * numRows} blocks.`);
    }
    */
  }

  draw(ctx) {
    // Draw blocks using SVG
    for (const block of this.blocks) {
      if (this.svgImage && this.svgImage.complete) {
        ctx.drawImage(this.svgImage, block.x, block.y, block.width, block.height);
      }
    }
  }
}
