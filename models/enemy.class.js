class Enemy extends MovableObject {
    constructor(id) {
        super();
        this.id = id || Math.random().toString(36).substr(2, 9); // Generiere eine ID, falls keine vorhanden ist
    
        this.dead = false;
        this.isAttacking = false;
        this.energy = 100;
        this.deathAnimationPlayed = false;
        this.isRemoved = false; // Variable, um zu überprüfen, ob der Feind bereits entfernt wurde
    }

    setWorld(world) {
        if (!(this instanceof Enemy)) {
            console.error("setWorld called on non-Enemy object:", this);
            return;
        }
        this.world = world;
        console.log(`World set for enemy with ID: ${this.id}, world:`, this.world); // Debugging
    }

    takeDamage(damage) {
        if (!this.dead) {
            this.energy -= damage;
            console.log(`Feind mit ID ${this.id} nimmt Schaden: ${damage}. Verbleibende Energie: ${this.energy}`);
            if (this.energy <= 0) {
                this.energy = 0;
                this.die();
            }
        }
    }
    

    die() {
        if (!this.isDead()) {
            console.log(`Feind mit ID ${this.id} stirbt.`);
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
            console.log(`Todesanimation gestartet für Feind mit ID: ${this.id}`);
            this.playAnimation(this.IMAGES_DEAD);
    
            setTimeout(() => {
                console.log(`Entferne Feind mit ID: ${this.id}`);
                this.removeEnemy();
            }, 1500); // Zeit anpassen, wie lange die Todesanimation dauert
        }
    }
    
    removeEnemy() {
        if (this.isRemoved) return; // Überprüfen, ob der Feind bereits entfernt wurde
        if (this.world && this.world.enemies) {
            const index = this.world.enemies.findIndex(enemy => enemy.id === this.id);
            if (index !== -1) {
                this.world.enemies.splice(index, 1);
                this.isRemoved = true; // Markiere den Feind als entfernt
                console.log('Enemy removed');
            } else {
                console.log('Enemy not found');
            }
        } else {
            console.log('World or enemies not defined');
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