"use strict";

/**
 * Player class:
 *      Represents the active player character.
 * @author Caleb Geyer
 * @typedef Player
*/
class Player extends Entity {
  /**
   * Player input bindings and their behaviours.
   * @type {Object}
  */
  keys = {
    left:  { key: "left",  polled: false, state: "x_movement", mod: -1 },
    right: { key: "right", polled: false, state: "x_movement", mod:  1 },
    up:    { key: "up",    polled: false, state: "y_movement", mod: -1 },
    down:  { key: "down",  polled: false, state: "y_movement", mod:  1 },
    z:     { key: "z",     polled: false, state: "fire",       mod:  1 },
    x:     { key: "x",     polled: false, state: "bomb",       mod:  1 },
  }
  /**
   * Player actions polled that should be resolved in the update loop.
   * @type {Object}
  */
  polledActions = { x_movement: 0, y_movement: 0, fire: 0, bomb: 0 };

  /**
   * Pixel dimensions of player character.
   * @type {Object}
  */
  size = { width: 34, height: 37 };

  /**
   * Player input-handler object.
   * @type {InputHandler}
  */
  input_handler = null;

  /**
   * Frames since last bullet was fired.
   * @type {Number}
  */
  silentDuration = Config.fireDelay;

  /**
   * Particle array.
   * @type {Object}
  */
  particles = [];
  /**
   * Frames since last particle was emitted.
   * @type {Number}
  */
  sinceLastParticle = Config.particleInterval;

  /**
   * Number of bomb powerups collected still remaining.
   * @type {Number}
  */
  numBombs = 3;

  /**
   * Player sprite.
   * @type {HTMLImageElement}
  */
  sprite = i_Ship;

  /**
   * Sets GameManager handle and initializes position and input-handler.
   * @param {GameManager} gm GameManager handle.
  */
  constructor(gm) {
    super();
    this.gm = gm;
    this.position.x = Config.width / 2;
    this.position.y = Config.height - 100;
    this.input_handler = new InputHandler(this);
  }

  /**
   * Updates input, movement, collisions, etc.
   * @param {Number} dt DeltaTime.
  */
  update(dt) {
    this.particles.forEach((value) => {
      value.update(dt);
    });
    this.silentDuration += dt;
    this.updateInput();
    this.updateMovement(dt);
    this.updateAttack();
    this.checkCollisions();
  }

  /**
   * Draws Player to canvas.
   * @param {CanvasRenderingContext2D} graphics Graphical context to draw to.
  */
  draw(graphics) {
    this.particles.forEach((value) => {
      value.draw(graphics);
    });
    graphics.drawImage(this.sprite, this.position.x, this.position.y);
  }

  /**
   * Pushes new laser into the GameManager's laser array.
   * @param none.
  */
  fireLaser() {
    this.gm.createLaser();
  }

  /**
   * Checks for collisions with enemies and powerups.
   * @param none.
  */
  checkCollisions() {
    this.gm.enemies.forEach((value, index) => {
      if (this.position.x < value.position.x + value.size.width && this.position.x + this.size.width > value.position.x
      && this.position.y < value.position.y + value.size.height && this.position.y + this.size.height > value.position.y) {
        this.health -= 5;
        delete this.gm.enemies[index];
      }
    });

    this.gm.powerups.forEach((powerup, index) => {
      if (this.position.x < powerup.position.x + powerup.size.width && this.position.x + this.size.width > powerup.position.x
        && this.position.y < powerup.position.y + powerup.size.height && this.position.y + this.size.height > powerup.position.y) {
        powerup.collisionFunc();
        delete this.gm.powerups[index];
      }
    });
  }

  /**
   * Resolves polled actions.
   * @param none.
  */
  updateInput() {
    // Handle movement:
    Object.values(this.keys).forEach((key, index) => {
      if (key.polled) {
        this.polledActions[key.state] += key.mod;
      }
    });
  }

  /**
   * Resolves polled attacks and bomb uses.
   * @param none.
  */
  updateAttack() {
    if (this.keys.z.polled && this.silentDuration >= Config.fireDelay) {
      this.silentDuration = 0;
      this.fireLaser();
    }
    if (this.keys.x.polled && this.numBombs > 0) {
      gm.bombScreen();
      this.numBombs--;
      this.keys.x.polled = false;
    }
  }

  /**
   * Updates movement and prevents movement out of bounds.
   * @param {Number} dt DeltaTime.
  */
  updateMovement(dt) {
    this.sinceLastParticle += dt;
    this.velocity.x += Math.ceil(this.polledActions.x_movement * dt * Config.playerSpeed);
    this.velocity.y += Math.ceil(this.polledActions.y_movement * dt * Config.playerSpeed);
    if (this.polledActions.x_movement != 0 && this.polledActions.y_movement != 0) {
      this.velocity.x /= Math.sqrt(2);
      this.velocity.y /= Math.sqrt(2);
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.sinceLastParticle > Config.particleInterval) {
      this.particles.push(new Particle(this));
      this.sinceLastParticle = 0;
    }

    // Check if player is out of bounds of canvas:
    if (this.position.x > Config.width - this.size.width) {
      this.position.x = Config.width - this.size.width;
    }
    else if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = 0;
    }
    else if (this.position.y > Config.height - this.size.height) {
      this.position.y = Config.height - this.size.height;
    }
    this.polledActions.x_movement = 0;
    this.polledActions.y_movement = 0;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  /**
   * Moves player far out of bounds to simulate destruction.
   * @param none.
  */
  destroy() {
    this.position.x = 999;
    this.position.y = 999;
  }
}
