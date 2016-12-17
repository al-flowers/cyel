/******************
 * DIAMOND OBJECT *
 ******************/
var Diamond = function(x_position, y_position, size) {
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
}

// Display the Diamond using the 'Bleed' animation
Diamond.prototype.display = function(rate = 1) {
    this.ani_bleed_init(rate);

    this.visible = true;
};

// Move the diamond to the goal location
// IDEA: provide an option for moving a relative distance
Diamond.prototype.move = function(goal_x, goal_y) {

};

// Expand or contract the Diamond depending on the new_length in relation to the current_length
// NOTE: size cannot be reduced to a value less than 0
// IDEA: provide an option for changing the size by a relative amount
Diamond.prototype.change_size = function(new_size) {
    if (new_size < 0) {
        console.error('Diamond size cannot be lower than 0');
        return;
    }

};

// Raise or lower the Diamond object to change the shadow width/intensity
// NOTE: elevation cannot be reduced to a value less than 0
Diamond.prototype.change_elevation = function(new_elevation) {
    if (new_elevation < 0) {
        console.error('Diamond elevation cannot be lower than 0');
        return;
    }
};

Diamond.prototype.addContent = function(content_item) {
    this.content.push(content_item);
};

// TODO: create a rotate function


/***********************
 * ANIMATION FUNCTIONS *
 ***********************/
// TODO: make these methods private
// TODO: maybe (just maybe) devise cleaner solution for scoping
// IDEA: run code from init functions within the corresponding methods above and remove the init methods

// Animate the 'Bleed' effect to display the Diamond
// TODO: scale the appropriate values using the rate variable
Diamond.prototype.ani_bleed_init = function(rate) {
    this.rate = rate;
    // WARNING: be careful of floating point values. they may break the fillRect function. We'll see though.

    this.diamond_complete = false;
    this.edge = Math.ceil(this.size * Math.sqrt(2));
    this.half_edge = Math.ceil(this.edge/2);
    this.line_progress = [this.half_edge, this.edge, this.half_edge, this.half_edge, this.half_edge, this.half_edge, this.half_edge];
    this.line_complete = [false, false, false, false, false, false, false];

    this.cover_color = "#FFFFFF";

    window.requestAnimationFrame(() => {this.ani_bleed_draw()});
}

Diamond.prototype.ani_bleed_draw = function() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

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

    this.diamond_complete = true;
    for (var i=0; i < 7; i++) {
        if (this.line_progress[i] <= 0 || this.line_complete[i]) {
            this.line_complete[i] = true;
        } else {
            this.diamond_complete = false;
        }
    }

    // Quadrant IV (2/2)
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

    // Quadrant I (1/1)
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

    // Quadrant II (1/2)
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

    // Quadrant II (2/2)
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

    // Quadrant III (1/2)
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

    // Quadrant III (2/2)
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

    // Quadrant IV (1/2)
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
        // free variables that were only used by this one time animation
        delete this.diamond_complete;
        delete this.line_progress;
        delete this.line_complete;
        window.requestAnimationFrame(() => {this.ani_elevation_init()});
        return;
    } else {
        window.requestAnimationFrame(() => {this.ani_bleed_draw()});
    }
}

// Animate change in elevation
Diamond.prototype.ani_elevation_init = function() {
    this.shadow_width = 40;
    // TODO: find better names for fade_ratio and fade_change
    this.fade_ratio = 0.1;
    this.fade_change = 0.002;
    this.lift_progress = 0;
    this.lift_end = 100;
    this.lift_rate = 1;
    this.items_loaded = false;

    this.shadow_transparency_begin = 0.7;
    this.shadow_transparency_end = 0.2;
    window.requestAnimationFrame(() => {this.ani_elevation_draw()});
}

Diamond.prototype.ani_elevation_draw = function() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    if (this.lift_progress >= this.lift_end) {
        this.lift_progress = this.lift_end;
    }

    var shadow;
    var shadow_level = Math.floor(256 - this.lift_progress);

    draw.save();
    draw.translate(this.origin_x, this.origin_y);

    // Quadrant I
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

    // Quadrant II
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

    // Quadrant III
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

    // Quadrant IV
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

    // draw diamond over the shadow
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

    if (this.lift_progress < this.lift_end) {
        if (!this.menu_loaded && this.lift_progress > this.lift_end/2) {
            // Display diamond content (e.g. titles, menus, etc.)
            this.content.forEach(function(item) {
                console.log(item);
                item.display();
            });
            this.menu_loaded = true;
        }
        this.lift_progress += this.lift_rate;
        this.fade_ratio += this.fade_change; // TODO: find smooth way to make sure that fade_ratio never goes higher than 1.0
        this.size += 0.1;
        window.requestAnimationFrame(() => {this.ani_elevation_draw()});
    } else {
        return;
    }
}

// Animate change in size
function ani_size_init() {

}

function ani_size_draw() {

}

// Animate change in position
function ani_position_init() {

}

function ani_position_draw() {

}
