this.center/**********************************************************/
/*                     DIAMOND OBJECT                     */
/**********************************************************/

/* The diamond object provides the framework for each puzzle piece. At least with the current game idea.
 */

function Diamond(id, x_position, y_position, size, intro_rate = 1) {
    // Inherit from AnimatableObject
    AnimatableObject.call(this);

    // General Attributes
    this.id = id;
    this.border = "rgb(70, 70, 70)";
    this.fill = "rgb(256, 256, 256)";
    this.content = [];
    this.activate_dependents = false; //TODO: revisit

    // Position variables
    // NOTE: The origin refers to the center of the diamond (not the center of the canvas)
    this.center_x = x_position;
    this.center_y = y_position;
    this.angle = 0;
    this.elevation = 0;

    // Size variables
    this.size = size; // the distance between the origin and a corner of the diamond
    this.edge_length = Math.ceil(this.size * Math.sqrt(2));

    this.fill_size = 0;

    this.items_loaded = false;

    // Assign the intro animation sequence to the diamond
    this.intro(id + '_intro_sequence', intro_rate, 20);

    console.log("New diamond with id '" + id + "' created.");
}

Diamond.prototype = Object.create(AnimatableObject.prototype);



/***************************/
/* Draw the diamond object */
/***************************/

// Draw the diamond object shape
Diamond.prototype.drawObject = function() {
    draw.save();
    draw.translate(this.center_x, this.center_y);
    draw.rotate(this.angle * Math.PI/180);

    // Draw the blank shape with just a border
    draw.beginPath();
    draw.moveTo(0, -(this.size));
    draw.lineTo(this.size, 0);
    draw.lineTo(0, this.size);
    draw.lineTo(-(this.size), 0);
    draw.lineTo(0, -(this.size));
    draw.lineWidth = 0.7;
    draw.shadowBlur = this.elevation;
    draw.shadowColor = "rgb(100, 100, 100)";
    draw.shadowOffsetX = this.elevation;
    draw.shadowOffsetY = this.elevation/2;
    draw.strokeStyle = this.border;
    draw.fillStyle = "rgb(256, 256, 256)";
    draw.stroke();
    draw.fill();
    draw.closePath();

    // Draw the fill
    draw.beginPath();
    draw.moveTo(0, -(this.fill_size));
    draw.lineTo(this.fill_size, 0);
    draw.lineTo(0, this.fill_size);
    draw.lineTo(-(this.fill_size), 0);
    draw.lineTo(0, -(this.fill_size));
    draw.fillStyle = this.fill;
    draw.fill();
    draw.closePath();

    draw.restore();
}

// TODO: Implement the canvas shadowblur property on the shape essentially making this function useless
// Draw the shadow of the diamond object
Diamond.prototype.drawShadow = function() {
    var shadow_dist = this.elevation * 0.05;

    draw.save();
    draw.translate(this.center_x - shadow_dist, this.center_y);
    draw.rotate(this.angle * Math.PI/180);

    // draw main shadow block
    draw.beginPath();
    draw.moveTo(0, -(this.size));
    draw.lineTo(this.size, 0);
    draw.lineTo(0, this.size);
    draw.lineTo(-(this.size), 0);
    draw.lineTo(0, -(this.size));
    draw.lineWidth = 1;
    //draw.strokeStyle = "rgba(160, 160, 160, 0.8)";
    draw.fillStyle = "rgb(150, 150, 150)";
    draw.fill();
    //draw.stroke();
    draw.closePath();

    draw.restore();
}


/*************************/
/* Change/Add attributes */
/*************************/

// Set the border and fill colors for the Diamond
Diamond.prototype.setColor = function(fill, border = false) {
    this.fill = fill;
    if (border) {
        this.border = border;
    }
}

// Link div items to appear with the diamond
Diamond.prototype.linkContent = function(content_item) {
    this.content.push(content_item);
}

