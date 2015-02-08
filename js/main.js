var canvas;
var vincent;
var points;
var tree;
var kValueElement;
var kValue;
var rectangle = {xMin: 0, yMin: 0, xMax: 0, yMax: 0};
// on document ready load
$(function() {
    canvas = document.getElementById('canvas');
    kValueElement = document.getElementById('kValue');

    canvas.addEventListener('mousedown', mouseControl, false);
    canvas.addEventListener('mousemove', mouseControl, false);
    canvas.addEventListener('mouseup', mouseControl, false);

    kValueElement.addEventListener('change', getKValue, false);

    vincent = new Vincent(canvas);
    vincent.init();

    points = [];

    getKValue();

    tree = new KDTree();
});

function getKValue() {
    kValue = parseInt(kValueElement.value);
        kValue = kValue < 0 ? 0 : kValue;
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

    if (ev.type == 'mousedown' && ev.button == 1) {
        rectangle.xMin = x;
        rectangle.yMin = y;
    }

    if (ev.type == 'mousemove' && ev.button == 1) {
        rectangle.xMax = x;
        rectangle.yMax = y;

        redraw();
    }

    if (ev.type == 'mouseup' && ev.button == 1) {
        rectangle.xMax = x;
        rectangle.yMax = y;

        selectInRectangle();

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
    if (points.length === 0 || point.x !== points[points.length-1].x || point.y !== points[points.length-1].y) {

        points.push(point);
        tree.init(points);
        redraw();
    } else {
    }

    resetRectangle();
}

function swap(a, b) {
    return [b, a];
}

function selectInRectangle() {
    if (rectangle.xMin > rectangle.xMax) {
        var swapped = swap(rectangle.xMin, rectangle.xMax);
        rectangle.xMin = swapped[0];
        rectangle.xMax = swapped[1];
    }
    if (rectangle.yMin > rectangle.yMax) {
        var swapped = swap(rectangle.yMin, rectangle.yMax);
        rectangle.yMin = swapped[0];
        rectangle.yMax = swapped[1];
    }

    tree.insideRect(rectangle);

    redraw();

    resetRectangle();
}

function selectPoint(point) {
    var selectedPoint = null;
    points.forEach(function(centerPoint, index){
        if (centerPoint.select(point, 5)) selectedPoint = centerPoint;
    });

    // tree.findNeighbours(point, k);
    if (selectedPoint !== null) {
        console.log(selectedPoint.x + 'x' + selectedPoint.y);
        var result = tree.nearestNeighbours(selectedPoint, kValue + 1);

        result.nodes.forEach(function(node, index) {
            if (node.point.selected) node.point.neighbourRadius = distance(node.point, result.nodes[result.nodes.length-1].point);
            node.point.neighbour = true;
        });

        redraw();
    }

    resetRectangle();
}

function redraw() {

    vincent.clear();

    points.forEach(function(point, index){
        var color = point.neighbour ? '#0000ce' : '#333333';
        var color = point.selected ? '#ce0000' : color;


        if (point.selected && point.neighbour) vincent.circle(point, point.neighbourRadius, '#cece00');

        vincent.point(point, color);
    });

    if (rectangle.xMin !== 0 && rectangle.yMin !== 0 && rectangle.xMax !== 0 && rectangle.yMax !== 0) {
        vincent.rect(
            new Point(rectangle.xMin, rectangle.yMin),
            new Point(rectangle.xMax, rectangle.yMax),
            '#da7700'
        )
    }

    var viewport = [0, 0, canvas.width, canvas.height];
    drawDividingLines(this.tree.root, viewport);

    deselectAllPoints();

}

function resetRectangle() {
    rectangle = {xMin: 0, yMin: 0, xMax: 0, yMax: 0};
}

function deselectAllPoints() {
    points.forEach(function(point) {
        point.selected = false;
        point.neighbour = false;
    });
}

function drawDividingLines(t, viewport) {
    var XMIN = 0, YMIN = 1, XMAX = 2, YMAX = 3;

    if (t === null || t.point !== null) return;

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