dimension_x = 1280;
dimension_y = 720;



// dynamic and persistent DOM objects
var title;
var menu;

//NOTE: this function will likely be moved to a different file (i.e. a main .js file)
$(function() {
    console.log('dimension_x: ' + dimension_x);
    entrance_init();
    //TODO: perform the appropriate animations (and data manipulation) according to the user's actions. IMPORTANCE: high
});



/******************************
 * WEBSITE ENTRANCE ANIMATION *
 ******************************/

// progress of the animation
var ani_progress;
var ani_goal;
var draw;
var velocity;
var acceleration;

// distance between the edges of the menu diamond object and the edges of the canvas
var m_object_margin;

// set up objects and values before the looping of the animation
function entrance_init() {
    m_object_margin = 40;
    ani_progress = 0;
    ani_goal = dimension_y/2 - m_object_margin;
    // TODO: use velocity and accleration properly....eventually
    velocity = 0.6;
    acceleration = 1.05;

    window.requestAnimationFrame(entrance_draw);
    draw = document.getElementById("canvas").getContext("2d");
    draw.globalCompositeOperation = 'source-over';
}

// recursively called until the animation is complete
function entrance_draw() {
    draw.clearRect(0, 0, dimension_x, dimension_y);

    // make sure the object never grows larger than it should
    if (ani_progress > ani_goal) {
        ani_progress = ani_goal;
    }

    // draw menu square
    draw.save();
    draw.translate(dimension_x/2, dimension_y/2);
    draw.beginPath();
    draw.moveTo(0, -(ani_progress));    //1
    draw.lineTo(ani_progress, 0);       //2
    draw.lineTo(0, ani_progress);       //3
    draw.lineTo(-(ani_progress), 0);    //4
    draw.lineTo(0, -(ani_progress));    //1
    draw.strokeStyle = "#CCCCCC";
    draw.stroke();
    draw.closePath();
    draw.restore();

    // restart or end animation loop
    if (ani_progress >= ani_goal) {
        console.log('Entrance animation complete.');
        load_title();
    } else {
        velocity *= acceleration;
        ani_progress += velocity;
        window.requestAnimationFrame(entrance_draw);
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

    load_menu();
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
// NOTE: this is on a road to messiness, but my current goal is results...should it not be? We'll find out.
function start_game_init() {
    console.log("new game started");
    //IDEA: fade out all other options except for what was selected and drift it to the
    //      to the center before minimizing the diamond.
    ng_text = document.getElementById("main_new_game");
    $(ng_text).off('mouseenter mouseleave');
    var current_position = $(ng_text).position();

    menu.menu_items.forEach(function(item) {
        if (item.availability === false) {
            console.log(menu.menu_items.indexOf(item));
            console.log(menu.amount - 1);
            if (menu.menu_items.indexOf(item) === menu.amount - 1) {
                $(item.div).fadeOut(500, function() {
                    $("#title").fadeOut(500);
                    // TODO: the title needs to fade after all of the menu items fade. As it is,
                    //          the title is fading out at the same time as all of the menu items
                });
            } else {
                $(item.div).fadeOut(500);
            }
        }
    });

    //$(ng_text).css('position', 'absolute');

    // This will change once title becomes a floatingtext object
    $("#title").fadeOut(500);

    // $(ng_text).animate({
    //     top: current_position.top
    // }, 500);

    alert("brb, learning bootstrap")
}

function start_game_draw() {

}



/***********************
 * GAMEPLAY ANIMATIONS *
 ***********************/
//TODO: falling units, clockwise/counter-clockwise shift, removing units, IMPORTANCE: high
