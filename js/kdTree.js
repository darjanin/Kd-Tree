
function KDTreeNode() {
    this.point = null; // Stores instant of the Point class with position

    this.split = null; // Split value
    this.dim = 0; // Dimension for node, if even than use x else y axis

    this.left = null; // Stores left subtree
    this.right = null; // Stores right subtree
    this.parent = null; // Store parent node

    this.distance = 0;
}

KDTreeNode.prototype.isAxisX = function() {
    return this.dim % 2 === 0;
}

function KDTree(splitValueType) {
    this.root = null;
    this.splitValueType = splitValueType;
}

KDTree.prototype.init = function(points){
    this.root = this.constructTree(points, 0, 2);
};

KDTree.prototype.constructTree = function(points, dim, k) {
    if (points.length === 0) return null;

    var node = new KDTreeNode();
    node.dim = dim;

    if (points.length === 1) {
        node.point = points[0];
        return node;
    }
    if (this.splitValueType === 'median') {
        node.split = this.computeSplitValueMedian(points, dim);
    } else if (this.splitValueType === 'average') {
        node.split = this.computeSplitValueAverage(points, dim);
    }


    var pointsLeft = this.splitPoints(points, node.split, dim, 'left');
    var pointsRight = this.splitPoints(points, node.split, dim, 'right');

    var newDim = ++dim % k;

    node.left = this.constructTree(pointsLeft, newDim, k);
    if (node.left !== null) node.left.parent = node;

    node.right = this.constructTree(pointsRight, newDim, k);
    if (node.right !== null) node.right.parent = node;

    return node;
}

KDTree.prototype.computeSplitValueAverage = function(points, dim) {
    var sum = 0;
    for (var i = 0; i < points.length; i++) {
        if (dim % 2 === 0) {
            sum += points[i].x;
        } else {
            sum += points[i].y;
        }
    }
    return Math.round(sum/points.length);
}

KDTree.prototype.computeSplitValueMedian = function(points, dim) {
    if (dim % 2 === 0) {
        points.sort(function(a,b) {
            if (a.x > b.x) return 1;
            else if (a.x < b.x) return -1;
            return 0;
        });
        return points[Math.floor(points.length/2)].x;
    } else {
        points.sort(function(a,b) {
            if (a.y > b.y) return 1;
            else if (a.y < b.y) return -1;
            return 0;
        });
        return points[Math.floor(points.length/2)].y;
    }
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

KDTree.prototype.nearestNeighbours = function(point, k) {
    var inLeftPart = function(point, dim, split) {
        if (dim % 2 == 0) {
            return point.x < split ? true : false;
        } else {
            return point.y < split ? true : false;
        }
    };

    var distanceFromPlane = function(point, dim, split) {
        var planePoint = dim % 2 === 0 ? new Point(split, point.y) : new Point(point.x, split);
        return point.distance(planePoint)
    };

    var updateRadius = function(nodes) {
        var maxRadius = 0;
        nodes.forEach(function(node) {
            if (node.distance > maxRadius) maxRadius = node.distance;
        });
        return maxRadius;
    };

    var addNewAndRemove = function(nodes, currentNode, point, k) {
        var contains = false;

        nodes.forEach(function(node) {
            if (node.distance === currentNode.distance) contains = true;
        });

        if (!contains) {
            nodes.push(currentNode);
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

    var findNearPoints = function(node, point, k, result) {
        if (node.point !== null) {
            node.distance = Math.round(point.distance(node.point));
            result.nodes.push(node);
            result.radius = node.distance;
            return result;
        }

        if (inLeftPart(point, node.dim, node.split)) {
            result = findNearPoints(node.left, point, k, result);
            if (result.nodes.length < k) {
                result = findNearPoints(node.right, point, k, result);
            }
        } else {
            result = findNearPoints(node.right, point, k, result);
            if (result.nodes.length < k) {
                result = findNearPoints(node.left, point, k, result);
            }
        }

        return result;
    };

    var searchSubtree = function(node, point, k, result) {
        var nodes = [];
        var currentNode, hyperplaneDistance;
        if (node !== null) nodes.push(node);

        while(nodes.length > 0) {
            currentNode = nodes.pop();

            if (currentNode.point !== null) {
                currentNode.distance = point.distance(currentNode.point);
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
    };

    var findNearestPoints = function(root, point, k, result) {
        var kd, hyperplaneDistance;
        var currentNode = result.nodes[0];
        while (currentNode !== root) {
            hyperplaneDistance = distanceFromPlane(point, currentNode.parent.dim, currentNode.parent.split);

            if (hyperplaneDistance < result.radius) {
                if (currentNode === currentNode.parent.left) {
                    result = searchSubtree(currentNode.parent.right, point, k, result);
                } else {
                    result = searchSubtree(currentNode.parent.left, point, k, result);
                }
            }

            currentNode = currentNode.parent;
        }

        return result;
    };


    var result = { nodes: [], radius: 0 };

    result = findNearPoints(this.root, point, k, result);
    result.nodes.forEach(function(node) {
        if (node.distance > result.radius) result.radius = node.distance;
    });

    result = findNearestPoints(this.root, point, k, result);
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

KDTree.prototype.insideRect = function(rectangle) {
    var inside = function(node, rectangle) {
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
                if (rectangle.xMin < node.split) inside(node.left, rectangle);
                if (rectangle.xMax > node.split) inside(node.right, rectangle);
            } else {
                if (rectangle.yMin < node.split) inside(node.left, rectangle);
                if (rectangle.yMax > node.split) inside(node.right, rectangle);
            }
        }
    };

    inside(this.root, rectangle);
}