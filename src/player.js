// player.js
import Bulk from "./bulk.js";
import { Vector, MathUtils } from "./utilities.js";

export default class Player extends Bulk {
  constructor(x, y, size, color) {
    // Assuming a default mass for the player, adjust as needed
    const mass = size * size * 0.8; // Making the player slightly lighter than blocks
    super(x, y, size, color, "./assets/svg/robots/robot-player.svg", mass, true);
    this.acceleration = 0.1;
  }

  update(keys, canvasWidth, canvasHeight, level) {
    const desiredVelocity = this.calculateDesiredVelocity(keys);
    this.updateVelocity(desiredVelocity);
    super.update(canvasWidth, canvasHeight);
  }

  calculateDesiredVelocity(keys) {
    let desiredVelocity = { x: 0, y: 0 };

    if (keys.ArrowLeft || keys.KeyA) desiredVelocity.x -= 1;
    if (keys.ArrowRight || keys.KeyD) desiredVelocity.x += 1;
    if (keys.ArrowUp || keys.KeyW) desiredVelocity.y -= 1;
    if (keys.ArrowDown || keys.KeyS) desiredVelocity.y += 1;

    if (desiredVelocity.x !== 0 || desiredVelocity.y !== 0) {
      desiredVelocity = Vector.normalize(desiredVelocity);
      desiredVelocity = Vector.multiply(desiredVelocity, this.maxSpeed);
    }

    return desiredVelocity;
  }

  updateVelocity(desiredVelocity) {
    const deltaVelocity = Vector.subtract(desiredVelocity, this.velocity);
    const t = MathUtils.bezierBlend(this.acceleration);
    this.velocity = Vector.add(this.velocity, Vector.multiply(deltaVelocity, t));
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
