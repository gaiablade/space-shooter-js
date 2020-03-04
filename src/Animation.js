"use strict";

/**
 * AnimationTextureCoord class:
 *      Represents data for a texture coordinate in a spritesheet.
 * @author Caleb Geyer
 * @typedef AnimationTextureCoord
*/
class AnimationTextureCoord {
  /**
   * Number of frames until the next coordinate.
   * @type {Number}
  */
  frameDuration = 0;

  /**
   * Pixel coordinates in the spritesheet of the top-left of the coordinate.
   * @type {Number}
  */
  x = 0;
  y = 0;

  /**
   * Initializes the duration and coordinate parameters.
   * @param {Number} duration Frame duration of this coordinate.
   * @param {Number} x Pixel position of left-edge of coordinate.
   * @param {Number} y Pixel position of top-edge of coordinate.
  */
  constructor(duration, x, y) {
    this.frameDuration = duration;
    this.x = x;
    this.y = y;
  }
}

/**
 * AnimationParameters class:
 *      Contains an array of texture coordinates, the dimensions of each
 *      coordinate, and the texture file itself.
 * @author Caleb Geyer
 * @typedef AnimationParameters
*/
class AnimationParameters {
  /**
   * Texture file / spritesheet of the animation.
   * @type {HTMLImageElement}
  */
  texture = null;

  /**
   * TextureCoord array that contains all the texture coordinates of the
   * animation.
   * @type {Object}
  */
  textureCoords = null;

  /**
   * Pixel dimensions of the clipped coordinate.
   * @type {Object}
  */
  dimensions = {width: 0, height: 0};

  /**
   * @param {HTMLImageElement} texture Spritesheet.
   * @param {Object} array Array of texture coordinates.
   * @param {Number} width Width of coordinate.
   * @param {Number} height Height of coordinate.
  */
  constructor(texture, array, width, height) {
    this.texture = texture;
    this.textureCoords = array;
    this.dimensions.width = width;
    this.dimensions.height = height;
  }
}

/**
 * Animation class:
 *      Contains all the animation parameters listed above as well as the
 *      rendering information.
 * @typedef Animation
*/
class Animation {
  /**
   * Position on the canvas of the animation sprite.
   * @type {Object}
  */
  position = {x: 0, y: 0};

  /**
   * Current state of animation, whether it's queued for deletion.
   * @type {Boolean}
  */
  finished = false;

  /**
   * Pixel dimensions of the rendering sprite.
   * @type {Object}
  */
  size = {width: 0, height: 0};

  /**
   * Initializes the animation object.
   * @param {AnimationParameters} parameters Contains the animation data.
   * @param {Number} x Initial x position on the canvas.
   * @param {Number} y Initial y position on the canvas.
   * @param {Number} w Width of the sprite, assumed to be width of clipping
   *    rectangle unless specified otherwise.
   * @param {Number} w Height of the sprite, assumed to be height of clipping
   *    rectangle unless specified otherwise.
  */
  constructor(parameters, x, y, w = 0, h = 0) {
    this.data = parameters;
    this.frameCounter = parameters.textureCoords[0].frameDuration;
    this.length = parameters.textureCoords.length;
    this.currentTexture = 0;
    this.position.x = x;
    this.position.y = y;
    this.size.width = (w == 0) ? this.data.dimensions.width : w;
    this.size.height = (h == 0) ? this.data.dimensions.height : h;
  }

  /**
   * Updates the animation based on the amount of frames that have passed.
   * @param {Number} dt DeltaTime (number of frames that have passed since last
   *    iteration)
   * @returns none
  */
  update(dt) {
    this.frameCounter -= dt;
    if (this.frameCounter <= 0) {
      this.currentTexture++;
      if (this.currentTexture >= this.data.textureCoords.length) {
        this.finished = true;
        return;
      }
      this.frameCounter = this.data.textureCoords[this.currentTexture].frameDuration;
    }
  }

  /**
   * Draws the animation to the screen.
   * @param {CanvasRenderingContext2D} graphics Graphical context to draw to.
  */
  draw(graphics) {
    const texCoord = this.data.textureCoords[this.currentTexture];
    const dimensions = this.data.dimensions;
    graphics.drawImage(this.data.texture, texCoord.x, texCoord.y, dimensions.width, dimensions.height, this.position.x, this.position.y, this.size.width, this.size.height);
  }
}
