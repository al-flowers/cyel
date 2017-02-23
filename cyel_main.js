/*
              *
           /     \
  IV    /           \    I
     /                 \
  /                       \
*          c y e l          *
  \                       /
     \                 /
  III   \           /    II
           \     /
              *

           created
             by
        Alonso Flores

     Project initiation:
           Q4 2016
*/

// NOTE: currently only works with Chrome.
// TODO: make work with browsers other than Chrome. Important.
// TODO: return to this project with knowledge from bootstrap and angularJS, whether utilized or not

// the dimensions of the canvas. TODO: maybe find a dynamic solution
var dimension_x = 1280;
var dimension_y = 720;

// dynamic and persistent objects
var title;
var menu;
var draw;
var title_diamond;
var ani_overlord;

$(function() {
    // initialize the game canvas and Animation Overlord
    draw = document.getElementById("canvas").getContext("2d");
    draw.globalCompositeOperation = 'source-over';
    ani_overlord = new AnimationOverlord(draw);

    // first diamond object holding the main menu
    title_diamond = new Diamond('title', 640, 360, 320);

    // main menu and title
    var title = new Title('Main', 'c y e l');
    var main_continue = new MenuItem('continue', false, null);
    var main_new_game = new MenuItem('new game', true, start_game);
    var main_leaderboard = new MenuItem('leaderboard', false, null);
    var main_settings = new MenuItem('settings', false, null);
    menu = new Menu('Main', [main_continue, main_new_game, main_leaderboard, main_settings]);

    title_diamond.addContent(title);
    title_diamond.addContent(menu);

    ani_overlord.add('title', title_diamond);

    ani_overlord.animate();
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
    new_diamond1 = new Diamond('new_diamond1', 960, 160, 120);
    new_diamond2 = new Diamond('new_diamond2', 960, 560, 120);
    new_diamond3 = new Diamond('new_diamond3', 320, 560, 120);
    new_diamond4 = new Diamond('new_diamond4', 320, 160, 120);

    new_diamond1.setColor("#F69A9A", "#F69A9A");
    new_diamond2.setColor("#F9CDAE", "#F9CDAE");
    new_diamond3.setColor("#83AE9B", "#83AE9B");
    new_diamond4.setColor("#C8C8A9", "#C8C8A9");

    ani_overlord.add('new_diamond1', new_diamond1);
    ani_overlord.add('new_diamond2', new_diamond2);
    ani_overlord.add('new_diamond3', new_diamond3);
    ani_overlord.add('new_diamond4', new_diamond4);

    ani_overlord.ani_objects['new_diamond1'].rotate(360, 1);
    ani_overlord.ani_objects['new_diamond2'].rotate(360, 2);
    ani_overlord.ani_objects['new_diamond3'].rotate(360, 4);
    ani_overlord.ani_objects['new_diamond4'].rotate(360, 8);
}



/**********************************************************
 *                         GAMEPLAY                       *
 **********************************************************/
//TODO: falling units, clockwise/counter-clockwise shift, removing units, IMPORTANCE: high
