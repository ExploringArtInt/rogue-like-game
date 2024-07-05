import { MathUtils, Vector, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Block {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.svgImage = null;
    this.loadBlockSVG();

    this.velocityX = 0;
    this.velocityY = 0;
    this.acceleration = 0.1;
    this.maxSpeed = size * 0.4;
    this.friction = 0.85;
    this.mass = size * size * 10; // Mass proportional to size
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
    return Collision.rectIntersect(
      { x: this.x, y: this.y, width: this.size, height: this.size },
      { x: player.x - player.size / 2, y: player.y - player.size / 2, width: player.size, height: player.size },
    );
  }

  resolveCollision(player) {
    // Calculate collision vector
    const collisionVector = {
      x: this.x + this.size / 2 - player.x,
      y: this.y + this.size / 2 - player.y,
    };

    // Normalize collision vector
    const collisionNormal = Vector.normalize(collisionVector);

    // Calculate relative velocity
    const relativeVelocity = {
      x: this.velocityX - player.velocityX,
      y: this.velocityY - player.velocityY,
    };

    // Calculate relative velocity in terms of the normal direction
    const velocityAlongNormal = Vector.dotProduct(relativeVelocity, collisionNormal);

    // Do not resolve if velocities are separating
    if (velocityAlongNormal > 0) {
      return;
    }

    // Calculate bounciness (restitution)
    const bounciness = 0.5;

    // Calculate impulse scalar
    const impulseScalar = -(1 + bounciness) * velocityAlongNormal;
    const totalMass = this.mass + player.mass;
    const impulse = impulseScalar / totalMass;

    // Apply impulse to velocities
    const impulseVector = {
      x: impulse * collisionNormal.x,
      y: impulse * collisionNormal.y,
    };

    const minImpulse = 0.5; // Minimum impulse to apply
    const impluseScaler = 10000;
    const appliedImpulseX = Math.sign(impulseVector.x) * Math.max(Math.abs(impulseVector.x), minImpulse) * impluseScaler;
    const appliedImpulseY = Math.sign(impulseVector.y) * Math.max(Math.abs(impulseVector.y), minImpulse) * impluseScaler;

    this.velocityX += appliedImpulseX * (1 / this.mass);
    this.velocityY += appliedImpulseY * (1 / this.mass);
    player.velocityX -= appliedImpulseX * (1 / player.mass);
    player.velocityY -= appliedImpulseY * (1 / player.mass);

    // Prevent objects from sinking into each other
    const percent = 0.8; // usually 20% to 80%
    const slop = 0.1; // usually 0.01 to 0.1
    const correction = (Math.max(velocityAlongNormal - slop, 0) / totalMass) * percent;
    const correctionVector = {
      x: collisionNormal.x * correction,
      y: collisionNormal.y * correction,
    };

    this.x += correctionVector.x * this.mass;
    this.y += correctionVector.y * this.mass;
    player.x -= correctionVector.x * player.mass;
    player.y -= correctionVector.y * player.mass;

    // Ensure velocities don't exceed maxSpeed
    this.velocityX = MathUtils.clamp(this.velocityX, -this.maxSpeed, this.maxSpeed);
    this.velocityY = MathUtils.clamp(this.velocityY, -this.maxSpeed, this.maxSpeed);
    player.velocityX = MathUtils.clamp(player.velocityX, -player.maxSpeed, player.maxSpeed);
    player.velocityY = MathUtils.clamp(player.velocityY, -player.maxSpeed, player.maxSpeed);
  }

  update(canvasWidth, canvasHeight, player, blocks) {
    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Apply friction
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;

    // Keep block within canvas bounds
    this.x = MathUtils.clamp(this.x, 0, canvasWidth - this.size);
    this.y = MathUtils.clamp(this.y, 0, canvasHeight - this.size);

    // Check collision with player
    if (this.checkCollision(player)) {
      this.resolveCollision(player);
    }

    // Check collision with other blocks
    for (const block of blocks) {
      if (block !== this) {
        if (Collision.rectIntersect({ x: this.x, y: this.y, width: this.size, height: this.size }, { x: block.x, y: block.y, width: block.size, height: block.size })) {
          this.resolveCollision(block);
        }
      }
    }
  }
}
