var dimension_x = 1280;
var dimension_y = 720;

// dynamic and persistent objects
var title;
var menu;
var draw;

$(function() {
    draw = document.getElementById("canvas").getContext("2d");
    draw.globalCompositeOperation = 'source-over';
    var title_diamond = new Diamond(640, 360, 320);

    // make title object
    var title = new Title('Main', 'c y e l');

    // make main menu box
    var main_continue = new MenuItem('continue', false, null);
    var main_new_game = new MenuItem('new game', true, start_game_init);
    var main_leaderboard = new MenuItem('leaderboard', false, null);
    var main_settings = new MenuItem('settings', false, null);
    menu = new Menu('Main', [main_continue, main_new_game, main_leaderboard, main_settings]);

    title_diamond.addContent(title);
    title_diamond.addContent(menu);
    title_diamond.display();
    title_diamond.change_elevation(40);
});



/************************
 * GAME START ANIMATION *
 ************************/
// IDEA: Fade out menu items and condense menu object to become the center of the board
// IDEA: expand grey diamond to blend in with text then expand white diamond while revealing
//          the 'initiate' text.
function start_game_init() {
    console.log("new game started");
    ng_text = document.getElementById("main_new_game");
    $(ng_text).off('mouseenter mouseleave');
    $(ng_text).animate({
        color: "#808080",
        opacity: "0.0"
    }, 2000);
    $("#title").animate({
        opacity: "0.0"
    }, 400);
    menu.menu_items.forEach(function(item) {
        if (item.div !== ng_text) {
            $(item.div).animate({
                opacity: "0.0"
            }, 400);
        }
    });

    minimize_goal = 40;
    minimize_complete = false;
    window.requestAnimationFrame(start_game_draw);
}

// TODO: implement acceleration to the minimizing of the diamond
function start_game_draw() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    console.log("length: " + length);

    if (length < minimize_goal) {
        length = minimize_goal;
        minimize_complete = true;
    }

    // draw diamond
    draw.save();
    draw.translate(origin_x, origin_y);
    draw.beginPath();
    draw.moveTo(0, -(length));    //1
    draw.lineTo(length, 0);       //2
    draw.lineTo(0, length);       //3
    draw.lineTo(-(length), 0);    //4
    draw.lineTo(0, -(length));    //1
    draw.lineWidth = 0.5;
    draw.strokeStyle = "rgb(128, 128, 128)"; // rgb(128,128,128) is equivalent to #808080
    draw.fillStyle = "rgba(128, 128, 128, " + fill_opacity + ")";
    draw.stroke();
    draw.fill();
    draw.closePath();
    draw.restore();

    if (minimize_complete) {
        return;
    } else {
        length -= 5;
    }
}



/***********************
 * GAMEPLAY ANIMATIONS *
 ***********************/
//TODO: falling units, clockwise/counter-clockwise shift, removing units, IMPORTANCE: high

/* This will provide the framework for the condensing square animation
function entrance_draw() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    // make sure the object never grows larger than it should
    if (expand_progress < 0) {
        expand_progres = 0;
        expand_complete = true;
        damage_progress = 1.0;
    }
    if (damage_progress < 0) {
        damage_progress = 0;
        damage_complete = true;
    }
    draw.save();
    draw.translate(origin_x, origin_y);
    draw.beginPath();
    draw.moveTo(0, -(expand_progress));    //1
    draw.lineTo(expand_progress, 0);       //2
    draw.lineTo(0, expand_progress);       //3
    draw.lineTo(-(expand_progress), 0);    //4
    draw.lineTo(0, -(expand_progress));    //1
    draw.strokeStyle = "rgb(204, 204, 204)";
    draw.fillStyle = "rgba(204, 204, 204, " + damage_progress + ")"; // rgb(204,204,204) is equivalent to #CCCCCC
    draw.stroke();
    draw.closePath();
    draw.restore();

    // restart or end animation loop
    if (expand_complete && damage_complete) {
        console.log('Entrance animation complete.');
        load_title();
    } else if (expand_complete) {
        damage_progress -= 0.01;
        window.requestAnimationFrame(entrance_draw)
    } else {
        velocity *= acceleration;
        expand_progress -= velocity;
        window.requestAnimationFrame(entrance_draw);
    }
}
*/
