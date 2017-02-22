/**********************************************************
 *                       GAME FIELD                       *
 **********************************************************/
var Field = function(gameType) {
    this.gameType = gameType;
    this.score = 0;
    this.active_units = [];
    this.dormant_units = [[], [], [], [], [], [], [], []];
    //console.log('New ' + gameType + ' game started');
};

Field.prototype.clear_data = function() {
    // clear the dormant data
};

Field.prototype.floor = function() {
    // floor all dormant pieces
};

Field.prototype.traverse = function() {
    // search all of the dormant data for activation units and follow through the resulting matching chains
};



/**********************************************************
 *                    INDIVIDUAL UNITS                    *
 **********************************************************/
var Unit = function(color, type, location, status) {
    this.color = color;
    this.type = type;
    this.location = location;
    this.status = status;
    //console.log('New ' + color + ' ' + type + ' piece created at ' + location[0] + ',' + location[1]);
};



/**********************************************************
 *                      PAIR OF UNITS                     *
 **********************************************************/
var Pair = function(units) {
    this.units = units;
    //console.log('New pair created: ' + units[0].color + ',' + units[1].color);
};



/**********************************************************
 *                        MENU ITEM                       *
 **********************************************************/
var MenuItem = function(name, avail, action) {
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
                color: "#000000"
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
    }
}

// TODO: consider implementing private variables using the 'underscore' technique
//         mentioned at: https://philipwalton.com/articles/implementing-private-and-protected-members-in-javascript/



/**********************************************************
 *                          MENU                          *
 **********************************************************/
var Menu = function(group, items) {
    this.menu_name = group;
    this.menu_items = items;
    this.amount = items.length;

    // create all of the menu items to be stored in the menu_items array
    this.menu_items.forEach(function(item) {
        item.createDiv('main');
    });

    //console.log('New Menu created');
};

// display the menu object
Menu.prototype.display = function() {
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
        opacity: 1.0
    }, 1000);
};



/**********************************************************
 *                          TITLE                         *
 **********************************************************/
var Title = function(id, title) {
    this.title = title;
    this.id = 'title_' + id;

    this.div = document.createElement('div');
    this.div.id = this.id;
    this.div.className = 'title';
    this.div.innerHTML = title;
    this.div.style.opacity = 0.0;

    //console.log('New Title created');
};

Title.prototype.display = function() {
    //console.log('displaying title...');

    document.getElementById('main_div').appendChild(this.div);

    $('#' + this.id).animate({
        opacity: 1.0
    }, 1000);
};
