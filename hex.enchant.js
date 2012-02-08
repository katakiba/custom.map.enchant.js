enchant.hex = enchant.Class.create({
  initialize: function(costMap) {
    this._costMap = costMap;
    this._cost = this._initCost();
  },
  drawMovableArea: function(unitPosition, movingPower) {
    this.accessCost(unitPosition, movingPower);
    var movableArea = new Surface();
    movableArea.context.beginPath();
    movableArea.context.strokeStyle = 'rgb(255, 200, 0)';
    for (var x = 0; x < MAP_WIDTH; x++) {
      var offsetY = CHIP_SIZE / 2 * (x % 2);
      for (var y = 0; y < MAP_HEIGHT; y++) {
        if(this._cost[y][x] >= 0) {
          movableArea.context.rect(x * CHIP_SIZE, y * CHIP_SIZE + offsetY, CHIP_SIZE, CHIP_SIZE);
        }
      }
    }
    movableArea.context.closePath();
    movableArea.context.stroke();
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
    this._cost[chip.y][chip.x] = rest;
    if (rest <= 0) { return; }
    var around = this._aroundOf(chip);
    for (var i = 0; i < around.length; ++i) {
      var a = around[i];
      var c = this._costOf(this._costMap[a.y][a.x]);
      var nextRest = rest - c;
      if (!this._cost[a.y][a.x] || this._cost[a.y][a.x] < nextRest) {
        this._access(a, nextRest);
      }
    }
  },
  _costOf: function(valueOfCostMap) {
    return valueOfCostMap + 1;
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
      if (x < MAP_WIDTH - 1 && y > 0) result.push({x:x + 1, y:y + 1});
    } else {
      if (x > 0 && y < MAP_HEIGHT - 1) result.push({x:x - 1, y:y + 1});
      if (x > MAP_WIDTH -1 && y < MAP_HEIGHT -1) result.push({x:x + 1, y:y + 1});
    }
    return result;
  }
})
