
function KDTreeNode() {
    this.point = null; // Stores instant of the Point class with position

    this.split = null; // Split value
    this.dim = 0; // Dimension for node, if even than use x else y axis

    this.left = null; // Stores left subtree
    this.right = null; // Stores right subtree
    this.parent = null; // Store parent node

    this.distance = 0;
}

function KDTree() {
    this.root = null;
}

KDTree.prototype.init = function(points){
    // try {
    var self = this;
    // setInterval(function(points) {
        self.root = self.constructTree(points, 0, 2);

    // } catch (exception) {
        // alert('Please click slower! Your JS engine is slow.');
    // }
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

KDTree.prototype.nearestNeighbours = function(point, k) {
    var result = { nodes: [], radius: 0 };
    result = this.findNearPoints(this.root, point, k, result);
    // console.log('FindNearPoint');
    // console.log(result);
    result.nodes.forEach(function(node) {
        if (node.distance > result.radius) result.radius = node.distance;
    });
    result = this.findNearestPoints(this.root, point, k, result);
    result.nodes = result.nodes.sort(function(a, b) {
        if (a.distance > b.distance) {
            return 1;
        } else if (a.distance < b.distance) {
            return -1;
        }
        return 0;
    });
    return result;
}

KDTree.prototype.findNearPoints = function(node, point, k, result) {

    if (node.point !== null) {
        node.distance = distance(point, node.point);
        result.nodes.push(node);
        result.radius = node.distance;
        return result;
    }

    if (inLeftPart(point, node.dim, node.split)) {
        result = this.findNearPoints(node.left, point, k, result);
        if (result.nodes.length < k) {
            result = this.findNearPoints(node.right, point, k, result);
        }
    } else {
        result = this.findNearPoints(node.right, point, k, result);
        if (result.nodes.length < k) {
            result = this.findNearPoints(node.left, point, k, result);
        }
    }

    return result;
}

function distance(point0, point1) {
    var x = Math.pow(point0.x - point1.x, 2);
    var y = Math.pow(point0.y - point1.y, 2);
    return Math.round(Math.sqrt(x + y));
}

function inLeftPart(point, dim, split) {
    if (dim % 2 == 0) {
        return point.x < split ? true : false;
    } else {
        return point.y < split ? true : false;
    }
}

KDTree.prototype.findNearestPoints = function(root, point, k, result) {
    // console.log(root);
    var kd, hyperplaneDistance;
    // var result = result;
    var currentNode = result.nodes[0];
    // console.log(result.nodes[0]);
    while (currentNode !== root) {
        hyperplaneDistance = distanceFromPlane(point, currentNode.parent.dim, currentNode.parent.split);
        console.log('Hyperplane distance: ' + hyperplaneDistance);
        console.log('Current nearest radius' + result.radius);
        if (hyperplaneDistance < result.radius) {
            if (currentNode === currentNode.parent.left) {
                result = this.searchSubtree(currentNode.parent.right, point, k, result);
                // result = result;
            } else {
                result = this.searchSubtree(currentNode.parent.left, point, k, result);
                // result = result;
            }
        }

        currentNode = currentNode.parent;
    }

    return result;
}

function distanceFromPlane(point, dim, split) {
    var planePoint = dim % 2 === 0 ? new Point(split, point.y) : new Point(point.x, split);
    return distance(point, planePoint)
}

KDTree.prototype.searchSubtree = function(node, point, k, result) {
    var nodes = [];
    var currentNode, hyperplaneDistance;
    if (node !== null) nodes.push(node);

    while(nodes.length > 0) {
        currentNode = nodes.pop();

        if (currentNode.point !== null) {
            // result.radius = distance(currentNode.point, point);
            currentNode.distance = distance(currentNode.point, point);
            if (currentNode.distance < result.radius) {
                result.nodes = addNewAndRemove(result.nodes, currentNode, point, k);
                result.radius = updateRadius(result.nodes);
            }
            continue;
        }

        hyperplaneDistance = distanceFromPlane(point, currentNode.dim, currentNode.split);
        if (hyperplaneDistance > result.radius) {
            if (inLeftPart(point, currentNode.dim, currentNode.split)) {
                nodes.push(currentNode.left);
            } else {
                nodes.push(currentNode.right);
            }
        } else {
            nodes.push(currentNode.left);
            nodes.push(currentNode.right);
        }
    }

    return result;
}

function updateRadius(nodes) {
    var maxRadius = 0;
    nodes.forEach(function(node) {
        if (node.distance > maxRadius) maxRadius = node.distance;
    });
    return maxRadius;
}

function addNewAndRemove(nodes, currentNode, point, k) {
    // var result = [];
    var contains = false;
    nodes.forEach(function(node) {
        if (node.distance === currentNode.distance) contains = true;
    });
    if (!contains) {
        nodes.push(currentNode);
        // nodes.forEach(function(node) {
            // if (node.distance < currentNode.distance) result.push(node);
        // });
        nodes.sort(function(a, b) {
            if (a.distance > b.distance) {
                return 1;
            } else if (a.distance < b.distance) {
                return -1;
            }
            return 0;
        });

        if (nodes.length > k) nodes.splice(-1,1)
    }

    return nodes;
}


KDTree.prototype.insideRect = function(rectangle) {
    this.inside(this.root, rectangle);
}

KDTree.prototype.inside = function(node, rectangle) {
    if (node === null) return;
    if (node.point !== null) {
        if ((rectangle.xMin < node.point.x) &&
            (rectangle.xMax > node.point.x) &&
            (rectangle.yMin < node.point.y) &&
            (rectangle.yMax > node.point.y)
        ) {
            node.point.selected = true;
        }
    } else {
        if (node.dim % 2 == 0) {
            if (rectangle.xMin < node.split) this.inside(node.left, rectangle);
            if (rectangle.xMax > node.split) this.inside(node.right, rectangle);
        } else {
            if (rectangle.yMin < node.split) this.inside(node.left, rectangle);
            if (rectangle.yMax > node.split) this.inside(node.right, rectangle);
        }
    }
}