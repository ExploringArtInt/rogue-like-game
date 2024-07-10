Feature: Game Functionality
  As a game developer
  I want to ensure the Game class functions correctly
  So that the game runs smoothly

  Scenario: Game initialization
    When a new Game is created
    Then the game should be properly initialized

  Scenario: Handling key presses
    Given a game is running
    When a key is pressed down
    Then the corresponding key state should be set to true
    When a key is released
    Then the corresponding key state should be set to false

  Scenario: Game update
    Given a game is running
    When the game is updated
    Then the player and level should be updated

  Scenario: Game drawing
    Given a game is running
    When the game is drawn
    Then the level and player should be drawn

  Scenario: Game loop
    Given a game is running
    When the game loop is executed
    Then the game should be updated and drawn

  Scenario: Starting the game
    Given a game is initialized
    When the game is started
    Then the game loop should be initiated

  Scenario: Restarting the game
    Given a game is running
    When the game is restarted
    Then the game state should be reset

  Scenario: Pausing the game
    Given a game is running
    When the game is paused
    Then the isPaused state should be updated

  Scenario: Going to next level
    Given a game is running
    When the player goes to the next level
    Then the game state should be updated for the new level
