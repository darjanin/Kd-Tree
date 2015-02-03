var canvas;
var vincent;
var points;
// on document ready load
$(function() {
    canvas = document.getElementById('canvas');

    canvas.addEventListener('mousedown', mouseControl, false);
    canvas.addEventListener('mousemove', mouseControl, false);
    canvas.addEventListener('mouseup', mouseControl, false);
    
    vincent = new Vincent(canvas);
    vincent.init();

    points = [];
});

var actions = function() {

    this.mouseup = function() {

    };
}

function mouseControl(event) {

    if (event.type == 'mouseup' && !event.shiftKey && event.button === 0) {
        addPoint(new Point(event.layerX, event.layerY));
    }

    if (event.type = 'mouseup' && event.button == 2) {
        selectPoint(new Point(event.layerX, event.layerY));
    }
}

function showPoints() {
    var result = [];
    points.forEach(function(point, index) {
        result.push(point.x + "x" + point.y);
    });
    console.log(result.join(','));
}

function addPoint(point) {
    points.push(point);
    showPoints();
    redraw();
}

function selectPoint(point) {
    points.forEach(function(centerPoint, index){
        centerPoint.select(point, 5);
    });

    redraw();
}

function redraw() {
    points.forEach(function(point, index){
        var color = point.selected ? '#ce0000' : '#333333';
        vincent.point(point, color);
    });
}