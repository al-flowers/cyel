/**********************************************************
 *                     DIAMOND OBJECT                     *
 **********************************************************/

/* The diamond object provides the framework for each puzzle piece. At least with the current game idea.
 */

// TODO: rename a lot of variables :c
// TODO: ISSUE: creating a second diamond object clears any existing diamonds from the canvas because of clearRect()
//          IDEA: Animation overlord: draws all objects in each animation frame. Every frame will pass through
//                  the animation overlord's main draw loop. Long live creating issues through progress. :D :c :D

var Diamond = function(id, x_position, y_position, size) {
    // set main attributes
    this.id = id;
    this.origin_x = x_position;
    this.origin_y = y_position;
    this.size = size;
    this.border = "rgb(128, 128, 128)";
    this.fill = "rgb(256, 256, 256)";
    this.elevation = 0;
    this.visible = false;
    this.content = [];

    console.log('New Diamond object created');
};

// Set the border and fill colors for the Diamond
Diamond.prototype.setColor = function(border, fill) {
    this.border = border;
    this.fill = fill;
};

// Display the Diamond using the 'Bleed' animation
// TODO: (ultimately unnecessary) consider scaling the speed of the bleeding effect based on size.
Diamond.prototype.display = function(rate = 1) {
    // set default variables for animations (bleed_in, elevation, ...)
    // TODO: find better names for most of these variables
    // bleed_in
    this.rate = rate; // WARNING: be careful of floating point values. they may break the fillRect function. We'll see though.
    this.diamond_complete = false;
    this.edge = Math.ceil(this.size * Math.sqrt(2));
    this.half_edge = Math.ceil(this.edge/2);
    this.line_progress = [this.half_edge, this.edge, this.half_edge, this.half_edge, this.half_edge, this.half_edge, this.half_edge];
    this.line_complete = [false, false, false, false, false, false, false];
    this.cover_color = "#FFFFFF";

    // elevate
    this.shadow_width = 40;
    this.fade_ratio = 0.02;
    this.fade_change = 0.002; // NOTE: needs fixing. a high enough number will break code
    this.lift_progress = 0;
    this.lift_end = 100;
    this.lift_rate = 1;
    this.items_loaded = false;
    this.shadow_transparency_begin = 0.65;
    this.shadow_transparency_end = 0.1;

    window.requestAnimationFrame(() => {this.ani_intro_bleed()});

    this.visible = true;
    console.log('diamond displayed');
};

// Move the diamond to the goal location
// relative arguments
Diamond.prototype.move = function(goal_x, goal_y, rate = 1) {
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

    // NOTE: the values of origin_x and origin_y will change accordingly throughout the animation process
    window.requestAnimationFrame(() => {this.ani_position_change()});
};

// Expand or contract the Diamond depending on the new_length in relation to the current_length
// NOTE: size cannot be reduced to a value less than 0
// IDEA: maybe implement acceleration into the change of the diamond size
// relative arguments
Diamond.prototype.change_size = function(size_change, rate = 1) {
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

    window.requestAnimationFrame(() => {this.ani_size_change()});
};

// Raise or lower the Diamond object to change the shadow width/intensity
// NOTE: elevation cannot be reduced to a value less than 0
// Relative arguments
Diamond.prototype.change_elevation = function(new_elevation) {
    if (new_elevation < 0) {
        console.error('Diamond elevation cannot be lower than 0');
        return;
    }
};

// map div items to the diamond
Diamond.prototype.addContent = function(content_item) {
    this.content.push(content_item);
};

// rotate the entire diamond
// if clockwise is set to false then the diamond will rotate counter-clockwise instead
// TODO: this method
Diamond.prototype.rotate = function(angle, clockwise = true) {

}

// ** ANIMATION FUNCTIONS **

// TODO: make these methods private

