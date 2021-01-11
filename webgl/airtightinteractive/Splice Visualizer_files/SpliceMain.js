/**

Splice Viz 2 SpliceMain - 
main entry point, handles init 3d , resize

This Visulaizer move a camera along a randomly generated Spline.
Short notes are represented by ClipBoxes, longer notes are represented by Ribbons.

by @felixturner

**/


//GLOBAL
var events = new Events();
var snoise = new SimplexNoise();

//MAIN RMP
var SpliceMain = function() {

	var isMobile = false;

	var camera;
	var scene;
	var renderer;
	var stats;
	var vizHolder;

	var trackname = "scream";

	var panelShowing = false;

	function init() {

		//true for android or ios, false for MS surface
		isMobile = !!('ontouchstart' in window); 

		// stats = new Stats();
		// stats.domElement.style.position = 'absolute';
		// stats.domElement.style.top = '0px';
		// stats.domElement.style.right = '0px';		
		// $("body").append( stats.domElement );

		$("#info-btn").click(function(){

			panelShowing = !panelShowing;

			$("#info-panel").toggle();
			$("#overlay").toggle();
			$("#info-btn").text(panelShowing ? "BACK" : "ABOUT");

		});

		init3D();
		
		AudioHandler.init(trackname);
		FXHandler.init();
		SequenceHandler.init();
		//Story.init();

		Stars.init();
		SkyBox.init();
		

		//LOAD SEQENCE
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "res/"+ trackname + "/seq.json", 
			success: SpliceViz.onSequenceLoaded,
		});

		$("#play-btn").click(function(){
			AudioHandler.play();
		});


		$(window).resize(onResize);
		onResize();

		update();

		//on android setup first touch to request fullscreen		
		if (isMobile){
			$('body').click(function(){
				$('body')[0].webkitRequestFullscreen();
			});
		}

	}

	function onPlay(){
		TweenLite.to($("#play-btn"),0.3,{autoAlpha:0});
	}

	function init3D(){

		//RENDERER
		renderer = new THREE.WebGLRenderer({
			//antialias: true,
			//precision: "lowp"
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor ( 0x000000);
		renderer.sortObjects = false;
		$("body").append(renderer.domElement);

		//INIT 3D SCENE
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		scene = new THREE.Scene();
		scene.add(camera);
		scene.fog = new THREE.Fog( 0x000000, 0, 1200);
		vizHolder =  new THREE.Object3D();
		scene.add( vizHolder );

	}

	function update() {
		//stats.update();
		events.emit("update");
		requestAnimationFrame(update);
	}

	function trace(text){
		$("#debug-text").html(text);
	}

	function onResize(){
		var w = window.innerWidth; 
		var h = window.innerHeight;

		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
		events.emit("resize");

	}

	return {
		init:init,
		trace: trace,
		getVizHolder:function(){return vizHolder;},
		getCamera:function(){return camera;},
		getScene:function(){return scene;},
		getRenderer:function(){return renderer;},
		getIsMobile:function(){return isMobile;},
		onPlay:onPlay
		
	};

}();

$(document).ready(function() {
	SpliceMain.init();
});
