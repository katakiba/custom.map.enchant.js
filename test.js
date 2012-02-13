enchant();
var CHIP_SIZE = 16;
var MAP_WIDTH = 10;
var MAP_HEIGHT = 10;

window.onload = function() {
  var game = new Game(240, 240);
  game.preload('./img/menu.png');
  game.onload = function() {
    var cancel = new MoveCancelMenu();
  };
  game.start();
};

var MoveCancelMenu = enchant.Class.create(enchant.Menu, {
  initialize: function() {
    var menu = [{text:'cancel', frame:0}];
    enchant.Menu.call(this, 80, 120, menu);
    this._game.rootScene.addChild(this);
    this.addEventListener('touchend', function(e) {
      var area = this._menuArea(menu.text);
      if(e.x > area[0].x && e.x < area[0].x + this._width && e.y > area[0].y && e.y < area[0].y + 15) {
        this.remove();
      }
    });
  },
  remove: function() {
    this._game.rootScene.removeChild(this);
    delete this;
  }
});
