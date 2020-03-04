"use strict";

// Main Section
let gm = null;

class keyInstructions {
  opacity = 1.0;
  time = 0;
  update(dt) {
    this.time += dt;
    this.opacityFunc();
  }
  opacityFunc() {
    this.opacity = 1000 * Math.E ** (this.time * -6);
  }
}
let keyInstr = new keyInstructions();

function createLaser(player) {
  lasers.push(new Laser(player));
}

function updateEnemySpawn() {
  Config.enemy_spawn_rate = 1 - gm.numKills / 100;
}

function start() {
  Config.entities = [];
  graphics.drawImage(i_ArrowKeys, 15, 8);
  graphics.drawImage(i_ZKey, Config.width - i_ZKey.width - 12, 20);
  gm = new GameManager();
}

function update(dt) {
  gm.update(dt);
  keyInstr.update(dt);
  updateEnemySpawn();
}

function draw(graphics) {
  // Clear playing field:
  graphics.fillStyle = "#3f3073";
  graphics.clearRect(0, 0, Config.width, Config.height);
  graphics.globalAlpha = 0.3;
  graphics.fillRect(0, 0, Config.width, Config.height);
  graphics.globalAlpha = 1;

  gm.draw(graphics);

  // Draw controls
  graphics.globalAlpha = keyInstr.opacity;
  graphics.drawImage(i_ArrowKeys, 15, 8);
  graphics.drawImage(i_ZKey, Config.width - i_ZKey.width - 60, 20);
  graphics.drawImage(i_XKey, Config.width - i_XKey.width - 12, 20);
  graphics.globalAlpha = 1.0;
  if (gm.gameOver) {
    graphics.drawImage(i_Retry, Config.width / 2 - i_Retry.width, Config.height / 2);
  }
}

function loop(currentTime) {
  currentTime /= 1000;
  if (gm.lastTime === null) {
    gm.lastTime = currentTime;
  }
  let deltaTime = currentTime - gm.lastTime;
  while (deltaTime > Config.updateRate.seconds) {
    update(Config.updateRate.seconds);
    draw(graphics);
    deltaTime -= Config.updateRate.seconds;
    gm.lastTime = currentTime;
  }
  window.requestAnimationFrame(loop);
}

function clearFrame() {
  graphics.fillStyle = "#3f3073";
  graphics.fillRect(0, 0, Config.width, Config.height);
}

start();

window.requestAnimationFrame(loop);
