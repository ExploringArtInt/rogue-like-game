import { MathUtils, Vector, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Bulk {
  constructor(x, y, size, color, svgPath) {
    this.originIsCenter = false;
    this.x = x;
    this.y = y;
    this.prevX = this.x;
    this.prevY = this.y;
    this.size = size;
    this.color = color;
    this.velocityX = 0;
    this.velocityY = 0;
    this.acceleration = 0.1;
    this.maxSpeed = size * 0.4;
    this.friction = 0.85;
    this.mass = size * size; // Mass proportional to size
    this.svgImage = null;
    this.loadSVG(svgPath);
  }

  getRect() {
    var x, y;

    if (this.originIsCenter) {
      x = this.x - this.size / 2;
      y = this.y - this.size / 2;
    } else {
      x = this.x;
      y = this.y;
    }
    return { x, y, width: this.size, height: this.size };
  }

  loadSVG(svgPath) {
    loadSVG(svgPath, this.color)
      .then((image) => {
        this.svgImage = image;
      })
      .catch((error) => console.error("Error loading SVG:", error));
  }

  draw(ctx) {
    if (this.svgImage && this.svgImage.complete) {
      if (this.originIsCenter) {
        ctx.drawImage(this.svgImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      } else {
        ctx.drawImage(this.svgImage, this.x, this.y, this.size, this.size);
      }
    }
  }

  update(canvasWidth, canvasHeight) {
    // store location for late update
    this.prevX = this.x;
    this.prevY = this.y;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Apply friction
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;

    // Keep bulk within canvas bounds
    if (this.originIsCenter) {
      this.x = MathUtils.clamp(this.x, this.size / 2, canvasWidth - this.size / 2);
      this.y = MathUtils.clamp(this.y, this.size / 2, canvasHeight - this.size / 2);
    } else {
      this.x = MathUtils.clamp(this.x, 0, canvasWidth - this.size);
      this.y = MathUtils.clamp(this.y, 0, canvasHeight - this.size);
    }
  }

  checkCollisionBulk(other) {
    return Collision.rectIntersect(this.getRect(), other.getRect());
  }

  resolveCollisionBulk(other) {
    // Calculate bounciness (restitution)
    const bounciness = 0.1;
    const minImpulse = 0.1;
    const impluseScaler = 10000;
    const correctionPercent = 0;
    const slop = 0;

    // Calculate collision vector
    const collisionVector = {
      x: this.x - other.x,
      y: this.y - other.y,
    };

    // Normalize collision vector
    const collisionNormal = Vector.normalize(collisionVector);

    // Calculate relative velocity
    const relativeVelocity = {
      x: this.velocityX - other.velocityX,
      y: this.velocityY - other.velocityY,
    };

    // Calculate relative velocity in terms of the normal direction
    const velocityAlongNormal = Vector.dotProduct(relativeVelocity, collisionNormal);

    // Calculate impulse scalar
    const impulseScalar = -(1 + bounciness) * velocityAlongNormal;
    const totalMass = this.mass + other.mass;
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
    other.velocityX -= appliedImpulseX * (1 / other.mass);
    other.velocityY -= appliedImpulseY * (1 / other.mass);

    // Prevent objects from sinking into each other
    const correction = (Math.max(velocityAlongNormal - slop, 0) / totalMass) * correctionPercent;
    const correctionVector = {
      x: collisionNormal.x * correction,
      y: collisionNormal.y * correction,
    };

    this.x += correctionVector.x * this.mass;
    this.y += correctionVector.y * this.mass;
    other.x -= correctionVector.x * other.mass;
    other.y -= correctionVector.y * other.mass;

    // Ensure velocities don't exceed maxSpeed
    this.velocityX = MathUtils.clamp(this.velocityX, -this.maxSpeed, this.maxSpeed);
    this.velocityY = MathUtils.clamp(this.velocityY, -this.maxSpeed, this.maxSpeed);
    other.velocityX = MathUtils.clamp(other.velocityX, -other.maxSpeed, other.maxSpeed);
    other.velocityY = MathUtils.clamp(other.velocityY, -other.maxSpeed, other.maxSpeed);
  }

  resolveOverlapBulk(other) {
    const thisRect = this.getRect();
    const otherRect = other.getRect();

    // Calculate overlap on each axis
    const overlapX = Math.min(Math.abs(thisRect.x + thisRect.width - otherRect.x), Math.abs(otherRect.x + otherRect.width - thisRect.x));
    const overlapY = Math.min(Math.abs(thisRect.y + thisRect.height - otherRect.y), Math.abs(otherRect.y + otherRect.height - thisRect.y));

    // Determine which axis has the smaller overlap
    if (overlapX < overlapY) {
      // Collision on X-axis
      if (this.x < other.x) {
        this.x = other.x - this.size / 2;
      } else {
        this.x = other.x + other.size + this.size / 2;
      }
    } else {
      // Collision on Y-axis
      if (this.y < other.y) {
        this.y = other.y - this.size / 2;
      } else {
        this.y = other.y + other.size + this.size / 2;
      }
    }
  }
}
