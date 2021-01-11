/**
 * A ClipBox  - hangs in 3d space 
 * random  polys + glow
 * explodes on cue
 */

var glowTexture = THREE.ImageUtils.loadTexture("res/img/particle.png");

var boxSize = 5;
var clipBoxGeom1 = new THREE.BoxGeometry( boxSize, boxSize, boxSize );
var clipBoxGeom2 = new THREE.TetrahedronGeometry( boxSize);

var ClipBox = function() {

	this.played = false;
	this.start = 0;

	var hue;
	var color;
	var group;
	var material;
	var mesh;
	var mesh2;
	var glow;
	var glowMaterial;

	
	this.init = function() {

		//create reusable 3D object

		group = new THREE.Object3D();
		SpliceMain.getVizHolder().add(group);

		material = new THREE.MeshBasicMaterial( {
			blending: THREE.AdditiveBlending,
			depthWrite:false,
			depthTest:false,
			transparent:true,
			opacity:0.3//0.15
		} );

		mesh = new THREE.Mesh( Math.random() < 0.5 ? clipBoxGeom1 : clipBoxGeom2, material );
		mesh2 = new THREE.Mesh( Math.random() < 0.5 ? clipBoxGeom1 : clipBoxGeom2, material );
		group.add( mesh );
		group.add( mesh2 );

		//randomly rotate and offset sub-meshes
		mesh.rotation.x = ATUtil.randomRange(0,Math.PI*2); 
		mesh.rotation.y = ATUtil.randomRange(0,Math.PI*2); 

		mesh2.rotation.x = ATUtil.randomRange(0,Math.PI*2); 
		mesh2.rotation.y = ATUtil.randomRange(0,Math.PI*2); 
		mesh2.rotation.z = ATUtil.randomRange(0,Math.PI*2); 
		
		mesh2Offset = 2;
		mesh2.position.x = ATUtil.randomRange(-mesh2Offset,mesh2Offset); 
		mesh2.position.y = ATUtil.randomRange(-mesh2Offset,mesh2Offset); 
		mesh2.position.z = ATUtil.randomRange(-mesh2Offset,mesh2Offset); 

		//create one glow texture per clipbox
		//since we need to switch out colors 
		glowMaterial = new THREE.SpriteMaterial( { 
			map: glowTexture,
			opacity:0.05,
			blending: THREE.AdditiveBlending,
			fog: true,
		} );


		glow = new THREE.Sprite( glowMaterial );
		var scl = 40;
		glow.scale.set(scl,scl,scl);
		group.add( glow );

		
	};


	this.set = function(clipData){

		//console.log(clipData);

		//set position and color from clip data
		this.start = clipData.start;

		group.position.copy(clipData.position);

		material.color = clipData.color;
		glowMaterial.color = clipData.color;

		//reset played
		this.played = false;

		var scl = ATUtil.randomRange(0.4,0.8) * clipData.size;
		group.scale.set(scl,scl,scl);

		//reset explosion
		mesh.scale.set(1,1,1);
		mesh2.scale.set(1,1,1);
		glow.scale.set(40,40,40);
		material.opacity = 0.15;
		glowMaterial.opacity = 0.05;

	};


	this.explode = function(){

		this.played = true;

		//pop it in
		var POP_TIME = 0.3;
		var scl1 = 6;//26;
		var scl2 = 3;//26;
		TweenMax.fromTo(mesh.scale,POP_TIME,{x:scl1,y:scl1,z:scl1},{x:1,y:1,z:1 });
		TweenMax.fromTo(mesh2.scale,POP_TIME,{x:scl2,y:scl2,z:scl2},{x:1,y:1,z:1,delay:0.2});
		TweenMax.fromTo(material,POP_TIME,{opacity:0.5},{opacity:0.1});

		var glowscl = 100;
		TweenMax.to(glow.scale,0.3,{x:glowscl,y:glowscl,ease:Expo.easeOut});
		TweenMax.fromTo(glowMaterial,1,{opacity:0.05},{opacity:0});

	};

	this.update = function(){
		mesh.rotation.z += 0.05;
		mesh2.rotation.z += 0.02;
	};


};
