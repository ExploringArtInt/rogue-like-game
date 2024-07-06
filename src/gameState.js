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

  toJSON() {
    return JSON.stringify({
      currentLevel: this.currentLevel,
      currentSeed: this.currentSeed,
      playerEnergy: this.playerEnergy,
      playerHealth: this.playerHealth,
      gamesCompleted: this.gamesCompleted,
    });
  }

  fromJSON(jsonString) {
    try {
      const parsedState = JSON.parse(jsonString);
      this.currentLevel = parsedState.currentLevel || 1;
      this.currentSeed = parsedState.currentSeed || Date.now();
      this.playerEnergy = parsedState.playerEnergy || 100;
      this.playerHealth = parsedState.playerHealth || 100;
      this.gamesCompleted = parsedState.gamesCompleted || 0;
    } catch (error) {
      console.error("Error parsing game state JSON:", error);
      // If there's an error parsing, we'll reset to default values
      this.reset();
    }
  }
}
