var canvas;
var vincent;
var points;
var tree;
var kValueElement, clearElement;
var kValue;
var rectangle = {xMin: 0, yMin: 0, xMax: 0, yMax: 0};
var splitValueType = 'median';
// on document ready load
$(function() {
    canvas = document.getElementById('canvas');
    kValueElement = document.getElementById('kValue');
    clearCanvasElement = document.getElementById('clear');

    canvas.addEventListener('mousedown', mouseControl, false);
    canvas.addEventListener('mousemove', mouseControl, false);
    canvas.addEventListener('mouseup', mouseControl, false);

    kValueElement.addEventListener('change', getKValue, false);

    clearCanvasElement.addEventListener('click', clear, false);

    document.getElementById('median').addEventListener('click', function() {
        splitValueType = 'median';
        recalculateTree();
    }, false);

    document.getElementById('average').addEventListener('click', function() {
        splitValueType = 'average';
        recalculateTree();
    }, false);

    document.getElementById('pointRadius').addEventListener('change', function() {
         pointRadius = parseInt(this.value);
         pointRadius = pointRadius < 0 ? 0 : pointRadius;
         vincent.pointRadius = pointRadius;
         redraw();
    });

    vincent = new Vincent(canvas);
    vincent.init();

    points = [];

    getKValue();

    tree = new KDTree(splitValueType);
});

function getKValue() {
    kValue = parseInt(kValueElement.value);
    kValue = kValue < 0 ? 0 : kValue;

}

function clear() {
    points = [];
    tree = new KDTree();
    redraw();
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

function recalculateTree() {
    tree.splitValueType = splitValueType;
    tree.init(points);
    redraw();
}

function addPoint(point) {
    if (points.length === 0 || point.x !== points[points.length-1].x || point.y !== points[points.length-1].y) {

        points.push(point);
        // tree.init(points);
        // redraw();
        recalculateTree();
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
        if (centerPoint.select(point, vincent.pointRadius)) selectedPoint = centerPoint;
    });

    if (selectedPoint !== null) {
        // find k+1 nearest neighbours; it counts itself to neighbours. for that
        // is there +1 to k
        var result = tree.nearestNeighbours(selectedPoint, kValue + 1);

        result.nodes.forEach(function(node, index) {
            if (node.point.selected) node.point.neighbourRadius = result.radius;
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

function drawDividingLines(node, viewport) {
    var XMIN = 0, YMIN = 1, XMAX = 2, YMAX = 3;

    if (node === null || node.point !== null) return;

    var viewportLocal = viewport.slice();

    if (node.isAxisX()) {
        viewportLocal[XMIN] = node.split;
        viewportLocal[XMAX] = node.split;
    } else {
        viewportLocal[YMIN] = node.split;
        viewportLocal[YMAX] = node.split;
    }

    var color = node.isAxisX() ? '#de5555' : '#55de55';
    vincent.line(
        new Point(viewportLocal[XMIN], viewportLocal[YMIN]),
        new Point(viewportLocal[XMAX], viewportLocal[YMAX]),
        color
    );

    var viewportLeft = viewport.slice();
    var viewportRight = viewport.slice();

    if (node.isAxisX()) {
        viewportLeft[XMAX] = node.split;
        viewportRight[XMIN] = node.split;
    } else {
        viewportLeft[YMAX] = node.split;
        viewportRight[YMIN] = node.split;
    }

    drawDividingLines(node.left, viewportLeft);
    drawDividingLines(node.right, viewportRight);
}