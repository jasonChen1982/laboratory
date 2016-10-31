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

var w = window.innerWidth,
    h = window.innerHeight,
    gl;

onload = function() {

    var c = document.getElementById('canvas');
    c.width = w;
    c.height = h;

    gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    // 编译着色器程序
    var prg = compileProgram(document.getElementById('vs').text, document.getElementById('fs').text);

    // 获取着色器持续里面的变量指针
    var prg_position = gl.getAttribLocation(prg, 'position');
    var prg_color = gl.getAttribLocation(prg, 'color');
    var prg_size = gl.getAttribLocation(prg, 'size');
    var prg_viewMatrix = gl.getUniformLocation(prg, 'viewMatrix');
    var prg_perspectiveMatrix = gl.getUniformLocation(prg, 'perspectiveMatrix');
    var prg_modelMatrix = gl.getUniformLocation(prg, 'modelMatrix');


    // 利用数学公式生成10000个点
    var cubeData = createPoint(50000);
    var position = cubeData.p;
    var size = cubeData.s;
    var color = cubeData.c;

    // 利用生成的顶点信息生成将要上传给GPU的绘制的坐标数据缓冲区对象
    var pos_vbo = createVBO(position);
    var size_vbo = createVBO(size);
    var color_vbo = createVBO(color);

    // 将数据缓冲区对象上传到着色器指针所指向的内存中
    bindAttribute([pos_vbo, color_vbo, size_vbo], [prg_position, prg_color, prg_size], [3, 3, 1]);


    var m = new Matrix();

    var tmpMatrix = m.identity(m.create());
    var modelMatrix = m.identity(m.create());
    var viewMatrix = m.identity(m.create());
    var perspectiveMatrix = m.identity(m.create());
    var eyeDirection = [0.0, 0.0, 20.0];



    var count = 0,
        deep = 0.05;

    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD); //相加
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    (function() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        m.lookAt(eyeDirection, [0, 0, 0], [0, 1, 0], viewMatrix);
        m.perspective(45, c.width / c.height, 0.1, 1000, perspectiveMatrix);

        // eyeDirection[2] = eyeDirection[2] - deep;
        // if(eyeDirection[2]<2)deep=-0.1;
        // if(eyeDirection[2]>32)deep=0.1;
        count = (0.01 + count) % 360;

        // m.lookAt(eyeDirection, [0, 0, 0], [0, 1, 0], vMatrix);
        // m.perspective(45, c.width / c.height, 0.1, 100, pMatrix);
        // m.multiply(pMatrix, vMatrix, tmpMatrix);

        m.identity(modelMatrix);
        m.rotate(modelMatrix, count, [0, 1, 0], modelMatrix);
        m.rotate(modelMatrix, count, [1, 0, 0], modelMatrix);

        gl.uniformMatrix4fv(prg_modelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(prg_viewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(prg_perspectiveMatrix, false, perspectiveMatrix);


        gl.drawArrays(gl.POINTS, 0, 50000);


        gl.flush();

        requestAnimationFrame(arguments.callee);
    })();


};


function Point() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
}
function compileProgram(vs, fs) {
    var vShader, fShader;

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
function createPoint(num) {
    var pos = new Array(),
        size = new Array(),
        color = new Array(),
        radius = 6.0,
        toRAD = Math.PI / 180.0;

    for (var i = 0; i < num; i++) {
        var degX = toRAD * randomRange(0, 360),
            degY = toRAD * randomRange(0, 360),
            degZ = toRAD * randomRange(0, 360),
            x = Math.sin(degX) * Math.cos(degY) * radius,
            y = Math.sin(degX) * Math.sin(degY) * radius,
            z = Math.cos(degX) * radius,
            s = Math.random() * 2.0,
            rgb = setHex(random(COLOURS));
        pos.push(x, y, z);
        size.push(s);
        color.push(rgb.r, rgb.g, rgb.b);
    }
    return { p: pos, s: size, c: color };
}

function randomRange(LLimit, TLimit) {
    return Math.floor(Math.random() * (TLimit - LLimit) + LLimit);
};

function random(arr) {
    return arr[~~(Math.random() * arr.length)];
}

function setHex(hex) {
    hex = Math.floor(hex);
    var out = {};
    out.r = (hex >> 16 & 255) / 255;
    out.g = (hex >> 8 & 255) / 255;
    out.b = (hex & 255) / 255;
    return out;
}
var COLOURS = [0x69D2E7, 0xA7DBD8, 0xE0E4CC, 0xF38630, 0xFA6900, 0xFF4E50, 0xF9D423];
