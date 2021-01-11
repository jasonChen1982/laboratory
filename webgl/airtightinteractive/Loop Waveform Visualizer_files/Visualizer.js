var LoopVisualizer = (function() {

	var RINGCOUNT = 60;
	var SEPARATION = 30;
	var INIT_RADIUS = 50;
	var SEGMENTS = 512;
	var VOL_SENS = 2;
	var BIN_COUNT = 512;

	var rings = [];
	//var geoms = [];
	var materials = [];
	
	var levels = [];
	//var waves = [];
	var colors = [];

	var loopHolder = new THREE.Object3D();
	var perlin = new ImprovedNoise();
	var noisePos = 0;
	var freqByteData;
	var timeByteData;

	var loopGeom;//one geom for all rings


	function init() {

		rings = [];
		geoms = [];
		materials = [];
		levels = [];
		//waves = [];
		colors = [];

		////////INIT audio in
		freqByteData = new Uint8Array(BIN_COUNT);
		timeByteData = new Uint8Array(BIN_COUNT);

		scene.add(loopHolder);

		var scale = 1;
		var alt = 0;

		var circleShape = new THREE.Shape();
		circleShape.absarc( 0, 0, INIT_RADIUS, 0, Math.PI*2, false );
		//createPointsGeometry returns (SEGMENTS * 2 )+ 1 points
		loopGeom = circleShape.createPointsGeometry(SEGMENTS/2); 
		loopGeom.dynamic = true;

		//create rings
		for(var i = 0; i < RINGCOUNT; i++) {

			var m = new THREE.LineBasicMaterial( { color: 0xffffff,
				linewidth: 1 ,
				opacity : 1,
				blending : THREE.AdditiveBlending,
				//depthTest : false,
				transparent : true

			});

			var line = new THREE.Line( loopGeom, m);

			rings.push(line);
			//geoms.push(geom);
			materials.push(m);
			scale *= 1.02;
			line.scale.x = scale;
			line.scale.y = scale;

			loopHolder.add(line);

			levels.push(0);
			//waves.push(emptyBinData);
			colors.push(0);

			//rings
			//if (Math.floor(i /20) % 2 == 0 ){
				// /line.visible = false;
			// /}

		}


		

	}

	function remove() {

		if (loopHolder){
			for(var i = 0; i < RINGCOUNT; i++) {
				loopHolder.remove(rings[i]);
			}

		}
	}

	function update() {

		//analyser.smoothingTimeConstant = 0.1;
		analyser.getByteFrequencyData(freqByteData);
		analyser.getByteTimeDomainData(timeByteData);

		//get average level
		var sum = 0;
		for(var i = 0; i < BIN_COUNT; i++) {
			sum += freqByteData[i];
		}
		var aveLevel = sum / BIN_COUNT;
		var scaled_average = (aveLevel / 256) * VOL_SENS; //256 is the highest a level can be
		levels.push(scaled_average);

		//read waveform into timeByteData
		//waves.push(timeByteData);

		//get noise color posn
		noisePos += 0.005;
		var n = Math.abs(perlin.noise(noisePos, 0, 0));
		colors.push(n);

		levels.shift(1);
		//waves.shift(1);
		colors.shift(1);


		//write current waveform into all rings
		for(var j = 0; j < SEGMENTS; j++) {
			loopGeom.vertices[j].z = (timeByteData[j]- 128);//stretch by 2
		}
		// link up last segment
		loopGeom.vertices[SEGMENTS].z = loopGeom.vertices[0].z;
		loopGeom.verticesNeedUpdate = true;


		//for( i = RINGCOUNT-1; i > 0 ; i--) {

		for( i = 0; i < RINGCOUNT ; i++) {

			var ringId = RINGCOUNT - i - 1;
			

			var normLevel = levels[ringId] + 0.01; //avoid scaling by 0
			var hue = colors[i];

			materials[i].color.setHSL(hue, 1, normLevel);
			materials[i].linewidth = normLevel*3;
			materials[i].opacity = normLevel; //fadeout
			rings[i].scale.z = normLevel/3;
		}

		//auto tilt
		// loopHolder.rotation.x = perlin.noise(noisePos * .5, 0,0) * Math.PI*.6;
		// loopHolder.rotation.y = perlin.noise(noisePos * .5,10,0) * Math.PI*.6;


	}

	return {
		init:init,
		update:update,
		remove:remove,
		loopHolder:loopHolder
	};
	}());