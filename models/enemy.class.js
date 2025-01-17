class Enemy extends MovableObject {
    static nextId = 1;
    constructor(id) {
        super();
        this.id = id || Enemy.nextId++; 
        this.dead = false;
        this.isAttacking = false;
        this.energy = 100;
        this.deathAnimationPlayed = false;
        this.isRemoved = false; 
    }

    setWorld(world) {
        if (!(this instanceof Enemy)) {
            return;
        }
        this.world = world;
        if (!world.enemies.includes(this)) {
            world.enemies.push(this); // Füge den Feind hinzu, falls er fehlt
        }     
    }

    takeDamage(damage) {
        if (!this.dead) {
            this.energy -= damage;
           
            if (this.energy <= 0) {
                this.energy = 0;
                this.die();
            }
        }
    }
    
    die() {
        if (!this.isDead()) {
            this.dead = true;
            this.playDeathAnimation();
        }
    }

    isDead() {
        return this.energy <= 0 || this.dead;
    }

    playDeathAnimation() {
        if (!this.deathAnimationPlayed) {
            this.deathAnimationPlayed = true;
            this.dead = true;
            this.playAnimation(this.IMAGES_DEAD);
            setTimeout(() => {
                this.removeEnemy();
            }, 1500); // Zeit anpassen, wie lange die Todesanimation dauert
        }
    }
    
    removeEnemy() {
        if (this.isRemoved) return;
        if (!this.world) {
            return;
        }
        const index = this.world.enemies.findIndex(enemy => enemy.id === this.id);
        if (index !== -1) {
            this.world.enemies.splice(index, 1);
            this.isRemoved = true;
        }
    }
    
    hit(damage) {
        if (this.isDead() || this.deathAnimationPlayed) return;
        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
            this.playDeathAnimation();
        }
    }

    isHurt() {
        return this.energy < 100 && this.energy > 0;
    }

    attack(character) {
        if (this.dead || this.isAttacking) return;
        this.isAttacking = true;
        this.playAnimation(this.IMAGES_ATTACKING);
        setTimeout(() => {
            const characterBox = character.getCollisionBox();
            const enemyBox = this.getCollisionBox();
            const isStillInRange = enemyBox.x < characterBox.x + characterBox.width &&
                enemyBox.x + enemyBox.width > characterBox.x &&
                enemyBox.y < characterBox.y + characterBox.height &&
                enemyBox.y + enemyBox.height > characterBox.y;
            if (isStillInRange) {
                character.takeDamage(this.attackDamage);
            }
            setTimeout(() => {
                this.isAttacking = false;
            }, 500);
        }, 400);
    }

    animate() {
        setInterval(() => {
            if (this.dead) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACKING);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    getCollisionBox() {
        return {
            x: this.x + this.offset.left,
            y: this.y + this.offset.top,
            width: this.width - this.offset.left - this.offset.right,
            height: this.height - this.offset.top - this.offset.bottom,
        };
    }
}