/**
* Scream Sequence
*/

var Sequence = function() {

	var elements = 	

	[
		{ start:0, name:"start"},
		{ start:30.00, name: "levels-on"},
		
		{ start:67.50, name: "strobe-on"},
		{ start:71.29, name: "strobe-fast"},
		//{ start:73.09, name: "strobe-off"},
		{ start:75.09, name: "strobe-off"},

		//{ start:73.09, name: "shake-on"},
		//{ start:75.09, name: "shake-off"},

		{ start:105.00, name: "levels-off"},
		{ start:120.00, name: "levels-on"},

		{ start:157.50, name: "strobe-on"},
		{ start:161.29, name: "strobe-fast"},
		//{ start:163.09, name: "strobe-off"}
		{ start:165.09, name: "strobe-off"}

	];


	function init(){
		events.on("sequenceEvent", handleEvent);

	}

	function handleEvent(name){

		switch(name){

			case "start":
				FXHandler.fxParams.audioLevels = false;
				FXHandler.fxParams.strobe = false;
				FXHandler.fxParams.shakeAmount = 0;
				break;
			
			case "levels-on":
				FXHandler.fxParams.audioLevels = true;
				FXHandler.fxParams.strobe = false;
				break;

			case "strobe-on":
				FXHandler.fxParams.strobe = true;
				FXHandler.fxParams.strobePeriod = 12;
				break;

			case "strobe-fast":
				FXHandler.fxParams.strobe = true;
				FXHandler.fxParams.strobePeriod = 6;
				break;

			case "strobe-off":
				FXHandler.fxParams.strobe = false;
				break;

			case "shake-on":
				FXHandler.fxParams.shakeAmount = 0.2;
				break;

			case "shake-off":
				FXHandler.fxParams.shakeAmount = 0;
				break;

			case "levels-off":
				FXHandler.fxParams.audioLevels = false;
				FXHandler.fxParams.strobe = false;
				break;
		
		
		}
	}


	return {
		elements:elements,
		init:init
	};

}();