// Make the Diamond appear using an intro animation
Diamond.prototype.intro = function(action_id, velocity, elevation_distance) {
    if (this.is_visible) {
        console.error("Diamond with id '" + this.id + "' is already visible on the field.");
        return;
    }
    // Set up the ActionSets that shall be executed as part of the intro
    this.beginActionSet(action_id + '_step_1');
    var draw_border = new Action('draw_border', action_id + '_border', this.edge_length, velocity);
    var fill = new Action('fill', action_id + '_fill', this.size, velocity);
    this.assignAction(draw_border);
    this.assignAction(fill);
    this.closeActionSet();

    this.beginActionSet(action_id + '_step_2');
    var initial_elevate = new Action('elevate', action_id + '_inital_elevate', elevation_distance, velocity);
    this.assignAction(initial_elevate);
    this.closeActionSet();

    this.beginActionSet(action_id + '_step_3');
    var display_content = new Action('display_content', action_id + '_display_content', 1.0, 1000);
    this.assignAction(display_content);
    this.closeActionSet();

    this.getActionSet();
}

// Make the Dimaond disappear using an outro animation (a reverse version of the intro animation)

// Move the diamond to the goal location (Absolute location)
Diamond.prototype.move = function(action_id, goal_x, goal_y, velocity, carryover = false) {
    // Simulate having the center of the diamond as the origin of a new coordinate plane
    var pseudo_goal_x = goal_x - this.center_x;
    var pseudo_goal_y = goal_y - this.center_y;

    // Using a 1 or -1, set whether the x and y-coordinates will increase or decreatse with the position change
    var x_direction = 1;
    var y_direction = 1;
    if (goal_x < this.center_x) {
        x_direction = -1;
    }
    if (goal_y < this.center_y) {
        y_direction = -1;
    }
    var move = new Action('move', action_id, [pseudo_goal_x, pseudo_goal_y], [velocity, x_direction, y_direction]);
    move.actual_destination_x = goal_x;
    move.actual_destination_y = goal_y;
    move.carryover = carryover;

    this.assignAction(move);
}


// NOTE: size cannot be reduced to a value less than 0
Diamond.prototype.resize = function(action_id, new_size, rate, carryover = false) {
    if (new_size < 0) {
        console.error('Diamond size cannot be lower than 0');
        return;
    }
    // variables exclusively used by the animation
    if (size_change < 0) {
        this.size_direction = -1;
    } else {
        this.size_direction = 1;
    }
    this.size_progress = 0;
    this.size_goal = Math.abs(size_change);
    this.size_velocity = 5;
}


// Raise or lower the Diamond object by changing the object size and shadow width/intensity
// NOTE: elevation cannot be reduced to a value less than 0
Diamond.prototype.elevate = function(new_elevation, rate, carryover = false) {
    this.status_queue.push('elevate');
    this.elevation_modifier = rate;

    if (new_elevation < 0) {
        console.error('Diamond elevation cannot be lower than 0');
        return;
    }

    if (new_elevation == this.elevation) {
        return;
    } else if (new_elevation < this.elevation) {
        this.elevation_goal = new_elevation;
        this.elevation_direction = -1;
    } else {
        this.elevation_goal = new_elevation;
        this.elevation_direction = 1;
    }
}


// Rotate the entire diamond by the specified angle (degrees)
// Negative angle -> clockwise; positive angle -> counter-clockwise
Diamond.prototype.rotate = function(angle, rate, carryover = false) {
    this.rotation_goal = angle;
    this.rotation_modifier = rate;

    if (angle >= 0) {
        this.rotation_direction = 1;
    } else {
        this.rotation_direction = -1;
    }

    this.status_queue.push('rotate');
}


// Display the associated div content
Diamond.prototype.displayContent = function(rate, opacity = 1.0) {
    var display_content = new Action('display_content', action_id + 'display_content', opacity, rate);
    this.assignAction(display_content);
}


