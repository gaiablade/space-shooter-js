"use strict";

/**
 * Particle class:
 *      Simple particles emitted from player and enemies.
 * @author Caleb Geyer
 * @typedef Particle
*/
class Particle {
  /**
   * Movement velocity of the laser.
   * @type {Object}
  */
  velocity = {x: 0, y: 0};

  /**
   * Pixel position on the canvas.
   * @type {Object}
  */
  position = {x: 0, y: 0};

  /**
   * Time since construction.
   * @type {Number}
  */
  time = 0;

  /**
   * Opacity of particle, ranging from 0 to 1.
   * @type {Number}
  */
  opacity = 1.0;

  /**
   * Creates a particle based on the position and velocity of the parent entity.
   * @param {Entity} entity Parent entity.
  */
  constructor(entity) {
    // particles will move in opposite direction of player
    this.entity = entity;
    this.position.x = this.entity.position.x + this.entity.size.width / 2;
    this.position.y = this.entity.position.y + this.entity.size.height - 10;
    this.velocity.x = this.entity.velocity.x * -0.3 + ((Math.random() - 0.5) * 0.3);
    this.velocity.y = this.entity.velocity.y * -0.3;
  }

  /**
   * Equation of movement and opacity based on time.
   * @param none.
  */
  movementFunc() {
    this.opacity = Math.sqrt(this.time * -1 + 0.4);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (Number.isNaN(this.opacity)) this.entity.particles.shift();
  }

  /**
   * Updates the position, velocity, and opacity based on time.
  */
  update(dt) {
    this.time += dt;
    this.movementFunc();
  }

  /**
   * Draws particle to canvas.
   * @param {CanvasRenderingContext2D} graphics Graphical context to draw to.
  */
  draw(graphics) {
    graphics.globalAlpha = this.opacity;
    graphics.fillStyle = '#FFFFFF';
    graphics.fillRect(this.position.x, this.position.y, 5, 5);
    graphics.globalAlpha = 1.0;
  }
}
