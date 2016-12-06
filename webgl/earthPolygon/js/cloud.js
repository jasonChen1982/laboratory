function Cloud(){
	this.mesh = new THREE.Group();
	
	var geom = new THREE.ConeGeometry( 0.1, 0.4, 4 );
	geom.rotateX(Math.PI/2);
	
	var mat = new THREE.MeshPhongMaterial({
		color: new THREE.Color(0xffffff),  
		shading: THREE.FlatShading
	});
	window.mat = mat;
	
	var nBlocs = 50+(Math.random()*25 >> 0);
	for (var i=0; i<nBlocs; i++ ){
		var m = new THREE.Mesh(geom, mat); 
		var degX = toRAD * randomRange(50, 130),
			degY = toRAD * randomRange(0, 360),
			radius = randomRange(2.7, 3.2),
			x = Math.sin(degX) * Math.cos(degY) * radius,
			y = Math.cos(degX) * radius,
			z = Math.sin(degX) * Math.sin(degY) * radius;
		m.position.x = x;
		m.position.y = y;
		m.position.z = z;
		m.lookAt(new THREE.Vector3(0, 0, 0));
		var s = .3 + Math.random()*.7;
		m.scale.set(s,s,s);
		this.mesh.add(m);
	}
}
var toRAD = Math.PI / 180.0;
function randomRange(LLimit, TLimit) {
    return (Math.random() * (TLimit - LLimit) + LLimit);
};