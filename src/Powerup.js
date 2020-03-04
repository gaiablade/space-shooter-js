/**
 * Powerup Class:
 *      Base class for powerups dropped by enemies.
 * @author Caleb Geyer
 * @typedef Powerup
*/
class Powerup {
  /**
   * Canvas position of powerup.
   * @type {Object}
  */
  position = {x: 100, y: 0};
  /**
   * Pixel dimensions of powerup.
   * @type {Object}
  */
  size = {width: 20, height: 20};
  /**
   * Current lifespan of powerup.
   * @type {Number}
  */
  time = 0;
  /**
   * Movement velocity of powerup. Generally only the y-component is modified,
   * but an x-component was included for expandability.
   * @type {Object}
  */
  velocity = {x: 0, y: 0};
  /**
   * Handle to sprite object.
   * @type {HTMLImageElement}
  */
  sprite = null;

  /**
   * Initialize position of the powerup.
   * @param {Object} position Contains x and y components of powerup's position.
  */
  constructor(position) {
    this.position = position;
  }

  /**
   * Updates velocity and position of powerup on screen.
   * @param {Number} dt DeltaTime.
  */
  update(dt) {
    this.time += dt;

    this.velocity.x = 0;
    this.velocity.y = 1 * this.time;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  /**
   * Draws powerup to the screen.
   * @param {CanvasRenderingContext2D} graphics Graphical context to draw to.
  */
  draw(graphics) {
    graphics.drawImage(this.sprite, this.position.x, this.position.y, this.size.width, this.size.height);
  }
}

class BombPowerup extends Powerup {
  /**
   * Initializes position, GameManager handle, and sprite of powerup.
   * @param {Object} position Starting position of powerup.
   * @param {GameManager} gm GameManager handle.
  */
  constructor(position, gm) {
    super(position);
    this.gm = gm;
    this.sprite = i_BombPowerup;
  }

  /**
   * Defines the behaviour of the powerup when it is collected.
   * @param none.
  */
  collisionFunc() {
    gm.player.numBombs++;
  }
}

class SpeedPowerup extends Powerup {
  /**
   * Initializes position, GameManager handle, and sprite of powerup.
   * @param {Object} position Starting position of powerup.
   * @param {GameManager} gm GameManager handle.
  */
  constructor(position, gm) {
    super(position);
    this.gm = gm;
    this.sprite = i_SpeedPowerup;
  }

  /**
   * Defines the behaviour of the powerup when it is collected.
   * @param none.
  */
  collisionFunc() {
    Config.laserColor = "#1111FF";
    Config.fireDelay = 0.07;
  }
}
