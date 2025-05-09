/**
 * Handles all collision checks in the game.
 */
class CollisionHandler {
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks all relevant collisions in the game.
   */
  checkCollisions() {
    this.checkEnemyInteractions();
    this.checkCollectibles();
    this.checkTraps();
    this.checkDoor();
    this.checkThrowables();
  }

  /**
   * Checks collisions between character and enemies, and handles attacks.
   */
  checkEnemyInteractions() {
    // Combine all enemies (normal enemies + snakes)
    const allEnemies = [...this.world.enemies, ...this.world.snakes];
    
    allEnemies.forEach(enemy => {
      if (this.isColliding(this.world.character, enemy)) {
        this.handleEnemyCollision(enemy);
      }
      this.handleEnemyAttack(enemy);
    });

    // Special handling for Endboss projectiles
    this.checkEndbossProjectiles();
  }

  /**
   * Generic enemy collision handling.
   */
  handleEnemyCollision(enemy) {
    if (enemy.dead) return;

    // Character jumps on enemy
    if (this.world.character.isAboveGround() && this.world.character.speedY > 0) {
      this.world.character.jump();
      enemy.takeDamage(10);
    } 
    // Enemy damages character
    else {
      this.world.character.takeDamage(enemy.attackDamage);
    }
  }

  /**
   * Handles enemy attack logic.
   */
  handleEnemyAttack(enemy) {
    if (enemy.dead) return;
    
    // Check attack range (uses enemy's own attack range)
    const distance = Math.abs(this.world.character.x - enemy.x);
    if (distance <= enemy.attackRange) {
      enemy.attack(this.world.character);
    }
  }

  /**
   * Checks collisions with collectible items (poisons, key, crystal).
   */
  checkCollectibles() {
    // Poisons
    this.world.poisonsArray.forEach((poison, index) => {
      if (this.isColliding(this.world.character, poison)) {
        this.world.character.collectPoison(poison, index);
      }
    });

    // Key
    if (this.world.key?.isActive && this.isColliding(this.world.character, this.world.key)) {
      this.world.character.collectKey(this.world.key);
    }

    // Crystal
    if (this.world.crystal?.isActive && this.isColliding(this.world.character, this.world.crystal)) {
      this.world.crystal.collect();
    }
  }

  /**
   * Checks collisions with traps.
   */
  checkTraps() {
    this.world.traps.forEach(trap => {
      if (this.isColliding(this.world.character, trap)) {
        this.world.character.takeDamage(10);
      }
    });
  }

  /**
   * Checks door collision.
   */
  checkDoor() {
    if (this.world.door && this.isColliding(this.world.character, this.world.door)) {
      this.world.character.enterDoor(this.world.door);
    }
  }

  /**
   * Checks throwable object collisions with Endboss.
   */
  checkEndbossProjectiles() {
    this.world.throwableObjects.forEach(bottle => {
      this.world.enemies.forEach(enemy => {
        if (enemy instanceof Endboss && this.isColliding(bottle, enemy)) {
          enemy.takeDamage(25);
          bottle.deactivate();
        }
      });
    });
  }

  /**
   * Handles poison bottle throwing.
   */
  checkThrowables() {
    if (this.world.keyboard.D && this.world.character.poisonCollected > 0) {
      this.world.character.throwPoisonBottle();
      this.world.keyboard.D = false; 
    }
  }

  /**
   * Generic collision check between two objects.
   */
  isColliding(obj1, obj2) {
    const box1 = obj1.getCollisionBox?.() || obj1;
    const box2 = obj2.getCollisionBox?.() || obj2;

    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    );
  }
}