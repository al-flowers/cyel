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

     Project initiation:
           Q4 2016
*/

// the dimensions of the canvas. TODO: maybe find a dynamic solution
var dimension_x = 1280;
var dimension_y = 720;

// dynamic and persistent objects
var title;
var menu;
var draw;
var title_diamond;

$(function() {
    draw = document.getElementById("canvas").getContext("2d");
    draw.globalCompositeOperation = 'source-over';
    title_diamond = new Diamond('main', 640, 360, 320);

    // make title object
    var title = new Title('Main', 'c y e l');

    // make main menu box
    var main_continue = new MenuItem('continue', false, null);
    var main_new_game = new MenuItem('new game', true, start_game);
    var main_leaderboard = new MenuItem('leaderboard', false, null);
    var main_settings = new MenuItem('settings', false, null);
    menu = new Menu('Main', [main_continue, main_new_game, main_leaderboard, main_settings]);

    title_diamond.addContent(title);
    title_diamond.addContent(menu);
    title_diamond.display();
    title_diamond.change_elevation(40);

});



/**********************************************************
 *                        GAME START                      *
 **********************************************************/
// IDEA: Fade out menu items and condense menu object to become the center of the board
// IDEA: expand grey diamond to blend in with text then expand white diamond while revealing
//          the 'initiate' text.
function start_game() {
    // just testing some functions
    // title_diamond.move(50, 50);
    title_diamond.change_size(-50);
    new_diamond = new Diamond('new_diamond', 960, 160, 120);
    new_diamond.display();
    new_diamond.change_elevation(40);
}



/**********************************************************
 *                         GAMEPLAY                       *
 **********************************************************/
//TODO: falling units, clockwise/counter-clockwise shift, removing units, IMPORTANCE: high
