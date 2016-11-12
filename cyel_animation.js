dimension_x = 1280;
dimension_y = 720;

// dynamic and persistent DOM objects
var title;
var menu;

//NOTE: this function will likely be moved to a different file (i.e. a main .js file)
$(function() {
    console.log('dimension_x: ' + dimension_x);
    entrance_init();
    //TODO: perform the appropriate animations (and data manipulation) according to the user's actions
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

// fade in title and main menu (w/ animations?)
//TODO: probably make a title object since it may actually be useful in the future...idk
function load_title() {
    title = document.createElement('div');
    title.id = 'title';
    title.className = 'title';
    title.innerHTML = 'c y e l';
    title.style.opacity = 0.0;
    document.getElementById('main_div').appendChild(title);

    $(function() {
        $('#title').animate({
            opacity: 1.0
        }, 500);
    });

    load_menu();
}

// fade in title menu with full functionality and associated animations
function load_menu() {
    menu = new Menu(['continue', 'new game', 'leaderboard', 'settings']);
    menu.changeAvailability('continue', false);
    menu.changeAvailability('leaderboard', false);
    menu.changeAvailability('settings', false);
    menu.display();

    // Set the animations that play throughout the menu menu selection
    $(function() {
        menu.item_objects.forEach(function(item) {
            var avail = menu.getAvailability(item.innerHTML);
            if (avail) {
                $('#' + item.id).hover(function() {
                    $('#' + item.id).animate({
                        color: "#000000"
                    }, 100);
                },
                function() {
                    $('#' + item.id).animate({
                        color: "#CCCCCC"
                    }, 100);
                });
            }
        });
    });

    return;
}

/************************
 * GAME START ANIMATION *
 ************************/
//TODO: (current idea) fade out menu items and condense menu object to become the center of the board
function start_game_init() {

}

function start_game_draw() {

}

/***********************
 * GAMEPLAY ANIMATIONS *
 ***********************/
//TODO: falling units, clockwise/counter-clockwise shift, removing units,
