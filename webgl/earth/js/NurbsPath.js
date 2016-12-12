'use strict';

window.androidUC = /uc/i.test(window.navigator.userAgent) && /android/i.test(window.navigator.userAgent);
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame || window.androidUC) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
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

function CreatePath(control, degree){
    this.control = control;
    this.knots = [];
    this.degree = degree || 3;
    this.init();
}
CreatePath.prototype.init = function(){
    for ( var i = 0; i <= this.degree; i ++ ) {
        this.knots.push( 0 );
    }
    for ( var i = 0, j = this.control.length; i < j; i ++ ) {
        var knot = ( i + 1 ) / ( j - this.degree );
        this.knots.push( THREE.Math.clamp( knot, 0, 1 ) );
    }
    this.nurbs = new THREE.NURBSCurve(this.degree, this.knots, this.control);
};

var lookControl = [
    new THREE.Vector4(   1, 1.5,-1.6, 1),
    new THREE.Vector4( 0.9, 1.4,-1.5, 1),
    new THREE.Vector4( 0.7, 1.3,-1.4, 1),
    new THREE.Vector4( 0.5, 1.2,-1.2, 1),
    new THREE.Vector4(   1,   1,-1.6, 1),
    new THREE.Vector4( 0.1, 0.5,-1.2, 1),
    new THREE.Vector4( 0.1,   1,-1.8, 1),
    new THREE.Vector4( 0.1,   2,-2.5, 1),
    new THREE.Vector4( 0.1,   2,-1.1, 1),
    new THREE.Vector4(   0,   1,   0, 1),
    new THREE.Vector4(   0,   0,   0, 1),
];
var lookCurve = new CreatePath(lookControl);

var fovControl = [
    new THREE.Vector4(30, 0, 0, 1),
    new THREE.Vector4(35, 0, 0, 1),
    new THREE.Vector4(40, 0, 0, 1),
    new THREE.Vector4(45, 0, 0, 1),
    new THREE.Vector4(50, 0, 0, 1),
    new THREE.Vector4(60, 0, 0, 1),
    new THREE.Vector4(90, 0, 0, 1),
];
var fovCurve = new CreatePath(fovControl);

var cameraControl = [
    new THREE.Vector4(0.75,1.05,  -3, 1),
    new THREE.Vector4(   1, 0.4,-2.5, 1),
    new THREE.Vector4(1.25,-0.2,-2.7, 1),
    new THREE.Vector4(   0,-0.4,  -3, 1),
    new THREE.Vector4(  -1,-0.4,  -3, 1),
    new THREE.Vector4(  -2,-0.2,-2.5, 1),
    new THREE.Vector4(  -3,-0.1,  -2, 1),
    new THREE.Vector4(-3.4,   0,-1.6, 1),
    new THREE.Vector4(-3.2, 0.4,  -1, 1),
    new THREE.Vector4(-2.6, 0.5, 0.3, 1),
    new THREE.Vector4(  -2, 0.4, 1.9, 1),
    new THREE.Vector4(-1.4, 0.3, 3.3, 1),
    new THREE.Vector4(-0.9, 0.2, 4.4, 1),
    new THREE.Vector4(-0.4, 0.1, 5.4, 1),
    new THREE.Vector4(-0.1,   0, 6.4, 1),
    new THREE.Vector4(   0,   0,   7, 1)
];
var cameraCurve = new CreatePath(cameraControl);

function NurbsPath(option) {
    option = option || {};
    this.tween = {
        linear: function (t, b, c, d){  //匀速
            return c*t/d + b;
        },
        easeBoth: function(t, b, c, d){
            if ((t/=d/2) < 1) {
                return c/2*t*t + b;
            }
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    };
    this.path = option.path;
}
NurbsPath.prototype.motion = function(c, d, e, f) {
    var g = Date.now(),
        This = this;
    c = c || 1000;
    d = d || 'easeBoth';

    function go() {
        var a = Date.now() - g,
            stop = a > c,
            t = 1;
        if (!stop) {
            t = This.tween[d](a, 0, 1, c);
        }
        e && e(This.path.getPoint(t), t);
        if (stop) { 
            f && f();
        } else {
            window.RAF(go);
        } 
    }
    window.RAF(go);
};
