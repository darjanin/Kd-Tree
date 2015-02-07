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

function mouseControl(ev) {
    var x, y;

    // Get the mouse position relative to the <canvas> element
    if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) {
        x = ev.offsetX;
        y = ev.offsetY;
    }

    if (ev.type == 'mouseup' && !ev.shiftKey && ev.button === 0) {
        addPoint(new Point(x, y));
    }

    if (ev.type = 'mouseup' && ev.button == 2) {
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
    var XMIN = 0, YMIN = 1, XMAX = 2, YMAX = 3;

    if (t.point !== null) return;

    var viewportLocal = viewport.slice();

    if (t.dim % 2 == 0) {
        viewportLocal[XMIN] = t.split;
        viewportLocal[XMAX] = t.split;
    } else {
        viewportLocal[YMIN] = t.split;
        viewportLocal[YMAX] = t.split;
    }

    var color = t.dim % 2 == 0 ? '#de5555' : '#55de55';
    vincent.line(
        new Point(viewportLocal[XMIN], viewportLocal[YMIN]),
        new Point(viewportLocal[XMAX], viewportLocal[YMAX]),
        color
    );

    var viewportLeft = viewport.slice();
    var viewportRight = viewport.slice();

    if (t.dim % 2 === 0) {
        viewportLeft[XMAX] = t.split;
        viewportRight[XMIN] = t.split;
    } else {
        viewportLeft[YMAX] = t.split;
        viewportRight[YMIN] = t.split;
    }

    drawDividingLines(t.left, viewportLeft);
    drawDividingLines(t.right, viewportRight);
}