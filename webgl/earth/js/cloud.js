function Cloud(){
	this.mesh = new THREE.Group();
	
	var geom = new THREE.BoxGeometry(0.2,0.2,0.2);
	
	var mat = new THREE.MeshPhongMaterial({
		color: new THREE.Color(0xffffff),  
	});
	
	var nBlocs = 100+(Math.random()*20 >> 0);
	for (var i=0; i<nBlocs; i++ ){
		
		var m = new THREE.Mesh(geom, mat); 
		
        var degX = toRAD * randomRange(50, 130),
            degY = toRAD * randomRange(0, 360),
			radius = randomRange(3.5, 4),
            x = Math.sin(degX) * Math.cos(degY) * radius,
            y = Math.cos(degX) * radius,
            z = Math.sin(degX) * Math.sin(degY) * radius;
		m.position.x = x;
		m.position.y = y;
		m.position.z = z;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		
		var s = .3 + Math.random()*.7;
		m.scale.set(s,s,s);
		
		m.castShadow = true;
		m.receiveShadow = true;
		
		this.mesh.add(m);
	} 
}
var toRAD = Math.PI / 180.0;
function randomRange(LLimit, TLimit) {
    return (Math.random() * (TLimit - LLimit) + LLimit);
};