function CloudOne(){
	THREE.Mesh.apply(this, arguments);
	this.pc = new THREE.Vector3();
}
CloudOne.prototype = Object.create(THREE.Mesh.prototype);
CloudOne.prototype.init = function() {
	this.position.x = this.pc.x;
	this.position.y = this.pc.y;
	this.position.z = this.pc.z;
	this.proportion = randomRange(1,1.6);
	this.speed = randomRange(0.004,0.006);
	this.froce = randomRange(-0.00004,-0.00008);
	this.time = Date.now();
};
CloudOne.prototype.update = function() {
	var now = Date.now() - this.time;
	this.opacity = 1;
	this.speed += this.froce;
	this.proportion += this.speed;
	this.position.x = this.pc.x * this.proportion;
	this.position.y = this.pc.y * this.proportion;
	this.position.z = this.pc.z * this.proportion;
	if (now <= 300) this.material.opacity = THREE.Math.clamp(now/300, 0, 1);
	if (this.proportion <= 0.9) this.material.opacity = THREE.Math.clamp((this.proportion - 0.8)/0.1, 0, 1);
	if (this.proportion <= 0.8) this.init();
};

function Cloud(){
	this.mesh = new THREE.Group();
	
	var geom = new THREE.ConeGeometry( 0.1, 0.3, 4 );
	geom.rotateX(Math.PI/2);
	
	var mat = new THREE.MeshPhongMaterial({
		color: new THREE.Color(0xffffff),  
		shading: THREE.FlatShading,
		transparent: true,
	});
	window.mat = mat;
	
	var nBlocs = 50+(Math.random()*25 >> 0);
	for (var i=0; i<nBlocs; i++ ){
		var m = new CloudOne(geom, mat.clone()); 
		var degX = toRAD * randomRange(50, 130),
			degY = toRAD * randomRange(0, 360),
			radius = randomRange(2.7, 3.2),
			x = Math.sin(degX) * Math.cos(degY) * radius,
			y = Math.cos(degX) * radius,
			z = Math.sin(degX) * Math.sin(degY) * radius;
		m.pc.x = x;
		m.pc.y = y;
		m.pc.z = z;
		m.init();
		m.lookAt(new THREE.Vector3(0, 0, 0));
		var s = .3 + Math.random()*.7;
		m.scale.set(s,s,s);
		this.mesh.add(m);
	}
}
Cloud.prototype.update = function(){
	var childs = this.mesh.children;
	for(var i=0;i<childs.length;i++){
		var child = childs[i];
		child.update();
	}
};
var toRAD = Math.PI / 180.0;
function randomRange(LLimit, TLimit) {
    return (Math.random() * (TLimit - LLimit) + LLimit);
};