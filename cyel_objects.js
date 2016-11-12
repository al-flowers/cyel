/**************
 * GAME FIELD *
 **************/
var Field = function(gameType) {
    this.gameType = gameType;
    this.score = 0;
    this.active_units = [];
    this.dormant_units = [[], [], [], [], [], [], [], []];
    console.log('New ' + gameType + ' game started');
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


/*******************
 * INDIVIDUAL UNIT *
 *******************/
var Unit = function(color, type, location, status) {
    this.color = color;
    this.type = type;
    this.location = location;
    this.status = status;
    console.log('New ' + color + ' ' + type + ' piece created at ' + location[0] + ',' + location[1]);
};


/*****************
 * PAIR OF UNITS *
 *****************/
var Pair = function(units) {
    this.units = units;
    console.log('New pair created: ' + units[0].color + ',' + units[1].color);
};


/********
 * MENU *
 ********/
var Menu = function(list) {
    this.items = list;
    this.item_objects = [];
    this.amount = list.length;
    this.availability = []
    // create the div for each menu item and store it in the item_objects array
    for (i = 0; i < this.amount; i++) {
        var new_menu_item = document.createElement('div');
        new_menu_item.id = 'menu_item' + i;
        new_menu_item.className = 'menu_item';
        new_menu_item.innerHTML = this.items[i];

        this.item_objects = this.item_objects.concat(new_menu_item);

        this.availability[i] = true;
    }
};

// display the menu object
Menu.prototype.display = function() {
    console.log('menu being displayed:');
    // the menu div will hold all of the menu items
    var menu_div = document.createElement('div');
    menu_div.id ='menu';
    menu_div.className = 'menu';
    menu_div.style.opacity = 0.0;

    // add each menu item
    for (i = 0; i < this.amount; i++) {

        menu_div.appendChild(this.item_objects[i]);
        console.log('    ' + this.items[i]);
    }
    document.getElementById('main_div').appendChild(menu_div);
    // fade in the menu items
    $(function() {
        $('#menu').animate({
            opacity: 1.0
        }, 500);
    });
};

// change the availability of a menu item
Menu.prototype.changeAvailability = function(item, value) {
    var index = this.items.indexOf(item);
    this.availability[index] = value;
    if (value) {
        this.item_objects[index].style.color = '#000000';
    } else {
        this.item_objects[index].style.color = '#CCCCCC';
    }

    console.log('Availability of ' + item + ' is now ' + value);
}

// get the availability of a menu item
Menu.prototype.getAvailability = function(item) {
    var index = this.items.indexOf(item);
    var avail = this.availability[index];
    return avail;
}
