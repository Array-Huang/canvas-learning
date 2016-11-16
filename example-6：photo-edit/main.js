var WATERMARK_LOCATION = [
  { x: 5, y: 0}, { x: 5, y: 223}, { x: 50, y: 100}, { x: 100, y: 0}, { x: 100, y: 223}, 
];
var watermarkSamples = getSamplesElement(WATERMARK_LOCATION);
var WATERMARK_SIZE = {
  width: 100,
  height: 77,
};
// var editor = document.getElementById('editor');

var EDITOR_SIZE = {
  width: editor.width,
  height: editor.height,
};

function cleanCanvas(canvas) {
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, 200, 300);
}

function drawWatermark(canvas, img, coor) {
  var context = canvas.getContext('2d');
  context.drawImage(img, coor.x, coor.y, WATERMARK_SIZE.width, WATERMARK_SIZE.height);
}

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
  var photoPromise = new Promise(function(resolve) {
    var img = new Image();
    img.src = './photo.jpg';
    img.onload = function() {
      resolve(img);
    };
  });

  var watermarkPromise = new Promise(function(resolve) {
    var img = new Image();
    img.src = './watermark.png';
    img.onload = function() {
      resolve(img);
    };
  });

  Promise.all([photoPromise, watermarkPromise]).then(function(imgs) {
    var editor = window.editorObject.init({
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
    for (var i = 0; i < 5; i ++) {
      watermarkSamples[i].element.addEventListener('click', function(evt) {
        // cleanCanvas(editor);
        // drawWatermark(editor, imgs[1], watermarkSamples[evt.target.dataset.index].coor);
        editor.changeWatermarkCoor(watermarkSamples[evt.target.dataset.index].coor);
      });
      drawWatermark(watermarkSamples[i].element, imgs[1], watermarkSamples[i].coor);
    }

    // drawWatermark(editor, imgs[1], watermarkSamples[0].coor);
  });
})();