(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


var s = Snap("#bubble");
var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

/* 柱状喷泉式泡泡 */
function Bubble() {
    this.x = 0;
    this.y = 0;
    this.gravity = 0.2;
    this.radius = Math.floor(16 * Math.random()) + 2;
    this.tr = this.radius * 2;

    this.doc = s.paper.circle(this.x, this.y, this.radius);
    this.opacity = Math.random() * 0.3 + .7;
    this.doc.attr({fill: COLOURS[~~(Math.random() * COLOURS.length)], opacity: this.opacity});

    this.init();
}
Bubble.prototype.init = function() {
    this.x = 0;
    this.y = 0;
    this.speedX = 4 * (Math.random() - 0.5);
    this.speedY = -6.7 * (Math.random() + 1);
};
Bubble.prototype.update = function() {
    this.x += this.speedX;
    this.speedY += this.gravity;
    this.y += this.speedY;

    if (this.y + this.radius > 0 && this.speedY > 0 && Math.abs(this.speedY) > 1.2) {
        this.y = -this.radius;
        this.speedY *= -0.7;
    } else if((this.x + this.radius) < -600 || (this.x - this.radius) > 600 || (this.y >= -this.radius && this.speedY > 0)) {
        this.init();
    }

    // this.doc.attr({ transform: 'matrix(1,0,0,1,' + this.x + ',' + this.y + ')' }); // 性能差 snap内部实现的问题
    // this.doc.attr('transform', 'matrix(1,0,0,1,' + this.x + ',' + this.y + ')'); // 性能差 snap内部实现的问题
    // this.doc.attr({ cx: this.x, cy: this.y }); // 性能一般 snap内部实现的问题
    // this.doc.node.style.transform = 'matrix(1,0,0,1,' + this.x + ',' + this.y + ')'; // 性能优秀
    // this.doc.node.setAttribute('cx', this.x); // 性能优秀
    // this.doc.node.setAttribute('cy', this.y); // 性能优秀
    this.doc.node.setAttribute('transform', 'matrix(1,0,0,1,' + this.x + ',' + this.y + ')'); // 性能优秀
}
    /* 柱状喷泉式泡泡 */
function Stage() {
    this.max = 80;
    this.flow = 40;
    this.doc = s.paper.g().attr({id: 'group'});
    this.doc.attr({ transform: 'matrix(1,0,0,1,' + 600 + ',' + 450 + ')' });
    this.childs = [];
    this.pt = 0;
}
Stage.prototype.addOne = function() {
    this.nt = Date.now();
    if(this.nt - this.pt > this.flow){
        this.pt = this.nt;
        var e = new Bubble();
        this.childs.push(e);
        this.doc.add(e.doc);
    }
};
Stage.prototype.update = function() {
    var l = this.childs.length;
    if (this.max > l) this.addOne();
    l = this.childs.length;
    for (var i = 0; i < l; i++) {
        this.childs[i].update();
    }
};

var stage = new Stage();
render();

function render() {
    stage.update();
    requestAnimationFrame(render);
}

