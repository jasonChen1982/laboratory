var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
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

onload = function(){

	var c = document.getElementById('canvas');  
	c.width = w;  
	c.height = h;  

	gl = c.getContext('webgl') || c.getContext('experimental-webgl');
	
	var v_shader = create_shader('vs');
	var f_shader = create_shader('fs');
	
	var prg = create_program(v_shader, f_shader);
	
	var attLocation = new Array();
	prg_position = gl.getAttribLocation(prg, 'position');
	prg_size = gl.getAttribLocation(prg, 'size');
	
	
	var torusData = createPoint(10000);	// torus(64, 64, 1.5, 3.0);
	var position = torusData.p;
	var size = torusData.s;
	// var index = torusData.i;
	
	var pos_vbo = create_vbo(position);
	var nor_vbo = create_vbo(size);
	
	set_attribute([pos_vbo, nor_vbo], [prg_position, prg_size], [3,1]);
	
	// var ibo = create_ibo(index);
	
	// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	var mvpM = gl.getUniformLocation(prg, 'mvpMatrix');
	
	
	var m = new matIV();
	
	var mMatrix = m.identity(m.create());
	var vMatrix = m.identity(m.create());
	var pMatrix = m.identity(m.create());
	var tmpMatrix = m.identity(m.create());
	var mvpMatrix = m.identity(m.create());
	var invMatrix = m.identity(m.create());
	
	var lightDirection = [-0.5, 1.0, 0.5];
	
	var ambientColor = [0.1, 0.1, 0.1, 1.0];
	
	var eyeDirection = [0.0, 0.0, 20.0];

	
	
	var count = 0,
		deep = 0.05;
	
	
	(function(){
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		eyeDirection[2] = eyeDirection[2] - deep;
		if(eyeDirection[2]<2)deep=-0.1;
		if(eyeDirection[2]>30)deep=0.1;
		count = (0.01+count)%360;

		m.lookAt(eyeDirection, [0, 0, 0], [0, 1, 0], vMatrix);
		m.perspective(45, c.width / c.height, 0.1, 100, pMatrix);
		m.multiply(pMatrix, vMatrix, tmpMatrix);

		m.identity(mMatrix);
		m.rotate(mMatrix, count, [0,1,1], mMatrix);
		m.rotate(mMatrix, count, [1,0,1], mMatrix);

		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(mvpM, false, mvpMatrix);


		gl.drawArrays(gl.POINTS, 0, 10000);
		
		
		gl.flush();
		
		requestAnimationFrame(arguments.callee);
	})();
	


















	function create_shader(id){
		var shader;
		
		var scriptElement = document.getElementById(id);
		
		if(!scriptElement){return;}
		
		switch(scriptElement.type){
			
			case 'x-shader/x-vertex':
				shader = gl.createShader(gl.VERTEX_SHADER);
				break;
				
			case 'x-shader/x-fragment':
				shader = gl.createShader(gl.FRAGMENT_SHADER);
				break;
			default :
				return;
		}
		
		gl.shaderSource(shader, scriptElement.text);
		
		gl.compileShader(shader);
		
		if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			
			return shader;
		}else{
			
			alert(gl.getShaderInfoLog(shader));
		}
	}
	
	function create_program(vs, fs){
		var program = gl.createProgram();
		
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		
		gl.linkProgram(program);
		
		if(gl.getProgramParameter(program, gl.LINK_STATUS)){
		
			gl.useProgram(program);
			
			return program;
		}else{
			
			alert(gl.getProgramInfoLog(program));
		}
	}
	
	function create_vbo(data){
		var vbo = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		return vbo;
	}
	
	function set_attribute(vbo, attL, attS){
		for(var i in vbo){
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
			
			gl.enableVertexAttribArray(attL[i]);
			
			gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
		}
	}
	
	function create_ibo(data){
		var ibo = gl.createBuffer();
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		
		return ibo;
	}
	
	function torus(row, column, irad, orad, color){
		var pos = new Array(), nor = new Array(),
		    col = new Array(), idx = new Array();
		for(var i = 0; i <= row; i++){
			var r = Math.PI * 2 / row * i;
			var rr = Math.cos(r);
			var ry = Math.sin(r);
			for(var ii = 0; ii <= column; ii++){
				var tr = Math.PI * 2 / column * ii;
				var tx = (rr * irad + orad) * Math.cos(tr);
				var ty = ry * irad;
				var tz = (rr * irad + orad) * Math.sin(tr);
				var rx = rr * Math.cos(tr);
				var rz = rr * Math.sin(tr);
				if(color){
					var tc = color;
				}else{
					tc = hsva(360 / column * ii, 1, 1, 1);
				}
				pos.push(tx, ty, tz);
				nor.push(rx, ry, rz);
				col.push(tc[0], tc[1], tc[2], tc[3]);
			}
		}
		for(i = 0; i < row; i++){
			for(ii = 0; ii < column; ii++){
				r = (column + 1) * i + ii;
				idx.push(r, r + column + 1, r + 1);
				idx.push(r + column + 1, r + column + 2, r + 1);
			}
		}
		return {p : pos, n : nor, c : col, i : idx};
	}
	
	function hsva(h, s, v, a){
		if(s > 1 || v > 1 || a > 1){return;}
		var th = h % 360;
		var i = Math.floor(th / 60);
		var f = th / 60 - i;
		var m = v * (1 - s);
		var n = v * (1 - s * f);
		var k = v * (1 - s * (1 - f));
		var color = new Array();
		if(!s > 0 && !s < 0){
			color.push(v, v, v, a); 
		} else {
			var r = new Array(v, n, m, m, k, v);
			var g = new Array(k, v, v, n, m, m);
			var b = new Array(m, m, k, v, v, n);
			color.push(r[i], g[i], b[i], a);
		}
		return color;
	}

	function createPoint(num){
		var pos = new Array(),size = new Array(),radius = 8.0,toRAD = Math.PI/180.0;

		for(var i=0;i<num;i++){
			var degX = randomRange(0,360),
				degY = randomRange(0,360),
				degZ = randomRange(0,360),
				x = Math.cos(toRAD*degX)*radius,
				y = Math.cos(toRAD*degY)*radius,
				z = Math.cos(toRAD*degZ)*radius,
				s = Math.random()*4.0;
			pos.push(x,y,z);
			size.push(s);
		}
		return {p: pos, s: size};
	}

	function randomRange(LLimit,TLimit){
	    return Math.floor(Math.random()*(TLimit-LLimit) + LLimit);
	};
};