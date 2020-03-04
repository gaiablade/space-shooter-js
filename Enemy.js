"use strict";

/**
 * Enemy class:
 * @author Caleb Geyer
 * @typdef Enemy
*/
class Enemy extends Entity {
  /**
   * Current lifespan in frames.
   * @type {Number}
  */
  time = 0;

  /**
   * Pixel dimensions of the enemy.
   * @type {Object}
  */
  size = {width:22, height:23};

  /**
   * Frames since last particle was emitted.
   * @type {Number}
  */
  sinceLastParticle = Config.particleInterval;

  /**
   * Array of emitted particles.
   * @type {Object}
  */
  particles = [];

  /**
   * Initializes the enemy.
   * @param {GameManager} gm Parent GameManager object.
  */
  constructor(gm) {
    super();
    this.gm = gm;
    let x_pos = Math.floor(Math.random() * (Config.width - this.size.width));
    this.position = {x: x_pos, y: -10};
    this.velocity.x = 2 * (Math.random() - 0.5);
  }

  /**
   * Updates the enemy and its particles.
   * @param {Number} dt DeltaTime
  */
  update(dt) {
    this.time += dt;
    this.sinceLastParticle += dt;
    for (const particle of this.particles) {
      particle.update(dt);
    }
    this.position.x = this.position.x + this.velocity.x;
    this.position.y = Math.ceil(this.position.y + this.velocity.y);
    this.speedFunc();
    if (this.position.y > Config.height) {
      this.gm.enemies.shift();
    }
    if (this.sinceLastParticle > Config.particleInterval) {
      this.particles.push(new Particle(this));
      this.sinceLastParticle = 0;
    }
  }

  /**
   * Draws the enemy and its particles to the screen.
   * @param {CanvasRenderingContext2D} graphics Graphical context to draw to.
  */
  draw(graphics) {
    this.particles.forEach((value) => {
      value.draw(graphics);
    });
    graphics.drawImage(i_Enemy, this.position.x, this.position.y);
  }

  /**
   * Calculates the y velocity of the enemy.
   * @param none
  */
  speedFunc() {
    // Quadratic vertical speed:
    this.velocity.y = ((1.8 * (this.time - 0.8)) ** 4);
  }
}
