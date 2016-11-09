var calculateCoorInElement = function(originCoor, element) {
  var x, y;
  if (originCoor.pageX || originCoor.pageY) {
    x = originCoor.pageX;
    y = originCoor.pageY;
  } else {
    x = originCoor.clientX + document.body.scrollLeft +document.documentElement.scrollLeft;
    y = originCoor.clientY + document.body.scrollTop +document.documentElement.scrollTop;
  }

  return {
    x: x - element.offsetLeft,
    y: y - element.offsetTop,
  };
}

var utils = {
  mouseCoorInited: false,
  mouseCoor: {
    x: null,
    y: null,
  },

  /* 获取鼠标在画布内的坐标 */
  getMouseCoordinate: function(element) {
    if (utils.mouseCoorInited) {
      return utils.mouseCoor;
    }

    element.addEventListener('mousemove', function(evt) {
      var coor = calculateCoorInElement(evt, evt.target);

      utils.mouseCoor.x = coor.x;
      utils.mouseCoor.y = coor.y;
    });

    utils.mouseCoorInited = true;

    return utils.mouseCoor;
  },

  touchInited: false,
  touch: {
    x: null,
    y: null,
    isPressed: false,
  },

  /* 获取触摸相关的属性 */
  captureTouch: function(element) {
    if (utils.touchInited) {
      return utils.touch;
    }

    element.addEventListener('touchstart', function(evt) {
      utils.touch.isPressed = true;
    });

    element.addEventListener('touchend', function(evt) {
      utils.touch.x = null;
      utils.touch.y = null;
      utils.touch.isPressed = false;
    });

    element.addEventListener('touchmove', function(evt) {
      var coor = calculateCoorInElement(evt.touches[0], evt.target);
      utils.touch.x = coor.x;
      utils.touch.y = coor.y;
    });

    utils.touchInited = true;

    return utils.touch;
  },
};

window.utils = utils;
