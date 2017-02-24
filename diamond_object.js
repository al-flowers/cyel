/**********************************************************/
/*                     DIAMOND OBJECT                     */
/**********************************************************/

// TODO:

/* The diamond object provides the framework for each puzzle piece. At least with the current game idea.
 */

var Diamond = function(id, x_position, y_position, size) {
    // General Attributes
    this.id = id;
    this.border = "rgb(70, 70, 70)";
    this.fill = "rgb(256, 256, 256)";
    this.hasColor = false;
    this.visible = true;
    this.content = [];
    this.status_queue = ['intro_complete'];
    this.status = 'bleed';
    this.activate_children = false;

    // Position variables
    this.origin_x = x_position;
    this.origin_y = y_position;
    this.velocity_x;
    this.velocity_y;
    this.progress_x;
    this.progress_y;
    this.destination_x;
    this.destination_y;
    this.dest_x_reached;
    this.dest_y_reached;

    // Size variables
    this.size = size; // the distance between the origin and a corner of the diamond
    this.edge_length = Math.ceil(this.size * Math.sqrt(2));
    this.half_edge_length = Math.ceil(this.edge_length/2);

    // Rotation variables
    this.angle = 0;
    this.rotation_goal;
    this.rotation_direction;
    this.rotation_modifier = 1;

    // Intro animation variables (including updateColorFill variables)
    this.diamond_complete = false;
    this.line_progress = [this.half_edge_length, this.edge_length, this.half_edge_length, this.half_edge_length, this.half_edge_length, this.half_edge_length, this.half_edge_length];
    this.line_complete = [false, false, false, false, false, false, false];
    this.cover_color = "white";  // This would only ever change for debugging purposes
    this.diamond_filled = false;
    this.fill_size = 0;
    this.fill_modifier = 1;
    this.items_loaded = false;

    // Elevation variables
    this.elevation = 0;
    this.elevation_goal = 0;
    this.elevation_velocity = 2;
    this.elevation_direction = 1;  // Will be 1 if ascending or -1 if descending
    this.elevation_modifier = 1;

    // Shadow variables
    this.shadow_fade_width = 0;
    this.shadow_start_opacity = 0.45;
    this.shadow_end_opacity = 0.01;

    console.log('New Diamond object created');
};


/***************************/
/* Draw the diamond object */
/***************************/

// Draw the diamond object shape
Diamond.prototype.drawObject = function() {
    draw.save();
    draw.translate(this.origin_x, this.origin_y);
    draw.rotate(this.angle * Math.PI/180);

    draw.beginPath();
    draw.moveTo(0, -(this.size));
    draw.lineTo(this.size, 0);
    draw.lineTo(0, this.size);
    draw.lineTo(-(this.size), 0);
    draw.lineTo(0, -(this.size));
    draw.lineWidth = 0.3;
    draw.strokeStyle = this.border;
    if (this.diamond_filled) {
        draw.fillStyle = this.fill;
    } else {
        draw.fillStyle = "rgb(256, 256, 256)";
    }
    draw.stroke();
    draw.fill();
    draw.closePath();

    draw.restore();
};


