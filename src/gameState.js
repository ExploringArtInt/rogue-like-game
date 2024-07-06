// gameState.js

export default class GameState {
  constructor() {
    this.currentLevel = 1;
    this.currentSeed = Date.now();
    this.playerEnergy = 100;
    this.playerHealth = 100;
    this.gamesCompleted = 0;
  }

  incrementLevel() {
    this.currentLevel++;
    this.currentSeed = Date.now();
  }

  resetLevel() {
    this.currentLevel = 1;
    this.currentSeed = Date.now();
  }

  setEnergy(energy) {
    this.playerEnergy = Math.max(0, Math.min(100, energy));
  }

  setHealth(health) {
    this.playerHealth = Math.max(0, Math.min(100, health));
  }

  incrementGamesCompleted() {
    this.gamesCompleted++;
  }

  reset() {
    this.currentLevel = 1;
    this.currentSeed = Date.now();
    this.playerEnergy = 100;
    this.playerHealth = 100;
  }

  isGameWon() {
    return this.currentLevel === 5;
  }

  isGameLost() {
    return this.playerEnergy <= 0 || this.playerHealth <= 0;
  }
}
