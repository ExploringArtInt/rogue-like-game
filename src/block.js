// block.js
import Bulk from "./bulk.js";

export default class Block extends Bulk {
  constructor(x, y, size, color, type = "normal") {
    let svgPath;
    switch (type) {
      case "door":
        svgPath = "./assets/svg/doors/door-unlocked.svg";
        break;
      default:
        svgPath = "./assets/svg/blocks/block-hex.svg";
    }

    super(x, y, size, color, svgPath, false);
    this.type = type;
  }

  update(canvasWidth, canvasHeight, player, blocks) {
    super.update(canvasWidth, canvasHeight);

    if (this.checkCollision(player)) {
      this.resolveCollision(player);
    }

    for (const block of blocks) {
      if (block !== this && this.checkCollision(block)) {
        this.resolveCollision(block);
      }
    }
  }

  // You might want to add special behavior for the door here
  // For example, a method to check if the player is trying to use the door
  checkDoorUse(player) {
    if (this.type === "door" && this.checkCollision(player)) {
      // Implement door usage logic here
      console.log("Player is using the door!");
      return true;
    }
    return false;
  }
}
