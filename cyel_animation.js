dimension_x = 1280;
dimension_y = 720;



// dynamic and persistent DOM objects
var title;
var menu;

//NOTE: this function will likely be moved to a different file (i.e. a main .js file)
$(function() {
    entrance_init();
    //TODO: perform the appropriate animations (and data manipulation) according to the user's actions. IMPORTANCE: high
});



/******************************
 * WEBSITE ENTRANCE ANIMATION *
 ******************************/
var draw;
var velocity;
var acceleration;
var m_object_margin;
var origin_x = dimension_x/2;
var origin_y = dimension_y/2;
var fill_opacity;
var diamond_complete;
var intro_ln_progress;
var intro_ln_done;
var cover_color;

// TODO: Add ability to skip entrance animation by clicking and/or pressing a specific button

// set up objects and values before the looping of the animation
function entrance_init() {
    m_object_margin = 40;
    diamond_complete = false;
    corner_x = origin_y - m_object_margin;
    corner_y = origin_y - m_object_margin;
    intro_ln_progress = [227, 453, 227, 227, 227, 227, 227];
    intro_ln_done = [false, false, false, false, false, false];

    cover_color = "#FFFFFF"; // TODO: This will ultimately be #FFFFFF
    fill_opacity = 0.0;

    window.requestAnimationFrame(entrance_draw);
    draw = document.getElementById("canvas").getContext("2d");
    draw.globalCompositeOperation = 'source-over';
}

// recursively called until the animation is complete
function entrance_draw() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    draw.save();
    draw.translate(origin_x, origin_y);
    draw.beginPath();
    draw.moveTo(0, -(corner_y));    //1
    draw.lineTo(corner_x, 0);       //2
    draw.lineTo(0, corner_y);       //3
    draw.lineTo(-(corner_x), 0);    //4
    draw.lineTo(0, -(corner_y));    //1
    draw.lineWidth = 0.5;
    draw.strokeStyle = "rgb(128, 128, 128)"; // rgb(128,128,128) is equivalent to #808080
    draw.fillStyle = "rgba(128, 128, 128, " + fill_opacity + ")";
    draw.stroke();
    draw.fill();
    draw.closePath();
    draw.restore();

    // draw the line covering rectangles
    // min radius: 226.274
    // min diameter: 452.548 (320*sqrt(2))
    // NOTE: yes, it's not technically radius/diameter based on what is made (a square). it's about how it's made, k?

    diamond_complete = true;
    for (var i = 0; i < 7; i++) {
        if (intro_ln_progress[i] <= 0 || intro_ln_done[i]) {
            intro_ln_done[i] = true;
        } else {
            diamond_complete = false;
        }
    }

    // TODO: organize the order and notes to make the formatting of the code more easily
    //          reflect what is actually happening with the animation.

    // covering rect 0 (sm-r IV)
    if (!intro_ln_done[0]) {
        draw.save();
        draw.translate(origin_x - 162, origin_y - 162);
        draw.rotate(315 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = cover_color;
        draw.fillRect(228 - intro_ln_progress[0], 0, intro_ln_progress[0], 4);
        draw.closePath();
        draw.restore();
        intro_ln_progress[0] -= 4;
    }

    // covering rect 1 (lg I)
    if (!intro_ln_done[1]) {
        draw.save();
        draw.translate(origin_x, origin_y - 322);
        draw.rotate(45 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = cover_color;
        draw.fillRect(455 - intro_ln_progress[1], 0, intro_ln_progress[1], 4);
        draw.closePath();
        draw.restore();
        if (intro_ln_done[0]) {
            intro_ln_progress[1] -= 4;
        }
    }

    // covering rect 2 (sm-l II)
    if (!intro_ln_done[2]) {
        draw.save();
        draw.translate(origin_x + 322, origin_y);
        draw.rotate(135 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = cover_color;
        draw.fillRect(228 - intro_ln_progress[2], 0, intro_ln_progress[2], 4);
        draw.closePath();
        draw.restore();
        if (intro_ln_done[1]) {
            intro_ln_progress[2] -= 4;
        }
    }

    // covering rect 3 (sm-r II)
    if (!intro_ln_done[3]) {
        draw.save();
        draw.translate(origin_x + 162, origin_y + 162);
        draw.rotate(135 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = cover_color;
        draw.fillRect(0, 0, intro_ln_progress[3], 4);
        draw.closePath();
        draw.restore();
        intro_ln_progress[3]--;
    }

    // covering rect 4 (sm-l III)
    if (!intro_ln_done[4]) {
        draw.save();
        draw.translate(origin_x, origin_y + 322);
        draw.rotate(225 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = cover_color;
        draw.fillRect(228 - intro_ln_progress[4], 0, intro_ln_progress[4], 4);
        draw.closePath();
        draw.restore();
        intro_ln_progress[4]--;
    }

    // covering rect 5 (sm-r III)
    if (!intro_ln_done[5]) {
        draw.save();
        draw.translate(origin_x - 162, origin_y + 162);
        draw.rotate(225 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = cover_color;
        draw.fillRect(0, 0, intro_ln_progress[5], 4)
        draw.closePath();
        draw.restore();
        if (intro_ln_done[6]) {
            intro_ln_progress[5] -= 2;
        }
    }

    // covering rect 6 (sm-l IV)
    if (!intro_ln_done[6]) {
        draw.save();
        draw.translate(origin_x - 322, origin_y);
        draw.rotate(315 * Math.PI/180);
        draw.beginPath();
        draw.fillStyle = cover_color;
        draw.fillRect(0, 0, intro_ln_progress[6], 4);
        draw.closePath();
        draw.restore();
        intro_ln_progress[6] -= 2;
    }

    // restart or end animation loop
    if (diamond_complete) {
        console.log('Entrance animation complete.');
        load_title();
        load_menu();
    } else {
        window.requestAnimationFrame(entrance_draw);
    }
}

// Adds an intensifying shadow to the main diamond object
// TODO: Assimilate this function into the code better, likely through the use of OOP.
//          Currently exists as an experiment.... Am I taking the animation too far? hmmm...
// length: the maximum distance across the diamond object
function lift_diamond(length) {
    if (!draw.getContext()) {
        console.error("lift_diamond cannot be called without a pre-existing canvas");
    }


}

// TODO: consider implementing text div object (maybe not necessary... we'll see)
function load_title() {
    title = document.createElement('div');
    title.id = 'title';
    title.className = 'title';
    title.innerHTML = 'c y e l';
    title.style.display = 'none';
    document.getElementById('main_div').appendChild(title);

    $(function() {
        $('#title').fadeIn(500);
    });
}

// fade in title menu with full functionality and associated animations
function load_menu() {
    // TODO: consider creating menu items before creating the menu object
    var main_continue = new MenuItem('continue', false, null);
    var main_new_game = new MenuItem('new game', true, start_game_init);
    var main_leaderboard = new MenuItem('leaderboard', false, null);
    var main_settings = new MenuItem('settings', false, null);
    menu = new Menu('Main', [main_continue, main_new_game, main_leaderboard, main_settings]);
    menu.display();

    return;
}



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
        color: "#808080"
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
}

function start_game_draw() {

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
