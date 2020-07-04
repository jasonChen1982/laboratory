/* polyfill requestAnimationFrame */
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

/* 定义全局参数 */
var w = 512,
    h = 512,
    gl;

function Path(x = 0, y = 0) {
    this.points = [];
    this.x = x;
    this.y = y;
    this.length = 0;
}
Path.prototype.moveTo = function(x, y, z = 0) {
    this.length = 1;
    this.points.push(this.x + x, this.y + y, z);
    return this;
};
Path.prototype.lineTo = function(x, y, z = 0) {
    this.length++;
    this.points.push(this.x + x, this.y + y, z);
    return this;
};



/* body加载完成执信回调 */
onload = function() {
    var c = document.getElementById('canvas');
    c.width = w;
    c.height = h;

    // 获取canvas的webgl绘图上下文 gl
    gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    // 编译着色器程序
    var prg = compileProgram(document.getElementById('vs').text, document.getElementById('fs').text);

    // 获取着色器持续里面的变量指针
    var prg_position = gl.getAttribLocation(prg, 'position');
    var prg_perspectiveMatrix = gl.getUniformLocation(prg, 'perspectiveMatrix');

    // 画线段
    var path = new Path(w / 2, h / 2);
    var widthDiv2 = 200 / 2;
    path.moveTo(-widthDiv2,0);
    path.lineTo(50-widthDiv2,100);
    path.lineTo(100-widthDiv2,0);
    path.lineTo(150-widthDiv2,100);
    path.lineTo(200-widthDiv2,0);

    // 利用生成的顶点信息生成将要上传给GPU的绘制的坐标数据缓冲区对象
    var pos_vbo = createVBO(path.points);

    // 将数据缓冲区对象上传到着色器指针所指向的内存中
    bindAttribute([pos_vbo], [prg_position], [3]);

    var m = new Matrix();
    var perspectiveMatrix = m.identity(m.create());
    m.orthographic(0, w, h, 0, 0.00, 100, perspectiveMatrix);
    
    gl.lineWidth(100);

    (function() {
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(prg_perspectiveMatrix, false, perspectiveMatrix);
        gl.drawArrays(gl.LINE_STRIP, 0, path.length);
        gl.flush();

        requestAnimationFrame(arguments.callee);
    })();

};

function compileProgram(vs, fs) {
		var vShader,fShader;

    vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vs);
    gl.compileShader(vShader);

    fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fs);
    gl.compileShader(fShader);

    var program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        return program;
    } else {
        alert(gl.getProgramInfoLog(program));
    }
}

function createVBO(data) {
    var vbo = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vbo;
}

function bindAttribute(vbo, attL, attS) {
    for (var i in vbo) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);

        gl.enableVertexAttribArray(attL[i]);

        gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    }
}

function randomRange(LLimit, TLimit) {
    return Math.floor(Math.random() * (TLimit - LLimit) + LLimit);
};
function random(arr) {
    return arr[~~(Math.random() * arr.length)];
}
function setHex( hex ) {
    hex = Math.floor( hex );
    var out = {};
    out.r = ( hex >> 16 & 255 ) / 255;
    out.g = ( hex >> 8 & 255 ) / 255;
    out.b = ( hex & 255 ) / 255;
    return out;
}
var COLOURS = [ 0x69D2E7, 0xA7DBD8, 0xE0E4CC, 0xF38630, 0xFA6900, 0xFF4E50, 0xF9D423 ];
