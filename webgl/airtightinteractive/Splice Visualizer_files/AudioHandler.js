//UberViz AudioHandler handles Audio loading and Playback
//Handles Audio Analysis + publishes audio data

var AudioHandler = function() {

	var levelsData = []; //levels of each frequecy - from 0 - 1 . no sound is 0. Array [levelsCount]
	var volume = 0; // averaged normalized level from 0 - 1
	var smoothedVolume = 0; // averaged normalized level from 0 - 1 smoothed

	var freqByteData; //bars - bar data is from 0 - 256 in 512 bins. no sound is 0;
	var levelsCount = 16; //should be factor of 512

	var binCount; //512
	var levelBins;

	var isPlayingAudio = false;

	var source;
	var buffer;
	var audioBuffer;
	var audioContext;
	var processor;
	var analyser;

	function init(trackname) {

		//EVENT HANDLERS
		events.on("update", update);

		//Get an Audio Context
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			audioContext = new window.AudioContext();
		} catch(e) {
			//Web Audio API is not supported in this browser
			$("#warning").show();
			$("#warning").html("Sorry!<br>This browser does not support the Web Audio API. <br>Please use Chrome, Safari or Firefox.");
			return;
		}

		audioElement = document.getElementById( 'audio-elem' );
		audioElement.setAttribute('preload','auto');
		audioElement.setAttribute('src',"res/"+ trackname + "/"+ trackname + ".mp3");
		audioElement.addEventListener("seeked", onSeeked, true);
		audioElement.addEventListener("playing", onPlaying, true);

		//DEBUG
		//audioElement.muted = true;

		analyser = audioContext.createAnalyser();
		analyser.smoothingTimeConstant = 0.3; //smooths out bar chart movement over time
		analyser.fftSize = 1024;

		binCount = analyser.frequencyBinCount; // = 512
		analyser.connect(audioContext.destination);

		levelBins = Math.floor(binCount / levelsCount); //number of bins in each level

		freqByteData = new Uint8Array(binCount);

		loadAudioElement();

	}

	function play(){
		audioElement.play();
	}

	function onPlaying(){		
		SpliceMain.onPlay();
	}

	//load audio element on page
	function loadAudioElement(){

		// audioElement.setAttribute('id','audioElem');
		audioElement.setAttribute('autoplay','autoplay');
		audioElement.setAttribute('controls','controls');
		audioElement.preservespitch = false;

		source = audioContext.createMediaElementSource( audioElement);
		source.connect(analyser);

		audioElement.pause();
		audioElement.loop = false;
		isPlayingAudio = true;

		console.log(source);

	}

	function stopSound(){
		isPlayingAudio = false;
		if (source) {
			source.stop(0);
			source.disconnect();
		}
	}

	//called every frame
	//update published viz data
	function update(){

		if (audioElement.paused || audioElement.muted) {
			volume = 0;
			smoothedVolume = 0;
			return;
		}

		var i, j, sum;

		//GET DATA
		analyser.getByteFrequencyData(freqByteData); //<-- bar chart

		//normalize levelsData from freqByteData
		for(i = 0; i < levelsCount; i++) {
			sum = 0;
			for(j = 0; j < levelBins; j++) {
				sum += freqByteData[(i * levelBins) + j];
			}
			levelsData[i] = sum / levelBins/256 ; //freqData maxs at 256

		}

		//GET AVG LEVEL
		sum = 0;
		for(j = 0; j < levelsCount; j++) {
			sum += levelsData[j];
		}

		volume = sum / levelsCount;

		smoothedVolume += (volume - smoothedVolume)/5;

	}

	function setSmoothing(e){
		analyser.smoothingTimeConstant = e;

	}

	function onSeeked(event){
		events.emit("seeked");
	}

	return {
		update:update,
		init:init,
		getVolume: function() { return volume;},
		getSmoothedVolume: function() { return smoothedVolume;},
		setSmoothing:setSmoothing,
		getAudioTime: function() { return audioElement.currentTime;},
		play:play,
	};

}();