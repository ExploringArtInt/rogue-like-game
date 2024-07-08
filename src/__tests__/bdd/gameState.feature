Feature: Game State Management

  Scenario: Initializing a new game state
    Given a new game is started
    Then the current level should be 1
    And the player energy should be 100
    And the player health should be 100
    And the games completed should be 0

  Scenario: Incrementing the level
    Given the current level is 1
    When the level is incremented
    Then the current level should be 2

  Scenario: Resetting the level
    Given the current level is 5
    When the level is reset
    Then the current level should be 1

  Scenario: Setting player energy
    Given the player energy is 100
    When the player energy is set to 50
    Then the player energy should be 50

  Scenario: Setting player health
    Given the player health is 100
    When the player health is set to 75
    Then the player health should be 75

  Scenario: Incrementing games completed
    Given the games completed is 0
    When a game is completed
    Then the games completed should be 1

  Scenario: Resetting the game state
    Given the current level is 3
    And the player energy is 50
    And the player health is 75
    When the game state is reset
    Then the current level should be 1
    And the player energy should be 100
    And the player health should be 100

  Scenario: Checking if the game is won
    Given the current level is 5
    Then the game should be won

  Scenario: Checking if the game is lost due to no energy
    Given the player energy is 0
    Then the game should be lost

  Scenario: Checking if the game is lost due to no health
    Given the player health is 0
    Then the game should be lost

  Scenario: Serializing and deserializing game state
    Given a game state with custom values
    When the game state is serialized and then deserialized
    Then the deserialized game state should match the original
