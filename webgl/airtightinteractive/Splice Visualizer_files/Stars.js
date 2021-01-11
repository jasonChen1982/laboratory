var starTexture = THREE.ImageUtils.loadTexture("res/img/dot.png");

var Stars = function() {


	var starCount = 1800;
	var starGeometry;
	var material;
	var group;
	var particles;

	function init(){

		//init event listeners
		events.on("update", update);
		events.on("seeked", seeked);

		group = new THREE.Object3D();
		SpliceMain.getVizHolder().add(group);

		//init Particles
		starGeometry = new THREE.Geometry();

		//create one shared material
		material = new THREE.PointCloudMaterial({
			size: 2,
			map: starTexture,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			transparent: true,
			opacity: 0.3,
			side: THREE.DoubleSide,
			color: 0xFFFFFF,
		});

		material.particleHue = Math.random();
		material.color = new THREE.Color(0xffffff);
		material.color.setHSL(material.particleHue, 1.0, 1.0);

		//create particles
		var spread =  600;
		for (i = 0; i < starCount; i++) {

			var posn = new THREE.Vector3(ATUtil.randomRange(-spread,spread),
											ATUtil.randomRange(-spread,spread),
											ATUtil.randomRange(0,1000));

			starGeometry.vertices.push(posn);
			posn.origZ = posn.z;

		}

		//init particle systemvizParams.opacity;
		particles = new THREE.PointCloud(starGeometry, material);
		particles.sortParticles = false;

		particles.frustumCulled = false;

		group.add(particles);

	}

	function update() {

		//if stars go behind camera re-add to front
		var camz =  SpliceMain.getCamera().position.z;

		for (i = 0; i < starCount; i++) {


			starGeometry.vertices[i].z -= 1;

			if (starGeometry.vertices[i].z < camz){
				starGeometry.vertices[i].z = camz  +  Math.random()*600 + 200 ;
			}
			
		}
		starGeometry.verticesNeedUpdate = true;
	}

	function seeked() {

		//reset all stars infront of cam
		var camz =  SpliceMain.getCamera().position.z;

		for (i = 0; i < starCount; i++) {
			starGeometry.vertices[i].z = camz  +  Math.random()*600 + 200 ;
		}

		starGeometry.verticesNeedUpdate = true;
	}

	return {
		init:init,
	};

}();