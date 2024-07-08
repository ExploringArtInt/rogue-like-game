# __tests__/player.feature
Feature: Player
  As a player
  I want to ensure my Player works correctly
  So that the game behaves as expected

  Scenario: Player initialization
    Given a new player is created at position (100, 100) with size 50 and color "#FFFFFF"
    Then the player should have the correct initial properties

  Scenario: Player movement
    Given a new player is created at position (100, 100) with size 50 and color "#FFFFFF"
    When the player moves right and down
    Then the player's position should be updated accordingly
