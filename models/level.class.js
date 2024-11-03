class Level{
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 1900;

    constructor(enemies, clouds, backgroundObjects){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = [];
        this.createCoins();
    }
    createCoins(){
        for (let i = 0; i < 5; i++) {
            let coin = new Coin(810 + i * 150, 300); // Platziere 5 Münzen in horizontaler Linie
            this.coins.push(coin);
        }
    }
    draw(ctx) {
        this.backgroundObjects.forEach((bg) => bg.draw(ctx));
        this.clouds.forEach((cloud) => cloud.draw(ctx));
        this.enemies.forEach((enemy) => enemy.draw(ctx));
        this.drawCoins(ctx); // Zeichne die Münzen
    }
}