// Draw the diamond outline
Diamond.prototype.draw_diamond = function() {
    draw.save();
    draw.translate(this.origin_x, this.origin_y);

    draw.beginPath();
    draw.moveTo(0, -(this.size));
    draw.lineTo(this.size, 0);
    draw.lineTo(0, this.size);
    draw.lineTo(-(this.size), 0);
    draw.lineTo(0, -(this.size));
    draw.lineWidth = 0.5;
    draw.strokeStyle = this.border;
    draw.fillStyle = this.fill;
    draw.stroke();
    draw.fill();
    draw.closePath();

    draw.restore();
};

// Draw the diamond shadow (changes with elevation)
Diamond.prototype.draw_shadow = function() {
    var shadow;
    var shadow_level = Math.floor(256 - this.lift_progress);

    draw.save();
    draw.translate(this.origin_x, this.origin_y);

    // Top Right Quadrant
    shadow = draw.createLinearGradient(0, -(this.size), this.shadow_width, -(this.size + this.shadow_width));
    shadow.addColorStop(0, "rgba(" + shadow_level + ", " + shadow_level + ", " + shadow_level + ", " + this.shadow_transparency_begin + ")");
    shadow.addColorStop(this.fade_ratio, "rgba(256, 256, 256, " + this.shadow_transparency_end + ")");

    draw.beginPath();
    draw.moveTo(0, -(this.size));
    draw.lineTo(0, -(this.size + this.shadow_width));
    draw.lineTo(this.size + this.shadow_width, 0);
    draw.lineTo(this.size, 0);
    draw.lineTo(0, -(this.size));
    draw.lineWidth = 0.0;
    draw.fillStyle = shadow;
    draw.fill();
    draw.closePath();

    // Bottom Right Quadrant
    shadow = draw.createLinearGradient(this.size, 0, this.size + this.shadow_width, this.shadow_width);
    shadow.addColorStop(0, "rgba(" + shadow_level + ", " + shadow_level + ", " + shadow_level + ", " + this.shadow_transparency_begin + ")");
    shadow.addColorStop(this.fade_ratio, "rgba(256, 256, 256, " + this.shadow_transparency_end + ")");

    draw.beginPath();
    draw.moveTo(this.size, 0);
    draw.lineTo(this.size + this.shadow_width, 0);
    draw.lineTo(0, this.size + this.shadow_width);
    draw.lineTo(0, this.size);
    draw.lineTo(this.size, 0);
    draw.lineWidth = 0.0;
    draw.fillStyle = shadow;
    draw.fill();
    draw.closePath();

    // Bottom left Quadrant
    shadow = draw.createLinearGradient(0, this.size, -(this.shadow_width), this.size + this.shadow_width);
    shadow.addColorStop(0, "rgba(" + shadow_level + ", " + shadow_level + ", " + shadow_level + ", " + this.shadow_transparency_begin + ")");
    shadow.addColorStop(this.fade_ratio, "rgba(256, 256, 256, " + this.shadow_transparency_end + ")");

    draw.beginPath();
    draw.moveTo(0, this.size);
    draw.lineTo(0, this.size + this.shadow_width);
    draw.lineTo(-(this.size + this.shadow_width), 0);
    draw.lineTo(-(this.size), 0);
    draw.lineTo(0, this.size);
    draw.lineWidth = 0.0;
    draw.fillStyle = shadow;
    draw.fill();
    draw.closePath();

    // Top Left Quadrant
    shadow = draw.createLinearGradient(-(this.size), 0, -(this.size + this.shadow_width), -(this.shadow_width));
    shadow.addColorStop(0, "rgba(" + shadow_level + ", " + shadow_level + ", " + shadow_level + ", " + this.shadow_transparency_begin + ")");
    shadow.addColorStop(this.fade_ratio, "rgba(256, 256, 256, " + this.shadow_transparency_end + ")");

    draw.beginPath();
    draw.moveTo(-(this.size), 0);
    draw.lineTo(-(this.size + this.shadow_width), 0);
    draw.lineTo(0, -(this.size + this.shadow_width));
    draw.lineTo(0, -(this.size));
    draw.lineTo(-(this.size), 0);
    draw.lineWidth = 0.0;
    draw.fillStyle = shadow;
    draw.fill();
    draw.closePath();

    draw.restore();
};

