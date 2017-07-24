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

// NOTE: currently only works with Chrome. TODO: increase portability.

// the dimensions of the canvas. TODO: maybe find a dynamic solution
var dimension_x = 1280;
var dimension_y = 720;
var canvas_center_x = dimension_x/2;
var canvas_center_y = dimension_y/2;

// variables storing canvas and animation info
var draw;
var animator;

function main() {
    console.log("Initializing 'cyel'...");

    // Initialize the game canvas and animation handler
    draw = document.getElementById("canvas").getContext("2d");
    draw.globalCompositeOperation = 'source-over';
    animator = new Animator(draw);

    // Set up the starting title screen diamond and its associated interactive div
    var title_diamond = new Diamond('title', canvas_center_x, canvas_center_y, 160);
    //title_diamond.setColor("rgb(126, 54, 80)");
    var menu_title = new lightMenuItem('cyel', canvas_center_x, canvas_center_y, startCyel);
    title_diamond.linkContent(menu_title);

    animator.addObject('title', title_diamond);

    animator.animation_objects['title'].beginActionSet('display_content');
    animator.animation_objects['title'].displayContent('title_content', 1000);
    animator.animation_objects['title'].closeActionSet();

    // Start the animation loop that will continue to run as long as the application runs
    animator.animate();
}

$(function() {
    main();
});



/**********************************************************
 *                        GAME START                      *
 **********************************************************/
// IDEA: Fade out menu items and condense menu object to become the center of the board
// IDEA: expand grey diamond to blend in with text then expand white diamond while revealing
//          the 'initiate' text.
function startCyel() {
    console.log("initializing menu...");
    animator.animation_objects['title'].removeContent();

    var selector_diamond = new Diamond('selector', canvas_center_x - 160, canvas_center_y - 160, 100);
    //selector_diamond.setColor("rgb(48, 22, 90)");

    animator.addObject('selector', selector_diamond);

    var selector_group = new AnimatableObject('selector_group', canvas_center_x, canvas_center_y);

    animator.addObject('selector_group', selector_group);

    animator.designateComponent('selector_group', 'title');
    animator.designateComponent('selector_group', 'selector');
    //console.log(animator.animation_objects);

    animator.animation_objects['selector_group'].rotate('initial_rotate', 90, 2);
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
