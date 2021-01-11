/**
* UberViz SequenceHandler
* Reads sequence from Sequence.js
* Fires events when the mp3 time hits a mark
*
**/

var SequenceHandler = function() {

	var lastTime;
	var nextElementId;

	function init(){
		Sequence.init();
		events.on("update", update);
		nextElementId = 0;		
	}

	function update() {

		var currentTime = AudioHandler.getAudioTime();

		if ( currentTime < lastTime){
			reset();
			return;
		}

		//check for next event
		if (Sequence.elements[ nextElementId ]){
			var element = Sequence.elements[ nextElementId ];

			if ( element.start < currentTime ) {
				//fire event
				//console.log("SEQUENCE fire: " , element.name , element.start , currentTime);
				events.emit("sequenceEvent",element.name);
				nextElementId++;
			}
		}

		lastTime = currentTime;

	}

	function reset(){
		nextElementId = 0;
		lastTime = 0;
	}

	return {
		init: init,
		update: update,
		getSequence: function() { return sequence;},
		getDuration: function() { return duration;},
	};

}();