var JCM = new matIV();
function Vertex3(x,y,z){
    this.x = x||0;
    this.y = y||0;
    this.z = z||0;
}
function Object3D(){
    this.vertex = [];
    this.color = [];
    this.index = [];

    this.toRAD = Math.PI/180.0;
	this.rotate = new Vertex3();
	this.scale = new Vertex3(1,1,1);
	this.translate = new Vertex3();
    this.matrix = JCM.identity(JCM.create());
}
Object3D.prototype.rotateXYZ = function(){
    JCM.rotate(this.matrix, (this.rotate.x % 360) * this.toRAD, [1,0,0], this.matrix);
    JCM.rotate(this.matrix, (this.rotate.y % 360) * this.toRAD, [0,1,0], this.matrix);
    JCM.rotate(this.matrix, (this.rotate.z % 360) * this.toRAD, [0,0,1], this.matrix);
}
Object3D.prototype.translateXYZ = function(){
    JCM.translate(this.matrix, [this.translate.x,this.translate.y,this.translate.z], this.matrix);
}
Object3D.prototype.scaleXYZ = function(){
    JCM.scale(this.matrix, [this.scale.x,this.scale.y,this.scale.z], this.matrix);
}
Object3D.prototype.upMatrix = function(Wmatrix){
    this.matrix = JCM.identity(JCM.create());
    this.translateXYZ();
    this.rotateXYZ();
    this.scaleXYZ();

    JCM.multiply(Wmatrix, this.matrix, this.matrix);
}
Object3D.prototype.createVbo = function(data){
    var vbo = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	return vbo;
}
Object3D.prototype.setAttribute = function(vbo, attL, attS){
	for(var i in vbo){
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
		
		gl.enableVertexAttribArray(attL[i]);
		
		gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
	}
}
Object3D.prototype.createIbo = function(data){
	var ibo = gl.createBuffer();
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	return ibo;
}

function Material(){
	this.v_shader = this.createShader('vs');
	this.f_shader = this.createShader('fs');
	this.prg = this.createProgram(this.v_shader, this.f_shader);
}
Material.prototype.createShader = function(id){
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
Material.prototype.createProgram = function(vs, fs){
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












function Wings(data,m){
	this.prg = m.prg;
	this.vertex = data.vertex;
	this.color = data.color;
	this.index = data.index;
	
	this.attLocation = new Array();
	this.attLocation[0] = gl.getAttribLocation(this.prg, 'position');
	this.attLocation[1] = gl.getAttribLocation(this.prg, 'color');
	
	this.attStride = new Array();
	this.attStride[0] = 3;
	this.attStride[1] = 4;


	this.vertexR = [];
	for(var i=0;i<this.vertex.length;i++){
		if(i%3==0){
			this.vertexR[i] = -this.vertex[i];
		}else{
			this.vertexR[i] = this.vertex[i];
		}
	}
	this.matrixR = JCM.identity(JCM.create());


	this.pos_vbo = this.createVbo(this.vertex);
	this.posR_vbo = this.createVbo(this.vertexR);
	this.col_vbo = this.createVbo(this.color);
	this.ibo = this.createIbo(this.index);
	
}
Wings.prototype = new Object3D();
Wings.prototype.constructor = Wings;
Wings.prototype.upMatrixR = function(Wmatrix){
	this.matrixR = JCM.identity(JCM.create());
    JCM.translate(this.matrixR, [-this.translate.x,this.translate.y,this.translate.z], this.matrixR);
    
    JCM.rotate(this.matrixR, (this.rotate.x % 360) * this.toRAD, [1,0,0], this.matrixR);
    JCM.rotate(this.matrixR, -(this.rotate.y % 360) * this.toRAD, [0,1,0], this.matrixR);
    JCM.rotate(this.matrixR, (this.rotate.z % 360) * this.toRAD, [0,0,1], this.matrixR);

    JCM.scale(this.matrixR, [this.scale.x,this.scale.y,this.scale.z], this.matrixR);

    JCM.multiply(Wmatrix, this.matrixR, this.matrixR);

}
Wings.prototype.render = function(Wmatrix){

	gl.disable( gl.CULL_FACE );

	this.upMatrix(Wmatrix);

	this.setBuffer(true);


	gl.uniformMatrix4fv(this.uniLocation, false, this.matrix);
	gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_SHORT, 0);
	


	this.upMatrixR(Wmatrix);

	this.setBuffer(false);
	gl.uniformMatrix4fv(this.uniLocation, false, this.matrixR);
	gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_SHORT, 0);
	
}
Wings.prototype.setBuffer = function (mark){
	var position = mark?this.pos_vbo:this.posR_vbo;
	
	this.setAttribute([position, this.col_vbo], this.attLocation, this.attStride);
	
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
	
	this.uniLocation = gl.getUniformLocation(this.prg, 'mvpMatrix');
}