/**********************************/
/*       Animation functions      */
/**********************************/

// Perform the specified action appropriately using Diamond animation methods
Diamond.prototype.updateAction = function(action) {
    var modfied_action;
    switch (action.type) {
        case 'draw_border':
            modified_action = this.updateDrawBorder(action);
            break;
        case 'erase_border':
            modified_action = this.updateDrawBorder(action, true);
            break;
        case 'fill':
            modified_action = this.updateFill(action);
            break;
        case 'unfill':
            modified_action = this.updateFill(action, true);
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
// TODO: consider removing this method if ultimately useless
Diamond.prototype.updateContent = function(action) {
    //console.log("displaying content...");

    if (!this.items_loaded) {
        this.content.forEach(function(item) {
            item.display(action.rate, action.level);
        });
        this.items_loaded = true;
        action.complete();
    }

    return action;
}


// Animate change in position
Diamond.prototype.updatePosition = function(action) {
    //console.log("updating position...");

    // make sure the diamond is not drawn at a further position than desired
    if (action.progress_x * action.direction_x >= action.destination_x * action.direction_x) {
        action.progress_x = action.destination_x;
        this.center_x = action.actual_destination_x;
        action.reached_x = true;
    }

    if (action.progress_y * action.direction_y >= action.destination_y * action.direction_y) {
        action.progress_y = action.destination_y;
        this.center_y = action.actual_destination_y;
        action.reached_y = true;
    }

    // update the position change progress
    if (action.reached_x && action.reached_y) {
        action.complete();
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

    return action;
}


// 'fade/bleed-in' animation for the diamond outline
Diamond.prototype.updateDrawBorder = function(action, reverse = false) {
    //console.log("updating border draw...");

    action.draw_border_complete = true; // this will become false if the diamond isn't fully visible yet
    for (var i=0; i < 7; i++) {
        if (action.border_progress[i] <= 0 || action.section_complete[i]) {
            action.section_complete[i] = true;
        } else {
            action.draw_border_complete = false;
        }
    }
    
    // Top Left Quadrant (2/2)
    if (!action.section_complete[0]) {
        draw.save();
        draw.translate(this.center_x - (this.size/2 + 2), this.center_y - (this.size/2 + 2));
        draw.rotate(315 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = action.border_cover_color;
        draw.fillRect((action.short_destination + 2) - action.border_progress[0], 0, action.border_progress[0], 4);
        draw.closePath();
        draw.restore();
        action.border_progress[0] -= 4 * action.display_rate;
    }

    // Top Right Quadrant (1/1)
    if (!action.section_complete[1]) {
        draw.save();
        draw.translate(this.center_x, this.center_y - (this.size + 2));
        draw.rotate(45 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = action.border_cover_color;
        draw.fillRect((action.long_destination + 2) - action.border_progress[1], 0, action.border_progress[1], 4);
        draw.closePath();
        draw.restore();
        if (action.section_complete[0]) {
            action.border_progress[1] -= 4 * action.display_rate;
        }
    }

    // Bottom Right Quadrant (1/2)
    if (!action.section_complete[2]) {
        draw.save();
        draw.translate(this.center_x + (this.size + 2), this.center_y);
        draw.rotate(135 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = action.border_cover_color;
        draw.fillRect((action.short_destination + 2) - action.border_progress[2], 0, action.border_progress[2], 4);
        draw.closePath();
        draw.restore();
        if (action.section_complete[1]) {
            action.border_progress[2] -= 4 * action.display_rate;
        }
    }

    // Bottom Right Quadrant (2/2)
    if (!action.section_complete[3]) {
        draw.save();
        draw.translate(this.center_x + (this.size/2 + 2), this.center_y + (this.size/2 + 2));
        draw.rotate(135 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = action.border_cover_color;
        draw.fillRect(0, 0, action.border_progress[3], 4);
        draw.closePath();
        draw.restore();
        action.border_progress[3] -= 1 * action.display_rate;
    }

    // Bottom Left Quadrant (1/2)
    if (!action.section_complete[4]) {
        draw.save();
        draw.translate(this.center_x, this.center_y + (this.size + 2));
        draw.rotate(225 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = action.border_cover_color;
        draw.fillRect((action.short_destination + 2) - action.border_progress[4], 0, action.border_progress[4], 4);
        draw.closePath();
        draw.restore();
        action.border_progress[4] -= 1 * action.display_rate;
    }

    // Bottom Left Quadrant (2/2)
    if (!action.section_complete[5]) {
        draw.save();
        draw.translate(this.center_x - (this.size/2 + 2), this.center_y + (this.size/2 + 2));
        draw.rotate(225 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = action.border_cover_color;
        draw.fillRect(0, 0, action.border_progress[5], 4);
        draw.closePath();
        draw.restore();
        if (action.section_complete[6]) {
            action.border_progress[5] -= 2 * action.display_rate;
        }
    }

    // Top Left Quadrant (1/2)
    if (!action.section_complete[6]) {
        draw.save();
        draw.translate(this.center_x - (this.size + 2), this.center_y);
        draw.rotate(315 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = action.border_cover_color;
        draw.fillRect(0, 0, action.border_progress[6], 4);
        draw.closePath();
        draw.restore();
        action.border_progress[6] -= 2 * action.display_rate;
    }

    if (action.draw_border_complete) {
        console.log("Borders completed for diamond with id: " + this.id);
        action.complete();
    }

    return action;
}


// Animate color fill
Diamond.prototype.updateFill = function(action, reverse = false) {
    //console.log("updating diamond fill...");

    // TODO: implement the reverse process (should mainly involve enclosing everything within an 'if' statement)

    // make sure the color fill does not grow past the goal fill size
    if (action.fill_progress >= action.fill_destination) {
        action.fill_progress = action.fill_destination;
        action.fill_complete = true;
    }
    // make sure the color fill does not grow past the actual fill size of the diamond
    if (action.fill_progress >= this.size) {
        action.fill_progress = this.size;
        action.fill_complete = true;
    }

    if (action.fill_complete) {
        action.complete();
    } else {
        action.fill_progress += action.fill_rate * 1.5;
        this.fill_size += action.fill_rate * 1.5;
    }

    return action;
}


// Animate change in elevation
Diamond.prototype.updateElevation = function(action) {
    //console.log("updating elevation...");

    var progress = action.elevation_progress * action.elevation_direction;
    var goal = action.elevation_goal * action.elevation_direction;

    // make sure that the diamond is not drawn at a higher or lower elevation than desired
    if (progress >= goal) {
        action.elevation_progress = action.elevation_goal;
        this.elevation = action.elevation_goal;
        action.complete();

    } else {
        action.elevation_progress += action.elevation_rate * action.elevation_direction * action.elevation_modifier;
        this.elevation += action.elevation_rate * action.elevation_direction * action.elevation_modifier;
        this.size += 0.05 * action.elevation_modifier;
        this.fill_size = this.size;
    }

    return action;
}


// Animate change in size
Diamond.prototype.updateSize = function(action) {
    //console.log("updating size");

    if (this.size_progress > this.size_goal) {
        this.size_progress = this.size_goal;
    }
    if (this.size_progress < this.size_goal) {
        this.size_progress += this.size_velocity;
        this.size += this.size_velocity * this.size_direction;
    } else {
        return;
    }

    return action;
}


// Animate rotation of diamond
Diamond.prototype.updateRotation = function(action) {
    //console.log("updating rotation");

    var progress = this.angle * this.rotation_direction;
    var goal = this.rotation_goal * this.rotation_direction;

    if (progress >= goal) {
        this.angle = this.rotation_goal;
        this.status = 'stable';
        return;

    } else {
        this.angle += 2 * this.rotation_direction * this.rotation_modifier;
    }

    return action;
}
