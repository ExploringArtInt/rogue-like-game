Feature: Game User Interface
  As a player
  I want to interact with the game through a user interface
  So that I can control the game and view game information

  Scenario: Opening the game menu
    Given the game is running
    When I click on the "Game Menu" button
    Then the game menu should be displayed
    And the game should be paused

  Scenario: Closing the game menu
    Given the game menu is open
    When I click on the "Close" button
    Then the game menu should be closed
    And the game should resume

  Scenario: Saving the game state
    Given the game menu is open
    When I click on the "Save Game" button
    Then the current game state should be saved

  Scenario: Restoring the game state
    Given the game menu is open
    And a saved game state exists
    When I click on the "Restore Game" button
    Then the saved game state should be restored

  Scenario: Deleting saved game data
    Given the game menu is open
    When I click on the "Delete All" button
    Then all saved game data should be deleted

  Scenario: Updating game state display
    Given the game is running
    When the player completes a level
    Then the game state display should be updated with the new level
