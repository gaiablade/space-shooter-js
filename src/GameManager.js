"use strict";

/**
 * GameManager class:
 *      Functions as a container for variables and objects that are used by many
 *      objects.
 * @author Caleb Geyer
 * @typedef GameManager
*/
class GameManager {
  /**
   * Game Over flag.
   * @type {Boolean}
  */
  gameOver = false;

  /**
   * Player character.
   * @type {Player}
  */
  player = null;

  /**
   * The last recorded time from the previous iteration of the main game loop.
   * @type {Number}
  */
  lastTime = null;

  /**
   * The array of lasers currently on the field.
   * @type {Object}
  */
  lasers = [];

  /**
   * The array of enemies on the field.
   * @type {Object}
  */
  enemies = [];

  /**
   * The field's enemy spawner.
   * @type {EnemySpawner}
  */
  enemySpawner = null;

  /**
   * Number of enemies that have been destroyed.
   * @type {Number}
  */
  numKills = 0;

  /**
   * Total number of frames the game has been running.
   * @type {Number}
  */
  upFrames = 0;

  /**
   * Total number of seconds the game has been running.
   * @type {Number}
  */
  globalUpTime = 0; // in seconds

  /**
   * Number of minutes the game ha been running.
   * @type {Number}
  */
  num_Minutes = 0;

  /**
   * Number of seconds in the current minute.
   * @type {Number}
  */
  num_Seconds = 0;

  /**
   * Formatted string that displays number of minutes the game has been running.
   * @type {String}
  */
  str_Minutes = "";

  /**
   * Formatted string that displays the number of seconds have passed in the
   * current minute.
   * @type {String}
  */
  str_Seconds = "";

  /**
   * Player score.
   * @type {Number}
  */
  score = 0;

  /**
   * Array of animations.
   * @type {Object}
  */
  animations = [];

  /**
   * Array of powerups.
   * @type {Object}
  */
  powerups = [];

  /**
   * Constructor:
   *    Initializes the player and enemy spawner, as well as setting up an event
   *    listener for restarting the game.
   * @param none
   * @returns none
  */
  constructor() {
    this.player = new Player(this);
    this.lastTime = 0;
    this.enemySpawner = new EnemySpawner(this);
    window.addEventListener("keydown", (event) => this.keydown(event), false);
  }

  /**
   * update(dt):
   *    Iterates through and updates all member objects.
   * @param {Number} dt The amount of time since the last loop iteration.
   * @returns none
  */
  update(dt) {
    // Advance animations:
    this.animations.forEach((animation) => {
      animation.update(dt);
    });

    // Update total number of frames that have passed:
    this.upFrames += dt;

    // Calculate up-time using the number of frames: (in seconds)
    this.globalUpTime = Math.floor(this.upFrames / 60 * 100);

    // Check for enemy movement:
    this.enemies.forEach((enemy) => {
      enemy.update(dt);
    });

    // Move lasers and check for collision with enemies:
    this.lasers.forEach((laser) => {
      laser.update(dt);
    });
    this.updateLasers();

    // Move powerups:
    this.powerups.forEach((powerup) => {
      powerup.update(dt);
    });

    // Don't update other objects if the game has ended:
    if (this.gameOver) return;

    // Check for player movement, attacks, etc.:
    this.player.update(dt);

    // Spawn a new enemy if interval has passed:
    this.enemySpawner.update(dt);

    this.checkGameOver();

    // Calculations:
    this.num_Seconds = Math.floor(this.globalUpTime % 60);
    this.num_Minutes = Math.floor(this.globalUpTime / 60);
    this.str_Seconds = (this.num_Seconds < 10) ? "0" + this.num_Seconds : String(this.num_Seconds);
    this.str_Minutes = (this.num_Minutes < 10) ? "0" + this.num_Minutes : String(this.num_Minutes);
    this.score = Math.floor(30 * this.numKills + this.num_Seconds);
    Config.enemySpawnRate = 0.5 - 0.01 * Math.floor(this.numKills / 5);
  }

