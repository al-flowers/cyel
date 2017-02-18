/**********************************************************
 *                    ANIMATION OVERLORD                  *
 **********************************************************/

/* The Animation Overlord will handle the animation frame looping while calling on individual object
 * methods to actually draw on the canvas.
 * Each canvas should only be matched with one Animation_Overlord
 */

var Animation_Overlord = function(canvas) {
    // use an object instead of array to be able to refer to each object by an id
    // TODO: figure out how to loop through all of an object's objects
    this.ani_queue = [];
    this.ani_objects = {};
};

// add an object with a display function to the Animation Overlord's army
Animation_Overlord.prototype.add = function(id, object) {
    this.ani_objects[id] = object;
    this.ani_queue.push(id);
};

// remove an object from the Animation Overlord's army
Animation_Overlord.prototype.remove = function(id) {
    delete this.ani_objects[id];
    var index = ani_queue.indexOf(id);
    this.ani_queue.splice(index, 1);
};

// CONCERN: may have to rethink scoping method. Just some thought candy when out and about.
Animation_Overlord.prototype.animate = function() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    this.ani_queue.forEach((object_id) => {
        if (this.ani_objects[object_id]) {
            this.ani_objects[object_id].display();
        } else {
            console.log("object with id \'" + title + "\' doesn't exist. sry pal.");
            return;
        }

    });

    window.requestAnimationFrame(() => this.animate());
};
