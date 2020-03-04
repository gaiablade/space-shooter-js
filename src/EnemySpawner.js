"use strict";

/**
 * EnemySpawner class:
 *      Periodically spawns and pushes new enemies to the field.
 * @author Caleb Geyer
 * @typedef EnemySpawner
*/
class EnemySpawner {
  /**
   * Initializes the enemy spawner and immediately polls an enemy to be spawned.
   * @param {GameManager} gm Provides access to the enemy array.
  */
  constructor(gm) {
    this.gm = gm;
    this.sinceSpawn = Config.enemySpawnRate;
  }

  /**
   * Updates the time since the last enemy was spawned and pushes a new one if
   * the spawn duration has been surpassed.
   * @param {Number} dt DeltaTime
   * @returns none
  */
  update(dt) {
    this.sinceSpawn += dt;
    if (this.sinceSpawn >= Config.enemySpawnRate) {
      this.spawnEnemy();
      this.sinceSpawn = 0;
    }
  }

  /**
   * Creates and pushes a new enemy into the enemy array.
   * @param none
   * @returns none
  */
  spawnEnemy() {
    this.gm.enemies.push(new Enemy(this.gm));
  }
}