  /**
   * draw(graphics):
   *    Iterates through all objects and draws them to the canvas.
   * @param {CanvasRenderingContext2D} graphics Graphical context to draw to.
  */
  draw(graphics) {
    // Draw player, enemies, particles, and lasers:
    this.animations.forEach((animation) => {
      if (!animation.finished) {
        animation.draw(graphics);
      }
    });
    this.player.draw(graphics);
    this.enemies.forEach((enemy) => {
      enemy.draw(graphics);
    });
    this.lasers.forEach((laser) => {
      laser.draw(graphics);
    });
    this.powerups.forEach((powerup) => {
      powerup.draw(graphics);
    });

    // Clear the stat bar on the right:
    graphics.fillStyle = "#70140d";
    graphics.fillRect(Config.width, 0, Config.statBarDimensions.width, Config.statBarDimensions.height);

    // Configure text rendering:
    graphics.font = "17px Arial";
    graphics.fillStyle = '#FFFFFF';

    // Display stats:
    graphics.fillText(`Stats`, Config.width + 50, 20);
    graphics.fillText(`HP: ${this.player.health}`, Config.width + 15, 50);
    graphics.fillText(`# of kills: ${this.numKills}`, Config.width + 15, 70);
    graphics.fillText(`Time: ${this.str_Minutes}:${this.str_Seconds}`, Config.width + 15, 90);
    graphics.fillText(`Score: ${this.score}`, Config.width + 15, 110);
    graphics.fillText(`Enemies: ${this.enemies.length}`, Config.width + 15, 130);
    graphics.fillText(`Bombs: ${this.player.numBombs}`, Config.width + 15, 150);
  }

  /**
   * checkGameOver():
   *    Checks if the player's ship has been destroyed and updates the gameOver
   *    boolean accordingly
   * @param none
  */
  checkGameOver() {
    if (this.player.health <= 0) {
      // game lost
      this.animations.push(new Animation(explosionParameters, this.player.position.x, this.player.position.y));
      this.player.destroy();
      this.gameOver = true;
    }
  }

  /**
   * updateLasers():
   *    Iterates through each laser and removes it if it has gone out of bounds
   *    or collided with an enemy.
   * @param none
  */
  updateLasers() {
    this.lasers.forEach((laser, index) => {
      if (laser.position.y <= 0 || laser.collided) {
        this.lasers.splice(index, 1);
      }
    });
  }

  /**
   * updateAnimations():
   *    Removes finished animations.
   * @param none
  */
  updateAnimations() {
    this.animations.forEach((animation, index) => {
      if (animation.finished) {
        this.animations.splice(index, 1);
      }
    });
  }

  /**
   * bombScreen():
   *    Detonates a bomb that destroys all enemies on screen. Bomb uses are
   *    limited, however.
   * @param none
  */
  bombScreen() {
    this.animations.push(new Animation(fsExplosionParameters, 0, Config.height / 2 - Config.width / 2, Config.width, Config.width));
    this.enemies.forEach((enemy) => {
      this.numKills++;
      this.animations.push(new Animation(explosionParameters, enemy.position.x, enemy.position.y))
    });
    this.enemies = [];
  }

  /**
   * createLaser():
   *    Fires a laser using the player's position component.
   * @param none
   * @returns none
  */
  createLaser() {
    this.lasers.push(new Laser(this.player));
  }

  /**
   * keydown(event):
   *    Callback for the event listener
   * @param {Event/Object} event Represents the key information
   * @returns none
  */
  keydown(event) {
    if (this.gameOver) {
      if (event.keyCode == 82) {
        this.gameOver = false;
        this.player = new Player(this);
        this.enemies = [];
        this.score = 0;
        this.upFrames = 0;
        this.numKills = 0;
        this.animations = [];
        this.enemies = [];
        this.lasers = [];
      }
    }
  }

  spawnPowerups(position) {
    if (this.numKills == 100) {
      this.powerups.push(new SpeedPowerup(position, this));
    }
    else if (this.numKills % 50 == 0) {
      this.powerups.push(new BombPowerup(position, this));
    }
  }
}
