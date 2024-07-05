import { MathUtils, Vector, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Block {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.prevX = this.x;
    this.prevY = this.y;
    this.size = size;
    this.color = color;
    this.svgImage = null;
    this.loadBlockSVG();

    this.velocityX = 0;
    this.velocityY = 0;
    this.acceleration = 0.1;
    this.maxSpeed = size * 0.4;
    this.friction = 0.85;
    this.mass = size * size; // Mass proportional to size
  }

  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size,
    };
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

  // must be exact with no margin or player will not interact with blocks, only be stopped by them
  checkCollision(player) {
    return Collision.rectIntersect(
      { x: this.x, y: this.y, width: this.size, height: this.size },
      { x: player.x - player.size / 2, y: player.y - player.size / 2, width: player.size, height: player.size },
    );
  }

  resolveCollision(bulk) {
    // bulk could be the player or another block

    // Calculate bounciness (restitution)
    const bounciness = 0.1;
    const minImpulse = 0.1; // Minimum impulse to apply
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

    // Do not resolve if velocities are separating
    if (velocityAlongNormal > 0) {
      return;
    }

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

    // this.resolveOverlap(bulk);
  }

  resolveOverlap(bulk) {
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

  update(canvasWidth, canvasHeight, player, blocks) {
    // store location before update
    this.prevX = this.x;
    this.prevY = this.y;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Apply friction
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;

    // Keep block within canvas bounds
    this.x = MathUtils.clamp(this.x, 0, canvasWidth - this.size);
    this.y = MathUtils.clamp(this.y, 0, canvasHeight - this.size);

    // Enable player to move this block
    if (this.checkCollision(player)) {
      this.resolveCollision(player);
    }

    // Check collision with other blocks
    for (const block of blocks) {
      if (block !== this) {
        if (
          Collision.rectIntersectOverMargin({ x: this.x, y: this.y, width: this.size, height: this.size }, { x: block.x, y: block.y, width: block.size, height: block.size }, 1)
        ) {
          console.debug("Block collision happened!");
          this.resolveCollision(block);
        }
      }
    }
  }
}
