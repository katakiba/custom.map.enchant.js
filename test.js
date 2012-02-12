enchant();
var CHIP_SIZE = 16;
var MAP_WIDTH = 10;
var MAP_HEIGHT = 10;

window.onload = function() {
  var game = new Game(240, 240);
  game.onload = function() {
    var cancel = new MoveCancelMenu();
  };
  game.start();
};

enchant.Menu = enchant.Class.create(enchant.Group,{
  initialize: function(x, y, menu) {
    enchant.Group.call(this);
    this._game = Game.instance;
    this._menuBase = new Sprite(this._game.width, this._game.height);
    this._menuBase.image = new Surface(this._game.width, this._game.height);

    this.menu = menu;
    this._height = this.menu.length * 15;
    this.x = x;
    this.y = y;
    this._drawMenu();
  },
  _fillRoundRect: function(x, y, width, height, radius, color) {
    var ctx = this._menuBase.image.context;
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, -Math.PI, -Math.PI / 2, false);
    ctx.arc(x + width + radius, y + radius, radius, -Math.PI / 2, 0, false);
    ctx.arc(x + width + radius, y + height + radius, radius, 0, Math.PI / 2, false);
    ctx.arc(x + radius, y + height + radius, radius, Math.PI / 2, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  },
  _drawMenu: function() {
    this._fillRoundRect(this.x, this.y, 80, this._height, 5, '#000000');
    this.addChild(this._menuBase);

    for (var i = 0; i < this.menu.length; i++) {
      var label = new Label(this.menu[i]);
      label.x = this.x;
      label.y = this.y;
      label.color = '#ffffff';
      label.font = "0.5em, 'ＭＳ ゴシック'";
      this.addChild(label);
    }
  }
});

var MoveCancelMenu = enchant.Class.create(enchant.Menu, {
  initialize: function() {
    var menu = ['キャンセル'];
    enchant.Menu.call(this, 40, 80, menu);
    this._game.rootScene.addChild(this);
    this.addEventListener('touchend', function() {
      this.remove();
    });
  },
  remove: function() {
    this._game.removeChild(this);
    delete this;
  }
});
