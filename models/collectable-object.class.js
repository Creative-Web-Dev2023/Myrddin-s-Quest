class CollectableObject extends DrawableObject {
    constructor() {
        super();
        this.IntervallIDs = [];
    }

    animate() {
      let id = setInterval(() => {
        this.playAnimation(this.IMAGES);
      }, 1000 / 5);

      this.IntervallIDs.push(id);
    }
}