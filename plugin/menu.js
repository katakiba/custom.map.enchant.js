enchant.Menu = enchant.Class.create(enchant.Group,{
  initialize: function(x, y, menu) {
    enchant.Group.call(this);
    this._game = Game.instance;
    this._menu = menu;
    this._height = this._menu.length * 15;
    this._width = 60;

    this._menuBase = new Sprite(this._width + 10, this._height + 10);
    this._menuBase.image = new Surface(this._width + 10, this._height + 10);

    this._menuBase.x = x;
    this._menuBase.y = y;
    
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
    this._fillRoundRect(0, 0, this._width, this._height, 5, '#000000');
    this.addChild(this._menuBase);
    
    var image = new Surface(this._width, this._height);
    image.draw(this._game.assets['./img/menu.png'], 0, 0, 60, 150, 0, 0, 60, 150);
    for (var i = 0; i < this._menu.length; i++) {
      var _menuElement = new Sprite(this._width, 15);
      _menuElement.x = this._menuBase.x + 5;
      _menuElement.y = this._menuBase.y + 5 + i * 15;
      _menuElement.image = image;
      _menuElement.frame = this._menu[i].frame;
      this.addChild(_menuElement);
    }
  },
  _menuArea: function(text) {
    var area = [];
    var menuX = this._menuBase.x + 5;
    for (var i = 0; i < this._menu.length; i++) {
      if(this._menu.text == text) {
        var menuY = this._menuBase.y + 5 + i * 15;
        break;
      }
    }
    area.push({x: menuX, y: menuY});
    return area;
  }
});


