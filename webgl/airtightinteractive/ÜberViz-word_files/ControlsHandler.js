//UberViz ControlsHandler
//Handles side menu controls

var ControlsHandler = function() {

	var audioParams = {
		useMic: false,
		useSample: true,
		showDebug:true,
		volSens:1,
		beatHoldTime:40,
		beatDecayRate:0.97,
		bpmMode: false,
		bpmRate:0,
		sampleURL: "res/mp3/Word_Problems_Edit.mp3"
	};

	var vizParams = {
		fullSize: true,
		showControls: false,
		// useBars: false,
		// useGoldShapes: true,
		// useNebula:true,
		// useNeonShapes:true,
		// useStripes:true,
		// useTunnel:true,
		// useWaveform:true,
	};

	var fxParams = {
		glow: 1.0
	};

	function init(){

		//Init DAT GUI control panel
		gui = new dat.GUI({autoPlace: false });
		$('#settings').append(gui.domElement);

		var f2 = gui.addFolder('Audio');
		f2.add(audioParams, 'useMic').listen().onChange(AudioHandler.onUseMic).name("Use Mic");
		//f2.add(audioParams, 'useSample').listen().onChange(AudioHandler.onUseSample);
		f2.add(audioParams, 'volSens', 0, 10).step(0.1).name("Gain");
		f2.add(audioParams, 'beatHoldTime', 0, 100).step(1).name("Beat Hold");
		f2.add(audioParams, 'beatDecayRate', 0.9, 1).step(0.01).name("Beat Decay");
		// f2.add(audioParams, 'bpmMode').listen();
		// f2.add(audioParams, 'bpmRate', 0, 4).step(1).listen().onChange(AudioHandler.onChangeBPMRate);
		f2.open();

		//var f5 = gui.addFolder('Viz');
		//f5.add(fxParams, 'Full', 0, 4).listen().onChange(AudioHandler.onUseMic);
		var f5 = gui.addFolder('FX');
		f5.add(fxParams, 'glow', 0, 4).step(0.1);
		//f5.open();


		var f6 = gui.addFolder('Viz');
		f6.add(vizParams, 'fullSize').listen().onChange(VizHandler.onResize).name("Full Size");
		//f5.open();


		// var f6 = gui.addFolder('Bloom');
		// for (var propertyName in bloomParams) {
		// 	f6.add(bloomParams,propertyName)
		// }

		AudioHandler.onUseMic();
		AudioHandler.onUseSample();
		AudioHandler.onShowDebug();

	}

	return {
		init:init,
		audioParams: audioParams,
		fxParams: fxParams,
		vizParams:vizParams
	};
}();