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

// TODO: create a rotate function


/***********************
 * ANIMATION FUNCTIONS *
 ***********************/
 // TODO: make these methods private
 // TODO: scale the appropriate values using the rate variable
// Animate the 'Bleed' effect to display the Diamond
Diamond.prototype.ani_bleed_init = function(rate) {
    this.rate = rate;
    // WARNING: be careful of floating point values. they may break the fillRect function. We'll see though.

    this.diamond_complete = false;
    console.log(this.size);
    this.edge = Math.ceil(this.size * Math.sqrt(2));
    this.half_edge = Math.ceil(this.edge/2);
    this.line_progress = [this.half_edge, this.edge, this.half_edge, this.half_edge, this.half_edge, this.half_edge, this.half_edge];
    this.line_complete = [false, false, false, false, false, false, false];

    console.log('edge: ' + this.edge);
    console.log('half_edge: ' + this.half_edge);

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

    // Quadrant IV Right
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

    // Quadrant I complete
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

    // Quadrant II Left
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

    // Quadrant II Right
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

    // Quadrant III Left
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

    // Quadrant III Right
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

    // Quadrant IV Left
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
        // window.requestAnimationFrame(ani_elevation_init);
        return;
    } else {
        window.requestAnimationFrame(() => {this.ani_bleed_draw()});
    }
}

// Animate change in size
function ani_size_init() {

}

function ani_size_draw() {

}

// Animate change in elevation
function ani_elevation_init() {

}

function ani_elevation_draw() {

}

// Animate change in position
function ani_position_init() {

}

function ani_position_draw() {

}
