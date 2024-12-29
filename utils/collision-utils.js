
class CollisionUtils {
    static checkCollision(obj1, obj2) {
      if (typeof obj1.getCollisionBox !== 'function' || typeof obj2.getCollisionBox !== 'function') {
        console.error('Objects do not have getCollisionBox method:', obj1, obj2);
        return false;
      }
      const box1 = obj1.getCollisionBox();
      const box2 = obj2.getCollisionBox();
  
      return (
        box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.y + box1.height > box2.y
      );
    }
  
    static isColliding(obj1, obj2) {
      return this.checkCollision(obj1, obj2);
    }
  
    static checkCollisionWithObjects(obj, objectsArray, callback) {
      objectsArray.forEach((object, index) => {
        if (this.checkCollision(obj, object)) {
          callback(object, index);
        }
      });
    }
  
    static checkCollisionsWithCollectables(character, collectables, handleCollectable) {
      collectables.forEach((collectable) => {
        if (this.checkCollision(character, collectable) && collectable.isActive) {
          collectable.deactivate(); // Deaktiviere das Sammelobjekt
          handleCollectable(collectable); // Reagiere basierend auf dem Typ
        }
      });
    }
  }