// Draw the shadow of the diamond object
Diamond.prototype.drawShadow = function() {
    var shadow;
    var shadow_dist = this.elevation * 0.05;
    var shadow_size = this.size - 1;
    var fade_shift_line = 0.5

    draw.save();
    draw.translate(this.origin_x - shadow_dist, this.origin_y);
    draw.rotate(this.angle * Math.PI/180);


    // draw main shadow block
    draw.beginPath();
    draw.moveTo(0, -(shadow_size));
    draw.lineTo(shadow_size, 0);
    draw.lineTo(0, shadow_size);
    draw.lineTo(-(shadow_size), 0);
    draw.lineTo(0, -(shadow_size));
    draw.lineWidth = 0.0;
    draw.fillStyle = "rgba(0, 0, 0, 0.4)";
    draw.fill();
    draw.closePath();

    // Top Right Quadrant
    shadow = draw.createLinearGradient(0, -(shadow_size), this.shadow_fade_width, -(shadow_size + this.shadow_fade_width));
    shadow.addColorStop(0, "rgba(0, 0, 0, " + this.shadow_start_opacity + ")");
    shadow.addColorStop(fade_shift_line, "rgba(256, 256, 256, " + this.shadow_end_opacity + ")");

    draw.beginPath();
    draw.moveTo(0, -(shadow_size));
    draw.lineTo(0, -(shadow_size + this.shadow_fade_width));
    draw.lineTo(shadow_size + this.shadow_fade_width, 0);
    draw.lineTo(shadow_size, 0);
    draw.lineTo(0, -(shadow_size));
    draw.lineWidth = 0.0;
    draw.fillStyle = shadow;
    draw.fill();
    draw.closePath();

    // Bottom Right Quadrant
    shadow = draw.createLinearGradient(shadow_size, 0, shadow_size + this.shadow_fade_width, this.shadow_fade_width);
    shadow.addColorStop(0, "rgba(0, 0, 0, " + this.shadow_start_opacity + ")");
    shadow.addColorStop(fade_shift_line, "rgba(256, 256, 256, " + this.shadow_end_opacity + ")");

    draw.beginPath();
    draw.moveTo(shadow_size, 0);
    draw.lineTo(shadow_size + this.shadow_fade_width, 0);
    draw.lineTo(0, shadow_size + this.shadow_fade_width);
    draw.lineTo(0, shadow_size);
    draw.lineTo(shadow_size, 0);
    draw.lineWidth = 0.0;
    draw.fillStyle = shadow;
    draw.fill();
    draw.closePath();

    // Bottom left Quadrant
    shadow = draw.createLinearGradient(0, shadow_size, -(this.shadow_fade_width), shadow_size + this.shadow_fade_width);
    shadow.addColorStop(0, "rgba(0, 0, 0, " + this.shadow_start_opacity + ")");
    shadow.addColorStop(fade_shift_line, "rgba(256, 256, 256, " + this.shadow_end_opacity + ")");

    draw.beginPath();
    draw.moveTo(0, shadow_size);
    draw.lineTo(0, shadow_size + this.shadow_fade_width);
    draw.lineTo(-(shadow_size + this.shadow_fade_width), 0);
    draw.lineTo(-(shadow_size), 0);
    draw.lineTo(0, shadow_size);
    draw.lineWidth = 0.0;
    draw.fillStyle = shadow;
    draw.fill();
    draw.closePath();

    // Top Left Quadrant
    shadow = draw.createLinearGradient(-(shadow_size), 0, -(shadow_size + this.shadow_fade_width), -(this.shadow_fade_width));
    shadow.addColorStop(0, "rgba(0, 0, 0, " + this.shadow_start_opacity + ")");
    shadow.addColorStop(fade_shift_line, "rgba(256, 256, 256, " + this.shadow_end_opacity + ")");

    draw.beginPath();
    draw.moveTo(-(shadow_size), 0);
    draw.lineTo(-(shadow_size + this.shadow_fade_width), 0);
    draw.lineTo(0, -(shadow_size + this.shadow_fade_width));
    draw.lineTo(0, -(shadow_size));
    draw.lineTo(-(shadow_size), 0);
    draw.lineWidth = 0.0;
    draw.fillStyle = shadow;
    draw.fill();
    draw.closePath();

    draw.restore();
};


/******************************************/
/* Change/Add attributes */
/******************************************/

// Set the border and fill colors for the Diamond
Diamond.prototype.setColor = function(border, fill) {
    this.border = border;
    this.fill = fill;
    this.hasColor = true;
};

// map div items to the diamond
Diamond.prototype.addContent = function(content_item) {
    this.content.push(content_item);
};

