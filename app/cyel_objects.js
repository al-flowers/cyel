/**********************************************************
 *                       GAME FIELD                       *
 **********************************************************/
function Field(gameType) {
    this.gameType = gameType;
    this.score = 0;
    this.active_units = [];
    this.dormant_units = [[], [], [], [], [], [], [], []];
    //console.log('New ' + gameType + ' game started');
}

Field.prototype.clear_data = function() {
    // clear the dormant data
}

Field.prototype.floor = function() {
    // floor all dormant pieces
}

Field.prototype.traverse = function() {
    // search all of the dormant data for activation units and follow through the resulting matching chains
}



/**********************************************************
 *                    INDIVIDUAL UNITS                    *
 **********************************************************/
function Unit(color, type, location, status) {
    this.color = color;
    this.type = type;
    this.location = location;
    this.status = status;
    //console.log('New ' + color + ' ' + type + ' piece created at ' + location[0] + ',' + location[1]);
}



/**********************************************************
 *                      PAIR OF UNITS                     *
 **********************************************************/
function Pair(units) {
    this.units = units;
    //console.log('New pair created: ' + units[0].color + ',' + units[1].color);
}


/*********************************************************
 *                      LIGHT MENU ITEM                  *
 *********************************************************/
// A menu item with light text colors meant to be used with darker backgrounds
function lightMenuItem(name, position_x, position_y, action = null) {
    this.name = name;
    this.action = action;
    this.selection = false;

    // position_x and position_y correlate to coordinates over the canvas
    this.position_x = position_x;
    this.position_y = position_y;

    // availability determines whether the item is interactive
    if (!action) {
        this.interactive = false;
    } else {
        this.interactive = true;
    }

    this.div = document.createElement('div');
    this.div.id = this.name;
    this.div.className = 'light_menu_item';
    this.div.innerHTML = this.name;
    this.div.style.opacity = 0;

    var adjusted_position_x = this.position_x - 40;
    var adjusted_position_y = this.position_y - 40;
    this.div.style.left = adjusted_position_x + "px";
    this.div.style.top = adjusted_position_y + "px";

    if (this.interactive) {
        this.div.style.color = "#CCCCCC";
        $(this.div).hover(function() {
            this.selection = true;
            $(this).stop();
            $(this).animate({
                color: "#FFFFFF"
            }, 80);
        },
        function() {
            this.selection = false;
            $(this).stop();
            $(this).animate({
                color: "#CCCCCC"
            }, 80);
        });
        var action = this.action;
        $(this.div).click(function() {
            action();
        });
    } else {
        this.div.style.color = "#777777";
    }
}

lightMenuItem.prototype.display = function(rate, level) {
    // Assign the appropriate interaction animation

    document.getElementById('canvas_map').appendChild(this.div);
    // fade in the menu item
    $('#' + this.div.id).animate({
        opacity: level
    }, rate);
}

lightMenuItem.prototype.updatePosition = function(new_position_x, new_position_y) {
    this.div.style.left = (new_position_x - 40) + "px";
    this.div.style.top = (new_position_y - 40) + "px";
}


/**********************************************************
 *                        MENU ITEM                       *
 **********************************************************/
function MenuItem(name, avail, action) {
    this.name = name;
    this.availability = avail;
    this.action = action;
    // NOTE: there is also a div attribute

    //console.log('New MenuItem created');
}

MenuItem.prototype.createDiv = function(group) {
    this.div = document.createElement('div');
    this.div.id = group + '_' + this.name.replace(/ /g, '_');
    this.div.className = 'menu_item';
    this.div.innerHTML = this.name;
    // if a menu item is selectable then add the appropriate functionality and hover animation
    if (this.availability) {
        $(this.div).hover(function() {
            $(this).stop();
            $(this).animate({
                color: "#FFFFFF"
            }, 80);
        },
        function() {
            $(this).stop();
            $(this).animate({
                color: "#CCCCCC"
            }, 80);
        });

        var action = this.action;
        $(this.div).click(function() {
            action();
        });
    } else {
        this.div.style.color = "#777777";
    }
}

// TODO: consider implementing private variables using the 'underscore' technique
//         mentioned at: https://philipwalton.com/articles/implementing-private-and-protected-members-in-javascript/



/**********************************************************
 *                          MENU                          *
 **********************************************************/
function Menu(group, items) {
    this.menu_name = group;
    this.menu_items = items;
    this.amount = items.length;

    // create all of the menu items to be stored in the menu_items array
    this.menu_items.forEach(function(item) {
        item.createDiv('main');
    });

    //console.log('New Menu created');
}

// display the menu object
// rate is in milliseconds and level is a value between 0 and 1.0 inclusive
Menu.prototype.display = function(rate, level) {
    //console.log('displaying menu...');

    // the menu div will hold all of the menu items
    var menu_div = document.createElement('div');

    menu_div.id = 'menu_' + this.menu_name;
    menu_div.className = 'menu';
    menu_div.style.opacity = 0.0;

    // add each menu item
    this.menu_items.forEach(function(item) {
        menu_div.appendChild(item.div);

    });
    document.getElementById('main_div').appendChild(menu_div);
    // fade in the menu items
    $('#' + menu_div.id).animate({
        opacity: level
    }, rate);
}



/**********************************************************
 *                          TITLE                         *
 **********************************************************/
function Title(id, title) {
    this.title = title;
    this.id = 'title_' + id;

    this.div = document.createElement('div');
    this.div.id = this.id;
    this.div.className = 'title';
    this.div.innerHTML = title;
    this.div.style.opacity = 0.0;

    //console.log('New Title created');
}

Title.prototype.display = function(rate, level) {
    //console.log('displaying title...');

    document.getElementById('main_div').appendChild(this.div);

    $('#' + this.id).animate({
        opacity: level
    }, rate);
}
