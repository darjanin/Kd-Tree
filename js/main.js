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

    drawDividingLines(this.tree.root, '');
}

function drawDividingLines(t, direction) {
    // console.log('drawDividingLines');
    console.log(t.parent);
    var yMin, yMax, xMin, xMax;
    if (t.parent === null) {
            xMin = 0;
            xMax = canvas.width;
            yMin = t.split;
            yMax = t.split;
            // console.log(xMin + 'x' + yMin);
            // console.log(xMax + 'x' + yMax);
            // vincent.line(new Point(xMin, yMin), new Point(xMax, yMax));
    } else {
        console.log('Parent is diff from null');
        if (t.dim % 2 == 0) { // yMin is split
            if (direction === 'right') {
                xMin = t.parent.split;
                xMax = canvas.width;
            } else if (direction === 'left') {
                yMin = canvas.width;
                yMax = t.parent.split;
            }
            yMin = t.split;
            yMax = t.split;
            // vincent.line(new Point(xMin, yMin), new Point(xMax, yMax));
        } else { // xMax is split
            xMin = t.split;
            xMax = t.split;
            if (direction === 'right') {
                yMin = t.parent.split;
                yMax = canvas.height;
            } else if (direction === 'left') {
                yMin = 0;
                yMax = t.parent.split;
            }

        }
    }
    var color = t.dim % 2 == 0 ? '#de5555' : '#55de55';
    vincent.line(new Point(xMin, yMin), new Point(xMax, yMax), color);

    if (t.left !== null) drawDividingLines(t.left, 'left');
    if (t.right !== null) drawDividingLines(t.right, 'right');
}