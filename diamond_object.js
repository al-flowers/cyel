/**********************************************************/
/*                     DIAMOND OBJECT                     */
/**********************************************************/

/* The diamond object provides the framework for each puzzle piece. At least with the current game idea.
 */

var Diamond = function(id, x_position, y_position, size) {
    // set main attributes
    this.id = id;
    this.origin_x = x_position;
    this.origin_y = y_position;
    this.size = size; // the distance between the origin and a corner of the diamond
    this.border = "rgb(70, 70, 70)";
    this.fill = "rgb(256, 256, 256)";
    this.hasColor = false;
    this.elevation = 0;
    this.visible = false;
    this.content = [];
    this.edge_length = Math.ceil(this.size * Math.sqrt(2));
    this.half_edge_length = Math.ceil(this.edge_length/2);

    // bleed animation variables
    this.diamond_complete = false;
    this.line_progress = [this.half_edge_length, this.edge_length, this.half_edge_length, this.half_edge_length, this.half_edge_length, this.half_edge_length, this.half_edge_length];
    this.line_complete = [false, false, false, false, false, false, false];
    this.cover_color = "white";  // This would only ever change for debugging purposes

    this.diamond_filled = false;
    this.fill_size = 0;

    // Shadow variables
    this.shadow_fade_width = 0;

    this.elevation_progress = 0;
    this.elevation_goal = 0;
    this.elevation_rate = 2;

    this.items_loaded = false;
    this.shadow_start_opacity = 0.45;
    this.shadow_end_opacity = 0.01;

    // misc animation variables
    this.elevation_direction = 1;  // Will be 1 if raising or -1 is lowering

    this.status = 'initial';

    console.log('New Diamond object created');
};


/***************************/
/* Draw the diamond object */
/***************************/

// Draw the diamond object shape
Diamond.prototype.drawObject = function() {
    draw.save();
    draw.translate(this.origin_x, this.origin_y);

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
    var shadow_dist = this.elevation_progress * 0.05;
    var shadow_size = this.size - 1;
    var fade_shift_line = 0.5

    draw.save();
    draw.translate(this.origin_x - shadow_dist, this.origin_y);


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
Diamond.prototype.moveTo = function(goal_x, goal_y, rate = 1) {
    this.rate = rate;
    this.progress_x = 0;
    this.progress_y = 0;
    this.end_x = Math.abs(goal_x);
    this.end_y = Math.abs(goal_y);

    // time to incorporate some (very simple) physics!
    var velocity = 5;
    var distance_x = Math.abs(this.end_x);
    var distance_y = Math.abs(this.end_y);
    var angle = Math.atan(distance_y/distance_x);
    this.velocity_x = velocity * Math.sin(angle);
    this.velocity_y = velocity * Math.cos(angle);

    // TODO: search for a more elegant solution...
    if (this.end_x < 0) {
        this.move_x_sign = -1;
    } else {
        this.move_x_sign = 1;
    }

    if (this.end_y < 0) {
        this.move_y_sign = -1;
    } else {
        this.move_y_sign = 1;
    }
    console.log('v: ' + velocity + '\nd_x: ' + distance_x + '\nd_y: ' + distance_y + '\na: ' + angle + '\nv_x: ' + this.velocity_x + '\nv_y: ' + this.velocity_y);
};


// NOTE: size cannot be reduced to a value less than 0
// IDEA: maybe implement acceleration into the change of the diamond size
Diamond.prototype.resize = function(new_size, rate = 1) {
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
Diamond.prototype.setElevation = function(new_elevation, rate = 1) {
    this.status = 'elevate';
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
// if clockwise is set to false then the diamond will rotate counter-clockwise instead
// TODO: this method
Diamond.prototype.rotate = function(angle, clockwise = true, rate = 1) {

};


// Display the associated div content
Diamond.prototype.displayContent = function() {
    if (!this.menu_loaded && this.elevation_progress > this.elevation_goal/2) {
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
        // intro statuses
        case 'initial':
            console.log('initial');
            this.visible = true;
            this.status = 'bleed';
            this.updateIntro();
            break;
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
        default:
            break;
    }
};


// Animate change in position
Diamond.prototype.updatePosition = function(rate = 1) {
    // make sure the diamond is not drawn at a further position than desired
    if (this.progress_x > this.end_x) {
        this.progress_x = this.end_x;
    }
    if (this.progress_y > this.end_y) {
        this.progress_y = this.end_y;
    }

    // each position and respective origin value will be affected equally
    if (this.progress_x < this.end_x && this.progress_y < this.end_y) {
        this.progress_x += this.velocity_x * rate;
        this.progress_y += this.velocity_y * rate;
        this.origin_x += this.velocity_x * this.move_x_sign;
        this.origin_y += this.velocity_y * this.move_y_sign;
        console.log('new_origin: (' + this.origin_x + ', ' + this.origin_y + ')');
    } else {
        return;
    }
};


// 'fade/bleed-in' animation for the diamond outline
Diamond.prototype.updateIntro = function(rate = 1) {

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
        this.line_progress[0] -= 4 * rate;
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
            this.line_progress[1] -= 4 * rate;
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
            this.line_progress[2] -= 4 * rate;
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
        this.line_progress[3] -= rate;
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
        this.line_progress[4] -= rate;
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
            this.line_progress[5] -= 2 * rate;
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
        this.line_progress[6] -= 2 * rate;
    }

    if (this.diamond_complete) {
        this.status = 'color_fill';
    }
};


// Animate color fill
Diamond.prototype.updateColorFill = function(rate = 1) {

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
        this.setElevation(200);
    } else {
        this.fill_size += 3 * rate;
    }
};


Diamond.prototype.updateElevation = function(rate = 1) {
    var progress = this.elevation_progress * this.elevation_direction;
    var goal = this.elevation_goal * this.elevation_direction;

    // make sure that the diamond is not drawn at a higher or lower elevation than desired
    if (progress >= goal) {
        this.elevation_progress = this.elevation_goal;
        this.status = 'intro_complete';
        return;

    } else {
        this.elevation_progress += this.elevation_rate * this.elevation_direction * rate;
        //this.fade_ratio += this.fade_change; // TODO: find smooth way to make sure that fade_ratio never goes higher than 1.0
        this.shadow_fade_width += 0.1 * rate;
        this.size += 0.05 * rate;
    }
};


// Animate change in size
Diamond.prototype.updateSize = function(rate = 1) {
    draw.clearRect(0, 0, dimension_x, dimension_y);

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
Diamond.prototype.updateRotation = function(rate = 1) {

};
