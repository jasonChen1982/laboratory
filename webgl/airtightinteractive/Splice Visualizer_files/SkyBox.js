/**
*
* A big box of crosses
*
**/

var SkyBox = function() {

	var groupHolder;
	var backMesh;

	function init(){

			events.on("update", update);

			groupHolder = new THREE.Object3D();
			SpliceMain.getVizHolder().add(groupHolder);

			imgTextureStars = THREE.ImageUtils.loadTexture( "res/img/crosses.png" );
			imgTextureStars.wrapS = imgTextureStars.wrapT = THREE.RepeatWrapping;
			imgTextureStars.repeat.set( 12, 12 );

			backMaterial = new THREE.MeshBasicMaterial( {
				blending: THREE.AdditiveBlending,
				map:imgTextureStars,
				transparent:true,
				depthTest: true,
				opacity:1,
				fog:false
			} );
			
			backMesh = new THREE.Mesh( new THREE.BoxGeometry( 600, 600,600), backMaterial  );
			backMesh.scale.x = -1;
			groupHolder.add( backMesh );

	}

	function update() {
		//lock skybox to camera posn
		backMesh.position.copy(SpliceMain.getCamera().position);
	}


	return {
		init:init,
		update:update,
	};

}();