function Matrix() {
    this.props = new Float32Array(16);
}

Matrix.prototype.reset = function (){
    this.props[0] = 1;
    this.props[1] = 0;
    this.props[2] = 0;
    this.props[3] = 0;
    this.props[4] = 0;
    this.props[5] = 1;
    this.props[6] = 0;
    this.props[7] = 0;
    this.props[8] = 0;
    this.props[9] = 0;
    this.props[10] = 1;
    this.props[11] = 0;
    this.props[12] = 0;
    this.props[13] = 0;
    this.props[14] = 0;
    this.props[15] = 1;
    return this;
}

Matrix.prototype.rotateX = function (angle){
    if(angle === 0){
        return this;
    }
    var mCos = Math.cos(angle);
    var mSin = Math.sin(angle);
    return this.transform(
        1,    0,     0, 0,
        0,  mCos, mSin, 0,
        0, -mSin, mCos, 0,
        0,     0,    0, 1);
}

Matrix.prototype.rotateY = function (angle){
    if(angle === 0){
        return this;
    }
    var mCos = Math.cos(angle);
    var mSin = Math.sin(angle);
    return this.transform(
        mCos, 0, -mSin, 0,
        0,    1,    0, 0,
        mSin, 0, mCos, 0,
        0,    0,    0, 1);
}

Matrix.prototype.rotateZ = function (angle){
    if(angle === 0){
        return this;
    }
    var mCos = Math.cos(angle);
    var mSin = Math.sin(angle);
    return this.transform(
         mCos, mSin, 0, 0,
        -mSin, mCos, 0, 0,
           0,     0, 1, 0,
           0,     0, 0, 1);
}

Matrix.prototype.transform = function (a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2) {
    var _p = this.props;

    var a1 = _p[0];
    var b1 = _p[1];
    var c1 = _p[2];
    var d1 = _p[3];
    var e1 = _p[4];
    var f1 = _p[5];
    var g1 = _p[6];
    var h1 = _p[7];
    var i1 = _p[8];
    var j1 = _p[9];
    var k1 = _p[10];
    var l1 = _p[11];
    var m1 = _p[12];
    var n1 = _p[13];
    var o1 = _p[14];
    var p1 = _p[15];

    /* matrix order (canvas compatible):
     * ace
     * bdf
     * 001
     */
    _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2;
    _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2 ;
    _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2 ;
    _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2 ;

    _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2 ;
    _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2 ;
    _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2 ;
    _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2 ;

    _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2 ;
    _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2 ;
    _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2 ;
    _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2 ;

    _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2 ;
    _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2 ;
    _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2 ;
    _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2 ;

    return this;
}

Matrix.prototype.applyToPoint = function (x, y, z) {
    return {
        x: x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12],
        y: x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13],
        z: x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]
    };
}

Matrix.prototype.toCSS = function () {
    var i = 0;
    var props = this.props;
    var cssValue = 'matrix3d(';
    var v = 10000;
    while(i<16){
        cssValue += Math.round(props[i]*v)/v;
        cssValue += i === 15 ? ')':',';
        i += 1;
    }
    return cssValue;
}
