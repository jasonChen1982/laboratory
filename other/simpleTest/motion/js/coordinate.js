function Coordinate(options) {
    options = options || {};
    this.segment = options.segment || {
        x: 10,
        y: 10
    };
    this.size = options.size || {
        x: 400,
        y: 400
    };
    this.jutting = options.jutting || 50;
    this.grideOffset = options.grideOffset || {
        x: 0,
        y: 0
    };
    this.gridColor = options.gridColor || '#444a61';
    this.axisColor = options.axisColor || '#646794';
}

Coordinate.prototype.render = function (ctx) {
    this._renderGrid(ctx);
    this._renderAxis(ctx);
};

Coordinate.prototype._renderAxis = function (ctx) {
    var lx = this.size.x + this.jutting * 2;
    var ly = this.size.y + this.jutting * 2;
    var sy = this.jutting + this.grideOffset.y;
    var ey = ly - sy;
    var sx = this.jutting + this.grideOffset.x;
    var ex = lx - sx;

    var ax = 6;
    var ay = 12;

    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(0, -ey);
    ctx.moveTo(-ax, -ey + ay);
    ctx.lineTo(0, -ey);
    ctx.lineTo(ax, -ey + ay);

    ctx.moveTo(-sx, 0);
    ctx.lineTo(ex, 0);
    ctx.moveTo(ex - ay, ax);
    ctx.lineTo(ex, 0);
    ctx.lineTo(ex - ay, -ax);

    ctx.strokeStyle = this.axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();
};

Coordinate.prototype._renderGrid = function (ctx) {
    var sx = this.size.x;
    var sy = this.size.y;
    var segx = this.segment.x;
    var segy = this.segment.y;
    var ox = this.grideOffset.x;
    var oy = this.grideOffset.y;

    ctx.beginPath();
    ctx.lineWidth = 1;
    for (var i = 0; i <= segx; i++) {
        var step = i * sx / segx;
        ctx.moveTo(step - ox, oy);
        ctx.lineTo(step - ox, -sy + oy);
    }
    for (var j = 0; j <= segy; j++) {
        var step = j * sy / segy;
        ctx.moveTo(-ox, -step + oy);
        ctx.lineTo(sx - ox, -step + oy);
    }
    ctx.strokeStyle = this.gridColor;
    ctx.stroke();
};