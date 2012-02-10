enchant.Hex = enchant.Class.create({
  initialize: function(costMap, x, y) {
    this.gameWidth = x;
    this.gameHeight = y;
    this.movableArea = new Sprite(x, y);
    this._costMap = costMap;
    this._cost = this._initCost();
  },
  drawMovableArea: function(unitPosition, movingPower) {
    this.accessCost(unitPosition, movingPower);
    var canvas = new Surface(this.gameWidth, this.gameHeight);
    canvas.context.beginPath();
    canvas.context.strokeStyle = 'rgb(255, 200, 0)';
    for (var x = 0; x < MAP_WIDTH; x++) {
      var offsetY = CHIP_SIZE / 2 * (x % 2);
      for (var y = 0; y < MAP_HEIGHT; y++) {
        if(this._cost[y][x] >= 0) {
          canvas.context.rect(x * CHIP_SIZE, y * CHIP_SIZE + offsetY, CHIP_SIZE, CHIP_SIZE);
        }
      }
    }
    canvas.context.closePath();
    canvas.context.stroke();
    
    this.movableArea.image = canvas;
  },
  accessCost: function(unitPosition, movingPower) {
    this._initCost();
    this._access(unitPosition, movingPower);
    return this._cost;
  },
  _initCost: function() {
    var __cost = new Array(MAP_HEIGHT);
    for (var i = 0; i < MAP_HEIGHT; i++) {
      __cost[i] = new Array(MAP_WIDTH);
      for (var j = 0; j < MAP_WIDTH; j++) {
        __cost[i][j] = -1
      }
    }
    return __cost;
  },
  _access: function(chip, rest) {
    if (this._cost[chip.y][chip.x] < rest) {
      this._cost[chip.y][chip.x] = rest;
    }
    if (rest <= 0) { return; }
    var around = this._aroundOf(chip);
    for (var i = 0; i < around.length; i++) {
      var a = around[i]; //調査する座標
      var c = this._costMap[a.y][a.x]; //ある座標の移動コスト
      var nextRest = rest - c; //基準点から調査座標で移動したときの、残移動力
//    if (!this._cost[a.y][a.x] || this._cost[a.y][a.x] < nextRest) {
        this._access(a, nextRest);
//    }
    }
  },
  _aroundOf: function(unitPos) {
    var result = [];
    var x = unitPos.x;
    var y = unitPos.y;
    
    if (x > 0) result.push({x:x - 1, y:y});
    if (y > 0) result.push({x:x, y:y - 1});
    if (x < MAP_WIDTH - 1 ) result.push({x:x + 1, y:y});
    if (y < MAP_HEIGHT - 1) result.push({x:x, y:y + 1});
    if (x % 2 === 0) {
      if (x > 0 && y > 0) result.push({x:x - 1, y:y - 1});
      if (x < MAP_WIDTH - 1 && y > 0) result.push({x:x + 1, y:y - 1});
    } else {
      if (x > 0 && y < MAP_HEIGHT - 1) result.push({x:x - 1, y:y + 1});
      if (x > MAP_WIDTH -1 && y < MAP_HEIGHT -1) result.push({x:x + 1, y:y + 1});
    }
    return result;
  }
})
