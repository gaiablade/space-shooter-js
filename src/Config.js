"use strict";

const canvas = document.getElementById("game_canvas");
const graphics = game_canvas.getContext('2d');

// Images/Sprites:
const i_ArrowKeys = document.getElementById("arrow_keys");
const i_ZKey = document.getElementById("z_key");
const i_XKey = document.getElementById("x_key");
const i_Ship = document.getElementById("ship");
const i_Enemy = document.getElementById('enemy');
const i_Retry = document.getElementById('replay_key');
const i_Explosion = document.getElementById('explosion');
const i_BombPowerup = document.getElementById('bomb_powerup');
const i_SpeedPowerup = document.getElementById('speed_powerup');

const Config = {
  // Canvas dimensions:
  width: 0,
  height: canvas.height,

  // Right side stat section:
  statBarDimensions: {
    width: 150, height: canvas.height
  },

  // Entity variables:
  runningId: 0,
  entities: [],

  // Player constants:
  playerSpeed: 250,
  playerHealth: 50,

  // Enemy constants:
  enemySpeed: 125,
  enemySpawnRate: 0.5,

  // Laser constants:
  laserWidth: 4,
  laserHeight: 10,
  laserSpeed: 500,
  fireDelay: 0.15, // in ms
  laserColor: "#1eff00",

  // Particle constants:
  particleInterval: 0.5,

  // Window constants:
  updateRate: {
    fps: 60,
    seconds: null
  }
};
Config.updateRate.seconds = 1 / Config.updateRate.fps;
Config.width = canvas.width - Config.statBarDimensions.width;

// Animations:
const explosionParameters = new AnimationParameters(i_Explosion,
  [new AnimationTextureCoord(0.04, 0, 0),
    new AnimationTextureCoord(0.04, 64, 0),
    new AnimationTextureCoord(0.04, 128, 0),
    new AnimationTextureCoord(0.04, 128 + 64, 0),
    new AnimationTextureCoord(0.04, 0, 64),
    new AnimationTextureCoord(0.04, 64, 64),
    new AnimationTextureCoord(0.04, 128, 64),
    new AnimationTextureCoord(0.04, 128 + 64, 64),
  ], 64, 64);

const fsExplosionParameters = new AnimationParameters(i_Explosion,
  [new AnimationTextureCoord(0.04, 0, 0),
    new AnimationTextureCoord(0.04, 64, 0),
    new AnimationTextureCoord(0.04, 128, 0),
    new AnimationTextureCoord(0.04, 128 + 64, 0),
    new AnimationTextureCoord(0.04, 0, 64),
    new AnimationTextureCoord(0.04, 64, 64),
    new AnimationTextureCoord(0.04, 128, 64),
    new AnimationTextureCoord(0.04, 128 + 64, 64),
  ], 64, 64);
