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
  game.preload('map1.gif', './img/unit.gif', 'grid.png','./img/menu.png');
  game.onload = function() {
    game.rootScene.backgroundColor = '#000000';
    var hex = new Hex(moveCostMap, 240, 240);
    var stage = new Group();

    var map = new exMap(CHIP_SIZE, CHIP_SIZE, mapElement);
    stage.addChild(map);

    var grid = new Map(CHIP_SIZE, CHIP_SIZE);
    grid.image = game.assets['grid.png'];
    grid.loadData(gridmap());
    stage.addChild(grid);

    game.rootScene.addChild(stage);

    var unit = new Unit(2, 3);
  };
  game.start();
};

var Unit = enchant.Class.create(enchant.Sprite, {
  initialize: function(px, py) {
    Sprite.call(this, CHIP_SIZE, CHIP_SIZE);
    var game = Game.instance;
    var image = new Surface(96, 96);
    image.draw(game.assets['./img/unit.gif'], 0, 0, 96, 96, 0, 0, 16, 16);
    this.image = image;
    this._unitPos = {x:px, y:py}
    this.x = px * CHIP_SIZE;
    this.y = py * CHIP_SIZE + this.calcOffset(); 
    this.movingPower = 4;
    game.rootScene.addChild(this);
    this.addEventListener('touchend', function() {
      var hex = Hex.instance;
      hex.drawMovableArea(this._unitPos, this.movingPower);
      var movableArea = hex.movableArea;
      game.rootScene.addChild(movableArea);
      
      var cancel = new MoveCancelMenu(movableArea);
    });
  },
  remove: function() {
    game.rootScene.removeChild(this);
    delete this;
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

var exMap = enchant.Class.create(enchant.Map, {
  initialize: function(width, height, element) {
    enchant.Map.call(this, width, height);
    var game = Game.instance;
    this._image = game.assets['map1.gif'];
    this.loadData(element);
  }
});

var MoveCancelMenu = enchant.Class.create(enchant.Menu, {
  initialize: function(movablearea) {
    var menu = [{text:'キャンセル', frame:0}];
    enchant.Menu.call(this, 100, 120, menu);
    this._game.rootScene.addChild(this);
    this.addEventListener('touchend', function(e) {
      var area = this._menuArea(menu.text);
      if(e.x > area[0].x && e.x < area[0].x + this._width && e.y > area[0].y && e.y < area[0].y + 15) {
        this._game.rootScene.removeChild(movablearea);
        this.remove();
      }
    });
  },
  remove: function() {
    this._game.rootScene.removeChild(this);
    delete this;
  }
});