// Recursive loop for drawing the 'fade/bleed-in' animation for the diamond outline
Diamond.prototype.ani_intro_bleed = function() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    this.draw_shadow();
    this.draw_diamond();

    // Break the recursive loop once all of the 'line-covers' have revealed the entire diamond_complete
    this.diamond_complete = true; // this will become false if the diamond isn't fully visible
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
        draw.fillRect((this.half_edge + 2) - this.line_progress[0], 0, this.line_progress[0], 4);
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
        draw.fillRect((this.edge + 2) - this.line_progress[1], 0, this.line_progress[1], 4);
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
        draw.fillRect((this.half_edge + 2) - this.line_progress[2], 0, this.line_progress[2], 4);
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
        this.line_progress[3]--;
    }

    // Bottom Left Quadrant (1/2)
    if (!this.line_complete[4]) {
        draw.save();
        draw.translate(this.origin_x, this.origin_y + (this.size + 2));
        draw.rotate(225 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = this.cover_color;
        draw.fillRect((this.half_edge + 2) - this.line_progress[4], 0, this.line_progress[4], 4);
        draw.closePath();
        draw.restore();
        this.line_progress[4]--;
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
        window.requestAnimationFrame(() => {this.ani_elevation_change()});
        return;
    } else {
        window.requestAnimationFrame(() => {this.ani_intro_bleed()});
    }
};

// TODO: make work with a negative elevation change
Diamond.prototype.ani_elevation_change = function() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    // make sure that the diamond is not drawn at a higher elevation than desired
    if (this.lift_progress >= this.lift_end) {
        this.lift_progress = this.lift_end;
    }

    this.draw_shadow();
    this.draw_diamond();

    if (this.lift_progress < this.lift_end) {
        if (!this.menu_loaded && this.lift_progress > this.lift_end/2) {
            // Display diamond content (e.g. titles, menus, etc.)
            this.content.forEach(function(item) {
                item.display();
            });
            this.menu_loaded = true;
        }
        this.lift_progress += this.lift_rate;
        // TODO: find a solid ending fade_ratio value to be able to utilize this animation function for any other function
        // TODO: or maybe create a centralized draw function for drawing the diamond. This funciton is going to be used A LOT. k?
        this.fade_ratio += this.fade_change; // TODO: find smooth way to make sure that fade_ratio never goes higher than 1.0
        this.size += 0.05;
        window.requestAnimationFrame(() => {this.ani_elevation_change()});
    } else {
        return;
    }
};

// Animate change in size
Diamond.prototype.ani_size_change = function() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    console.log('diamond size: ' + this.size);

    this.draw_shadow();
    this.draw_diamond();

    if (this.size_progress > this.size_goal) {
        this.size_progress = this.size_goal;
    }

    if (this.size_progress < this.size_goal) {
        this.size_progress += this.size_velocity;
        this.size += this.size_velocity * this.size_direction;

        window.requestAnimationFrame(() => {this.ani_size_change()});
    } else {
        return;
    }

};

// Animate change in position
Diamond.prototype.ani_position_change = function() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    this.draw_shadow();
    this.draw_diamond();

    // make sure the diamond is not drawn at a further position than desired
    if (this.progress_x > this.end_x) {
        this.progress_x = this.end_x;
    }
    if (this.progress_y > this.end_y) {
        this.progress_y = this.end_y;
    }

    // each position and respective origin value will be affected equally
    if (this.progress_x < this.end_x && this.progress_y < this.end_y) {
        this.progress_x += this.velocity_x;
        this.progress_y += this.velocity_y;
        this.origin_x += this.velocity_x * this.move_x_sign;
        this.origin_y += this.velocity_y * this.move_y_sign;
        console.log('new_origin: (' + this.origin_x + ', ' + this.origin_y + ')');

        window.requestAnimationFrame(() => {this.ani_position_change()});
    } else {
        return;
    }
};
