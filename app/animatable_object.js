/*******************************
 *      ANIMATABLE OBJECT      *
 *******************************/

/* The AnimatableObject object contains all of the essential attributes and methods that
 * allow and object to participate in the animation cycle facilitated by the Animator object
 */
function AnimatableObject(id, position_x, position_y) {
    // General attributes
    this.id = id;
    this.is_visible = false;
    this.action_queue = [];
    this.current_action_set;
    this.current_action_build;
    this.action_hold = false;
    this.components = [];
    this.terminated = false;

    this.DOM_content;        // Allows the animatable object to interacted with via DOM objects
    this.content_loaded = false;

    // Waiting attributes
    this.wait_condition = false;
    this.waitlisted = false;

    // Position attributes
    this.center_x = position_x;
    this.center_y = position_y;
    this.angle = 0;
}



// Returns true if the animatable object is ready to be destroyed
AnimatableObject.prototype.isTerminated = function() {
    return this.terminated;
}


// Returns true if the encapsulating animator is aware of the wait_condition
AnimatableObject.prototype.isWaitlisted = function() {
    return this.waitlisted;
}



// Draw all of the components of the animatable object
AnimatableObject.prototype.drawObject = function() {
    draw.save();
    draw.translate(this.center_x, this.center_y);
    draw.rotate(this.angle * Math.PI/180);
    draw.translate(-this.center_x, -this.center_y);
    this.components.forEach((component) => {
        component.drawObject();
        component.update();
    });
    draw.restore();
}


// Remove the assciated DOM element
AnimatableObject.prototype.removeContent = function() {
    this.DOM_content.delete();
    delete this.DOM_content;
}


// Set the DOM content within the animatable object
AnimatableObject.prototype.setContent = function(text, font_size, click_function) {
    var div_content = new lightMenuItem(this.id, text, font_size, this.center_x, this.center_y, click_function);
    this.DOM_content = div_content;
}



// Set the animatable object to wait for a specific action to be performed by another object
// The object will wait on an action performed by a specific object specified by object_id and action_id
// The delay value will determine how long to continue waiting after the specified action begins
AnimatableObject.prototype.waitOn = function(object_id, action_id, delay = 0) {
    this.wait_condition = [object_id, action_id];

    var wait = new Action('wait', 'wait', delay);
    this.assignAction(wait);
}



//
// Move the animatable object to the goal location (Absolute location)
AnimatableObject.prototype.move = function(action_id, goal_x, goal_y, velocity, carryover = false) {
    //var move = new Action('move', action_id, [pseudo_goal_x, pseudo_goal_y], [velocity, x_direction, y_direction]);
    var move = new Action('move', action_id, [goal_x, goal_y], velocity);
    move.carryover = carryover;

    this.assignAction(move);
}



// Rotate the entire animatable object by the specified angle (degrees)
// Negative rate -> clockwise; positive rate -> counter-clockwise
AnimatableObject.prototype.rotate = function(action_id, angle, rate, carryover = false) {
    var rotate = new Action('rotate', action_id, angle, rate);
    rotate.carryover = carryover;

    this.assignAction(rotate);
}



// Calls the appropriate update function for the specified action
AnimatableObject.prototype.updateAction = function(action) {
    var modfied_action;
    switch (action.type) {
        case 'move':
            modified_action = this.updateMove(action);
            break;
        case 'rotate':
            modified_action = this.updateRotation(action);
            break;
        case 'wait':
            modified_action = this.updateWait(action);
            break;
        default:
            console.error("The Animatable Object '" + this.id + "' cannot perform the action '" + action.id + "'.");
    }
    return modified_action;
}


