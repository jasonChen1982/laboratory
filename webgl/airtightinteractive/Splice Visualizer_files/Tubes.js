/**
*
* Scream Tubes!!!!
*
**/

var Tubes = function() {

	var group;
	var tube;
	var tubeTexture;
	var material;

	var mytime = 0;

	function init(){

		events.on("update", update);

		group = new THREE.Object3D();
		SpliceMain.getVizHolder().add(group);

			
		//make 2 tubes for 'everybody scream'

		tubeTexture = THREE.ImageUtils.loadTexture("res/img/card2.jpg");
		tubeTexture.wrapS = tubeTexture.wrapT = THREE.RepeatWrapping;
		//tubeTexture.repeat.set( 1,12 );


		material = new THREE.MeshBasicMaterial( {
			//color: 0xFF00FF,
			wireframe: false,
			blending: THREE.AdditiveBlending,
			depthWrite:false,
			depthTest:false,
			transparent:true,
			opacity:0.4,
			side: THREE.BackSide,
			map:tubeTexture
			//map: ribbonTexture
		} );

		var controlPoints = [];
		var pointCount = 10;
		//var startPos = 72.5/SpliceViz.getDuration();
		var startPos = 72.5/SpliceViz.getDuration();
		var clipLen = 2.0/SpliceViz.getDuration();

		for ( var i = 0; i < pointCount; i ++ ) {
			var t = startPos + (clipLen/pointCount)*i;
			var point = SpliceViz.getSpline().getPoint(t);
			controlPoints.push(point);
		}

		//TubeGeometry(path, segments, radius, radiusSegments, closed)
		var splineCurve = new THREE.SplineCurve3(controlPoints);
		var tubeGeom = new THREE.TubeGeometry(splineCurve, pointCount * 2, 30, 32, false);
		tube = new THREE.Mesh( tubeGeom, material );
		group.add( tube );


		var controlPoints = [];
		var pointCount = 10;
		//var startPos = 72.5/SpliceViz.getDuration();
		var startPos = 162.5/SpliceViz.getDuration();
		var clipLen = 2.0/SpliceViz.getDuration();

		for ( var i = 0; i < pointCount; i ++ ) {
			var t = startPos + (clipLen/pointCount)*i;
			var point = SpliceViz.getSpline().getPoint(t);
			controlPoints.push(point);
		}

		//TubeGeometry(path, segments, radius, radiusSegments, closed)
		var splineCurve = new THREE.SplineCurve3(controlPoints);
		var tubeGeom = new THREE.TubeGeometry(splineCurve, pointCount * 2, 30, 32, false);
		tube = new THREE.Mesh( tubeGeom, material );
		group.add( tube );

	}

	function update() {

		mytime += 0.4;

		//lock skybox to camera posn
		//tube.rotation.x += 0.1;

		//tubeTexture.offset.y += 0.01;

		tubeTexture.offset.x = (tubeTexture.offset.x + 0.008 )% 1 ;
		tubeTexture.offset.y = (tubeTexture.offset.y + 0.002 )% 1 ;
		//SpliceMain.trace(tubeTexture.offset.x);
		//material.opacity = (Math.sin(mytime) + 1 )/2;

		//SpliceMain.trace(material.opacity);




		
	}


	return {
		init:init,
		update:update,
	};

}();