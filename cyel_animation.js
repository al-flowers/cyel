/**********************************************************
 *                    ANIMATION OVERLORD                  *
 **********************************************************/

/* The Animation Overlord will handle the animation frame looping while calling on individual object
 * methods to actually draw on the canvas.
 * Each canvas should only be matched with one Animation_Overlord
 */

var Animation_Overlord = function() {
    this.ani_objects = [];
};

// add an object with a display function to the Animation Overlord's army
Animation_Overlord.prototype.addObject = function() {

};

// CONCERN: may have to rethink scoping method. Just some thought candy when out and about.
Animation_Overlord.prototype.animate = function() {

    window.requestAnimationFrame(() => this.animate());
};
