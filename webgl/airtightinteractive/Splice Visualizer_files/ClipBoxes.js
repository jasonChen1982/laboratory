/**
* ClipBoxes handles all clip boxes. 
* Pulls active clipboxes from clipbox pool
*
**/


var ClipBoxes = function() {

	var group;
	var BOX_COUNT = 100;
	var pool = []; //pool for 3D ClipBox objects
	var clips = [];// clip data objects
	var clipCount;
	var nextClipIndex = 0;


	function init(){

		//init event listeners
		events.on("update", update);
		events.on("seeked", seeked);

		group = new THREE.Object3D();
		SpliceMain.getVizHolder().add(group);

		//create a pool of reusable clipBoxes
		for (i = 0; i < BOX_COUNT; i++) {
			var clipBox = new ClipBox();
			clipBox.init();
			pool.push(clipBox);
		}

	}

	function onClipsCreated(){
		clipCount = clips.length;
		//sort clips by start time
		clips.sort(function(a, b) {
		  return a.start - b.start;
		});
		nextClipIndex = 0;
		//populate first 100 boxes
		seeked();
	}

	function addClip(startTime, trackId){

		//create a clip data object
		var songPos = startTime/SpliceViz.getDuration();
		var pos = SpliceViz.getSpline().getPoint(songPos );

		//add track offset
		pos.add(SpliceViz.getTracks()[trackId].offset);

		var clip = ({start: startTime, 
						color: SpliceViz.getTracks()[trackId].color,
						position:pos,
						size:SpliceViz.getTracks()[trackId].size});

		clips.push(clip);

	}

	function update() {

		//loop thru all clips
		var currentTime = AudioHandler.getAudioTime();
		var camTime = currentTime - 2;

		for (i = 0; i < BOX_COUNT; i++) {

			var box = pool[i];

			//EXPLODE STUFF
			if (!box.played && currentTime > box.start){
				box.explode();
			}

			//if clip t behind audio t - reset to front
			if ( camTime > box.start && nextClipIndex < clipCount){

				//reset box to be 100 boxes away
				box.set(clips[nextClipIndex]);
				nextClipIndex++;
			}

			box.update();

		}

	}

	function getNextClipIndexFromTime(time){


		//console.log('getNextClipIndexFromTime', time);

		for (i = 0; i < clipCount; i++) {
			if (clips[i].start <= time){

				return(i);
			}
		}

		//if at start of track and no clips happened yet, return 0
		return(0);
	}


	function seeked() {

		var time = AudioHandler.getAudioTime();

		//create 100 clipboxes infront of camera based on audiotime
		nextClipIndex = getNextClipIndexFromTime(time);

		//console.log('nextClipIndex', nextClipIndex);

		for (i = 0; i < BOX_COUNT; i++) {

			var box = pool[i];
		
			box.set(clips[nextClipIndex]);
			nextClipIndex++;

			if (nextClipIndex >= clipCount){
				break;
			}
			
		}

	}


	return {
		init:init,
		update:update,
		onClipsCreated:onClipsCreated,
		addClip:addClip

	};

}();