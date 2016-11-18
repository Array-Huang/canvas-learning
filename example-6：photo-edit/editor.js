/* 照片编辑器的单例 */
window.editorObject = {
  canvas: null, // 存放canvas的element对象
  context: null, // 存放canvas的context
  canvasSize: { // <canvas>的宽高
  	w: 0,
  	h: 0,
  },

  watermark: { // 水印相关信息
    img: null, // 水印img的element对象
    coor: { // 绘制水印的基点
    	x: 0,
    	y: 0,
    },
    size: { // 绘制水印的大小，注意不一定等于水印图片的实际大小
    	width: 0,
    	height: 0,
    }
  },

  photo: { // 照片的相关信息
  	img: null, // 照片img的element对象
  	translate: { // 绘制照片时，canvas坐标轴移动的横距离和纵距离
  		x: 0,
  		y: 0,
  	},
  	rotate: 0, // 绘制图片时，canvas坐标轴旋转的弧度
    initScale: 1, // 图片缩放动作开始时的原始scale
  	scale: 1, // 图片缩放动作结束时，正式绘制的scale
  },

  init: function(params) { // 初始化，主要是赋初值以及绑定各种事件
  	this.canvas = params.canvas;
  	this.context = this.canvas.getContext('2d');
  	this.canvasSize = {
  		w: this.canvas.width,
  		h: this.canvas.height,
  	};
  	this.watermark = params.watermark;
  	this.photo.img = params.photo.img;
  	this.photo.translate = { // canvas坐标轴的原点设在画布的正中心，也是图片本身的正中心
  		x: this.canvasSize.w / 2,
  		y: this.canvasSize.h / 2,
  	};

  	this.context.save(); // 保存canvas的原始状态

  	this._render(); // 根据初始参数绘制水印和图片

    /* 绑定手势事件 */
    var that = this;
    new window.AlloyFinger(this.canvas, {
      multipointStart: function () {
        that.photo.initScale = that.photo.scale; // 记录图片缩放动作开始时的原始scale
      },
      rotate: function (evt) {
        that._rotate(evt.angle * Math.PI / 180); // 这里的evt.angle是度数，而canvas使用的是弧度，需要先进行单位转换
      },
      pinch: function (evt) {
        that._scale(evt.scale);
      },
      pressMove: function (evt) {
        that._translate(evt.deltaX, evt.deltaY);
        evt.preventDefault();
      },
    })

  	return this;
  },

  changeWatermarkCoor: function(coor) { // 切换水印位置
  	this.watermark.coor = coor;
  	this._render();
  },

  _translate: function(deltaX, deltaY) { // 通过调整canvas的坐标原点来调整图片的位置
    this.photo.translate.x += deltaX;
    this.photo.translate.y += deltaY;
    this._render();
  },

  _rotate: function(angle) { // 通过调整canvas坐标轴的旋转弧度来调整图片的旋转弧度
    this.photo.rotate += angle;
    this._render();
  },

  _scale: function(scale) { // 通过调整canvas坐标轴的scale来调整图片的scale
    this.photo.scale = this.photo.initScale * scale; // 根据缩放动作前的scale乘以这次缩放的scale来确定最终的scale（即相对于原始scale）
    this._render();
  },

  reset: function() { // 重置图片的所有参数
    /* 恢复移动距离 */
    this.photo.translate = {
      x: this.canvasSize.w / 2,
      y: this.canvasSize.h / 2,
    };
    /* 恢复旋转角度 */
    this.photo.rotate = 0;
    /* 恢复缩放 */
    this.photo.scale = 1;

    this._render();

    return this;
  },

  output: function() { // 将canvas输出为DataUrl
    return this.canvas.toDataURL('image/jpeg', 0.8);
  },

  _resetCanvas: function() { // 恢复到canvas的原始状态
  	this.context.restore();
  	this.context.save(); // 记得restore后要save一次，否则下次就无法恢复到原始状态了
  	return this;
  },

  _clean: function() { // 清空canvas
  	this.context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
  	return this;
  },

  _render: function() {
  	this._clean(); // 绘制前先清空

  	(function _renderPhoto(that) { // 根据图片参数来绘制图片
  		that._resetCanvas();
  		that.context.translate(that.photo.translate.x, that.photo.translate.y);
  		that.context.rotate(that.photo.rotate);
  		that.context.scale(that.photo.scale, that.photo.scale);
  		that.context.drawImage(that.photo.img, -that.canvasSize.w / 2, -that.canvasSize.h / 2, that.canvasSize.w, that.canvasSize.h);
  	})(this);

  	(function _renderWatermark(that) { // 根据水印参数来绘制水印
  		that._resetCanvas();
  		that.context.drawImage(that.watermark.img, that.watermark.coor.x, that.watermark.coor.y, that.watermark.size.width, that.watermark.size.height);
  	})(this);

  },
};