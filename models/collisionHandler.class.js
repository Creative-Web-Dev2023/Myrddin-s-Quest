class CollisionHandler {
    constructor(world) {
        this.world = world;
    }

    checkCollisions() {
        this.checkCollisionWithPoisons();
        this.checkCollisionsWithEnemies();
        this.checkCollisionWithKey();
        this.checkDoorCollision();
        this.checkTraps();
    }

    checkCollisionWithPoisons() {
        this.world.poisonsArray.forEach((poison, index) => {
            if (this.world.checkCollision(this.world.character, poison)) {
                this.world.character.collectPoison(poison, index);
            }
        });
    }

    checkCollisionsWithEnemies() {
        this.world.enemies.forEach((enemy) => {
            if (this.world.checkCollision(this.world.character, enemy)) {
                if (enemy instanceof Snake) {
                    if (this.world.character.isAboveGround() && this.world.character.speedY > 0) {
                        this.world.character.jump();
                        if (!enemy.isDead) {
                            enemy.takeDamage(20);
                        }
                    } else {
                        if (!enemy.isDead) {
                            this.world.character.hit(enemy);
                            this.world.characterStatusBar.setPercentage(this.world.character.energy);
                        }
                    }
                }
            } else if (enemy instanceof Snake) {
                const distance = Math.abs(this.world.character.x - enemy.x);
                if (distance <= 100 && !enemy.isDead) {
                    enemy.attack();
                }
            }
        });
    }

    checkCollisionWithKey() {
        if (this.world.key && this.world.key.isActive && this.world.checkCollision(this.world.character, this.world.key)) {
            this.world.key.deactivate();
            this.world.character.collectKey(this.world.key);
        }
    }

    checkDoorCollision() {
        const door = this.world.door;
        if (this.world.character.hasKey && this.world.character.checkCollisionWithDoor(door)) {
            this.world.character.enterDoor();
            setTimeout(() => {
                this.world.levelCompleted = true;
                continueToNextLevel();
            }, 2000);
        }
    }

    checkTraps() {
        if (this.world.traps) {
            this.world.traps.forEach(trap => {
                if (this.world.checkCollision(this.world.character, trap)) {
                    trap.isActive = true;
                    this.world.character.takeDamage(10);
                    this.world.characterStatusBar.setPercentage(this.world.character.energy);
                } else {
                    trap.isActive = false;
                }
            });
        }
    }

    checkCollision(character, object) {
        const charBox = character.getCollisionBox();
        const objBox = object.getCollisionBox();
        return (
            charBox.x < objBox.x + objBox.width &&
            charBox.x + charBox.width > objBox.x &&
            charBox.y < objBox.y + objBox.height &&
            charBox.y + charBox.height > objBox.y
        );
    }
}
