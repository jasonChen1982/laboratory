/**
	Creates Clip boxes + ribbons based on splice seq
	Handles mouse controls
**/


var SpliceViz = function() {

	var splineCurve;
	var mover;
	var seqHolder;

	//seq data
	var trackDuration;	

	var tracks = [];

	//var CAMERA_LAG_OFFSET = 0.0042;
	var CAMERA_LAG_OFFSET = 0.0038;

	//handpicked nice hues (0 - 360)
	//var hues = [71,342,315,284,185,138];
	var hues = [71,342,284,185,138];

	var mousePos = new THREE.Vector2(0,0);
	var camOffset = new THREE.Vector2(0,0);
	var mouseDown = false;
	var CAM_RANGE = 70;

	var TRACK_OFFSET = 0;//2;//2; //add 2 seconds of silence at start off track

	function onSequenceLoaded(data){

		console.log("onSequenceLoaded");

		//console.log(data);

		sequence = data;

		trackDuration = data.duration + TRACK_OFFSET;


		console.log('trackDuration',trackDuration);
		var trackData = data.tracks;

		//parse json + create clip obj3ects

		seqHolder =  new THREE.Object3D();
		SpliceMain.getVizHolder().add( seqHolder );

		createSpline();

		Rails.init();
		Tubes.init();
		LightLeak.init();

		initControls();

		//create mover triangle
		var geom = new THREE.RingGeometry ( 30, 50,3, 2 );
		var mat = new THREE.MeshBasicMaterial( { 
											color: 0xFFFFFF,
											wireframe: true,
											opacity:0.2,
											transparent:true,
											side: THREE.DoubleSide
										} );	

		mover = new THREE.Mesh( geom, mat );
		mover.frustumCulled = false;
		mover.scale.multiplyScalar(0.2);
		seqHolder.add( mover );

		ClipBoxes.init();

		//create tracks

		console.log("Create " + trackData.length + " trackData");

		var trackIndex = 0;
		var clipCount = 0;
		var ribbonCount = 0;

		$.each( trackData, function( i, track ) {

			trackIndex ++;


			//if (track.id !== 161) return;

			//one hue per track
			
			var trackCol = new THREE.Color();
			//pick hue from predefined set

			var r = ATUtil.randomInt(0,hues.length-1);
			//console.log(r);

			hue = hues[r]/360;


			
			//hue = hues[trackIndex % hues.length]/360;
			//hue = Math.random();
			trackCol.setHSL(hue,1,0.6);

			//create random track offset posn
			//var MAX_TRACK_OFFSET = 40;

			//var xOff = ATUtil.randomRange(30,20);
			//var yOff = ATUtil.randomRange(30,20);

			//var trackOffset = new THREE.Vector3( Math.random() < 0.5 ? -xOff : xOff,
			//										Math.random() < 0.5 ? -yOff : yOff,
			//										0);


			//tracks should have constant distance from center
			var dist = 30;
			var ang = Math.random()*Math.PI*2;

			var trackOffset = new THREE.Vector3( Math.cos(ang) * dist,
													Math.sin(ang) * dist,
													0);

			var size = track.size;
			if (!size ) size = 1;

			//console.log(size);

			//save track data for clipbox object pool
			tracks.push({offset: trackOffset, color: trackCol, size: size});

			$.each( track.clips, function( j, clip ) {



				var clipLen = clip.end - clip.start;

				if (clipLen <= 0){

					console.log("0 clip len, track id: " + track.id);

				} else if (clip.notes && clip.notes.length > 1){

					//midi clip with > 1 notes

					$.each( clip.notes, function( k, note ) {

						ClipBoxes.addClip(clip.start + note.from/1000 + TRACK_OFFSET,i);
						clipCount++;

					});


				}else{
					//audio clip
					if (clipLen < 4  ){

						//console.log(clip.start);

						//create a clip floating alongside the track
						ClipBoxes.addClip(clip.start + TRACK_OFFSET,i);

						clipCount++;

					} else{

						//for longer clips
						//draw a ribbon
						var ribbon = new Ribbon();
						ribbon.init(clip.start + TRACK_OFFSET, clip.end + TRACK_OFFSET, trackCol.clone(),trackOffset);
						ribbonCount ++;

					}

				}

			});


			
		});


		ClipBoxes.onClipsCreated();
		
		console.log("Created " + clipCount + " clips");
		console.log("Created " + ribbonCount + " ribbons");

		camRot = 0;

		events.on("update", onUpdate);
		events.on("seeked", onUpdate);

		//fade up
		TweenLite.fromTo(FXHandler.fxParams , 1, {brightness:-1},{brightness:0});

	}

	function onUpdate() {

		var currentTime = AudioHandler.getAudioTime();

		var songPos = currentTime/trackDuration;

		//cam lags behind
		//TODO - vary lag time?
		
		// var camPos = Math.max(0,songPos - CAMERA_LAG_OFFSET);

		// SpliceMain.getCamera().position.copy(splineCurve.getPoint(camPos));

		// //add extra z cam movement at start of song
		// if (camPos === 0){
		// 	SpliceMain.getCamera().position.z = 600 * 60 * ( songPos - CAMERA_LAG_OFFSET) + 600;
		// }


		var camPos = songPos - CAMERA_LAG_OFFSET;


		if (camPos < 0){
			SpliceMain.getCamera().position.copy(splineCurve.getPoint(0));
			//do fake motion at start off track when cam is off the spline
			SpliceMain.getCamera().position.z += camPos * 30000;

			


		}else{

			SpliceMain.getCamera().position.copy(splineCurve.getPoint(camPos));

		}

		//cam motions@@@!!!!

		//if (mouseDown){


			//smoothedVolume += (volume  - smoothedVolume) * 0.1;

			camOffset.x += (mousePos.x - camOffset.x) * 0.1;
			camOffset.y += (mousePos.y - camOffset.y) * 0.1;

			//SpliceMain.getCamera().position.y += mousePos.x * 200;
			//SpliceMain.getCamera().position.x += mousePos.y * 200;

		//}else{

			//camOffset.x += ( - camOffset.x) * 0.1;
			//camOffset.y += ( - camOffset.y) * 0.1;


		//}

		SpliceMain.getCamera().position.x += camOffset.x * CAM_RANGE;
		SpliceMain.getCamera().position.y += camOffset.y * CAM_RANGE;


		SpliceMain.getCamera().lookAt(splineCurve.getPoint(songPos + 0.00001 ));
		SpliceMain.getCamera().rotation.z = snoise.noise(songPos*20,0,0)* Math.PI;

		//SpliceMain.trace(SpliceMain.getCamera().position.z);

		//move mover traingle
		mover.position.copy(splineCurve.getPoint(songPos ));
		mover.lookAt(splineCurve.getPoint(songPos + 0.01));
		mover.position.y -= 5;	// put on track
		mover.rotation.z = snoise.noise(songPos*30,100,0)* Math.PI;
		//var scl = AudioHandler.getSmoothedVolume()*0.1 + 0.2;
		//mover.scale.set(scl,scl,scl);


		//SpliceMain.trace(SpliceMain.getCamera().position.z);

	}

	function createSpline(){

		//create a random spline for camera motion + rails
		
		var controlPoints = [];

		//at each step move forward fixed amount and side step randomly in x + y
		//incremental
		var ZSTEP = 700; //900
		var MAX_RAILS_SIDE_STEP = 300;		
		var CONTROL_COUNT = 40;

		var lastPos = new THREE.Vector3();
		for ( var i = 0; i < CONTROL_COUNT; i ++ ) {
			lastPos.x = ATUtil.randomRange(-MAX_RAILS_SIDE_STEP,MAX_RAILS_SIDE_STEP);
			lastPos.y = ATUtil.randomRange(-MAX_RAILS_SIDE_STEP,MAX_RAILS_SIDE_STEP);
			lastPos.z += ZSTEP;
			controlPoints.push(lastPos.clone());
		}

		//put first CPs in strait Z line to make fake cam motion at start better
		controlPoints[0].set(0,0,ZSTEP);
		controlPoints[1].set(0,0,ZSTEP*2);

		//console.log(controlPoints);

		splineCurve = new THREE.SplineCurve3(controlPoints);


		//create a camera start vec3


	}

	

	function initControls(){

		//$('body').on( 'mousedown', onMouseDown);
		//$('body').on( 'mouseup',   onMouseUp);
		//$('body').on( 'mouseout', onMouseUp );
		$('body').on( 'mousemove', onMouseMove );
		//$('body').on(  'touchstart', onTouchStart );
		//$('body').on(  'touchend', onMouseUp );
		$('body').on(  'touchmove', onTouchMove );

	}

	function onMouseMove(event) {

		//if (!mouseDown) return;

		//convert to range -1 - 0 - 1 based on distance from center
		mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}

	// function onMouseDown(event) {
	// 	mouseDown = true;
	// 	onMouseMove(event);
	// }

	// function onMouseUp() {
	// 	mouseDown = false;
	// 	mousePos.set(0,0);
	// }

	function onTouchStart( event ) {
		onMouseMove( event.touches[ 0 ]);
		onMouseDown( event.touches[ 0 ]);
	}

	function onTouchMove( event ) {
		event.preventDefault();
		event.stopPropagation();
		onMouseMove(event.touches[ 0 ]);
	}

	return {
		onSequenceLoaded:onSequenceLoaded,
		getDuration:function(){return trackDuration;},
		getSpline:function(){return splineCurve;},
		getBeatTime:function(){return beatTime;},
		getTracks:function(){return tracks;},
		getMoverPos:function(){ return mover.position;}

	};



}();