dimension_x = 720;
dimension_y = 720;

//NOTE: this function will likely be moved to a different file (i.e. a main .js file)
$(function() {
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

// dynamic and persistent DOM objects
var title;
var menu;

// set up objects and values before the looping of the animation
function entrance_init() {
    m_object_margin = 40;
    ani_progress = 0;
    ani_goal = dimension_x/2 - m_object_margin;
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

function load_menu() {
    var items = ['continue', 'new game', 'leaderboard', 'settings'];
    menu = new Menu(items);
    menu.display();

    console.log('menu progress');
    return;
}


/************************
 * GAME START ANIMATION *
 ************************/
//TODO: (current idea) fade out menu items and condense menu object to become the center of the board


/***********************
 * GAMEPLAY ANIMATIONS *
 ***********************/
//TODO: falling units, clockwise/counter-clockwise shift, removing units,
