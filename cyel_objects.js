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
    this.amount = list.length;
    // TOOO: loop through all items in list and create a div object for each
};

// display the menu object
Menu.prototype.display = function() {

    console.log('menu being displayed:');
    for (i = 0; i < this.amount; i++) {
        console.log('    ' + this.items[i]);
    }
};