// Move the diamond to the goal location
Diamond.prototype.moveTo = function(goal_x, goal_y, velocity, activateChildren = false) {
    this.status_queue.push('move');
    if (activateChildren) {
        this.status_queue.push('activate_children');
    }

    // NOTE: origin_x and origin_y should never be negative. May have to implement some safeguards.

    console.log('goal_x: ' + goal_x);
    console.log('goal_y: ' + goal_y);
    console.log('origin_x: ' + this.origin_x);
    console.log('origin_y: ' + this.origin_y);

    this.progress_x = 0;
    this.progress_y = 0;
    this.goal_x = goal_x;
    this.goal_y = goal_y;
    this.destination_x = Math.abs(goal_x - this.origin_x);
    this.destination_y = Math.abs(goal_y - this.origin_y);

    console.log(this.destination_x);
    console.log(this.destination_y);

    this.dest_x_reached = false;
    this.dest_y_reached = false;

    // time to incorporate some (very simple) physics!
    if (this.destination_x > 0 && this.destination_y > 0) {
        var angle = Math.atan(this.destination_y/this.destination_x);
        this.velocity_x = velocity * Math.cos(angle);
        this.velocity_y = velocity * Math.sin(angle);
    } else if (this.destination_x == 0) {
        this.velocity_x = 0;
        this.velocity_y = velocity;
    } else if (this.destination_y == 0) {
        this.velocity_x = velocity;
        this.velocity_y = 0;
    }

    // Check to see whenther there will be positive or negative movement for both the x and y directions
    if (goal_x < this.origin_x) {
        this.direction_x = -1;
    } else {
        this.direction_x = 1;
    }

    if (goal_y < this.origin_y) {
        this.direction_y = -1;
    } else {
        this.direction_y = 1;
    }
    console.log('v: ' + velocity + '\nd_x: ' + (this.destination_x * this.direction_x) + '\nd_y: ' + (this.destination_y * this.direction_y) + '\na: ' + this.angle + '\nv_x: ' + this.velocity_x + '\nv_y: ' + this.velocity_y);
};


