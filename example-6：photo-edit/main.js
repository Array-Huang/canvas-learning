var WATERMARK_LOCATION = [ // 水印的几个可选位置
  { x: 5, y: 0}, { x: 5, y: 223}, { x: 50, y: 100}, { x: 100, y: 0}, { x: 100, y: 223}, 
];
var watermarkSamples = getSamplesElement(WATERMARK_LOCATION);
var WATERMARK_SIZE = {
  width: 100,
  height: 77,
};

/* 用于在水印可选位置示例中绘制水印 */
function drawWatermark(canvas, img, coor) {
  var context = canvas.getContext('2d');
  context.drawImage(img, coor.x, coor.y, WATERMARK_SIZE.width, WATERMARK_SIZE.height);
}
/* 整理一下水印可选位置示例的数据 */
function getSamplesElement(WATERMARK_LOCATION) {
  var samples = [];
  var elements = document.querySelectorAll('.js-sample');
  for (var i = 0; i < 5; i ++) {
    samples.push({
      element: elements[i],
      coor: WATERMARK_LOCATION[i],
    });
  }
  return samples;
}

(function() {
  /* 获取图片的promise */
  var photoPromise = new Promise(function(resolve) {
    var img = new Image();
    img.src = './photo.jpg';
    img.onload = function() {
      resolve(img);
    };
  });
  /* 获取水印的promise */
  var watermarkPromise = new Promise(function(resolve) {
    var img = new Image();
    img.src = './watermark.png';
    img.onload = function() {
      resolve(img);
    };
  });
  /* 成功获取图片和水印后再开始执行 */
  Promise.all([photoPromise, watermarkPromise]).then(function(imgs) {
    var editor = window.editorObject.init({ // 传入参数初始化图片编辑器
      canvas: document.getElementById('editor'),
      watermark: {
        img: imgs[1],
        coor: watermarkSamples[0].coor,
        size: WATERMARK_SIZE,
      },
      photo: {
        img: imgs[0],
      },
    });

    /* 重置按钮 */
    document.getElementById('reset-btn').addEventListener('click', function() {
      editor.reset();
    });

    /* 生成图片的按钮 */
    document.getElementById('submit-btn').addEventListener('click', function() {
      document.getElementById('final-product').src = editor.output();
      document.getElementById('editor-container').style.display = 'none';
      document.getElementById('display-container').style.display = 'block';
    });

    /* 再玩一遍的按钮 */
    document.getElementById('again-btn').addEventListener('click', function() {
      document.getElementById('display-container').style.display = 'none';
      document.getElementById('editor-container').style.display = 'block';
    });

    for (var i = 0; i < 5; i ++) {
      watermarkSamples[i].element.addEventListener('click', function(evt) { // 点击水印可选位置示例后更新图片编辑器的水印位置
        editor.changeWatermarkCoor(watermarkSamples[evt.target.dataset.index].coor);
      });
      drawWatermark(watermarkSamples[i].element, imgs[1], watermarkSamples[i].coor); // 绘制水印可选位置示例
    }
  });
})();