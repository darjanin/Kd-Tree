
function KDTreeNode() {
    this.point = null; // Stores instant of the Point class with position

    this.split = null; // Split value
    this.dim = 0; // Dimension for node, if even than use x else y axis

    this.left = null; // Stores left subtree
    this.right = null; // Stores right subtree
    this.parent = null; // Store parent node
}

function KDTree() {
    this.root = null;
}

KDTree.prototype.init = function(points){
    this.root = this.constructTree(points, 0, 2);
};

KDTree.prototype.constructTree = function(points, dim, k) {
    if (points.length === 0) return null;

    var node = new KDTreeNode;
    node.dim = dim;

    if (points.length === 1) {
        node.point = points[0];
        return node;
    }

    node.split = this.computeSplitValue(points, dim);

    var pointsLeft = this.splitPoints(points, node.split, dim, 'left');
    var pointsRight = this.splitPoints(points, node.split, dim, 'right');

    var newDim = ++dim % k;
    node.left = this.constructTree(pointsLeft, newDim, k);
    if (node.left !== null) node.left.parent = node;
    node.right = this.constructTree(pointsRight, newDim, k);
    if (node.right !== null) node.right.parent = node;

    return node;
}

KDTree.prototype.computeSplitValue = function(points, dim) {
    var sum = 0;
    for (var i = 0; i < points.length; i++) {
        if (dim % 2 == 0) {
            sum += points[i].x;
        } else {
            sum += points[i].y;
        }
    }
    return Math.round(sum/points.length);
}

KDTree.prototype.splitPoints = function(points, split, dim, direction) {
    var resultPoints = [];
    if (direction === 'left') {
        for (var i = 0; i < points.length; i++) {
            if (dim % 2 == 0) {
                if (points[i].x < split) resultPoints.push(points[i]);
            } else {
                if (points[i].y < split) resultPoints.push(points[i]);
            }
        }
        return resultPoints;
    }

    if (direction === 'right') {
        for (var i = 0; i < points.length; i++) {
            if (dim % 2 == 0) {
                if (points[i].x >= split) resultPoints.push(points[i]);
            } else {
                if (points[i].y >= split) resultPoints.push(points[i]);
            }
        }
        return resultPoints;
    }
}

KDTree.prototype.findNeighbours = function (point, k) {
    if (k <= 0) return 0;

    // if the root is point & one point is selected, than it must be the root
    // so it doesn't have neighbours
    if (this.root.point !== null) return 0;

    var neigboursCount = 0;

    var node = this.root;

    if (node.dim % 2 == 0) { // comparing x axis

    } else { // comparing y axis

    }



    return neigboursCount;
}