/**********************************************************/
/*                     DIAMOND OBJECT                     */
/**********************************************************/

/* The diamond object provides the framework for each puzzle piece. At least with the current game idea.
 */

function Diamond(id, position_x, position_y, size, intro_rate = 1) {
    // Inherit from AnimatableObject
    AnimatableObject.call(this);

    // General Attributes
    this.id = id;
    this.fill = "rgb(126, 54, 80)";
    this.previous_fill = "rgb(256, 256, 256)"; //
    this.DOMcontent;        // Allows the diamond object to interacted with via DOM objects
    this.content_loaded = false;

    // Position attributes
    this.center_x = position_x;
    this.center_y = position_y;
    this.angle = 0;
    this.depth = 0;
    this.max_depth = 25;

    // Size attributes
    this.size = size;       // the distance between the origin and any corner of the diamond
    this.edge_length = Math.ceil(this.size * Math.sqrt(2));
    this.fill_level = 0;        // Indicates how much the fill has expanded from the center

    // Assign the intro animation sequence to the diamond
    // NOTE: The default depth for any new diamond is equivalent to the max_depth
    this.intro(id + '_intro_sequence', intro_rate, this.max_depth);

    console.log("New diamond with id '" + id + "' created.");
}

Diamond.prototype = Object.create(AnimatableObject.prototype);



/***************************/
/* Draw the diamond object */
/***************************/

// Draw the Draw the diamond object in its current statement
Diamond.prototype.drawObject = function () {
    // Set the diamond's position and angle as the current refernce point
    draw.save();
    draw.translate(this.center_x, this.center_y);
    draw.rotate(this.angle * Math.PI/180);

    // Set the mask
    draw.beginPath();
    draw.moveTo(0, -(this.size - 1));
    draw.lineTo(-(this.size - 1), 0);
    draw.lineTo(0, this.size - 1);
    draw.lineTo(this.size - 1, 0);
    draw.lineTo(0, -(this.size - 1));
    draw.closePath();
    draw.clip();

    // Draw the fill
    draw.beginPath();
    draw.arc(0, 0, this.fill_level, 0, 2 * Math.PI);
    draw.closePath();
    draw.fillStyle = this.fill;
    draw.fill();
    console.log(this.fill_level);

    // Draw a square-ring-like object to project a shadow giving the illusion of a recessed square shape
    draw.beginPath();
    draw.moveTo(0, -(this.size + 40));
    draw.lineTo(this.size + 40, 0);
    draw.lineTo(0, this.size + 40);
    draw.lineTo(-(this.size + 40), 0);
    draw.lineTo(0, -(this.size + 40));

    draw.moveTo(0, -(this.size));
    draw.lineTo(-(this.size), 0);
    draw.lineTo(0, this.size);
    draw.lineTo(this.size, 0);
    draw.lineTo(0, -(this.size));
    draw.closePath();

    // The shadows are set to demonstrate a light source from the upper-left direction
    draw.shadowBlur = this.depth*1.2;
    draw.shadowColor = "rgb(0, 0, 0)";
    draw.shadowOffsetX = this.depth/2;
    draw.shadowOffsetY = this.depth/2;
    draw.fillStyle = "rgba(126, 126, 126, 1)";
    draw.fill();

    draw.restore();
}



/*************************/
/* Change/Add attributes */
/*************************/


// Link div items to appear with the diamond
Diamond.prototype.linkContent = function(content_item) {
    this.DOMcontent = content_item;
}


// Remove the assciated DOM content_item
Diamond.prototype.removeContent = function() {
    delete this.DOMcontent;
}


// Set up the ActionSets to make the diamond appear
Diamond.prototype.intro = function(action_id, rate, initial_depth = this.max_depth) {
    // Recess the diamond and expand the fill outwards from the center

    this.beginActionSet(action_id + '_step_1');
    this.elevate(action_id + '_initial_sink', initial_depth, rate, false);
    //this.rotate(action_id + '_initial_rotate', 90, rate * 2, false);
    //this.assignAction(sink);
    this.closeActionSet();

    this.beginActionSet(action_id + '_step_1');
    this.setColor(action_id + '_initial_fill', this.fill, rate, false);
    //this.assignAction(fill);
    this.closeActionSet();

    this.getActionSet();
}
// TODO: Make the Dimaond disappear using an outro animation (a reverse version of the intro animation)



/*
 * In the following methods, the default carryover value (true) allows queued actions to be executed before the
 * current action is completed
 */

 // Set a new fill color and schedule the fill animation
 Diamond.prototype.setColor = function(action_id, new_fill, rate, carryover = true) {
     this.previous_fill = this.fill;
     this.fill = new_fill;

     var fill = new Action('fill', action_id, this.size, rate);
     fill.acceleration = 0.02;
     fill.carryover = carryover;
     this.assignAction(fill);
 }




