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

// NOTE: currently only works with Chrome.
// TODO: make work with browsers other than Chrome. Important.
// TODO: return to this project with knowledge from bootstrap and angularJS, whether utilized or not
// TODO: remove any mention of classes because JS doesn't utilize classes and I don't want to add to my ignorance.

// the dimensions of the canvas. TODO: maybe find a dynamic solution
var dimension_x = 1280;
var dimension_y = 720;

// dynamic and persistent objects
var title;
var menu;
var draw;
var title_diamond;
var animator;

$(function() {
    console.log("\n\n+++++starting 'cyel'++++++\n");

    // initialize the game canvas and Animation Overlord
    draw = document.getElementById("canvas").getContext("2d");
    draw.globalCompositeOperation = 'source-over';
    animator = new Animator(draw);

    // first diamond object holding the main menu
    title_diamond = new Diamond('title', 640, 360, 315);

    // main menu and title
    var title = new Title('Main', 'c y e l');
    var main_continue = new MenuItem('continue', false, null);
    var main_new_game = new MenuItem('new game', true, practiceSequence02);
    var main_leaderboard = new MenuItem('leaderboard', false, null);
    var main_settings = new MenuItem('settings', false, null);
    menu = new Menu('Main', [main_continue, main_new_game, main_leaderboard, main_settings]);

    title_diamond.linkContent(title);
    title_diamond.linkContent(menu);

    animator.addObject('title', title_diamond);
    animator.animate();
    // window.requestAnimationFrame(() => {animator.animate()});
});



/**********************************************************
 *                        GAME START                      *
 **********************************************************/
// IDEA: Fade out menu items and condense menu object to become the center of the board
// IDEA: expand grey diamond to blend in with text then expand white diamond while revealing
//          the 'initiate' text.
function startGame() {

}