// NOTE: size cannot be reduced to a value less than 0
// IDEA: maybe implement acceleration into the change of the diamond size
Diamond.prototype.resize = function(new_size, rate, activateChildren = false) {
    if (size_change + this.size < 0) {
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
};


// Raise or lower the Diamond object by changing the object size and shadow width/intensity
// NOTE: elevation cannot be reduced to a value less than 0
Diamond.prototype.setElevation = function(new_elevation, rate, activateChildren = false) {
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
};


// rotate the entire diamond
Diamond.prototype.rotate = function(angle, rate, activateChildren = false) {
    this.rotation_goal = angle;
    this.rotation_modifier = rate;

    if (angle >= 0) {
        this.rotation_direction = 1;
    } else {
        this.rotation_direction = -1;
    }

    this.status_queue.push('rotate');
};


// Display the associated div content
Diamond.prototype.displayContent = function() {
    if (!this.menu_loaded && this.elevation > this.elevation_goal/2) {
        // Display diamond content (e.g. titles, menus, etc.)
        this.content.forEach(function(item) {
            item.display();
        });
        this.menu_loaded = true;
    }
};


/*******************************************************/
/* Animation update functions */
/*******************************************************/

// Call the appropriate specific update functions to execute the appropriate animations
Diamond.prototype.update = function() {
    switch (this.status) {
        case 'stable':
            console.log('stable');
            this.status = this.status_queue.shift();
            break;

        // intro statuses
        case 'bleed':
            console.log('bleed');
            this.updateIntro();
            break;
        case 'color_fill':
            console.log('color_fill');
            this.updateColorFill();
            break;
        case 'intro_complete':
            this.displayContent();
            this.status = 'stable';
            console.log("Diamond is complete");
            break;

        // general statuses
        case 'move':
            this.updatePosition();
            break;
        case 'elevate':
            console.log('elevate');
            this.updateElevation();
            break;
        case 'resize':
            console.log('resize');
            this.updateSize();
            break;
        case 'rotate':
            console.log('rotate');
            this.updateRotation();
            break;
        case 'activate_children':
            console.log('activate_children');
            this.activate_children = true;
            this.status = 'stable';
            break;
        default:
            break;
    }
};


// Animate change in position
Diamond.prototype.updatePosition = function() {
    // make sure the diamond is not drawn at a further position than desired
    if (this.progress_x >= this.destination_x) {
        this.progress_x = this.destination_x;
        this.origin_x = this.goal_x;
        this.dest_x_reached = true;
    }
    if (this.progress_y >= this.destination_y) {
        this.progress_y = this.destination_y;
        this.origin_y = this.goal_y;
        this.dest_y_reached = true;
    }

    //console.log('current_origin: (' + this.origin_x + ', ' + this.origin_y + ')');

    // update the position change progress
    if (this.dest_x_reached && this.dest_y_reached) {
        this.status = 'stable';
        return;
    }
    if (!this.dest_x_reached) {
        this.progress_x += this.velocity_x;
        this.origin_x += this.velocity_x * this.direction_x;
    }
    if (!this.dest_y_reached) {
        this.progress_y += this.velocity_y;
        this.origin_y += this.velocity_y * this.direction_y;
    }

};


// 'fade/bleed-in' animation for the diamond outline
Diamond.prototype.updateIntro = function() {

    this.diamond_complete = true; // this will become false if the diamond isn't fully visible yet
    for (var i=0; i < 7; i++) {
        if (this.line_progress[i] <= 0 || this.line_complete[i]) {
            this.line_complete[i] = true;
        } else {
            this.diamond_complete = false;
        }
    }

    // Top Left Quadrant (2/2)
    if (!this.line_complete[0]) {
        draw.save();
        draw.translate(this.origin_x - (this.size/2 + 2), this.origin_y - (this.size/2 + 2));
        draw.rotate(315 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = this.cover_color;
        draw.fillRect((this.half_edge_length + 2) - this.line_progress[0], 0, this.line_progress[0], 4);
        draw.closePath();
        draw.restore();
        this.line_progress[0] -= 4;
    }

    // Top Right Quadrant (1/1)
    if (!this.line_complete[1]) {
        draw.save();
        draw.translate(this.origin_x, this.origin_y - (this.size + 2));
        draw.rotate(45 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = this.cover_color;
        draw.fillRect((this.edge_length + 2) - this.line_progress[1], 0, this.line_progress[1], 4);
        draw.closePath();
        draw.restore();
        if (this.line_complete[0]) {
            this.line_progress[1] -= 4;
        }
    }

    // Bottom Right Quadrant (1/2)
    if (!this.line_complete[2]) {
        draw.save();
        draw.translate(this.origin_x + (this.size + 2), this.origin_y);
        draw.rotate(135 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = this.cover_color;
        draw.fillRect((this.half_edge_length + 2) - this.line_progress[2], 0, this.line_progress[2], 4);
        draw.closePath();
        draw.restore();
        if (this.line_complete[1]) {
            this.line_progress[2] -= 4;
        }
    }

    // Bottom Right Quadrant (2/2)
    if (!this.line_complete[3]) {
        draw.save();
        draw.translate(this.origin_x + (this.size/2 + 2), this.origin_y + (this.size/2 + 2));
        draw.rotate(135 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = this.cover_color;
        draw.fillRect(0, 0, this.line_progress[3], 4);
        draw.closePath();
        draw.restore();
        this.line_progress[3] -= 1;
    }

    // Bottom Left Quadrant (1/2)
    if (!this.line_complete[4]) {
        draw.save();
        draw.translate(this.origin_x, this.origin_y + (this.size + 2));
        draw.rotate(225 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = this.cover_color;
        draw.fillRect((this.half_edge_length + 2) - this.line_progress[4], 0, this.line_progress[4], 4);
        draw.closePath();
        draw.restore();
        this.line_progress[4] -= 1;
    }

    // Bottom Left Quadrant (2/2)
    if (!this.line_complete[5]) {
        draw.save();
        draw.translate(this.origin_x - (this.size/2 + 2), this.origin_y + (this.size/2 + 2));
        draw.rotate(225 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = this.cover_color;
        draw.fillRect(0, 0, this.line_progress[5], 4);
        draw.closePath();
        draw.restore();
        if (this.line_complete[6]) {
            this.line_progress[5] -= 2;
        }
    }

    // Top Left Quadrant (1/2)
    if (!this.line_complete[6]) {
        draw.save();
        draw.translate(this.origin_x - (this.size + 2), this.origin_y);
        draw.rotate(315 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = this.cover_color;
        draw.fillRect(0, 0, this.line_progress[6], 4);
        draw.closePath();
        draw.restore();
        this.line_progress[6] -= 2;
    }

    if (this.diamond_complete) {
        this.status = 'color_fill';
    }
};


// Animate color fill
Diamond.prototype.updateColorFill = function() {

    // make sure the color fill does not grow past the boundary of the diamond
    if (this.fill_size >= this.size) {
        this.fill_size = this.size;
        this.diamond_filled = true;
    }

    // Draw the growing inner diamond with color
    draw.save();
    draw.translate(this.origin_x, this.origin_y);

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

    if (this.diamond_filled || !this.hasColor) {
        this.status = 'elevate';
        this.elevation_goal = 200;
        this.elevation_direction = 1;
    } else {
        this.fill_size += 3 * this.fill_modifier;
    }
};


// Alternate color fill animation
Diamond.prototype.updateColorFillv2 = function() {
    if (this.fill_size >= this.size) {
        this.fill_size = this.size;
        this.diamond_filled = true;
    }

    var progress = this.size - this.fill_size;

    // Draw the shrinking inner diamond with color
    draw.save();
    draw.translate(this.origin_x, this.origin_y);

    draw.beginPath();
    draw.moveTo(0, -(progress));
    draw.lineTo(progress, 0);
    draw.lineTo(0, progress);
    draw.lineTo(-(progress), 0);
    draw.lineTo(0, -(progress));
    draw.fillStyle = "rgb(256, 256, 256)";
    draw.fill();
    draw.closePath();

    draw.restore();

    if (this.diamond_filled || !this.hasColor) {
        this.setElevation(200, 1);
    } else {
        this.fill_size += 3 * this.fill_modifier;
    }
};


Diamond.prototype.updateElevation = function() {
    var progress = this.elevation * this.elevation_direction;
    var goal = this.elevation_goal * this.elevation_direction;

    // make sure that the diamond is not drawn at a higher or lower elevation than desired
    if (progress >= goal) {
        this.elevation = this.elevation_goal;
        this.status = 'stable';
        return;

    } else {
        this.elevation += this.elevation_velocity * this.elevation_direction * this.elevation_modifier;
        //this.fade_ratio += this.fade_change; // TODO: find smooth way to make sure that fade_ratio never goes higher than 1.0
        this.shadow_fade_width += 0.1 * this.elevation_modifier;
        this.size += 0.05 * this.elevation_modifier;
    }
};


// Animate change in size
Diamond.prototype.updateSize = function() {

    console.log('diamond size: ' + this.size);

    if (this.size_progress > this.size_goal) {
        this.size_progress = this.size_goal;
    }

    if (this.size_progress < this.size_goal) {
        this.size_progress += this.size_velocity;
        this.size += this.size_velocity * this.size_direction;

    } else {
        return;
    }

};


// Animate rotation of diamond
Diamond.prototype.updateRotation = function() {
    var progress = this.angle * this.rotation_direction;
    var goal = this.rotation_goal * this.rotation_direction;

    if (progress >= goal) {
        this.angle = this.rotation_goal;
        this.status = 'stable';
        return;

    } else {
        this.angle += 2 * this.rotation_direction * this.rotation_modifier;
    }
};
