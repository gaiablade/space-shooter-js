"use strict";

/**
 * InputHandler class:
 *      Handles input related to player movement and action.
 * @author Caleb Geyer
 * @typdef InputHandler
*/
class InputHandler {
  /**
   * Key codes for all the mapped inputs.
   * @type {Object}
  */
  keyBindings = {
    37: { key: "left"  },
    39: { key: "right" },
    38: { key: "up"    },
    40: { key: "down"  },
    90: { key: "z"     },
    88: { key: "x"     }
  };

  /**
   * Initializes the InputHandler.
   * @param {Player} player Handle to the current active player.
  */
  constructor(player) {
    this.player = player;
    this.gm = this.player.gm;
    window.addEventListener("keydown", (event) => this.keydown(event), false);
    window.addEventListener("keyup", (event) => this.keyup(event), false);
  }

  /**
   * Callback for the keydown event listener.
   * @param {Event/Object} event Event information.
  */
  keydown(event) {
    if (event.repeat) return;
    if (this.keyBindings.hasOwnProperty(event.keyCode)) {
      const mapping = this.keyBindings[event.keyCode];
      this.player.keys[mapping.key].polled = true;
    }
  }

  /**
   * Callback for the keyup event listener.
   * @param {Event/Object} event Event information.
  */
  keyup(event) {
    if (this.keyBindings.hasOwnProperty(event.keyCode)) {
      const mapping = this.keyBindings[event.keyCode];
      this.player.keys[mapping.key].polled = false;
    }
  }
}
