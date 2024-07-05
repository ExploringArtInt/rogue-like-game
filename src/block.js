import Bulk from "./bulk.js";
import { MathUtils, Vector, Collision } from "./utilities.js";

export default class Block extends Bulk {
  constructor(x, y, size, color) {
    super(x, y, size, color, "./assets/svg/block.svg");
  }

  update(canvasWidth, canvasHeight, player, blocks) {
    super.update(canvasWidth, canvasHeight);

    // Enable player to move this block
    if (this.checkCollisionWithBlocks(player)) {
      this.resolveCollisionWithBlocks(player);
    }

    // Check collision with other blocks
    for (const block of blocks) {
      if (block !== this) {
        // margin of 1 very important for very bounce environments
        if (Collision.rectIntersectOverMargin(this.getRect(), block.getRect(), 1)) {
          this.resolveCollisionWithBlocks(block);
          this.resolveOverlapWithBlocks(block);
        }
      }
    }
  }

  // must be exact with no margin or player will not interact with blocks, only be stopped by them
  checkCollisionWithBlocks(player) {
    return Collision.rectIntersect(
      { x: this.x, y: this.y, width: this.size, height: this.size },
      { x: player.x - player.size / 2, y: player.y - player.size / 2, width: player.size, height: player.size },
    );
  }

  resolveCollisionWithBlocks(bulk, resolveOverlapFlag) {
    // bulk could be the player or another block

    // Calculate bounciness (restitution)
    const bounciness = 5.1; // min 0.1 (solid) to 10 (bouncy)
    const minImpulse = 5.1; // min 0.1 (solid) to 10 (bouncy)
    const impluseScaler = 10000;
    const correctionPercent = 0; // refactor out?
    const slop = 0; // refactor out?

    // Calculate collision vector
    const collisionVector = {
      x: this.x + this.size / 2 - bulk.x,
      y: this.y + this.size / 2 - bulk.y,
    };

    // Normalize collision vector
    const collisionNormal = Vector.normalize(collisionVector);

    // Calculate relative velocity
    const relativeVelocity = {
      x: this.velocityX - bulk.velocityX,
      y: this.velocityY - bulk.velocityY,
    };

    // Calculate relative velocity in terms of the normal direction
    const velocityAlongNormal = Vector.dotProduct(relativeVelocity, collisionNormal);

    // Calculate impulse scalar
    const impulseScalar = -(1 + bounciness) * velocityAlongNormal;
    const totalMass = this.mass + bulk.mass;
    const impulse = impulseScalar / totalMass;

    // Apply impulse to velocities
    const impulseVector = {
      x: impulse * collisionNormal.x,
      y: impulse * collisionNormal.y,
    };

    const appliedImpulseX = Math.sign(impulseVector.x) * Math.max(Math.abs(impulseVector.x), minImpulse) * impluseScaler;
    const appliedImpulseY = Math.sign(impulseVector.y) * Math.max(Math.abs(impulseVector.y), minImpulse) * impluseScaler;

    this.velocityX += appliedImpulseX * (1 / this.mass);
    this.velocityY += appliedImpulseY * (1 / this.mass);
    bulk.velocityX -= appliedImpulseX * (1 / bulk.mass);
    bulk.velocityY -= appliedImpulseY * (1 / bulk.mass);

    // Prevent objects from sinking into each other
    const correction = (Math.max(velocityAlongNormal - slop, 0) / totalMass) * correctionPercent;
    const correctionVector = {
      x: collisionNormal.x * correction,
      y: collisionNormal.y * correction,
    };

    this.x += correctionVector.x * this.mass;
    this.y += correctionVector.y * this.mass;
    bulk.x -= correctionVector.x * bulk.mass;
    bulk.y -= correctionVector.y * bulk.mass;

    // Ensure velocities don't exceed maxSpeed
    this.velocityX = MathUtils.clamp(this.velocityX, -this.maxSpeed, this.maxSpeed);
    this.velocityY = MathUtils.clamp(this.velocityY, -this.maxSpeed, this.maxSpeed);
    bulk.velocityX = MathUtils.clamp(bulk.velocityX, -bulk.maxSpeed, bulk.maxSpeed);
    bulk.velocityY = MathUtils.clamp(bulk.velocityY, -bulk.maxSpeed, bulk.maxSpeed);

    if (resolveOverlapFlag) {
      this.resolveOverlapWithBlocks(bulk);
    }
  }

  resolveOverlapWithBlocks(bulk) {
    if (this.x < bulk.x) {
      this.x -= 1;
      bulk.x += 1;
    } else {
      this.x += 1;
      bulk.x -= 1;
    }
    if (this.y < bulk.y) {
      this.y -= 1;
      bulk.y += 1;
    } else {
      this.y += 1;
      bulk.y -= 1;
    }
  }
}
