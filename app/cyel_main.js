/*
              *
           /     \
        /           \
     /                 \
  /                       \
*          c y e l          *
  \                       /
     \                 /
        \           /
           \     /
              *

           created
             by
        Alonso Flores

*/

// NOTE: currently only works in Chrome. TODO: increase portability.

// the dimensions of the canvas. TODO: possibly find a dynamic solution
var dimension_x = 1280;
var dimension_y = 720;
var canvas_center_x = dimension_x/2;
var canvas_center_y = dimension_y/2;

// variables storing canvas and animation objects/states
var draw;
var animator;

/*
 * The main() function serves as the point of entry for the entire application.
 */
function main() {
    console.log("Initializing 'cyel'...");

    // Initialize the game canvas and animation handler
    draw = document.getElementById("canvas").getContext("2d");
    draw.globalCompositeOperation = 'source-over';
    animator = new Animator(draw);

    // Set up the starting title screen diamond and add it to the animator
    var title_diamond = new Diamond('title', canvas_center_x, canvas_center_y, 160);
    //title_diamond.setContent('changecolor', colorChange);
    title_diamond.setContent('cyel', "30px", startCyel);
    animator.addObject('title', title_diamond);
    animator.animation_objects['title'].intro('intro');

    animator.animation_objects['title'].displayContent('title_content', 1000);

    // Start the animation loop that will continue to run as long as the application runs
    animator.animate();
}

$(function() {
    main();
});



// Testing the diamond fill color queue
colors = ['#F8B195', '#F67280', '#C06C84', '#6C5B7B', '#355C7D'];
color_id = 0;
unique_id = 0;

// Clicking on the object with this assigned action will change to the next color listed in 'colors'
function colorChange(object_id) {
    animator.animation_objects[object_id].setColor(colors[color_id] + unique_id, colors[color_id], 2);
    console.log(animator.animation_objects[object_id].current_action_set);

    color_id++;
    if (color_id > 4) {
        color_id = 0;
    }
    unique_id++;
}


/**********************************************************
 *                        GAME START                      *
 **********************************************************/
// IDEA: Fade out menu items and condense menu object to become the center of the board
// IDEA: expand grey diamond to blend in with text then expand white diamond while revealing
//          the 'initiate' text.
function startCyel() {
    console.log("initializing menu...");
    animator.animation_objects['title'].outro('outro');

    // Create the diamond for each main menu option and set them in different quadrants
    // Top Left
    var new_game_diamond = new Diamond('new_game', canvas_center_x - 160, canvas_center_y - 160, 120);
    // Top Right
    var continue_diamond = new Diamond('continue', canvas_center_x + 160, canvas_center_y - 160, 120);
    // Bottom Right
    var settings_diamond = new Diamond('settings', canvas_center_x + 160, canvas_center_y + 160, 120);
    // Bottom left
    var leaderboard_diamond = new Diamond('leaderboard', canvas_center_x - 160, canvas_center_y + 160, 120);


    // Display each diamond by adding them to the animator and calling the intro action for each
    animator.addObject('new_game', new_game_diamond);
    animator.addObject('continue', continue_diamond);
    animator.addObject('leaderboard', leaderboard_diamond);
    animator.addObject('settings', settings_diamond);

    // Testing waitOn() method
    animator.animation_objects['new_game'].intro('intro');

    animator.animation_objects['continue'].waitOn('new_game', 'intro', 200);
    animator.animation_objects['continue'].newActionSet('intro');
    animator.animation_objects['continue'].intro('intro');
    animator.animation_objects['continue'].closeActionSet();

    animator.animation_objects['settings'].waitOn('continue', 'intro', 200);
    animator.animation_objects['settings'].newActionSet('intro');
    animator.animation_objects['settings'].intro('intro');
    animator.animation_objects['settings'].closeActionSet();

    animator.animation_objects['leaderboard'].waitOn('settings', 'intro', 200);
    animator.animation_objects['leaderboard'].newActionSet('intro');
    animator.animation_objects['leaderboard'].intro('intro');
    animator.animation_objects['leaderboard'].closeActionSet();

    // Move each diamond and set a div button to trigger the colorChange function for each
    // new_game
    animator.animation_objects['new_game'].newActionSet('mv_d1');
    animator.animation_objects['new_game'].move('mv_d1', canvas_center_x, canvas_center_y - 160, 2.5);
    animator.animation_objects['new_game'].closeActionSet();

    animator.animation_objects['new_game'].newActionSet('mv_d2');
    animator.animation_objects['new_game'].move('mv_d2', canvas_center_x, canvas_center_y - 140, 2.5);
    animator.animation_objects['new_game'].closeActionSet();


    animator.animation_objects['new_game'].setContent("newgame", "20px", colorChange);
    animator.animation_objects['new_game'].displayContent('display_new_game_diamond', 1000);

    // continue
    animator.animation_objects['continue'].newActionSet('mv_d1');
    animator.animation_objects['continue'].move('mv_d1', canvas_center_x + 160, canvas_center_y, 2.5);
    animator.animation_objects['continue'].closeActionSet();

    animator.animation_objects['continue'].newActionSet('mv_d2');
    animator.animation_objects['continue'].move('mv_d2', canvas_center_x + 140, canvas_center_y, 2.5);
    animator.animation_objects['continue'].closeActionSet();

    animator.animation_objects['continue'].setContent('continue', "20px", colorChange);
    animator.animation_objects['continue'].displayContent('display_continue_diamond', 1000);

    // settings
    animator.animation_objects['settings'].newActionSet('mv_d1');
    animator.animation_objects['settings'].move('mv_d1', canvas_center_x, canvas_center_y + 160, 2.5);
    animator.animation_objects['settings'].closeActionSet();

    animator.animation_objects['settings'].newActionSet('mv_d2');
    animator.animation_objects['settings'].move('mv_d2', canvas_center_x, canvas_center_y + 140, 2.5);
    animator.animation_objects['settings'].closeActionSet();

    animator.animation_objects['settings'].setContent('settings', "20px", colorChange);
    animator.animation_objects['settings'].displayContent('display_settings_diamond', 1000);

    // leaderboard
    animator.animation_objects['leaderboard'].newActionSet('mv_d1');
    animator.animation_objects['leaderboard'].move('mv_d1', canvas_center_x - 160, canvas_center_y, 2.5);
    animator.animation_objects['leaderboard'].closeActionSet();

    animator.animation_objects['leaderboard'].newActionSet('mv_d2');
    animator.animation_objects['leaderboard'].move('mv_d2', canvas_center_x - 140, canvas_center_y, 2.5);
    animator.animation_objects['leaderboard'].closeActionSet();

    animator.animation_objects['leaderboard'].setContent('leaderboard', "20px", colorChange);
    animator.animation_objects['leaderboard'].displayContent('display_leaderboard_diamond', 1000);

}

function newGame() {
    console.log("starting new game...");
}

function moveTest01() {
    console.log("initializing moveTest01");
}


/**********************************************************
 *                         GAMEPLAY                       *
 **********************************************************/
//TODO: falling units, clockwise/counter-clockwise shift, removing units, IMPORTANCE: high
