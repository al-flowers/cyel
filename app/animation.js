/************************************************
 *                    ANIMATOR                  *
 ************************************************/

/* The Animator will handle the animation frame looping while calling on individual object
 * methods to actually draw on the canvas.
 * Each canvas should only require one Animator.
 */

// TODO: Find a way to manipulate items in animation_objects without directly accessing the associative array
// TODO: Find an efficient way to display objects in ascending order by their depths (if possible...being efficient, that is)
function Animator(canvas) {
    this.animation_queue = [];      //Queue containing the id of each object that is currently being animated
    this.animation_objects = {};    //Associative array containing all animatable objects that exist within the game
}


// Add an object with a drawObject() method to the list of animatable objects
Animator.prototype.addObject = function(id, object, add_to_back = false) {
    if (this.animation_objects[id]) {
        this.removeObject(id);
    }

    if (add_to_back) {
        this.animation_queue.unshift(id);
    } else {
        this.animation_queue.push(id);
    }
    this.animation_objects[id] = object;
}


// Remove an object from the list of  animatable objects
Animator.prototype.removeObject = function(id) {
    delete this.animation_objects[id];
    var index = this.animation_queue.indexOf(id);
    this.animation_queue.splice(index, 1);
}


// Designate a current animatable object (sub-object) as a component of another animatable object (super-object)
Animator.prototype.designateComponent = function(super_id, sub_id) {
    this.animation_objects[super_id].components.push(this.animation_objects[sub_id]);
    this.removeObject(sub_id);
}


/* TODO: Add functionality for waiting on other objects to complete a specific action (refer to github history)
*/
Animator.prototype.animate = function() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    // Draw all queued animatable objects
    this.animation_queue.forEach((object_id) => {
        this.animation_objects[object_id].drawObject();
        this.animation_objects[object_id].update();
    });

    window.requestAnimationFrame(() => this.animate());

    return;
}