// Animate change in position
AnimatableObject.prototype.updateMove = function(action) {
    if (!action.initialized) {

        // Simulate having the center of the animatable object as the origin of a new coordinate plane
        action.pseudo_goal_x = action.destination_x - this.center_x;
        action.pseudo_goal_y = action.destination_y - this.center_y;

        console.log("psuedo_goal: " + action.pseudo_goal_x + ", " + action.pseudo_goal_y);

        // Using a 1 or -1, set whether the x and y-coordinates will increase or decreatse with the position change
        action.direction_x = 1;
        action.direction_y = 1;
        if (action.destination_x < this.center_x) {
            action.direction_x = -1;
        }
        if (action.destination_y < this.center_y) {
            action.direction_y = -1;
        }

        // Separate the movement rate into a horizontal velocity and a vertical velocity
        var angle = Math.atan(Math.abs(action.pseudo_goal_y)/Math.abs(action.pseudo_goal_x));
        action.velocity_x = action.velocity * Math.cos(angle);
        action.velocity_y = action.velocity * Math.sin(angle);

        action.initialized = true;
    }

    /* Make sure the animatable object is not drawn at a further position than desired by removing whatever
       extra progress was made beyond the pseudo_goal. This helps to avoid teleportation of the object. */
    if (action.progress_x * action.direction_x >= action.pseudo_goal_x * action.direction_x) {
        var excess = action.progress_x - action.pseudo_goal_x;
        action.progress_x = action.pseudo_goal_x;

        this.center_x -= excess * action.direction_x;
        action.reached_x = true;
    }

    if (action.progress_y * action.direction_y >= action.pseudo_goal_y * action.direction_y) {
        var excess = action.progress_y - action.pseudo_goal_y;
        action.progress_y = action.pseudo_goal_y;
        this.center_y -= excess * action.direction_y;
        action.reached_y = true;
    }

    // update the position change progress
    if (action.reached_x && action.reached_y) {
        if (this.DOM_content) {
            this.DOM_content.updatePosition(this.center_x, this.center_y);
        }
        action.complete();
        return action;
    }
    if (!action.reached_x) {
        action.progress_x += action.velocity_x * action.direction_x;
        this.center_x += action.velocity_x * action.direction_x;
    }
    if (!this.reached_y) {
        action.progress_y += action.velocity_y * action.direction_y;
        this.center_y += action.velocity_y * action.direction_y;
    }
    // TODO: Check for performance difference if the directions are baked into the respective velocities

    // Move the associated DOM content
    if (this.DOM_content) {
        this.DOM_content.updatePosition(this.center_x, this.center_y);
    }


    return action;
}



// Animate rotation of animatable object
AnimatableObject.prototype.updateRotation = function(action) {
    action.progress = this.angle;

    if (!action.initialized) {
        if (action.progress > action.goal) {
            action.direction = -1;
        }
        action.initialized = true;
    }

    if (action.progress * action.direction > action.goal * action.direction) {
        action.progress = action.goal;
        this.angle = action.goal;
        action.complete();
        return action;
    } else {
        action.progress += action.rate * action.direction;
        this.angle += action.rate * action.direction;
    }

    return action;
}



// Update the waiting status of the animatable object in accordance with the wait_condition
// i.e., resume actions after the specified delay once the wait_condition is cleared
AnimatableObject.prototype.updateWait = function(action) {
    if (!this.wait_condition) {
        action.progress = Date.now();

        if (!action.initialized) {
            // Start the timer to complete the delay of the next action set
            action.goal_time = action.progress + action.wait_time;
            action.initialized = true;
            //console.log("initialize DELAY");
        }

        // Once the current time meets or exceeds the goal time, the wait action is complete
        //console.log(action.progress + ", " + action.goal_time);
        if (action.progress >= action.goal_time) {
            action.complete();
            return action;
        }
    }

    return action;
}



// Facilitate the object's animation by updating physical attributes and the list of actions
AnimatableObject.prototype.update = function() {

    if (!this.current_action_set || this.current_action_set.isComplete()) {
        this.getActionSet();
    }
    // It is still possible for the current_action_set to be undefined if the action_queue is empty
    if (this.current_action_set) {
        var carryover = true;
        var trash_actions = [];
        this.current_action_set.action_ids.forEach((action_id) => {
            //console.log(this.current_action_set.action_ids.length + ": " + this.id + ": " + action_id)
            var current_action = this.current_action_set.actions[action_id];
            // The current_action may disqualify the entire action set from carrying over into the next action set
            if (!current_action.carryover) {
                carryover = false;
            }

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

        // If elegible, carry over all of the current actions into the next queued action set
        if (carryover && this.action_queue[0]) {
            this.performCarryover();
        }
    }
}



// Return the wait_condition
AnimatableObject.prototype.waitingFor = function() {
    return this.wait_condition;
}



// Clear the wait condition
AnimatableObject.prototype.clearWaitCondition = function() {
    this.wait_condition = false;
}



// Assign a new action to the AnimatableObject
AnimatableObject.prototype.newActionSet = function(set_id) {
    this.current_action_build = new ActionSet(set_id);
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
        if (!this.current_action_set) {
            this.current_action_set = new ActionSet(this.id + "_" + action.id);
        }
        this.current_action_set.appendAction(action);
    }
}

// Add the current_action_build to the action_queue
AnimatableObject.prototype.closeActionSet = function() {
    this.action_queue.push(this.current_action_build);
    delete this.current_action_build;
    this.action_hold = false;
    //console.log(this.action_queue);
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
AnimatableObject.prototype.performCarryover = function() {
    this.current_action_set.action_ids.forEach((action_id) => {
        this.action_queue[0].appendAction(this.current_action_set.actions[action_id]);
    });
    delete this.current_action_set;
}


AnimatableObject.prototype.performAction = function() {
    console.error("AnimatableObject with id '" + this.id + "' needs to be of a more specific object type to perfom actions");
}
