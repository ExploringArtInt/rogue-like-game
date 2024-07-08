Feature: Game Functionality
  As a player
  I want to interact with the game
  So that I can play and progress through levels

  Scenario: Starting a new game
    Given the game is initialized
    When I start a new game
    Then the game should be in its initial state

  Scenario: Player movement
    Given the game is running
    When I press the right arrow key
    Then the player should move to the right

  Scenario: Collision detection
    Given the game is running
    And there is a block in front of the player
    When the player moves towards the block
    Then the player should not pass through the block

  Scenario: Level progression
    Given the game is running
    And the player is near a door
    When the player uses the door
    Then the game should advance to the next level

  Scenario: Game pausing
    Given the game is running
    When I pause the game
    Then the game should stop updating

  Scenario: Game resuming
    Given the game is paused
    When I resume the game
    Then the game should continue updating

  Scenario: Game over detection
    Given the game is running
    When the player's energy reaches 0
    Then the game should end

  Scenario: Game winning
    Given the game is running
    When the player completes the final level
    Then the game should show a victory message
