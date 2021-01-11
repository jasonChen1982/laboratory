/*

	3D UI demo based on http://www.liift.ca/tesla-emsx-interface
	Simple geometry with hi-rez textures 
	Trackball contrils and custom tilt shift shader
	by @felixturner / airtight.cc

*/

/* global THREE, Stats, window, document, requestAnimationFrame */

var camera, scene, renderer;
var stats;

var camGroup;
var ring01Mesh;
var ring02Mesh;
var frontPanelMesh;
var faceMaterial;

var canvas;
var ctx;
var labelTexture;
var FACE_CANVAS_DIM = 1024;

var postprocessing = {};

var guiParams  = {

	scale: 1  ,
	fov:75,
	tiltFocus: 0.5,
	tiltAmount: 0.006,
	tiltBrightness: 0.65,
	showFace: true,

};

var clickSnd;
var heading = 58;

function init() {

	//init GUI				
	var gui = new dat.GUI();
	gui.add( guiParams, "scale", 0.01, 3.0, 1 ).onChange( onParamsChange );
	gui.add( guiParams, "fov", 25, 125, 75 ).onChange( onParamsChange );
	gui.add( guiParams, "tiltFocus", 0, 1, 0.5 ).onChange( onParamsChange );
	gui.add( guiParams, "tiltAmount", 0, 0.02, 0.005 ).onChange( onParamsChange );
	gui.add( guiParams, "tiltBrightness", 0, 2, 0.5 ).onChange( onParamsChange );
	gui.add( guiParams, "showFace").onChange( onParamsChange );
	gui.close();

	//init 3D world
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 600;
	scene = new THREE.Scene();

	//renderer
	renderer = new THREE.WebGLRenderer();// {antialias: true});
	renderer.setPixelRatio( window.devicePixelRatio );
	document.body.appendChild( renderer.domElement );

	//make geometry
	camGroup = new THREE.Object3D();
	scene.add( camGroup );


	camGroup.rotation.x = Math.PI/2;
	camGroup.rotation.z = Math.PI/4;

	//INNER CYLINDERS

	//ring01 - outer dots
	var ring01Geom = new THREE.CylinderGeometry( 300,300, 310, 60, 1, true);
	var texture = new THREE.Texture();
	var textureLoader = new THREE.TextureLoader();
	texture = textureLoader.load('img/ring01.png');
	texture.minFilter  =  THREE.LinearFilter;
	texture.maxFilter  =  THREE.LinearFilter;

	var ring01Material = new THREE.MeshBasicMaterial( {

		map: texture,
		transparent: true,
		side: THREE.DoubleSide,
		depthTest:false,
		depthWrite: false,
		blending: THREE.AdditiveBlending


	} );

	ring01Mesh = new THREE.Mesh( ring01Geom, ring01Material );
	camGroup.add( ring01Mesh );
	ring01Material.map.wrapS = THREE.RepeatWrapping;
	ring01Material.map.repeat.x = 60;

	//ring02 - horizontal orange ring
	var ring02Geom = new THREE.CylinderGeometry( 240,240, 30, 120, 1, true);
	var ring02Material = new THREE.MeshBasicMaterial( {

		map: textureLoader.load('img/h-ring.png'),
		transparent: true,
		side: THREE.DoubleSide,
		depthTest:false,
		depthWrite: false,
		blending: THREE.AdditiveBlending,

	} );

	ring02Mesh = new THREE.Mesh( ring02Geom, ring02Material );
	camGroup.add( ring02Mesh );
	ring02Mesh.position.y = 135;

	//FRONT FACE
	var frontPanelGeom = new THREE.PlaneGeometry( 340,340, 1, 1);
	faceMaterial = new THREE.MeshBasicMaterial( {

		map: textureLoader.load('img/empty.gif'), //dummy img load
		transparent: true,
		side: THREE.DoubleSide,
		depthTest:false,
		depthWrite: false,
		blending: THREE.AdditiveBlending,

	} );

	frontPanelMesh = new THREE.Mesh( frontPanelGeom, faceMaterial );
	camGroup.add( frontPanelMesh );
	frontPanelMesh.position.y = 135;
	frontPanelMesh.rotation.x = -Math.PI/2;

	//OUTER PLANES
	//outerRing01 -orang segments
	var outerRing01Geom = new THREE.PlaneGeometry( 1000,1000, 1, 1);
	outerRing01Material = new THREE.MeshBasicMaterial( {
		map: textureLoader.load('img/outer01.jpg'),
		transparent: true,
		side: THREE.DoubleSide,
		depthTest:false,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		opacity:0.8

	} );
	outerRing01Mesh = new THREE.Mesh( outerRing01Geom, outerRing01Material );
	camGroup.add( outerRing01Mesh );
	outerRing01Mesh.position.y = -55;
	outerRing01Mesh.rotation.x = -Math.PI/2;

	//outerRing02 - grey
	var outerRing02Geom = new THREE.PlaneGeometry( 1000,1000, 1, 1);
	outerRing02Material = new THREE.MeshBasicMaterial( {
		map: textureLoader.load('img/outer02.png'),
		transparent: true,
		side: THREE.DoubleSide,
		depthTest:false,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		opacity: 0.6
	} );
	outerRing02Mesh = new THREE.Mesh( outerRing02Geom, outerRing02Material );
	camGroup.add( outerRing02Mesh );
	outerRing02Mesh.position.y = -95;
	outerRing02Mesh.rotation.x = -Math.PI/2;

	//TOP SKINNY ring
	//ring02 - horizontal orange ring
	var ring03Geom = new THREE.CylinderGeometry( 500,500, 30, 120, 1, true);
	ring03Material = new THREE.MeshBasicMaterial( {

		map: textureLoader.load('img/top01.png'),
		transparent: true,
		side: THREE.DoubleSide,
		depthTest:false,
		depthWrite: false,
		blending: THREE.AdditiveBlending,

	} );

	ring03Mesh = new THREE.Mesh( ring03Geom, ring03Material );
	camGroup.add( ring03Mesh );
	ring03Mesh.position.y = 140;
	ring03Material.map.wrapS = THREE.RepeatWrapping;
	ring03Material.map.repeat.x = 240;

	//stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	//TRACKBALL CONTROLS
	controls = new THREE.TrackballControls( camera , renderer.domElement );
	controls.noZoom = true;
	controls.noPan = true;

	initPostprocessing();

	onParamsChange();

	//listeners
	window.addEventListener( 'resize', onResize, false );
	onResize();
	window.addEventListener("mousewheel", onWheel, true);


	clickSnd = new Howl({urls: ['click.mp3']});

	initLabel();

	setTimeout(function(){
		drawLabel(heading); //wait for font to load
	}, 1000);

	animate();

	
}

