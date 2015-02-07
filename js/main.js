var canvas;
var vincent;
var points;
var tree;
// on document ready load
$(function() {
    canvas = document.getElementById('canvas');

    canvas.addEventListener('mousedown', mouseControl, false);
    canvas.addEventListener('mousemove', mouseControl, false);
    canvas.addEventListener('mouseup', mouseControl, false);

    vincent = new Vincent(canvas);
    vincent.init();

    points = [];

    tree = new KDTree();
});

var actions = function() {

    this.mouseup = function() {

    };
}

function mouseControl(event) {
    var x = event.x - canvas.offsetLeft;
    var y = event.y - canvas.offsetTop;

    if (event.type == 'mouseup' && !event.shiftKey && event.button === 0) {
        addPoint(new Point(x, y));
    }

    if (event.type = 'mouseup' && event.button == 2) {
        selectPoint(new Point(x, y));
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
    // showPoints();
    tree.init(points);
    redraw();
}

function selectPoint(point) {
    points.forEach(function(centerPoint, index){
        centerPoint.select(point, 5);
    });

    // tree.findNeighbours(point, k);

    redraw();
}

function redraw() {

    vincent.clear();

    points.forEach(function(point, index){
        var color = point.selected ? '#ce0000' : '#333333';
        vincent.point(point, color);
    });

    var viewport = [0, 0, canvas.width, canvas.height];
    drawDividingLines(this.tree.root, viewport);
}

function drawDividingLines(t, viewport) {

    if (t.point !== null) return;

    var viewportLocal = viewport.slice();

    if (t.dim % 2 == 0) {
        viewportLocal[0] = t.split;
        viewportLocal[2] = t.split;
    } else { // xMax is split
        viewportLocal[1] = t.split;
        viewportLocal[3] = t.split;
    }
    console.log(viewportLocal);
    var color = t.dim % 2 == 0 ? '#de5555' : '#55de55';
    vincent.line(
        new Point(viewportLocal[0], viewportLocal[1]),
        new Point(viewportLocal[2], viewportLocal[3]),
        color
    );

    var viewportLeft = viewport.slice();
    var viewportRight = viewport.slice();
    // console.log(t.dim);
    if (t.dim % 2 === 0) {
        viewportLeft[2] = t.split;
        viewportRight[0] = t.split;
    } else {
        viewportLeft[3] = t.split;
        viewportRight[1] = t.split;
    }

    if (t.left !== null) drawDividingLines(t.left, viewportLeft);
    if (t.right !== null) drawDividingLines(t.right, viewportRight);
}