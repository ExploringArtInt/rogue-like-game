// js/player.js

import { MathUtils, Vector } from "./utilities.js";

export default class Player {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocityX = 0;
    this.velocityY = 0;
    this.acceleration = 0.1;
    this.maxSpeed = 20;
    this.friction = 0.99;
    this.svg = null;
    this.svgImage = new Image();
    this.loadSVG();
  }

  loadSVG() {
    fetch("./assets/svg/player.svg")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((svgData) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
        this.svg = svgDoc.documentElement;

        // Create a Blob from the SVG
        const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);

        // Load the SVG into the image
        this.svgImage.onload = () => {
          URL.revokeObjectURL(url);
        };
        this.svgImage.src = url;
      })
      .catch((error) => console.error("Error loading SVG:", error));
  }

  update(keys, canvasWidth, canvasHeight) {
    let desiredVelocity = { x: 0, y: 0 };

    if (keys.ArrowLeft) desiredVelocity.x -= 1;
    if (keys.ArrowRight) desiredVelocity.x += 1;
    if (keys.ArrowUp) desiredVelocity.y -= 1;
    if (keys.ArrowDown) desiredVelocity.y += 1;

    if (desiredVelocity.x !== 0 || desiredVelocity.y !== 0) {
      desiredVelocity = Vector.normalize(desiredVelocity);
      desiredVelocity = Vector.multiply(desiredVelocity, this.maxSpeed);

      let deltaVelocity = Vector.subtract(desiredVelocity, { x: this.velocityX, y: this.velocityY });

      let t = MathUtils.bezierBlend(this.acceleration);
      this.velocityX += deltaVelocity.x * t;
      this.velocityY += deltaVelocity.y * t;
    } else {
      // Apply friction when no keys are pressed
      this.velocityX *= this.friction;
      this.velocityY *= this.friction;
    }

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Keep player within canvas bounds
    this.x = MathUtils.clamp(this.x, 0, canvasWidth - this.size);
    this.y = MathUtils.clamp(this.y, 0, canvasHeight - this.size);
  }

  draw(ctx) {
    if (this.svgImage.complete && this.svgImage.naturalHeight !== 0) {
      ctx.drawImage(this.svgImage, this.x, this.y, this.size, this.size);
    } else {
      // Fallback to drawing a rectangle if SVG hasn't loaded
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }
}
