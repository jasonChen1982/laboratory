function curveBezierPath(){
    this.Tween = {
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
    }
}
curveBezierPath.prototype.drawPath = function(aPoints,time,fx,update,cb){
    var startTime = new Date().getTime(),
        l = aPoints.length,
        This = this;
    function letGo(){
        var nowTime = new Date().getTime(),
            progress = nowTime-startTime,
            stop = progress>time;

        var ptn = This.Tween[fx]( progress, 0, 1, time);

        var point = This.higherBezierCurve(aPoints,ptn);

        if(stop){
            point = aPoints[l-1];
            cb&&cb();
        }else{
            update&&update(point);
            requestAnimationFrame(letGo)
        }
    }
    requestAnimationFrame(letGo)
}
curveBezierPath.prototype.higherBezierCurve = function(aPoints,rate){ // 高阶贝塞尔曲线
    var a = aPoints,
        len = a.length,
        t = rate,
        rT = 1-t,
        l = a.slice(0,len-1),
        r = a.slice(1),
        oP = {};

    if(len>3){
        var oL = this.higherBezierCurve(l,t),
            oR = this.higherBezierCurve(r,t);

            oP.x = rT*oL.x + t*oR.x;
            oP.y = rT*oL.y + t*oR.y;
            oP.z = rT*oL.z + t*oR.z;

        return oP;
    }else{
        oP.x = rT*rT*aPoints[0].x+2*t*rT*aPoints[1].x+t*t*aPoints[2].x;
        oP.y = rT*rT*aPoints[0].y+2*t*rT*aPoints[1].y+t*t*aPoints[2].y;
        oP.z = rT*rT*aPoints[0].z+2*t*rT*aPoints[1].z+t*t*aPoints[2].z;

        return oP;
    }
}
