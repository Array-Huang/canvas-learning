var HIT_LOST_SPEED = 100;
var g = 600

var pf = {
  calculateCoor: function(ball, t1) {
    /* 计算离上次位移经过的时间 */
    var deltaT = t1 - ball.t0;
    ball.t0 = t1;

    /* 计算速度 */
    var newV = ball.v0 + g * deltaT;

    /* 计算位移 */
    var s = ball.v0 * deltaT + g * Math.pow(deltaT, 2) / 2;
    var newY = ball.y - s; // 球离地面的距离
    if (newY < 0) { // 距离小于0表示球已触底
      ball.y = 0; // 方便起见，把距离重置为0
      /*
        触底反弹，速度方向相反，而且会有一定的衰减，衰减由参数HIT_LOST_SPEED来决定
        如果现时速度小于衰减的量，则直接重置速度为0，表明球已彻底停下
      */
      ball.v0 = newV > HIT_LOST_SPEED ? -1 * (newV - HIT_LOST_SPEED) : 0;  
    } else {
      ball.y = newY; // 记录好球的新位置
      ball.v0 = newV; // 记录好球的新速度
    }
  },
};

window.ball = function(params) {
  Object.assign(this, params);
}

window.ball.prototype = {
  /* 实例化ball类时需要传入的参数，这些参数是各个球独有的 */
  // x: 0, // 绘制图片的基点，即图片的左下角
  // y: 300, // 绘制图片的基点，即图片的左下角
  // v0: 0, // 球当前的速度，为正数则表示方向向下，为负数则表示方向向上
  // t0: null, // 上次计算位移时记录的时间戳

  /* 设置球的坐标 */
  setCoor: function(x, y) {
    this.x = x;
    this.y = y;
  },

  /* 计算最新的坐标 */
  getStatus: function(t1) {
    pf.calculateCoor(this, t1);
    return {
      x: this.x,
      y: this.y,
      v0: this.v0,
    };
  },
};
