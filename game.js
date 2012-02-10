enchant();
var CHIP_SIZE = 16;
var MAP_WIDTH = 10;
var MAP_HEIGHT = 10;

var mapElement = [
  [322, 322, 322, 322, 322, 205, 205, 205, 205, 205],
  [322, 320, 320, 320, 322, 322, 205, 205, 205, 322],
  [322, 320, 320, 322, 322, 322, 322, 322, 322, 322],
  [322, 320, 322, 322, 322, 322, 322, 322, 322, 322],
  [322, 322, 322, 322, 322, 322, 322, 322, 322, 322],
  [322, 322, 322, 322, 322, 322, 322, 322, 322, 322],
  [322, 322, 322, 322, 322, 322, 322, 322, 322, 322],
  [322, 322, 322, 322, 322, 322, 322, 322, 322, 322],
  [322, 322, 322, 322, 322, 322, 322, 322, 322, 322],
  [322, 322, 322, 322, 322, 322, 322, 322, 322, 322]
];

var moveCostMap = [
  [  1,   1,   1,   1,   1,  99,  99,  99,  99,  99],
  [  1,   2,   2,   2,   1,   1,  99,  99,  99,   1],
  [  1,   2,   2,   1,   1,   1,   1,   1,   1,   1],
  [  1,   2,   1,   1,   1,   1,   1,   1,   1,   1],
  [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1],
  [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1],
  [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1],
  [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1],
  [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1],
  [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1]
];

var gridmap = function() {
  var result = new Array(MAP_HEIGHT);
  for (var i = 0; i < MAP_HEIGHT; i++) {
    result[i] = new Array(MAP_WIDTH);
    for (var j = 0; j < MAP_WIDTH; j++) {
      result[i][j] = 0;
    }
  }
  return result;
};

window.onload = function() {
  var game = new Game(240, 240);
  game.fps = 15;
  game.preload('map1.gif', 'unit.png', 'grid.png');
  game.onload = function() {
    var hex = new Hex(moveCostMap, 240, 240);
    var stage = new Group();

    var map = new Map(CHIP_SIZE, CHIP_SIZE);
    map.image = game.assets['map1.gif'];
    map.loadData(mapElement);
    stage.addChild(map);

    var grid = new Map(CHIP_SIZE, CHIP_SIZE);
    grid.image = game.assets['grid.png'];
    grid.loadData(gridmap());
    stage.addChild(grid);

    var unit = new Unit(2, 3);
    unit.image = game.assets['unit.png'];
    stage.addChild(unit);
    unit.addEventListener('touchend', function() {
      hex.drawMovableArea(unit.getPosition(), unit.movePower);
      stage.addChild(hex.movableArea);
    });
    
    map.addEventListener('touchend', function(e) {
      var _x = Math.floor(e.pageX / CHIP_SIZE);
      var offsetY = (x % 2) * CHIP_SIZE / 2;
      var _y = Math.floor((e.pageY - offsetY) / CHIP_SIZE);
      var pos = {x: _x, y: _y};
      var cost = hex.accessCost[pos.y][pos.x];
      if(cost < 0) {
        stage.removeChild(hex.movableArea);
      } else {
        
      }
    })
  };
  game.start();
};

var Unit = enchant.Class.create(enchant.Sprite, {
  initialize: function(px, py) {
    Sprite.call(this, CHIP_SIZE, CHIP_SIZE);
    this._unitPos = {x:px, y:py}
    this.x = px * CHIP_SIZE;
    this.y = py * CHIP_SIZE + this.calcOffset(); 
    this.movePower = 4;
  },
  unitX: {
    get: function() {
      return this._unitPos.x;
    },
    set: function(unitX) {
      this.x = unitX * CHIP_SIZE;
      this._unitPos.x = unitX;
    }
  },
  unitY: {
    get: function() {
      return this._unitPos.y;
    },
    set: function(unitY) {
      this.y = unitY * CHIP_SIZE + this.calcOffset();
      this._unitPos.y = unitY;
    }
  },
  getPosition: function() {
    return this._unitPos;
  },
  calcOffset: function() {
      return CHIP_SIZE / 2 * (this._unitPos.x % 2);
  }
});

