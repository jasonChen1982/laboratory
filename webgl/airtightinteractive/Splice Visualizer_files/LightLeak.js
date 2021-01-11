//LIGHT LEAK AS SPRITE

var LightLeak = function() {

	var groupHolder;
	var spriteMaterial;

	function init(){

		groupHolder = new THREE.Object3D();

		//put on scene to avoid 3d tilt
		SpliceMain.getScene().add(groupHolder);
		//VizHandler.getVizHolder().add(groupHolder);

		events.on("update", update);

		//move up?
		var texture = THREE.ImageUtils.loadTexture( "res/img/leak03.jpg" );

		spriteMaterial = new THREE.SpriteMaterial( {
			map: texture,
			blending: THREE.AdditiveBlending,
			transparent: true,
			// depthWrite:false,
			depthTest:false,
			opacity: 0.08,
			fog:false,
		} );

		leak = new THREE.Sprite( spriteMaterial );
		groupHolder.add( leak );
		var spriteScale = 600;
		leak.scale.set(spriteScale,spriteScale,spriteScale);

		//leak.position.z = 5;


		// spriteMaterial = new THREE.MeshBasicMaterial( {
		// 	map : texture,
		// 	transparent:true,
		// 	//blending: THREE.AdditiveBlending,
		// 	opacity: 1,//0.1,
		// 	fog:false,
		// 	side: THREE.BackSide
		// } );

		//Add img plane
		// var planeGeometry = new THREE.PlaneGeometry( 800, 800,1,1 );
		// plane = new THREE.Mesh( planeGeometry, spriteMaterial );
		// groupHolder.add( plane );
		
		// plane.scale.x = plane.scale.y = 8;
		// plane.position.z = 500;
		// plane.rotation.y = Math.PI/2;


		// debugGeometry = new THREE.CubeGeometry( 20, 20, 20 );
		// debugMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );

		// debugMesh = new THREE.Mesh( debugGeometry, debugMaterial );
		// groupHolder.add( debugMesh );

		//debugMesh.position.z = 500;

	}


	function update() {

		//groupHolder.position.copy(SpliceMain.getCamera().position);


		spriteMaterial.rotation += 0.01;

		groupHolder.position.copy(SpliceViz.getMoverPos());


		//groupHolder.lookAt(SpliceMain.getCamera());

		//groupHolder.rotation.z += 0.002;
	}


	return {
		init:init,
	};

}();