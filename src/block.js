// block.js
import Bulk from "./bulk.js";

export default class Block extends Bulk {
  constructor(x, y, size, color, type = "normal", mass = size * size) {
    let svgPath;
    let isImmovable = false;

    switch (type) {
      case "door":
        svgPath = "./assets/svg/doors/door-unlocked.svg";
        isImmovable = true; // Make the door immovable
        break;
      default:
        svgPath = "./assets/svg/blocks/block-hex.svg";
    }

    super(x, y, size, color, svgPath, mass, false, isImmovable);
    this.type = type;
    this.playerNearby = false;
  }

  update(canvasWidth, canvasHeight, player, blocks) {
    if (!this.isImmovable) {
      super.update(canvasWidth, canvasHeight);
    }

    if (this.checkCollision(player)) {
      this.resolveCollision(player);
    }

    for (const block of blocks) {
      if (block !== this && this.checkCollision(block)) {
        this.resolveCollision(block);
      }
    }

    if (this.type === "door") {
      this.checkPlayerProximity(player);
    }
  }

  checkPlayerProximity(player) {
    const proximityThreshold = this.size * 1.5; // Adjust this value as needed
    const distance = this.calculateDistance(player);

    if (distance <= proximityThreshold) {
      if (!this.playerNearby) {
        // console.log("Player is near the door");
        this.playerNearby = true;
      }
    } else {
      if (this.playerNearby) {
        // console.log("Player has left the door's vicinity");
        this.playerNearby = false;
      }
    }
  }

  checkDoorUse(player) {
    if (this.type === "door" && this.checkCollision(player)) {
      console.log("Player is using the door!");
      return true;
    }
    return false;
  }
}
