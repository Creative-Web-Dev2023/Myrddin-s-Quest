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
        this.world = world;
       
    }

    takeDamage(damage) {
        if (!this.dead) {
            // console.log(`Feind nimmt Schaden: ${damage}`);
            this.energy -= damage;
            if (this.energy <= 0) {
                this.energy = 0;
                this.die();
            }
        }
    }

    die() {
        if (!this.isDead()) {
            console.log('Feind stirbt');
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
            // console.log(`Feind mit ID ${this.id} spielt die Todesanimation`);
            this.playAnimation(this.IMAGES_DEAD);
            
            setTimeout(() => {
                // console.log(`Feind mit ID ${this.id} sollte jetzt entfernt werden`);
                this.removeEnemy();
            }, 3000);
        }
    }

    removeEnemy() {
        if (this.isRemoved) return; // Bereits entfernt

        if (!this.world || !this.world.enemies) {
            // console.error(`Fehler: this.world oder this.world.enemies ist undefined für Feind mit ID ${this.id}!`);
            return;
        }
    
        // console.log(`removeEnemy: Suche nach Feind mit ID ${this.id}`);
        // console.log("Aktuelle Feinde vor Entfernen:", this.world.enemies.map(enemy => enemy?.id));
    
        const enemyIndex = this.world.enemies.findIndex(enemy => enemy?.id === this.id);
        
        if (enemyIndex !== -1) {
            console.log(`Feind gefunden! Entferne ${this.constructor.name} mit ID: ${this.id}`);
            this.world.enemies.splice(enemyIndex, 1);
            this.isRemoved = true; // Markiere den Feind als entfernt
        } else {
            // console.warn(`Fehler: Feind mit ID ${this.id} wurde nicht gefunden!`);
        }
    
        // Entferne alle undefined-Einträge aus der Liste der Feinde
        this.world.enemies = this.world.enemies.filter(enemy => enemy !== undefined);
        // console.log("Aktuelle Feinde nach Entfernen:", this.world.enemies.map(enemy => enemy?.id));
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