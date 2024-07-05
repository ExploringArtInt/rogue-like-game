import Bulk from "./bulk.js";
import { MathUtils, Vector, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Player extends Bulk {
  constructor(x, y, size, color) {
    super(x, y, size, color, "./assets/svg/player.svg");
    this.originIsCenter = true;
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
    }

    super.update(canvasWidth, canvasHeight);
  }

  lateUpdate(keys, canvasWidth, canvasHeight, level) {
    // Check collisions with blocks
    this.handleBlockCollisionsWithPlayer(level.blocks, this.prevX, this.prevY);
  }
  /* NEW
  lateUpdate(keys, canvasWidth, canvasHeight, level) {
    this.handleBlockCollisions(level.blocks);
  }
  */

  handleBlockCollisionsWithPlayer(blocks, prevX, prevY) {
    const playerRect = this.getRect();
    let collided = false;

    for (const block of blocks) {
      const blockRect = block.getRect();
      if (Collision.rectIntersect(playerRect, blockRect)) {
        collided = true;
        this.resolveOverlapWithPlayer(block);
      }
    }

    if (collided) {
      // Update velocity after collision resolution
      this.velocityX = this.x - prevX;
      this.velocityY = this.y - prevY;
    }
  }

  resolveOverlapWithPlayer(bulk) {
    const thisRect = this.getRect();
    const bulkRect = bulk.getRect();

    // Calculate overlap on each axis
    const overlapX = Math.min(Math.abs(thisRect.x + thisRect.width - bulkRect.x), Math.abs(bulkRect.x + bulkRect.width - thisRect.x));
    const overlapY = Math.min(Math.abs(thisRect.y + thisRect.height - bulkRect.y), Math.abs(bulkRect.y + bulkRect.height - thisRect.y));

    // Determine which axis has the smaller overlap
    if (overlapX < overlapY) {
      // Collision on X-axis
      if (this.x < bulk.x) {
        this.x = bulk.x - this.size / 2;
      } else {
        this.x = bulk.x + bulk.size + this.size / 2;
      }
    } else {
      // Collision on Y-axis
      if (this.y < bulk.y) {
        this.y = bulk.y - this.size / 2;
      } else {
        this.y = bulk.y + bulk.size + this.size / 2;
      }
    }
  }
}
