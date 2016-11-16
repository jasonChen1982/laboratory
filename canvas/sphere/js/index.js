'use strict';
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
    window.RAF = window.requestAnimFrame = window.requestAnimationFrame;
})();


var sin = Math.sin;
var cos = Math.cos;
var DTR = Math.PI / 180;
var COLORS = ['#c07d1a', '#fedf73', '#c5933a', '#edac30', '#fdd951', '#f1b833', '#aa741e', '#fcfad1', '#fcf590', '#d28231'];
var speed = window.devicePixelRatio < 1.8 ? 3 : 1;


function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}

function isNumber(object) {
    return typeof object === 'number';
}

function random(min, max) {
    if (isArray(min))
        return min[~~(Math.random() * min.length)];
    if (!isNumber(max))
        max = min || 1, min = 0;
    return min + Math.random() * (max - min);
}

function Vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Vector3.prototype.distance = function(vec) {
    var xx = Math.pow(this.x - vec.x, 2),
        yy = Math.pow(this.x - vec.x, 2),
        zz = Math.pow(this.x - vec.x, 2);
    return Math.sqrt(xx + yy + zz);
};

function Euler(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Euler.prototype.rotate = function(vec) {
    var vector = new Vector3();

    var x = DTR * this.x,
        y = DTR * this.y,
        z = DTR * this.z;
    var xc = cos(x),
        xs = sin(x);
    var yc = cos(y),
        ys = sin(y);
    var zc = cos(z),
        zs = sin(z);
    var m = [];


    m[0] = zc*yc-zs*xs*ys;
    m[4] = zs*yc+zc*xs*ys;
    m[8] = -xc*ys;

    m[1] = -zs*xc;
    m[5] = zc*xc;
    m[9] = xs;

    m[2] = zc*ys+zs*xs*yc;
    m[6] = zs*ys-zc*xs*yc;
    m[10] = xc*yc;


    m[3] = 0;
    m[7] = 0;
    m[11] = 0;

    // bottom row
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;

    vector.x = m[0] * vec.x + m[1] * vec.y + m[2] * vec.z;
    vector.y = m[4] * vec.x + m[5] * vec.y + m[6] * vec.z;
    vector.z = m[8] * vec.x + m[9] * vec.y + m[10] * vec.z;

    return vector;
};

function Sphere(opts) {
    opts = opts || {};
    this._vertexs = [];
    this.vertexs = [];
    this.index = [];
    this.colors = [];
    this.euler = new Euler();
    this.row = opts.row || 16;
    this.column = opts.column || 24;
    this.radius = opts.radius || 60;
    this.lines = [];
    this.froces = [];
    this.buildMesh();
}
Sphere.prototype.buildMesh = function() {
    var degX = 0,
        degY = 0,
        spaceX = DTR * 180 / this.row,
        spaceY = DTR * 360 / this.column,
        rad = this.radius;

    for (var i = 0; i <= this.row; i++) {
        degX = spaceX * i;
        for (var j = 0; j <= this.column; j++) {
            degY = spaceY * j;
            var x = sin(degX) * sin(degY) * rad,
                y = cos(degX) * rad,
                z = sin(degX) * cos(degY) * rad;
            this._vertexs.push(new Vector3(x, y, z));
        }
    }
    for (var k = 0; k < this.row; k++) {
        for (var h = 0; h < this.column; h++) {
            var r = (this.column + 1) * k + h;
            this.index.push([r, r + this.column + 1, r + this.column + 2, r + 1]);
            this.colors.push(random(COLORS));
            this.lines.push(random(1,1.2));
            this.froces.push([random(0.04,0.06),random(-0.004,-0.0008)]);
        }
    }
};
Sphere.prototype.boom = function() {
    if(!this.isSleep)return;
    for (var j = 0; j < this.lines.length; j++) {
        this.lines[j] = random(1,1.2);
        this.froces[j] = [random(0.04,0.06),random(-0.004,-0.0008)];
    }
    this.isSleep = false;
};
Sphere.prototype.upTransform = function() {
    this.euler.x = 10;
    this.euler.y += 1;
    this.euler.z = 15;
    var lines = 0;

    for (var i = 0; i < this._vertexs.length; i++) {
        this.vertexs[i] = this.euler.rotate(this._vertexs[i]);
    }
    for (var j = 0; j < this.lines.length; j++) {
        this.froces[j][0] += this.froces[j][1];
        this.lines[j] = Math.max(1,this.lines[j]+this.froces[j][0]);
        if(this.lines[j]+this.froces[j][0]<=1)lines++;
    }
    this.isSleep = lines>=this.lines.length?true:false;
};
Sphere.prototype.backface = function(idxs) {
    var points = [this.vertexs[idxs[0]], this.vertexs[idxs[1]], this.vertexs[idxs[2]], this.vertexs[idxs[3]]];
    for (var i = 0; i < points.length - 1; i++) {
        if (points[i].distance(points[i + 1]) < 0.0005) {
            points.splice(i, 1);
            break;
        }
    }
    var v1 = {
            x: points[1].x - points[0].x,
            y: points[1].y - points[0].y,
            z: points[1].z - points[0].z
        },
        v2 = {
            x: points[2].x - points[1].x,
            y: points[2].y - points[1].y,
            z: points[2].z - points[1].z
        },
        nor = v1.x * v2.y - v2.x * v1.y;
    return nor > 0;
};
Sphere.prototype.render = function(ctx) {
    for (var i = 0; i < this.index.length; i++) {
        var face4 = this.index[i];
        if (!this.backface(face4)) continue;
        ctx.beginPath();
        var l = Math.max(1,this.lines[i]);
        for (var j = 0; j < face4.length; j++) {
            var vec = this.vertexs[face4[j]];
            if (j === 0) {
                ctx.moveTo(vec.x*l, vec.y*l);
            } else {
                ctx.lineTo(vec.x*l, vec.y*l);
            }
        }
        ctx.fillStyle = this.colors[i];
        // ctx.strokeStyle = 'transparent';//'#e8ad4c';//this.colors[i];
        ctx.fill();
        // ctx.stroke();
    }

};

function Stage(opts) {
    opts = opts || {};
    this.canvas = typeof opts.canvas !== 'string' ? opts.canvas : document.getElementById(opts.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.children = [];
    this.init();
}
Stage.prototype.init = function() {
    var This = this;
    this.sphere = new Sphere();
    this.children.push(
        this.sphere
    );
    this.canvas.addEventListener('touchstart',function(){
        This.sphere.boom();
    });
    this.canvas.addEventListener('click',function(){
        This.sphere.boom();
    });
};
Stage.prototype.resize = function (w,h,sw,sh){
    this.width = this.canvas.width = w||document.documentElement.offsetWidth;
    this.height = this.canvas.height = h||document.documentElement.offsetHeight;
    if(this.setStyle&&sw&&sh){
        this.canvas.style.width = sw+'px';
        this.canvas.style.height = sh+'px';
    }
};
Stage.prototype.stop = function() {
    this.isAnimating = false;
};
Stage.prototype.start = function() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animate();
};
Stage.prototype.animate = function() {
    var This = this;

    function render() {
        This.render();
        This.isAnimating && window.RAF(render);
    }
    render();
};
Stage.prototype.render = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.transform(1, 0, 0, 1, this.width >> 1, this.height >> 1);
    this.ctx.globalAlpha = 1;
    for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].upTransform();
        this.children[i].render(this.ctx);
    }
    this.ctx.restore();
};

var stage = new Stage({
    canvas: 'loading'
});
stage.resize();
stage.start();





