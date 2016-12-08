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

var TWO_PI = Math.PI * 2;
var sin = Math.sin;
var cos = Math.cos;
var DTR = Math.PI / 180;

function euclideanModulo(n, m) {
    return ((n % m) + m) % m;
}

function ease(n, m) {
    return Math.pow(n, m);
}




function Vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Vector3.prototype.setCoords = function(vec) {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
};
Vector3.prototype.add = function(vec) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
};


function Euler(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Euler.prototype.rotate = function(vec) {
    var vector = new Vector3();

    var m = {};
    var ch = Math.cos(this.z * DTR);
    var sh = Math.sin(this.z * DTR);
    var ca = Math.cos(this.y * DTR);
    var sa = Math.sin(this.y * DTR);
    var cb = Math.cos(this.x * DTR);
    var sb = Math.sin(this.x * DTR);

    m.m00 = ch * ca;
    m.m01 = sh * sb - ch * sa * cb;
    m.m02 = ch * sa * sb + sh * cb;
    m.m10 = sa;
    m.m11 = ca * cb;
    m.m12 = -ca * sb;
    m.m20 = -sh * ca;
    m.m21 = sh * sa * cb + ch * sb;
    m.m22 = -sh * sa * sb + ch * cb;

    vector.x = m.m00 * vec.x + m.m01 * vec.y + m.m02 * vec.z;
    vector.y = m.m10 * vec.x + m.m11 * vec.y + m.m12 * vec.z;
    // vector.z = m.m20 * vec.x + m.m21 * vec.y +  m.m22 * vec.z;

    return vector;
};



function Pentagram(opts) {
    opts = opts || {};
    this.life = opts.life || 3000;
    this.space = opts.space || 1000;
    this.image = opts.image;
    this.width = this.image.width;
    this.height = this.image.height;
    this.scale = 1;
    this.alpha = 1;
    this.regX = opts.regX || this.width >> 1;
    this.regY = opts.regY || this.height >> 1;
}
Pentagram.prototype.update = function(idx, time) {
    var _s = euclideanModulo(idx * this.space + time, this.life),
        _a = euclideanModulo(idx * this.space + time, this.life);
    this.scale = 1 + 0.8 * ease(_s / this.life, 0.9);
    this.alpha = 0.9 * (1 - ease(_a / this.life, 0.9));
};
Pentagram.prototype.render = function(ctx) {
    ctx.save();
    ctx.transform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.image, 0, 0, this.width, this.height, -this.regX, -this.regY, this.width, this.height);
    ctx.restore();
};

function PentagramGloup(opts) {
    opts = opts || {};
    this.image = opts.image;
    this.position = opts.position;
    this.flow = opts.flow || 3;
    this.life = opts.life || 3000;
    this.space = this.life / this.flow;
    this.stars = [];
    this.spawn();
}
PentagramGloup.prototype.spawn = function() {
    for (var i = 0; i < this.flow; i++) {
        this.stars.push(new Pentagram({
            image: this.image,
            regX: 98,
            regY: 98
        }));
    }
};
PentagramGloup.prototype.render = function(ctx) {
    var time = Date.now();
    ctx.save();
    ctx.transform(1, 0, 0, 1, this.position.x, this.position.y);
    for (var i = 0; i < this.flow; i++) {
        this.stars[i].update(i, time);
        this.stars[i].render(ctx);
    }
    ctx.restore();
};

function Gift(opts) {
    opts = opts || {};
    this.image = opts.image;
    this.width = this.image.width;
    this.height = this.image.height;
    this.position = opts.position;
}
Gift.prototype.render = function(ctx) {
    ctx.save();
    ctx.transform(1, 0, 0, 1, this.position.x, this.position.y);
    // ctx.globalAlpha = 0.2;
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    ctx.restore();
};








