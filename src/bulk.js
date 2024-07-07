// bulk.js
import { MathUtils, Vector, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Bulk {
  constructor(x, y, size, color, svgPath, mass, isOriginCenter = false, isImmovable = false) {
    this.position = { x, y };
    this.prevPosition = { x, y };
    this.size = size;
    this.color = color;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = 0.1;
    this.maxSpeed = size * 0.4;
    this.friction = 0.85;
    this.mass = mass;
    this.svgImage = null;
    this.isOriginCenter = isOriginCenter;
    this.isImmovable = isImmovable;
    this.loadSVG(svgPath);
  }

  getRect() {
    const halfSize = this.size / 2;
    return this.isOriginCenter
      ? {
          x: this.position.x - halfSize,
          y: this.position.y - halfSize,
          width: this.size,
          height: this.size,
        }
      : {
          x: this.position.x,
          y: this.position.y,
          width: this.size,
          height: this.size,
        };
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
      const drawPosition = this.isOriginCenter
        ? {
            x: this.position.x - this.size / 2,
            y: this.position.y - this.size / 2,
          }
        : this.position;
      ctx.drawImage(this.svgImage, drawPosition.x, drawPosition.y, this.size, this.size);
    }
  }

  update(canvasWidth, canvasHeight) {
    if (!this.isImmovable) {
      this.updatePosition();
      this.applyFriction();
      this.constrainPosition(canvasWidth, canvasHeight);
    }
  }

  updatePosition() {
    this.prevPosition = { ...this.position };
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  applyFriction() {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
  }

  constrainPosition(canvasWidth, canvasHeight) {
    const halfSize = this.size / 2;
    const minX = this.isOriginCenter ? halfSize : 0;
    const minY = this.isOriginCenter ? halfSize : 0;
    const maxX = this.isOriginCenter ? canvasWidth - halfSize : canvasWidth - this.size;
    const maxY = this.isOriginCenter ? canvasHeight - halfSize : canvasHeight - this.size;

    this.position.x = MathUtils.clamp(this.position.x, minX, maxX);
    this.position.y = MathUtils.clamp(this.position.y, minY, maxY);
  }

  checkCollision(other) {
    return Collision.rectIntersect(this.getRect(), other.getRect());
  }

  resolveCollision(other) {
    if (this.isImmovable && other.isImmovable) {
      // Both objects are immovable, do nothing
      return;
    }

    const bounciness = 0.1;
    const minImpulse = 0.1;
    const impulseScaler = 10000;

    const thisCenter = this.getCenter();
    const otherCenter = other.getCenter();

    const collisionVector = Vector.subtract(thisCenter, otherCenter);
    const collisionNormal = Vector.normalize(collisionVector);

    const relativeVelocity = Vector.subtract(this.velocity, other.velocity);
    const velocityAlongNormal = Vector.dotProduct(relativeVelocity, collisionNormal);

    const impulseScalar = -(1 + bounciness) * velocityAlongNormal;
    const totalMass = this.isImmovable ? other.mass : other.isImmovable ? this.mass : this.mass + other.mass;
    const impulse = impulseScalar / totalMass;

    const impulseVector = Vector.multiply(collisionNormal, impulse);

    const appliedImpulse = {
      x: Math.sign(impulseVector.x) * Math.max(Math.abs(impulseVector.x), minImpulse) * impulseScaler,
      y: Math.sign(impulseVector.y) * Math.max(Math.abs(impulseVector.y), minImpulse) * impulseScaler,
    };

    if (!this.isImmovable) {
      this.velocity = Vector.add(this.velocity, Vector.multiply(appliedImpulse, 1 / this.mass));
      this.velocity = Vector.clamp(this.velocity, -this.maxSpeed, this.maxSpeed);
    }

    if (!other.isImmovable) {
      other.velocity = Vector.subtract(other.velocity, Vector.multiply(appliedImpulse, 1 / other.mass));
      other.velocity = Vector.clamp(other.velocity, -other.maxSpeed, other.maxSpeed);
    }

    this.resolveOverlap(other);
  }

  resolveOverlap(other) {
    const thisRect = this.getRect();
    const otherRect = other.getRect();

    const overlapX = Math.min(thisRect.x + thisRect.width - otherRect.x, otherRect.x + otherRect.width - thisRect.x);
    const overlapY = Math.min(thisRect.y + thisRect.height - otherRect.y, otherRect.y + otherRect.height - thisRect.y);

    if (overlapX < overlapY) {
      const adjustment = overlapX / (this.isImmovable || other.isImmovable ? 1 : 2);
      if (!this.isImmovable) this.position.x += this.getCenter().x < other.getCenter().x ? -adjustment : adjustment;
      if (!other.isImmovable) other.position.x += this.getCenter().x < other.getCenter().x ? adjustment : -adjustment;
    } else {
      const adjustment = overlapY / (this.isImmovable || other.isImmovable ? 1 : 2);
      if (!this.isImmovable) this.position.y += this.getCenter().y < other.getCenter().y ? -adjustment : adjustment;
      if (!other.isImmovable) other.position.y += this.getCenter().y < other.getCenter().y ? adjustment : -adjustment;
    }
  }

  getCenter() {
    return this.isOriginCenter
      ? this.position
      : {
          x: this.position.x + this.size / 2,
          y: this.position.y + this.size / 2,
        };
  }

  calculateDistance(other) {
    // Calculate the center points of this and the other object
    const thisCenterX = this.position.x + (this.isOriginCenter ? 0 : this.size / 2);
    const thisCenterY = this.position.y + (this.isOriginCenter ? 0 : this.size / 2);
    const otherCenterX = other.position.x + (other.isOriginCenter ? 0 : other.size / 2);
    const otherCenterY = other.position.y + (other.isOriginCenter ? 0 : other.size / 2);

    // Calculate the distance between the centers
    const dx = thisCenterX - otherCenterX;
    const dy = thisCenterY - otherCenterY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