function practiceSequence01() {
    // TODO: allow consecutive moves of the same type for the same object
    // IDEA: make an 'Action' object that can be queued

    // just testing some functions
    var board_size = 640;
    var board_margin_x = (dimension_x - board_size)/2;
    var board_margin_y = (dimension_y - board_size)/2;
    var row_count = 8;

    var diamond_size = (board_size/2)/row_count;
    var diamond_size_start = diamond_size - 5;

    var start_x1 = board_margin_x + board_size;
    var start_x2 = board_margin_x + board_size;
    var start_x3 = board_margin_x;
    var start_x4 = board_margin_x;

    var start_y1 = board_margin_y;
    var start_y2 = board_margin_y + board_size;
    var start_y3 = board_margin_y + board_size;
    var start_y4 = board_margin_y;

    console.log("board_margin_x: " + board_margin_x);
    console.log("board_margin_y: " + board_margin_y);
    console.log("diamond_size: " + diamond_size);

    var color1 = "#F9CDAE";
    var color2 = "#F69A9A";
    var color3 = "#83AE9B";
    var color4 = "#C8C8A9";
    var color0 = "rgb(70, 70, 70)";

    var diamond_speed = 60;

    var goal_x1 = board_margin_x + board_size/2;
    var goal_x2 = board_margin_x + board_size - diamond_size;
    var goal_x3 = board_margin_x + board_size/2;
    var goal_x4 = board_margin_x + diamond_size;

    var goal_y1 = board_margin_y + diamond_size;
    var goal_y2 = board_margin_y + board_size/2;
    var goal_y3 = board_margin_y + board_size - diamond_size;
    var goal_y4 = board_margin_y + board_size/2;

    var stage1 = 0;
    var stage2 = 1;
    var stage3 = 2;
    var stage4 = 3;

    var inc_x1 = diamond_size;
    var inc_x2 = -(diamond_size);
    var inc_x3 = -diamond_size;
    var inc_x4 = diamond_size;

    var inc_y1 = diamond_size;
    var inc_y2 = diamond_size;
    var inc_y3 = -diamond_size;
    var inc_y4 = -diamond_size;

    var line_count = row_count - 2;
    var line_limit = line_count;

    var first_layer = true;

    var diamond_count = row_count * row_count;

    //animator.ani_objects['title'].resize(board_size/2, 15, true);

    nd0 = new Diamond('nd0', start_x1, start_y1, diamond_size_start);
    nd1 = new Diamond('nd1', start_x2, start_y2, diamond_size_start);
    nd2 = new Diamond('nd2', start_x3, start_y3, diamond_size_start);
    nd3 = new Diamond('nd3', start_x4, start_y4, diamond_size_start);

    nd0.setColor(color1, color1);
    nd1.setColor(color2, color2);
    nd2.setColor(color3, color3);
    nd3.setColor(color4, color4);

    // animator.addObject('nd0', nd0, 'title');
    // animator.addObject('nd1', nd1, 'title');
    // animator.addObject('nd2', nd2, 'title');
    // animator.addObject('nd3', nd3, 'title');

    animator.addObject('nd0', nd0);
    animator.addObject('nd1', nd1);
    animator.addObject('nd2', nd2);
    animator.addObject('nd3', nd3);

    animator.ani_objects['nd0'].rotate(90, 8);
    animator.ani_objects['nd1'].rotate(90, 8);
    animator.ani_objects['nd2'].rotate(90, 8);
    animator.ani_objects['nd3'].rotate(90, 8);

    animator.ani_objects['nd0'].move(goal_x1, goal_y1, diamond_speed, true);
    animator.ani_objects['nd1'].move(goal_x2, goal_y2, diamond_speed, true);
    animator.ani_objects['nd2'].move(goal_x3, goal_y3, diamond_speed, true);
    animator.ani_objects['nd3'].move(goal_x4, goal_y4, diamond_speed, true);

    for (var i = 4; i < diamond_count; i++) {
        var new_diamond;
        var mod_value = i%4;
        switch (mod_value) {
            case 0:
                //console.log("dn" + i + " created. predecessor = nd" + (i-4) + ".");
                goal_x1 += inc_x1;
                goal_y1 += inc_y1;
                new_diamond = new Diamond('nd' + i, start_x1, start_y1, diamond_size_start);
                new_diamond.setColor(color1, color1);
                animator.addObject("nd" + i, new_diamond, "nd" + (i-4));
                animator.ani_objects['nd' + i].rotate(90, 8);
                animator.ani_objects['nd' + i].move(goal_x1, goal_y1, diamond_speed, true);


                break;
            case 1:
                //console.log("dn" + i + " created. predecessor = nd" + (i-4) + ".");
                goal_x2 += inc_x2;
                goal_y2 += inc_y2;
                new_diamond = new Diamond('nd' + i, start_x2, start_y2, diamond_size_start);
                new_diamond.setColor(color2, color2);
                animator.addObject("nd" + i, new_diamond, "nd" + (i-4));
                animator.ani_objects['nd' + i].rotate(90, 8);
                animator.ani_objects['nd' + i].move(goal_x2, goal_y2, diamond_speed, true);
                break;
            case 2:
                //console.log("dn" + i + " created. predecessor = nd" + (i-4) + ".");
                goal_x3 += inc_x3;
                goal_y3 += inc_y3;
                new_diamond = new Diamond('nd' + i, start_x3, start_y3, diamond_size_start);
                new_diamond.setColor(color3, color3);
                animator.addObject("nd" + i, new_diamond, "nd" + (i-4));
                animator.ani_objects['nd' + i].rotate(90, 8);
                animator.ani_objects['nd' + i].move(goal_x3, goal_y3, diamond_speed, true);
                break;
            case 3:
                //console.log("dn" + i + " created. predecessor = nd" + (i-4) + ".");
                goal_x4 += inc_x4;
                goal_y4 += inc_y4;
                new_diamond = new Diamond('nd' + i, start_x4, start_y4, diamond_size_start);
                new_diamond.setColor(color4, color4);
                animator.addObject("nd" + i, new_diamond, "nd" + (i-4));
                animator.ani_objects['nd' + i].rotate(90, 8);
                animator.ani_objects['nd' + i].move(goal_x4, goal_y4, diamond_speed, true);

                line_limit -= 1;

                if (line_limit == 0) {
                    if (first_layer) {
                        line_count -= 1;
                        first_layer = false;
                    } else {
                        line_count -= 2;
                    }
                    line_limit = line_count;

                    switch (stage1) {
                        case 0:
                            inc_x1 *= -1;
                            stage1 = 1;
                            break;
                        case 1:
                            inc_y1 *= -1;
                            stage1 = 2;
                            break;
                        case 2:
                            inc_x1 *= -1;
                            stage1 = 3;
                            break;
                        case 3:
                            inc_y1 *= -1;
                            stage1 = 0;
                            break;
                        default:
                            break;
                    }

                    switch (stage2) {
                        case 0:
                            inc_x2 *= -1;
                            stage2 = 1;
                            break;
                        case 1:
                            inc_y2 *= -1;
                            stage2 = 2;
                            break;
                        case 2:
                            inc_x2 *= -1;
                            stage2 = 3;
                            break;
                        case 3:
                            inc_y2 *= -1;
                            stage2 = 0;
                            break;
                        default:
                            break;
                    }

                    switch (stage3) {
                        case 0:
                            inc_x3 *= -1;
                            stage3 = 1;
                            break;
                        case 1:
                            inc_y3 *= -1;
                            stage3 = 2;
                            break;
                        case 2:
                            inc_x3 *= -1;
                            stage3 = 3;
                            break;
                        case 3:
                            inc_y3 *= -1;
                            stage3 = 0;
                            break;
                        default:
                            break;
                    }

                    switch (stage4) {
                        case 0:
                            inc_x4 *= -1;
                            stage4 = 1;
                            break;
                        case 1:
                            inc_y4 *= -1;
                            stage4 = 2;
                            break;
                        case 2:
                            inc_x4 *= -1;
                            stage4 = 3;
                            break;
                        case 3:
                            inc_y4 *= -1;
                            stage4 = 0;
                            break;
                        default:
                            break;
                    }
                }
                break;
            default:
                break;
        }
    }
}

function practiceSequence02() {
    var diamond_size = 40;
}



/**********************************************************
 *                         GAMEPLAY                       *
 **********************************************************/
//TODO: falling units, clockwise/counter-clockwise shift, removing units, IMPORTANCE: high