function Triangle(opts) {
    opts = opts || {};
    this.bound = opts.bound;
    this.alpha = 1;　
    this.colors = ['#b5b774','#787650','#dfc667','#dfc667','#dfc667','#dfc667','#c78322'];
    this._coords = [];
    this.coords = [];
    for (var i = 0; i < 3; i++) {
        var t = random(0,TWO_PI),
            b = random(0,TWO_PI),
            tx = cos(t) * opts.rad,
            ty = cos(b) * opts.rad,
            tz = sin(b) * opts.rad,
            vec = new Vector3(tx, ty, tz);
        this._coords.push(vec);
        this.coords.push(new Vector3(tx, ty, tz));
    }
    this.euler = new Euler();
    this.init();
}
Triangle.prototype.init = function() {
    this.velocity = new Vector3(random(-2,2), random(1,2));
    this.acceleration = new Vector3(0, random(0,0.02));
    this.scale = random(0.4,0.6);
    this.translate = new Vector3(random(-120,120), random(-80,20));
    this.color = random(this.colors);
};
Triangle.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.translate.add(this.velocity);
    if (this.hitBound()) {
        this.init();
    }
    this.scale = Math.min(1, this.scale + 0.005);
    this.euler.x += 3;
    this.euler.y += 3;
    for (var i = 0; i < this._coords.length; i++) {
        this.coords[i].setCoords(this.euler.rotate(this._coords[i]));
    }
};
Triangle.prototype.hitBound = function() {
    if(this.translate.x<-this.bound.x||this.translate.x>this.bound.w-this.bound.x||this.translate.y>this.bound.h-this.bound.y)return true;
};
Triangle.prototype.render = function(ctx) {
    ctx.save();
    ctx.transform(this.scale, 0, 0, this.scale, this.translate.x, this.translate.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    for (var i = 0; i < this.coords.length; i++) {
        var point = this.coords[i];
        if (i === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};


function TriangleRain(opts) {
    opts = opts || {};
    this.num = opts.num || 16;
    this.position = opts.position || 20;
    this.triangles = [];
    this.bound = opts.bound||{
        x: 0,
        y: 0,
        h: 500,
        w: 640
    };
    this.swapn();
    this.flow = 1000/(opts.flow||6);
    this.time = Date.now();
}
TriangleRain.prototype.swapn = function() {
    this.triangles.push(new Triangle({
        rad: random(16,20),
        bound: this.bound
    }));
};
TriangleRain.prototype.update = function() {
    var t = Date.now();
    if (this.triangles.length < this.num && t - this.time > this.flow) {
        this.swapn();
        this.time = t;
    }
    for (var i = 0; i < this.triangles.length; i++) {
        this.triangles[i].update();
    }
};
TriangleRain.prototype.render = function(ctx) {
    this.update();
    ctx.save();
    ctx.transform(1, 0, 0, 1, this.position.x, this.position.y);
    for (var i = 0; i < this.triangles.length; i++) {
        this.triangles[i].render(ctx);
    }
    ctx.restore();
};














function Stage(opts) {
    opts = opts || {};
    this.images = opts.images;
    this.canvas = typeof opts.canvas !== 'string' ? opts.canvas : document.getElementById(opts.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.children = [];
    this.init();
}
Stage.prototype.init = function() {
    this.children.push(
        new PentagramGloup({
            image: this.images.star,
            position: { x: 320, y: 90 }
        }),
        new Gift({
            image: this.images.gift,
            position: { x: 130, y: 118 }
        }),
        new TriangleRain({
            bound: {
                x: 320,
                y: 90,
                w: this.width,
                h: this.height-100
            },
            position: { x: 320, y: 90 }
        })
    );
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
        // stats.update();
        This.render();
        This.isAnimating && window.RAF(render);
    }
    render();
};
Stage.prototype.render = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.globalAlpha = 1;
    for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].render(this.ctx);
    }
};

function ImagesLoad(opts) {
    this.sprite = {};
    this.OKNum = 0;
    this.errNum = 0;
    this.totalNum = 0;
    this.imagesLoad(opts);
}
ImagesLoad.prototype.imagesLoad = function(opts) {
    var This = this;
    for (var img in opts) {
        this.sprite[img] = new Image();
        this.totalNum++;
        this.sprite[img].onload = function() {
            This.OKNum++;
            if (This.OKNum >= This.totalNum) {
                This.loaded && This.loaded();
            }
        };
        this.sprite[img].onerror = function() {
            This.errNum++;
        };
        this.sprite[img].src = opts[img];
    }
};
ImagesLoad.prototype.getImg = function(id) {
    return this.sprite[id];
};


// var stats = new Stats();
//     stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
//     stats.domElement.style.position = 'absolute';
//     stats.domElement.style.top = '0px';
//     document.body.appendChild(stats.domElement);
// exports.Stage = Stage;
// exports.ImagesLoad = ImagesLoad;
