"use strict";

/**
 * Entity class:
 *      Base class that more specific entities inherit from. Such classes are
 *      the player and the enemies.
 * @author Caleb Geyer
 * @typedef Entity
*/
class Entity {
  /**
   * Canvas position of the entity.
   * @type {Object}
  */
  position = {x:0, y:0};

  /**
   * Movement velocity of the entity.
   * @type {Object}
  */
  velocity = {x:0, y:0};

  /**
   * Pixel dimensions of the entity.
   * @type {Object}
  */
  size = {width: 10, height: 10};

  /**
   * Health component of the entity.
   * @type {Number}
  */
  health = Config.playerHealth;

  /**
   * Initializes entity with a numerical ID and pushes it to the global entity
   * array.
   * @param none
  */
  constructor() {
    this.id = Config.runningId++;
    Config.entities[this.id] = this;
  }
}