// Resize the diamond to have a size of new_size
// NOTE: size cannot be reduced to a value less than 0
Diamond.prototype.resize = function(action_id, new_size, rate, carryover = true) {
    if (new_size < 0) {
        console.error('Diamond size cannot be lower than 0');
        return;
    }

    var resize = new Action('resize', action_id, new_size, rate);
    resize.carryover = carryover;

    this.assignAction(resize);

}



// Raise or lower the Diamond object by changing the object size and shadow width/intensity
// NOTE: depth cannot be reduced to a value less than 0
Diamond.prototype.elevate = function(action_id, new_depth, rate, carryover = true) {
    if (new_depth < 0) {
        console.error('Diamond depth cannot be lower than 0');
        return;
    }

    var elevate = new Action('elevate', action_id, new_depth, rate);
    elevate.carryover = carryover;
    elevate.acceleration = -(0.018);

    this.assignAction(elevate);
}



// Rotate the entire diamond by the specified angle (degrees)
// Negative rate -> clockwise; positive rate -> counter-clockwise
Diamond.prototype.rotate = function(action_id, angle, rate, carryover = true) {
    var rotate = new Action('rotate', action_id, angle, rate);
    rotate.carryover = carryover;

    this.assignAction(rotate);
}



// Display the associated div content
Diamond.prototype.displayContent = function(action_id, rate, opacity = 1.0) {
    var display_content = new Action('display_content', action_id, opacity, rate);
    this.assignAction(display_content);
}

// TODO: make method to fade away content



/**********************************/
/*       Animation functions      */
/**********************************/

// Calls the appropriate update function for the specified action
Diamond.prototype.updateAction = function(action) {
    var modfied_action;
    switch (action.type) {
        case 'fill':
            modified_action = this.updateFill(action);
            break;
        case 'outro':
            modified_action = this.updateOutro(action);
            break;
        case 'display_content':
            modified_action = this.updateContent(action);
            break;
        case 'move':
            modified_action = this.updatePosition(action);
            break;
        case 'elevate':
            modified_action = this.updateElevation(action);
            break;
        case 'resize':
            modified_action = this.updateResize(action);
            break;
        case 'rotate':
            modified_action = this.updateRotation(action);
            break;
        default:
            console.error("The Diamond '" + this.id + "' cannot perform the action '" + action.id + "'.");
    }
    return modified_action;
}


// Animate the DOM content associated with the diamond. Animation method will be determined by each content item
Diamond.prototype.updateContent = function(action) {
    if (!this.content_loaded) {
        this.DOMcontent.display(action.rate, action.level);
        this.content_loaded = true;
        action.complete();
    }

    return action;
}






// Animate color fill
Diamond.prototype.updateFill = function(action, reverse = false) {
    // TODO: implement the reverse process (should mainly involve enclosing everything within an 'if' statement)

    // make sure the color fill does not grow past the goal fill size
    if (action.progress >= action.destination) {
        action.progress = action.destination;
        action.complete();
    }
    // make sure the color fill does not grow past the actual fill size of the diamond
    if (action.progress >= this.size) {
        action.progress = this.size;
        action.complete();
    }

    if (action.isComplete()) {
        return action;
    } else {
        if (action.rate + action.acceleration > 0) {
            action.rate += action.acceleration;
        }
        action.progress += action.rate * 3;
        this.fill_level += action.rate * 3;
    }

    return action;
}


// Animate change in depth
Diamond.prototype.updateElevation = function(action) {
    action.progress = this.depth;

    if (!action.initialized) {
        if (action.progress > action.goal) {
            action.direction = -1;
        }
        action.initialized = true;
    }

    // make sure that the diamond is not drawn at a higher or lower depth than desired
    if (action.progress * action.direction > action.goal * action.direction) {
        action.progress = action.goal;
        this.depth = action.goal;
        action.complete();
        return action;
    } else {
        if (action.rate + action.acceleration > 0) {
            action.rate += action.acceleration;
        }
        action.progress += action.rate * action.direction;
        this.depth += action.rate * action.direction;
    }

    return action;
}



// Animate rotation of diamond
Diamond.prototype.updateRotation = function(action) {
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



// Animate change in size
Diamond.prototype.updateResize = function(action) {
    action.resize_progress = this.size;

    if (!action.initialized) {
        if (action.resize_progress > action.resize_goal) {
            action.resize_direction = -1;
        }
        action.initialized = true;
    }

    if (action.resize_progress * action.resize_direction >= action.resize_goal * action.resize_direction) {
        action.resize_progress = action.resize_goal;
        this.size = action.resize_goal;
        this.fill_size = this.size;
        action.complete();
        return action;
    } else {
        action.resize_progress += action.resize_rate * action.resize_direction;
        this.size += action.resize_rate * action.resize_direction;
        this.fill_size = this.size;
    }

    return action;
}
