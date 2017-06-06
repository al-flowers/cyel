/************************************************
 *                    ANIMATOR                  *
 ************************************************/

/* The Animator will handle the animation frame looping while calling on individual object
 * methods to actually draw on the canvas.
 * Each canvas should only require one Animator.
 */

 // TODO: find a way to manipulate items in animation_objects without directly accessing the associative array

function Animator(canvas) {
    this.animation_queue = [];      //Queue containing the id of each object that is currently being animated
    this.animation_objects = {};    //Associative array containing all animatable objects that exist within the game
}


// Add an object with a drawObject() method to the list of animatable objects
Animator.prototype.addObject = function(id, object) {
    this.animation_objects[id] = object;
    this.animation_queue.push(id);
}


// Remove an object from the list of  animatable objects
Animator.prototype.removeObject = function(id) {
    delete this.animation_objects[id];
    var index = this.animation_queue.indexOf(id);
    this.animation_queue.splice(index, 1);
}

/* TODO: Rewrite the animate function to incorporate the Action and ActionSet objects.
        Be sure to include a check for whether an action is paused (current design).
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



/*******************************
 *      ANIMATABLE OBJECT      *
 *******************************/

/* The AnimatableObject object contains all of the essential attributes and methods that
 * allow and object to participate in the animation cycle facilitated by the Animator object
 */
function AnimatableObject(id) {
    this.id = id;
    this.is_visible = false;
    this.action_queue = [];
    this.current_action_set;
    this.current_action_build;
    this.action_hold = false;

}

// Facilitate the object's animation by updating physical attributes and the list of actions
AnimatableObject.prototype.update = function() {
    /* TODO: implement the carryover function by checking all actions for a carryover value and
     * using the carryover() method once all of the current actions have a carryover value
     * set to 'true'. Remember to only carryover when there is another action set in the queue. */

    if (!this.current_action_set || this.current_action_set.isComplete()) {
        this.getActionSet();
    }
    // It is still possible for the current_action_set to be undefined if the action_queue is empty
    if (this.current_action_set) {
        var trash_actions = [];
        this.current_action_set.action_ids.forEach((action_id) => {
            var current_action = this.current_action_set.actions[action_id];
            if (!current_action.paused) {
                // The updateAction method shall return an updated Action object
                this.current_action_set.actions[action_id] = this.updateAction(current_action);
                // Stage any completed actions from the current_action_set for deletion
                if (this.current_action_set.actions[action_id].isComplete()) {
                    trash_actions.push(action_id);
                }
            }
        });

        // Remove any completed actions from the current_action_set
        trash_actions.forEach((action_id) => {
            this.current_action_set.removeAction(action_id);
        });
    }
}

// Assign a new action to the AnimatableObject
AnimatableObject.prototype.beginActionSet = function(set_id, predecessor_id = null) {
    this.current_action_build = new ActionSet(set_id, predecessor_id);
    this.action_hold = true;
}

// Add actions to the current_action_build to be executed later
AnimatableObject.prototype.assignAction = function(action) {
    // An action hold indicates that a new action set is being built for future execution
    // Otherwise, the action shall be executed immediately by joining the current_action_set

    if (this.action_hold) {
        if (this.current_action_build) {
            this.current_action_build.appendAction(action);
        } else {
            console.error("Something went terribly wrong. This error should not appear.");
        }
    } else {
        // console.log("current action set...");
        // console.log(this.current_action_set);
        if (!this.current_action_set) {
            this.current_action_set = new ActionSet(this.id + '_new_action_set');
        }
        this.current_action_set.appendAction(action);
    }
}

// Add the current_action_build to the action_queue
AnimatableObject.prototype.closeActionSet = function() {
    this.action_queue.push(this.current_action_build);
    delete this.current_action_build;
    this.action_hold = false;
}

// Pull the next ActionSet from the action_queue and set it as the current_action_set
AnimatableObject.prototype.getActionSet = function() {
    this.current_action_set = this.action_queue.shift();
}

// Remove all action sets from the action_queue
AnimatableObject.prototype.clearActionQueue = function() {
    this.action_queue = [];
}

// Stop and remove all actions
AnimatableObject.prototype.stop = function() {
    delete this.current_action_set;
    this.action_queue = [];

}

// Pause the all actions in the current_action_set or a specific action if specified
AnimatableObject.prototype.pause = function(action_id = null) {
    if (action_id) {
        this.current_action_set.actions[action_id].pause();
    } else {
        this.current_action_set.actions.forEach(function(action) {
            action.pause();
        });
    }
}

// Resume all actions in the current_action_set or a specific action if specified
AnimatableObject.prototype.resume = function(action_id = null) {
    if (action_id) {
        this.current_action_set.actions[action_id].resume();
    } else {
        this.current_action_set.actions.forEach(function(action) {
            action.resume();
        });
    }
}

// Carryover all of the actions in the current action set into the next action set in the queue and remove the current action set
AnimatableObject.prototype.carryover = function() {
    this.current_action_set.action_ids.forEach((action_id) => {
        this.action_queue[0].appendAction(this.current_action_set.actions[action_id]);
    });
    delete this.current_action_set;
}

// Make sure that every AnimatableObject is of a more specific object type (e.g. Diamond)...for now
// TODO: Find a cleaner solution, if possible.
AnimatableObject.prototype.drawObject = function() {
    console.error("AnimatableObject with id '" + this.id + "' needs to be of a more specific object type to be drawn.");
}

AnimatableObject.prototype.performAction = function() {
    console.error("AnimatableObject with id '" + this.id + "' needs to be of a more specific object type to perfom actions");
}
