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

// NURBS curve

var nurbsControlPoints = [];
var nurbsKnots = [];
var nurbsDegree = 3;

for ( var i = 0; i <= nurbsDegree; i ++ ) {
    nurbsKnots.push( 0 );
}

var cameraControl = [
    new THREE.Vector4(0, 1, 300, 1),
    new THREE.Vector4(0, 1, 100, 1),
    new THREE.Vector4(-2, 1, -6, 1),
    new THREE.Vector4(30, 20, 20, 1),
    new THREE.Vector4(56, 36, -20, 1),
    new THREE.Vector4(80, 50, -80, 1),
    new THREE.Vector4(0, 1, 40, 1),
    new THREE.Vector4(-80, 24, 30, 1),
    new THREE.Vector4(-40, 18, 20, 1),
    new THREE.Vector4(-20, 14, -12, 1),
    new THREE.Vector4(-10, 12, -10, 1),
    new THREE.Vector4(-5, 12, -9, 1),
    new THREE.Vector4(0, 12, -8, 1)
];

for ( var i = 0, j = cameraControl.length; i < j; i ++ ) {

    nurbsControlPoints.push(
        cameraControl[i]
    );

    var knot = ( i + 1 ) / ( j - nurbsDegree );
    nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

}

var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);


var lookAtControlPoints = [];
var lookAtKnots = [];
var lookAtDegree = 3;

for ( var i = 0; i <= lookAtDegree; i ++ ) {
    lookAtKnots.push( 0 );
}

var lookAtControl = [
    new THREE.Vector4(0, 0, -8, 1),
    new THREE.Vector4(5, 0, -8, 1),
    new THREE.Vector4(10, 0, -8, 1),
    new THREE.Vector4(5, 0, -8, 1),
    new THREE.Vector4(0, 0, -8, 1),
    new THREE.Vector4(-5, 0, -8, 1),
    new THREE.Vector4(-10, 0, -8, 1),
    new THREE.Vector4(0, 1, -50, 1)
];

for ( var i = 0, j = lookAtControl.length; i < j; i ++ ) {

    lookAtControlPoints.push(
        lookAtControl[i]
    );

    var knot = ( i + 1 ) / ( j - lookAtDegree );
    lookAtKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

}

var lookAtCurve = new THREE.NURBSCurve(lookAtDegree, lookAtKnots, lookAtControlPoints);




function NurbsPath() {
    this.tween = {
        linear: function (t, b, c, d){  //匀速
            return c*t/d + b;
        }
    };
}
NurbsPath.prototype.motion = function(c, d, e, f) {
    var g = Date.now(),
        This = this;
    c = c || 1000;
    d = d || 'linear';

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
