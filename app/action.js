/**********************/
/*    ACTION OBJECT    */
/**********************/

// The constructor takes in a string indicating the action and an array of attributes [indexed via strings, i.e., an object containing attributes]
// TODO: consider naming this DiamondAction and create an Action prototype for this to inherit from.
// NOTE: Although parts of the framework around the Action class indicate its application to non-diamond objects, this current implementation only supports Diamond objects
function Action(action, action_id, goal, rate = 1) {
    this.type = action;
    this.action_id = action_id;
    this.paused = false;
    this.is_complete = false; // This may become useless if the action is simply removed from the action set upon completion
    this.carryover = false;
    switch (action) {
        case 'display_content':
            this.level = goal;
            this.rate = rate;
            break;
        case 'draw_border':
            this.long_destination = goal;                   // The entire edge length
            this.short_destination = Math.ceil(goal/2);     // Roughly half of the entire edge length
            this.draw_border_complete = false;
            this.border_progress = [this.short_destination, this.long_destination, this.short_destination, this.short_destination, this.short_destination, this.short_destination, this.short_destination];
            this.section_complete = [false, false, false, false, false, false, false];
            this.border_cover_color = "white";
            this.display_rate = rate;
            break;
        case 'erase_border':
            this.erase_border_complete = false;
            break;
        case 'fill':
            this.fill_progress = 0;
            this.fill_destination = goal;
            this.fill_rate = rate;
            this.fill_complete = false;
            break;
        case 'unfill':
            this.unfill_complete = false;
            break;
        case 'move':
            // destination_x, destination_y, velocity_x, velocity_y
            // direction_x, direction_y, progress_x, progress_y
            // reached_x, reached_y
            // In this case 'goal' is an array consisting of [goal_x, goal_y]
            if (Array.isArray(goal)) {
                this.destination_x = goal[0];
                this.destination_y = goal[1];
            } else {
                this.destination_x = 0;
                this.destination_y = 0;
                goal = [0, 0];
            }

            // In this case 'rate' is an array consisting of [velocity, direction_x, direction_y]
            if (Array.isArray(rate)) {
                this.direction_x = rate[1];
                this.direction_y = rate[2];
                this.velocity_x = rate[0];
                this.velocity_y = rate[0];
            } else {
                this.direction_x = 1;
                this.direction_y = 1;
                this.velocity_x = 0;
                this.velocity_y = 0;
            }

            // Separate the movement rate into a horizontal velocity and a vertical velocity
            var angle = Math.atan(Math.abs(this.destination_y)/Math.abs(this.destination_x));
            this.velocity_x = this.velocity_x * Math.cos(angle);
            this.velocity_y = this.velocity_y * Math.sin(angle);

            this.progress_x = 0;
            this.progress_y = 0;
            this.reached_x = false;
            this.reached_y = false;
            break;
        case 'elevate':
            // elevation_rate, elevation_goal, elevation_progress
            // elevation_direction, elevation_modifier
            this.elevation_rate = rate;
            this.elevation_goal = goal;
            this.elevation_progress = 0; // might be unnecessary
            this.elevation_direction = 1;
            this.elevation_modifier = 0.2;
            break;
        case 'resize':
            this.resize_rate = rate;
            this.resize_goal = goal;
            this.
            break;
        case 'rotate':
            this.rate = rate;
            this.goal = goal;
            this.roation_direction = 1;
            break;
        default:
            break;
    }
}

Action.prototype.pause = function() {
    this.paused = true;
}

Action.prototype.resume = function() {
    this.paused = false;
}

Action.prototype.complete = function() {
    this.is_complete = true;
}

// unnecessary at this point, but makes the animatable object update() function look a bit nicer (barely...)
Action.prototype.isComplete = function() {
    return this.is_complete;
}



/**************************/
/*    ACTION SET OBJECT    */
/**************************/

function ActionSet(set_id, predecessor_id = null) {
    this.set_id = set_id;
    this.predecessor_id = predecessor_id;
    this.action_ids = [];
    this.actions = {};
    this.is_complete = false;
}

ActionSet.prototype.appendAction = function(action) {
    console.log("appending action with id: " + action.action_id);
    this.action_ids.push(action.action_id);
    this.actions[action.action_id] = action;
}

ActionSet.prototype.removeAction = function(action_id) {
    console.log("removing action with id: " + action_id);
    var index = this.action_ids.indexOf(action_id);
    this.action_ids.splice(index, 1);
    delete this.actions[action_id];
}

// Checks if the Action Set has completed all of its actions and updates the is_complete attribute accordingly
ActionSet.prototype.isComplete = function() {
    if (this.action_ids.length == 0) {
        this.is_complete = true;
    }
    return this.is_complete;
}
