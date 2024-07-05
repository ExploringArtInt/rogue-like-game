import { MathUtils, Vector, Collision } from "./utilities.js";
import { loadSVG } from "./svg.js";

export default class Bulk {
  constructor(x, y, size, color, svgPath, isOriginCenter = false) {
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
    this.mass = size * size;
    this.svgImage = null;
    this.isOriginCenter = isOriginCenter;
    this.loadSVG(svgPath);
  }

  getRect() {
    if (this.isOriginCenter) {
      return {
        x: this.x - this.size / 2,
        y: this.y - this.size / 2,
        width: this.size,
        height: this.size,
      };
    } else {
      return {
        x: this.x,
        y: this.y,
        width: this.size,
        height: this.size,
      };
    }
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
      if (this.isOriginCenter) {
        ctx.drawImage(this.svgImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      } else {
        ctx.drawImage(this.svgImage, this.x, this.y, this.size, this.size);
      }
    }
  }

  update(canvasWidth, canvasHeight) {
    this.prevX = this.x;
    this.prevY = this.y;

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.velocityX *= this.friction;
    this.velocityY *= this.friction;

    if (this.isOriginCenter) {
      this.x = MathUtils.clamp(this.x, this.size / 2, canvasWidth - this.size / 2);
      this.y = MathUtils.clamp(this.y, this.size / 2, canvasHeight - this.size / 2);
    } else {
      this.x = MathUtils.clamp(this.x, 0, canvasWidth - this.size);
      this.y = MathUtils.clamp(this.y, 0, canvasHeight - this.size);
    }
  }

  checkCollision(other) {
    return Collision.rectIntersect(this.getRect(), other.getRect());
  }

  resolveCollision(other) {
    const bounciness = 0.1;
    const minImpulse = 0.1;
    const impulseScaler = 10000;

    const thisCenter = this.getCenter();
    const otherCenter = other.getCenter();

    const collisionVector = {
      x: thisCenter.x - otherCenter.x,
      y: thisCenter.y - otherCenter.y,
    };

    const collisionNormal = Vector.normalize(collisionVector);

    const relativeVelocity = {
      x: this.velocityX - other.velocityX,
      y: this.velocityY - other.velocityY,
    };

    const velocityAlongNormal = Vector.dotProduct(relativeVelocity, collisionNormal);

    const impulseScalar = -(1 + bounciness) * velocityAlongNormal;
    const totalMass = this.mass + other.mass;
    const impulse = impulseScalar / totalMass;

    const impulseVector = {
      x: impulse * collisionNormal.x,
      y: impulse * collisionNormal.y,
    };

    const appliedImpulseX = Math.sign(impulseVector.x) * Math.max(Math.abs(impulseVector.x), minImpulse) * impulseScaler;
    const appliedImpulseY = Math.sign(impulseVector.y) * Math.max(Math.abs(impulseVector.y), minImpulse) * impulseScaler;

    this.velocityX += appliedImpulseX * (1 / this.mass);
    this.velocityY += appliedImpulseY * (1 / this.mass);
    other.velocityX -= appliedImpulseX * (1 / other.mass);
    other.velocityY -= appliedImpulseY * (1 / other.mass);

    this.velocityX = MathUtils.clamp(this.velocityX, -this.maxSpeed, this.maxSpeed);
    this.velocityY = MathUtils.clamp(this.velocityY, -this.maxSpeed, this.maxSpeed);
    other.velocityX = MathUtils.clamp(other.velocityX, -other.maxSpeed, other.maxSpeed);
    other.velocityY = MathUtils.clamp(other.velocityY, -other.maxSpeed, other.maxSpeed);

    this.resolveOverlap(other);
  }

  resolveOverlap(other) {
    const thisRect = this.getRect();
    const otherRect = other.getRect();

    const overlapX = Math.min(thisRect.x + thisRect.width - otherRect.x, otherRect.x + otherRect.width - thisRect.x);
    const overlapY = Math.min(thisRect.y + thisRect.height - otherRect.y, otherRect.y + otherRect.height - thisRect.y);

    if (overlapX < overlapY) {
      if (this.getCenter().x < other.getCenter().x) {
        this.x -= overlapX / 2;
        other.x += overlapX / 2;
      } else {
        this.x += overlapX / 2;
        other.x -= overlapX / 2;
      }
    } else {
      if (this.getCenter().y < other.getCenter().y) {
        this.y -= overlapY / 2;
        other.y += overlapY / 2;
      } else {
        this.y += overlapY / 2;
        other.y -= overlapY / 2;
      }
    }
  }

  getCenter() {
    if (this.isOriginCenter) {
      return { x: this.x, y: this.y };
    } else {
      return { x: this.x + this.size / 2, y: this.y + this.size / 2 };
    }
  }
}
