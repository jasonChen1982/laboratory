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
// lookat NURBS curve

var lookControlPoints = [];
var lookKnots = [];
var lookDegree = 3;

for ( var i = 0; i <= lookDegree; i ++ ) {
    lookKnots.push( 0 );
}

var lookControl = [
    new THREE.Vector4(0.75,1.05,-3),
    new THREE.Vector4(7.5,10.5,-30),
    new THREE.Vector4(2,0.5, 4, 1),
    new THREE.Vector4(4, 1, 1, 1),
    new THREE.Vector4(0, 4, 0, 1),
    new THREE.Vector4(0, 3, -2, 1),
    new THREE.Vector4(0, 2, -3, 1),
    new THREE.Vector4(-3, 2, -3, 1),
    new THREE.Vector4(-2, 1, 3, 1),
    new THREE.Vector4(-1, 1, 4, 1),
    new THREE.Vector4(0, 0, 6, 1)
];

for ( var i = 0, j = lookControl.length; i < j; i ++ ) {

    lookControlPoints.push(
        lookControl[i]
    );

    var knot = ( i + 1 ) / ( j - lookDegree );
    lookKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

}

var lookCurve = new THREE.NURBSCurve(lookDegree, lookKnots, lookControlPoints);

// NURBS curve

var nurbsControlPoints = [];
var nurbsKnots = [];
var nurbsDegree = 3;

for ( var i = 0; i <= nurbsDegree; i ++ ) {
    nurbsKnots.push( 0 );
}

var cameraControl = [
    new THREE.Vector4(0.75,1.05,-3),
    new THREE.Vector4(7.5,10.5,-30),
    new THREE.Vector4(2,0.5, 4, 1),
    new THREE.Vector4(4, 1, 1, 1),
    new THREE.Vector4(0, 4, 0, 1),
    new THREE.Vector4(0, 3, -2, 1),
    new THREE.Vector4(0, 2, -3, 1),
    new THREE.Vector4(-3, 2, -3, 1),
    new THREE.Vector4(-2, 1, 3, 1),
    new THREE.Vector4(-1, 1, 4, 1),
    new THREE.Vector4(0, 0, 6, 1)
];

for ( var i = 0, j = cameraControl.length; i < j; i ++ ) {

    nurbsControlPoints.push(
        cameraControl[i]
    );

    var knot = ( i + 1 ) / ( j - nurbsDegree );
    nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

}

var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);


function NurbsPath() {
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
}
NurbsPath.prototype.motion = function(c, d, e, f) {
    var g = Date.now(),
        This = this;
    c = c || 1000;
    d = d || 'easeBoth';

    function go() {
        var a = Date.now() - g,
            stop = a > c,
            t;
        if (stop) { t = 1 } else { t = This.tween[d](a, 0, 1, c) }
        e && e(nurbsCurve.getPoint(t), t);
        if (stop) { f && f() } else { window.RAF(go) } 
    }
    window.RAF(go)
};
