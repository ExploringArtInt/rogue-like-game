// journeys.js
//
// Prompt: Review a_journeys.js and suggest additional journeys for the game.

// Result: journey("Energy Management", "player", "Player Abilities", "Consuming energy during movement")

/*** The Prompt that changed everything: Use journey("Energy Management", "player", "Player Abilities", "Consuming energy during movement") to update bdd/player.feature.txt, player.steps.js, player.test.js ***/

export function journeyNewGameStart() {
  journey("New Game Start", "game", "Game Functionality", "Game initialization");
  journey("New Game Start", "game", "Game Functionality", "Starting the game");
  journey("New Game Start", "gameState", "Game State Management", "Initializing a new game state");
  journey("New Game Start", "player", "Player Abilities", "Player initialization");
}

export function journeyGameplayLoop() {
  journey("Gameplay Loop", "game", "Game Functionality", "Game drawing");
  journey("Gameplay Loop", "game", "Game Functionality", "Game loop");
  journey("Gameplay Loop", "game", "Game Functionality", "Game update");
  journey("Gameplay Loop", "game", "Game Functionality", "Handling key presses");
  journey("Gameplay Loop", "player", "Player Abilities", "Player movement");
}

export function journeyPlayerStatus() {
  journey("Player Status", "gameState", "Game State Management", "Setting player energy");
  journey("Player Status", "gameState", "Game State Management", "Setting player health");
}

export function journeyMenuInteraction() {
  journey("Menu Interaction", "game", "Game Functionality", "Pausing the game");
  journey("Menu Interaction", "gui", "Game User Interface", "Closing the game menu");
  journey("Menu Interaction", "gui", "Game User Interface", "Focusing menu options");
  journey("Menu Interaction", "gui", "Game User Interface", "Opening the game menu");
}

export function journeyLevelProgression() {
  journey("Level Progression", "game", "Game Functionality", "Going to next level");
  journey("Level Progression", "gameState", "Game State Management", "Incrementing the level");
  journey("Level Progression", "gui", "Game User Interface", "Updating game state display");
}

export function journeySaveLoadGame() {
  journey("Save/Load Game", "gameState", "Game State Management", "Serializing and deserializing game state");
  journey("Save/Load Game", "gui", "Game User Interface", "Restoring the game state");
  journey("Save/Load Game", "gui", "Game User Interface", "Saving the game state");
}

export function journeyGameReset() {
  journey("Game Reset", "game", "Game Functionality", "Restarting the game");
  journey("Game Reset", "gameState", "Game State Management", "Resetting the game state");
  journey("Game Reset", "gameState", "Game State Management", "Resetting the level");
  journey("Game Reset", "gui", "Game User Interface", "Deleting saved game data");
}

export function journeyGameOver() {
  journey("Game Over", "gameState", "Game State Management", "Checking if the game is lost due to no energy");
  journey("Game Over", "gameState", "Game State Management", "Checking if the game is lost due to no health");
  journey("Game Over", "gameState", "Game State Management", "Checking if the game is won");
  journey("Game Over", "gameState", "Game State Management", "Incrementing games completed");
  return;
}

function journey(name, module, feature, scenario) {
  return;
}
