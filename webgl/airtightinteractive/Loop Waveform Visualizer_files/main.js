/**
 *
 * Loop Waveform Visualizer by Felix Turner
 * www.airtight.cc
 *
 * Audio Reactive Waveform via Web Audio API.
 *
 */

var mouseX = 0,
	mouseY = 0,
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	camera,
	scene,
	renderer,
	material,
	container;
var source;
var analyser;
var buffer;
var audioBuffer;
var dropArea;
var audioContext;
var source;
//var processor;
var analyser;
var xhr;
var started = false;

$(document).ready(function() {
	//Chrome is only browser to currently support Web Audio API
	var is_webgl = (function() {
		try {
			return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
		} catch (e) {
			return false;
		}
	})();

	if (!is_webgl) {
		$('#loading').html(
			'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />' +
				'Find out how to get it <a href="http://get.webgl.org/">here</a>, or try restarting your browser.'
		);
	} else {
		$('#loading').html('drop mp3 here or <a id="loadSample">load sample mp3</a>');
		init();
	}
});

function init() {
	//init 3D scene
	container = document.createElement('div');
	document.body.appendChild(container);
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000);
	camera.position.z = 350;
	scene = new THREE.Scene();
	scene.add(camera);
	renderer = new THREE.WebGLRenderer({
		antialias: false,
		sortObjects: false,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	// stop the user getting a text cursor
	document.onselectStart = function() {
		return false;
	};

	//add stats
	// stats = new Stats();
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.top = '0px';
	// container.appendChild(stats.domElement);

	//init listeners
	$('#loadSample').click(loadSampleAudio);
	$(document).mousemove(onDocumentMouseMove);
	$(window).resize(onWindowResize);
	document.addEventListener('drop', onDocumentDrop, false);
	document.addEventListener('dragover', onDocumentDragOver, false);

	onWindowResize(null);
}

function loadSampleAudio() {
	$('#loading').text('loading...');

	audioContext = new window.AudioContext();

	source = audioContext.createBufferSource();
	analyser = audioContext.createAnalyser();
	analyser.fftSize = 1024;
	analyser.smoothingTimeConstant = 0.1;

	// Connect audio processing graph
	source.connect(analyser);
	analyser.connect(audioContext.destination);

	loadAudioBuffer('audio/EMDCR.mp3');
}

function loadAudioBuffer(url) {
	// Load asynchronously
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function() {
		audioContext.decodeAudioData(
			request.response,
			function(buffer) {
				audioBuffer = buffer;
				finishLoad();
			},
			function(e) {
				console.log(e);
			}
		);
	};
	request.send();
}

function finishLoad() {
	source.buffer = audioBuffer;
	source.loop = true;
	source.start(0.0);
	startViz();
}

function onDocumentMouseMove(event) {
	mouseX = (event.clientX - windowHalfX) * 2;
	mouseY = (event.clientY - windowHalfY) * 2;
}

function onWindowResize(event) {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	render();
	//stats.update();
}

function render() {
	LoopVisualizer.update();

	//mouse tilt
	var xrot = mouseX / window.innerWidth * Math.PI + Math.PI;
	var yrot = mouseY / window.innerHeight * Math.PI + Math.PI;
	LoopVisualizer.loopHolder.rotation.x += (-yrot - LoopVisualizer.loopHolder.rotation.x) * 0.3;
	LoopVisualizer.loopHolder.rotation.y += (xrot - LoopVisualizer.loopHolder.rotation.y) * 0.3;

	renderer.render(scene, camera);
}

$(window).mousewheel(function(event, delta) {
	//set camera Z
	camera.position.z -= delta * 50;
});

function onDocumentDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	return false;
}

function onDocumentDrop(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	//clean up previous mp3
	if (source) source.disconnect();
	LoopVisualizer.remove();

	$('#loading').show();
	$('#loading').text('loading...');

	var droppedFiles = evt.dataTransfer.files;

	var reader = new FileReader();

	reader.onload = function(fileEvent) {
		var data = fileEvent.target.result;
		initAudio(data);
	};

	reader.readAsArrayBuffer(droppedFiles[0]);
}

function initAudio(data) {
	audioContext = new window.AudioContext();
	source = audioContext.createBufferSource();

	if (audioContext.decodeAudioData) {
		audioContext.decodeAudioData(
			data,
			function(buffer) {
				source.buffer = buffer;
				createAudio();
			},
			function(e) {
				console.log(e);
				$('#loading').text('cannot decode mp3');
			}
		);
	} else {
		source.buffer = audioContext.createBuffer(data, false);
		createAudio();
	}
}

function createAudio() {
	analyser = audioContext.createAnalyser();
	analyser.fftSize = 1024;
	analyser.smoothingTimeConstant = 0.1;
	source.connect(audioContext.destination);
	source.connect(analyser);
	source.start(0);
	source.loop = true;

	startViz();
}

function startViz() {
	$('#loading').hide();

	LoopVisualizer.init();

	if (!started) {
		started = true;
		animate();
	}
}
