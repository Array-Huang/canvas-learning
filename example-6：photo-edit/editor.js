window.editorObject = {
  canvas: null,
  context: null,
  canvasSize: {
  	w: 0,
  	h: 0,
  },

  watermark: {
    img: null,
    coor: {
    	x: 0,
    	y: 0,
    },
    size: {
    	width: 0,
    	height: 0,
    }
  },

  photo: {
  	img: null,
  	translate: {
  		x: 0,
  		y: 0,
  	},
  	rotate: 0,
  	scale: 1,
  },

  init: function(params) {
  	this.canvas = params.canvas;
  	this.context = this.canvas.getContext('2d');
  	this.canvasSize = {
  		w: this.canvas.width,
  		h: this.canvas.height,
  	};
  	this.watermark = params.watermark;
  	this.photo.img = params.photo.img;
  	this.photo.translate = {
  		x: this.canvasSize.w / 2,
  		y: this.canvasSize.h / 2,
  	}

  	this.context.save();

  	this._render();

  	return this;
  },

  changeWatermarkCoor: function(coor) {
  	this.watermark.coor = coor;
  	this._render();
  },

  translate: function() {

  },

  rotate: function() {

  },

  scale: function() {

  },

  reset: function() {

  },

  _resetCanvas: function() {
  	this.context.restore();
  	this.context.save();
  	return this;
  },

  _clean: function() {
  	this.context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
  	return this;
  },

  _render: function() {
  	this._clean();

  	(function _renderPhoto(that) {
  		that._resetCanvas();
  		that.context.translate(that.photo.translate.x, that.photo.translate.y);
  		that.context.rotate(that.photo.rotate);
  		that.context.scale(that.photo.scale, that.photo.scale);
  		that.context.drawImage(that.photo.img, -that.canvasSize.w / 2, -that.canvasSize.h / 2, that.canvasSize.w, that.canvasSize.h);
  	})(this);

  	(function _renderWatermark(that) {
  		that._resetCanvas();
  		that.context.drawImage(that.watermark.img, that.watermark.coor.x, that.watermark.coor.y, that.watermark.size.width, that.watermark.size.height);
  	})(this);

  },
};