'use strict';


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
    new THREE.Vector4(-2, 1, -10, 1),
    new THREE.Vector4(30, 20, 20, 1),
    new THREE.Vector4(56, 36, -20, 1),
    new THREE.Vector4(80, 50, -80, 1),
    new THREE.Vector4(0, 1, 40, 1),
    new THREE.Vector4(-80, 24, 30, 1),
    new THREE.Vector4(-40, 18, 20, 1),
    new THREE.Vector4(-20, 12, -12, 1),
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

    // new THREE.Vector4(0, 1, 300, 1),
    // new THREE.Vector4(0, 1, 100, 1),
    // new THREE.Vector4(-2, 1, -20, 1),
    // new THREE.Vector4(80, 40, 30, 1),
    // new THREE.Vector4(0, 1, 40, 1),
    // new THREE.Vector4(-80, 24, 30, 1),
    // new THREE.Vector4(-40, 18, 20, 1),
    // new THREE.Vector4(-20, 12, 10, 1),
    // new THREE.Vector4(-3, 12, -8, 1)
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




function BeizerPath(a) {
    a = a || {};
    this.tween = {
        linear: function (t, b, c, d){  //匀速
            return c*t/d + b;
        },
        easeIn: function(t, b, c, d){  //加速曲线
            return c*(t/=d)*t + b;
        },
        easeOut: function(t, b, c, d){  //减速曲线
            return -c *(t/=d)*(t-2) + b;
        },
        easeBoth: function(t, b, c, d){  //加速减速曲线
            if ((t/=d/2) < 1) {
                return c/2*t*t + b;
            }
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInStrong: function(t, b, c, d){  //加加速曲线
            return c*(t/=d)*t*t*t + b;
        },
        easeOutStrong: function(t, b, c, d){  //减减速曲线
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
            if ((t/=d/2) < 1) {
                return c/2*t*t*t*t + b;
            }
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
            if (t === 0) { 
                return b; 
            }
            if ( (t /= d) == 1 ) {
                return b+c; 
            }
            if (!p) {
                p=d*0.3; 
            }
            if (!a || a < Math.abs(c)) {
                a = c; 
                var s = p/4;
            } else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
            if (t === 0) {
                return b;
            }
            if ( (t /= d) == 1 ) {
                return b+c;
            }
            if (!p) {
                p=d*0.3;
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },    
        elasticBoth: function(t, b, c, d, a, p){
            if (t === 0) {
                return b;
            }
            if ( (t /= d/2) == 2 ) {
                return b+c;
            }
            if (!p) {
                p = d*(0.3*1.5);
            }
            if ( !a || a < Math.abs(c) ) {
                a = c; 
                var s = p/4;
            }
            else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            if (t < 1) {
                return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
                        Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            }
            return a*Math.pow(2,-10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
        },
        backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
            if (typeof s == 'undefined') {
               s = 3.70158;
            }
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        backOut: function(t, b, c, d, s){
            if (typeof s == 'undefined') {
                s = 3.70158;  //回缩的距离
            }
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        }, 
        backBoth: function(t, b, c, d, s){
            if (typeof s == 'undefined') {
                s = 1.70158; 
            }
            if ((t /= d/2 ) < 1) {
                return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            }
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
            return c - this['bounceOut'](d-t, 0, c, d) + b;
        },       
        bounceOut: function(t, b, c, d){
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
            }
            return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
        },      
        bounceBoth: function(t, b, c, d){
            if (t < d/2) {
                return this['bounceIn'](t*2, 0, c, d) * 0.5 + b;
            }
            return this['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
        }
    };
}
BeizerPath.prototype.motion = function(b, c, d, e, f) {
    var g = Date.now(),
        This = this;
    c = c || 1000;
    d = d || 'easeBothStrong';

    function go() {
        var a = Date.now() - g,
            stop = a > c,
            t;
        if (stop) { t = 1 } else { t = This.tween[d](a, 0, 1, c) }
        e && e(nurbsCurve.getPoint(t), t);
        if (stop) { f && f(This.getPoint(b, t), t) } else { window.RAF(go) } 
    }
    window.RAF(go) 
};
BeizerPath.prototype.getPoint = function(b, t) {
    var a = b,
        len = a.length,
        rT = 1 - t,
        l = a.slice(0, len - 1),
        r = a.slice(1),
        oP = {};
    if (len > 3) {
        var c = this.getPoint(l, t),
            oR = this.getPoint(r, t);
        oP.x = rT * c.x + t * oR.x;
        oP.y = rT * c.y + t * oR.y;
        oP.z = rT * c.z + t * oR.z;
        return oP } else { oP.x = rT * rT * b[0].x + 2 * t * rT * b[1].x + t * t * b[2].x;
        oP.y = rT * rT * b[0].y + 2 * t * rT * b[1].y + t * t * b[2].y;
        oP.z = rT * rT * b[0].z + 2 * t * rT * b[1].z + t * t * b[2].z;
        return oP } 
};

