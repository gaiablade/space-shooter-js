"use strict";

/**
 * Laser class:
 *      Interface for the lasers fired by the player character.
 * @author Caleb Geyer
 * @typedef Laser
*/
class Laser {
  /**
   * Canvas position of the laser.
   * @type {Object}
  */
  position = null;

  /**
   * Pixel dimensions of the laser.
   * @type {Object}
  */
  size = {width: Config.laserWidth, height: Config.laserHeight};

  /**
   * Flag of whether the laser has collided with an enemy.
   * @type {Boolean}
  */
  collided = false;

  /**
   * Initializes laser based on player position.
   * @param {Player} player Active player character.
  */
  constructor(player) {
    this.gm = player.gm;
    this.position = {x: player.position.x + (player.size.width / 2), y: player.position.y};
  }

  /**
   * Updates the position and checks for collision.
   * @param {Number} dt DeltaTime
  */
  update(dt) {
    this.updatePosition(dt);
    this.checkCollision();
  }

  /**
   * Draw laser to canvas.
   * @param {CanvasRenderingContext2D} graphics Graphical context to draw to.
  */
  draw(graphics) {
    graphics.fillStyle = Config.laserColor;
    graphics.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
  }

  /**
   * Update position based on speed.
   * @param {Number} dt DeltaTime
  */
  updatePosition(dt) {
    this.position.y -= Config.laserSpeed * dt;
  }

  /**
   * Iterate through enemies and check for collisions.
   * @param none
  */
  checkCollision() {
    // Check for collision with enemy:
    this.gm.enemies.forEach((enemy, index) => {
      if (this.position.x < enemy.position.x + enemy.size.width && this.position.x + this.size.width > enemy.position.x) {
        if (this.position.y < enemy.position.y + enemy.size.height && this.position.y + this.size.height > enemy.position.y) {
          this.gm.animations.push(new Animation(explosionParameters, enemy.position.x, enemy.position.y))
          this.gm.numKills++;
          this.gm.spawnPowerups(enemy.position);
          delete this.gm.enemies[index];
          this.collided = true;
        }
      }
    })
  }
}
