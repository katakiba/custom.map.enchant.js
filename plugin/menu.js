enchant.Menu = enchant.Class.create(enchant.Group,{
  initialize: function(x, y, menu) {
    enchant.Group.call(this);
    this._game = Game.instance;
    this._menu = menu;
    this._height = this._menu.length * MENU_HEIGHT;

    this._menuBase = new Sprite(MENU_WIDTH + MENU_RADIUS * 2, this._height + MENU_RADIUS * 2);
    this._menuBase.image = new Surface(MENU_WIDTH + MENU_RADIUS * 2, this._height + MENU_RADIUS * 2);

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
    this._fillRoundRect(0, 0, MENU_WIDTH, this._height, MENU_RADIUS, '#000000');
    this.addChild(this._menuBase);
    
    for (var i = 0; i < this._menu.length; i++) {
      var _menuElement = new Label(this._menu[i].text);
      _menuElement.x = this._menuBase.x + MENU_RADIUS;
      _menuElement.y = this._menuBase.y + MENU_RADIUS + i * MENU_HEIGHT;
      _menuElement.color = '#ffffff';
      _menuElement.font = '8px';
      this.addChild(_menuElement);
    }
  },
  _menuArea: function(text) {
    var area = [];
    var menuX = this._menuBase.x + MENU_RADIUS;
    for (var i = 0; i < this._menu.length; i++) {
      if(this._menu.text == text) {
        var menuY = this._menuBase.y + MENU_RADIUS + i * MENU_HEIGHT;
        break;
      }
    }
    area.push({x: menuX, y: menuY});
    return area;
  }
});


