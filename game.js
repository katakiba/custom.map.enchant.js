enchant();
var CHIP_SIZE = 16;

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

window.onload = function() {
  var game = new Game(240, 240);
  game.fps = 15;
  game.preload('map1.gif', 'chara0.gif');
  game.onload = function() {
    var map = new Map(16, 16);
    map.image = game.assets['map1.gif'];
    map.loadData(mapElement);

    var unit = new Unit(3, 4);
    unit.drawUnit();

    var stage = new Group();
    stage.addChild(map);
    stage.addChild(unit);
    game.rootScene.addChild(stage);
  };
  game.start();
};

var Unit = enchant.Class.create(enchant.Sprite, {
  initialize: function(px, py) {
    Sprite.call(this, CHIP_SIZE, CHIP_SIZE);
    this._unitX = px;
    this._unitY = py;
    this.x = px * CHIP_SIZE;
    this.y = py * CHIP_SIZE + this.offsetY;
    this.movePower = 6;
  },
  drawUnit: function() {
    var unitImage = new Surface(CHIP_SIZE, CHIP_SIZE);
    unitImage.context.beginPath();
    unitImage.context.fillStyle = 'rgb(255,192,192)';
    unitImage.context.arc(
      this.x + CHIP_SIZE / 2, 
      this.y + CHIP_SIZE / 2 + this.offsetY, 
      CHIP_SIZE / 3,
      0,
      Math.PI * 2, 
      false
    );
    unitImage.context.closePath();
    unitImage.context.fill();
    this._image = unitImage;
  },
  unitX: {
    get: function() {
      return this._unitX;
    },
    set: function(unitX) {
      this._unitX = unitX;
      this.x = unitX * CHIP_SIZE;
    }
  },
  unitY: {
    get: function() {
      return this.unitY;
    },
    set: function(unitY) {
      this._unitY = unitY;
      this.y = unitY * CHIP_SIZE + this.offsetY;
    }
  },
  offsetY: {
    get: function() {
      return CHIP_SIZE / 2 * (this._unitX % 2);
    }
  }
});
