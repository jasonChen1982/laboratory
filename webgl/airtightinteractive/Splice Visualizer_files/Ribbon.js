/**
 * A Ribbon  - for a longer clip.
 * draws from start to end time
 */

var boxSize = 5;
var RibbonGeom = new THREE.BoxGeometry( boxSize, boxSize, boxSize );

var Ribbon = function() {

	this.played = false;
	this.startTime = 0;

	var hue;
	var color;
	var group;
	var material;
	var radius = 320;
	var thickness = 0.6;
	var mesh;

	var tube;
	
	this.init = function(startTime,endTime,trackColor,offset) {

		//events.on("update", this.update);

		group = new THREE.Object3D();
		SpliceMain.getVizHolder().add(group);

		var startPos = startTime/ SpliceViz.getDuration();
		var clipLen = (endTime - startTime) / SpliceViz.getDuration();
		this.startTime = startTime;

		//assign color, Ribbon color pos
		color = trackColor;

		material = new THREE.MeshBasicMaterial( {
			color: color,
			blending: THREE.AdditiveBlending,
			depthWrite:false,
			depthTest:false,
			transparent:true,
			opacity: ATUtil.randomRange(0.2,1)
			//map: ribbonTexture
			//wireframe: Math.random() < 0.5 
		} );
		
		var controlPoints = [];
		var noiseStrt = Math.random()*100;
		var pointCount = Math.floor(clipLen*1000);//increase for smoother ribbons


		//contant offset
		var dist = 30;
		var ang = Math.random()*Math.PI*2;
		var trackOffset = new THREE.Vector3( Math.cos(ang) * dist,
													Math.sin(ang) * dist,
													0);

		for ( var i = 0; i < pointCount; i ++ ) {

			var t = startPos + (clipLen/pointCount)*i;

			var point = SpliceViz.getSpline().getPoint(t);

			//lerp points around main spline
			// var lerpSpeed = 10;
			// var lerpAmnt = 20;//Math.abs(snoise.noise(t * 10,0) )* 20;

			// point.x += snoise.noise(t * lerpSpeed,noiseStrt) * lerpAmnt;
			// point.y += snoise.noise(t * lerpSpeed,noiseStrt + 100) * lerpAmnt;

			point.add(trackOffset);
			

			controlPoints.push(point);

		}

		splineCurve = new THREE.SplineCurve3(controlPoints);
		var thickness = Math.random()*2.4 + 0.8;
		var tubeGeom = new THREE.TubeGeometry(splineCurve, pointCount * 2, thickness, 2, false, true);
		tube = new THREE.Mesh( tubeGeom, material );
		group.add( tube );

	};

	this.update = function(){

		//console.log('pppp');
		//material.opacity = AudioHandler.getVolume();
		//tube.scale.z = AudioHandler.getVolume();
	};

};
