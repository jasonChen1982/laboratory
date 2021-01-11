/**
* Rails is the white line and rings and rects that camera flys along
*
**/


var Rails = function() {


	var group;

	var beatsPerSecond = 128/60; //TODO - get from json
	var beatTime = 1 / beatsPerSecond; //ms = 0.46875


	var RING_COUNT = 4;


	function init(){

		group = new THREE.Object3D();
		SpliceMain.getVizHolder().add(group);

		//crate track line
		var pointCount = 60 * 120;

		//LINE TRACK
		var trackMaterial = new THREE.LineBasicMaterial( { 
				color: 0xFFFFFF, 
				linewidth: 4, 
				blending: THREE.AdditiveBlending,
				depthWrite:false,
				transparent: true ,
				opacity:0.4
			} );

		var trackGeometry = new THREE.Geometry();

		//add a point behind the initial camera
		trackGeometry.vertices.push(new THREE.Vector3(0,0,-500));

		var splinePoints = SpliceViz.getSpline().getPoints(pointCount);
		for(var i = 0; i < splinePoints.length; i++){
		    trackGeometry.vertices.push(splinePoints[i]);  
		}

		var track = new THREE.Line( trackGeometry,  trackMaterial );
		track.frustumCulled = false;
		track.position.y = -5;		
		group.add( track );

		//BEAT RINGS

		//ring every 4 beats

		var beatsPerRing = 4;
		var numBeats = Math.floor(SpliceViz.getDuration()/(beatTime*beatsPerRing));
		var ringGeom = new THREE.RingGeometry ( 30, 30.5,64, 2 );
		var ringMat = new THREE.MeshBasicMaterial( { 
								color: 0xFFFFFF,
								opacity:0.3,
								transparent:true,
								blending : THREE.AdditiveBlending,
								depthTest:false,
								side: THREE.DoubleSide,

							} );


		for ( var i = 0; i< numBeats; i ++ ) {

			if (i %4 === 0) continue;

			var t = (i*beatTime*beatsPerRing)/SpliceViz.getDuration();
			var ring = new THREE.Mesh(ringGeom , ringMat );
			var pos = SpliceViz.getSpline().getPoint(t);
			ring.position.copy(pos);
			ring.lookAt(SpliceViz.getSpline().getPoint(t + 0.01));
			group.add( ring );

		}

		//4 squares every 16 beats

		var squareGeom = new THREE.RingGeometry ( 40, 40.5,4, 2 );
		beatsPerRing = 16;
		numBeats = Math.floor(SpliceViz.getDuration()/(beatTime*beatsPerRing));

		for ( var i = 0; i < numBeats; i ++ ) {
			var t = (i*beatTime*beatsPerRing)/SpliceViz.getDuration();
			for ( var j = 0; j < 4; j ++ ) {

				var ring = new THREE.Mesh( squareGeom, ringMat );
				var pos = SpliceViz.getSpline().getPoint(t + 0.0002*j);
				ring.position.copy(pos);
				ring.lookAt(SpliceViz.getSpline().getPoint(t + 0.0002*j + 0.01));
				group.add( ring );
			}

		}

	}

	return {
		init:init,
	};

}();