function onParamsChange () {

	postprocessing.tilt.uniforms.focusPos.value = guiParams.tiltFocus;
	postprocessing.tilt.uniforms.amount.value = guiParams.tiltAmount;
	postprocessing.tilt.uniforms.brightness.value = guiParams.tiltBrightness;

	camera.fov = guiParams.fov;
	camera.updateProjectionMatrix();

	if (camGroup) camGroup.scale.set(guiParams.scale,guiParams.scale,guiParams.scale);

	if (frontPanelMesh) {
		frontPanelMesh.visible = guiParams.showFace;

	}

}

function animate() {

	requestAnimationFrame( animate );
	stats.update();
	controls.update();
	postprocessing.composer.render( 0.1 );
}

function onResize() {

	var width = window.innerWidth;
	var height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
	postprocessing.composer.setSize( width, height );

	controls.handleResize();
}

function initPostprocessing() {

	var width = window.innerWidth;
	var height = window.innerHeight;

	var renderPass = new THREE.RenderPass( scene, camera );
	var tiltShiftPass = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );
	var composer = new THREE.EffectComposer( renderer );

	composer.addPass( renderPass );
	composer.addPass( tiltShiftPass );
	tiltShiftPass.renderToScreen = true;

	postprocessing.composer = composer;
	postprocessing.tilt = tiltShiftPass;

}

function onWheel(event){
	event.stopPropagation();
	var dir = (event.wheelDelta > 0 ) ? 1 : -1;
	turnRing(dir);
}

function turnRing(dir){

	if (dir === undefined) dir = 1;

	//do a click
	heading += dir;
	var turnAng = Math.PI  / 180 * dir;

	//wrap
	var topVal = 360;
	if (heading === -1) heading = topVal - 1;
	if (heading === topVal) heading = 0;

	ring01Mesh.rotation.y -= turnAng;
	ring02Mesh.rotation.y += turnAng*2;
	outerRing01Mesh.rotation.z -= turnAng;
	outerRing02Mesh.rotation.z += turnAng;

	drawLabel(heading);
	clickSnd.play();
}

function initLabel(){

	//write label text on canvas and use as meterial
	canvas = document.createElement('canvas');
	canvas.width  = FACE_CANVAS_DIM;
	canvas.height = FACE_CANVAS_DIM;
	ctx = canvas.getContext('2d');
	labelTexture = new THREE.Texture(canvas);

	faceMaterial.map = labelTexture;

	//debug canvas
	//document.body.appendChild( canvas); 
	//canvas.style.position = 'absolute';
	//canvas.style.top = '0px';
	//canvas.style.left = '0px';
}

function drawLabel(num){
	
	//debug background
	//ctx.fillStyle = '#FF00FF';
	//ctx.fillRect(0,0,1024,1024);

	ctx.clearRect(0, 0, FACE_CANVAS_DIM, FACE_CANVAS_DIM);

	//small text
	ctx.textBaseline = 'top';
	ctx.fillStyle = '#FFFFFF';
	ctx.font = '400 90px Roboto';
	ctx.fillText( 'H E A D I N G', 140, 220);

	//big number
	if (num < 10) num = '0' + num;
	var fontSize = num < 100 ? '600px' : '460px';
	var topPos = num < 100 ? 220 : 260;	
	ctx.font = '500 ' + fontSize + ' Roboto';		
	ctx.fillText( num + '°', 65, topPos);
	
	labelTexture.needsUpdate = true;

}

//on document load
if (document.readyState != 'loading'){
	init();
} else {
	document.addEventListener('DOMContentLoaded', init);
}
