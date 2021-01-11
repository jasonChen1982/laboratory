//UberViz Main v0.1
//Handles HTML and wiring data
//Using Three v60

//GLOBAL
var events = new Events();
var simplexNoise = new SimplexNoise();

//MAIN RMP
var UberVizMain = (function() {
	var stats;
	var windowHalfX;
	var windowHalfY;

	function init() {
		console.log('ÜberViz v0.1.0');

		if (!Detector.webgl) {
			Detector.addGetWebGLMessage();
		}

		//INIT DOCUMENT
		document.onselectstart = function() {
			return false;
		};

		document.addEventListener('drop', onDocumentDrop, false);
		document.addEventListener('dragover', onDocumentDragOver, false);
		window.addEventListener('keydown', onKeyDown, false);

		//STATS
		stats = new Stats();
		$('#controls').append(stats.domElement);
		stats.domElement.id = 'stats';

		if (ControlsHandler.vizParams.showControls) {
			$('#controls').show();
		}

		$('#play-btn').click(startMusic);

		//on android setup first touch to request fullscreen
		// var isMobile = !!('ontouchstart' in window);
		// if (isMobile){
		// 	$('body').click(function(){
		// 		$('body')[0].webkitRequestFullscreen();
		// 	});
		// }
	}

	function startMusic() {
		//INIT HANDLERS
		AudioHandler.init();
		ControlsHandler.init();
		VizHandler.init();
		FXHandler.init();
		window.addEventListener('resize', onResize, false);
		onResize();
		update();
		$('#intro').hide();
		$('#info').show();
		started = true;
	}

	var started = false;

	function update() {
		requestAnimationFrame(update);
		stats.update();
		events.emit('update');
	}

	function onDocumentDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		return false;
	}

	//load dropped MP3
	function onDocumentDrop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		if (!started) startMusic();
		AudioHandler.onMP3Drop(evt);
	}

	function onKeyDown(event) {
		switch (event.keyCode) {
			case 32 /* space */:
				AudioHandler.onTap();
				break;
			case 81 /* q */:
				toggleControls();
				break;
		}
	}

	function onResize() {
		VizHandler.onResize();
	}

	function trace(text) {
		$('#debugText').text(text);
	}

	function toggleControls() {
		ControlsHandler.vizParams.showControls = !ControlsHandler.vizParams.showControls;
		$('#controls').toggle();
		VizHandler.onResize();
	}

	return {
		init: init,
		trace: trace,
	};
})();

$(document).ready(function() {
	UberVizMain.init();
});
