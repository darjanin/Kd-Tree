function Point(x, y) {
    this.x = x;
    this.y = y;
    this.selected = false;
    this.neighbour = false;
}

Point.prototype.distance = function(point) {
    return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
}

Point.prototype.select = function(point, radius) {
    var selected = false;
    if (this.x === point.x && this.y === point.y) {
        selected = true;
    }

    if (this.distance(point) <= radius) {
        selected = true;
    }

    this.selected = selected;
    return this.selected;
}

function Vincent(canvasElement) {
    this.canvas = canvasElement;

    this.pointColor = '#111111';
    this.pointRadius = 3;

    this.lineColor = '#aaa';

    return this.canvas === undefined ? false : true;
}

Vincent.prototype.init = function() {
    this.context = this.canvas.getContext('2d');
};

Vincent.prototype.clear = function() {
    this.context.clearRect (0, 0, canvas.width, canvas.height);
}

Vincent.prototype.line = function(from, to, color) {
    color = typeof color !== 'undefined' ? color : this.lineColor;

    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.strokeStyle = color;
    this.context.stroke();
};

Vincent.prototype.rect = function(from, to, color) {
    color = typeof color !== 'undefined' ? color : this.lineColor;

    this.context.strokeStyle = color;
    this.context.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
}

Vincent.prototype.point = function(point, color) {
    color = typeof color !== 'undefined' ? color : this.pointColor;

    this.context.beginPath();
    this.context.arc(point.x, point.y, this.pointRadius, 0, 2 * Math.PI, false);
    this.context.fillStyle = color;
    this.context.fill();
}

Vincent.prototype.circle = function(point, radius, color) {
    color = typeof color !== 'undefined' ? color : this.lineColor;

    this.context.beginPath();
    this.context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    this.context.strokeStyle() = color;
    this.context.stroke();
}