function Tentacle(data,m){
	this.prg = m.prg;
	this.vertex = data.vertex;
	this.color = data.color;
	this.index = data.index;
	this.attLocation = new Array();
	this.attLocation[0] = gl.getAttribLocation(this.prg, 'position');
	this.attLocation[1] = gl.getAttribLocation(this.prg, 'color');
	
	this.attStride = new Array();
	this.attStride[0] = 3;
	this.attStride[1] = 4;


	this.vertexR = [];
	for(var i=0;i<this.vertex.length;i++){
		if(i%3==0){
			this.vertexR[i] = -this.vertex[i];
		}else{
			this.vertexR[i] = this.vertex[i];
		}
	}
	this.matrixR = JCM.identity(JCM.create());


	this.ibo = this.createIbo(this.index);
	this.pos_vbo = this.createVbo(this.vertex);
	this.posR_vbo = this.createVbo(this.vertexR);
	this.col_vbo = this.createVbo(this.color);
}
Tentacle.prototype = new Object3D();
Tentacle.prototype.constructor = Tentacle;
Tentacle.prototype.upMatrixR = function(Wmatrix){
	this.matrixR = JCM.identity(JCM.create());
    JCM.translate(this.matrixR, [-this.translate.x,this.translate.y,this.translate.z], this.matrixR);
    
    JCM.rotate(this.matrixR, (this.rotate.x % 360) * this.toRAD, [1,0,0], this.matrixR);
    JCM.rotate(this.matrixR, -(this.rotate.y % 360) * this.toRAD, [0,1,0], this.matrixR);
    JCM.rotate(this.matrixR, (this.rotate.z % 360) * this.toRAD, [0,0,1], this.matrixR);

    JCM.scale(this.matrixR, [this.scale.x,this.scale.y,this.scale.z], this.matrixR);

    JCM.multiply(Wmatrix, this.matrixR, this.matrixR);

}
Tentacle.prototype.render = function(Wmatrix){


	gl.disable( gl.CULL_FACE );

	this.upMatrix(Wmatrix);
	this.setBuffer(true);

	gl.uniformMatrix4fv(this.uniLocation, false, this.matrix);
	gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_SHORT, 0);


	this.upMatrixR(Wmatrix);
	this.setBuffer(false);
	gl.uniformMatrix4fv(this.uniLocation, false, this.matrixR);
	gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_SHORT, 0);
	
}
Tentacle.prototype.setBuffer = function (mark){
	
	var position = mark?this.pos_vbo:this.posR_vbo;
	
	this.setAttribute([position, this.col_vbo], this.attLocation, this.attStride);
	
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
	
	this.uniLocation = gl.getUniformLocation(this.prg, 'mvpMatrix');
}


function Body(data,m){
	this.prg = m.prg;
	this.vertex = data.vertex;
	this.color = data.color;
	this.index = data.index;


	this.attLocation = new Array();
	this.attLocation[0] = gl.getAttribLocation(this.prg, 'position');
	this.attLocation[1] = gl.getAttribLocation(this.prg, 'color');
	
	this.attStride = new Array();
	this.attStride[0] = 3;
	this.attStride[1] = 4;


	this.pos_vbo = this.createVbo(this.vertex);
	this.col_vbo = this.createVbo(this.color);
	this.ibo = this.createIbo(this.index);
}
Body.prototype = new Object3D();
Body.prototype.constructor = Body;
Body.prototype.render = function(mvpMatrix){

	
	gl.enable(gl.CULL_FACE);
	this.setBuffer();


	gl.uniformMatrix4fv(this.uniLocation, false, mvpMatrix);
	gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_SHORT, 0);
}
Body.prototype.setBuffer = function (){
	
	this.setAttribute([this.pos_vbo, this.col_vbo], this.attLocation, this.attStride);
	
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
	
	this.uniLocation = gl.getUniformLocation(this.prg, 'mvpMatrix');
}



function Butterfly(){
	this.tentacle = new Tentacle();
	this.body = new Body();
	this.wings = new Wings();
	this.wings.translate.x = -10;
	//this.wings.rotate.y = -80;
}
Butterfly.prototype = new Object3D();
Butterfly.prototype.constructor = Butterfly;
Butterfly.prototype.render = function(ctx){
	this.upMatrix();
	this.tentacle.render(ctx,this.matrix);
	this.body.render(ctx,this.matrix);
	this.wings.render(ctx,this.matrix);
}
Butterfly.prototype.upMatrix = function(){
    this.matrix = JCM.identity(JCM.create());
    this.translateXYZ();
    this.rotateXYZ();
    this.scaleXYZ();
}