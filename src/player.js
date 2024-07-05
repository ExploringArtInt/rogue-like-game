import Bulk from "./bulk.js";
import { Vector, MathUtils } from "./utilities.js";

export default class Player extends Bulk {
  constructor(x, y, size, color) {
    // Highlight: Changed to set isOriginCenter to true
    super(x, y, size, color, "./assets/svg/player.svg", true);
  }

  update(keys, canvasWidth, canvasHeight, level) {
    let desiredVelocity = { x: 0, y: 0 };

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
    this.handleBlockCollisions(level.blocks);
  }

  handleBlockCollisions(blocks) {
    for (const block of blocks) {
      if (this.checkCollision(block)) {
        this.resolveCollision(block);
      }
    }
  }
}
