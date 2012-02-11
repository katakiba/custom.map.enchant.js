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

    var map = new exMap(CHIP_SIZE, CHIP_SIZE, mapElement);
/*  map.image = game.assets['map1.gif'];
    map.loadData(mapElement);
*/
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
    this.image = game.assets['unit.png'];
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

var Menu = enchant.Class.create(enchant.Sprite, {
  initialize: function() {
    enchant.Sprite.call(this, 240, 240);
    this._image = new Surface(this.width, this.height);
    this._bundle = new Group();
  },
  _fillRoundRect: function(x, y, width, height, radius, color) {
    var ctx = this._image.context;
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, -Math.PI, -Math.PI / 2, false);
    ctx.arc(x + width + radius, y + radius, radius, -Math.PI / 2, 0, false);
    ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false);
    ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  },
  _drawMenu: function(x, y, menu, menuHeight) {
    this._fillRoundRect(x, y, 48, menuHeight, 10, '#ffffff');
    this._fillRoundRect(x + 2, y + 2, 48 - 2 * 2, menuHeight - 2 * 2, (10 - 2) / 2, '#000000');
    this._fillRoundRect(x + 6, y + 6, 48 - 4 * 2, menuHeight - 4 * 2, (10 - 4) / 2, '#ffffff');
    this._bundle.addChild(this._image);
    for(var i = 0; i < menu.length; i++) {
      var label = new Label(menu.text);
      label.x = x + 8;
      label.y = y + 10 + i * 10;
      this._bundle.addChild(label);
    }
  }
});

var MoveCancelMenu = enchant.Class.create(Menu, {
  initialize: function(movableArea) {
    Menu.call(this);
    this._game = Game.instance;
    this.menu = [{text:'キャンセル'}];
    this._menuHeight = this.menu.lenght * 10;
    this._drawMenu(90, 120, this.menu, this._menuHeight);
    this._game.rootScene.addChild(this);
    this.addEventListener('touchend', function(e) {
      if (e.pageX > 90 && e.pageX < 148 && e.pageY > 120 && e.pageY < 90 + this._menuHeight + 10) {
        this._game.rootScene.removeChild(movableArea);
        this.remove();
      }
      
    });
  },
  remove: function() {
    this._game.rootScene.removeChild(this);
    delete this;
  }
});
